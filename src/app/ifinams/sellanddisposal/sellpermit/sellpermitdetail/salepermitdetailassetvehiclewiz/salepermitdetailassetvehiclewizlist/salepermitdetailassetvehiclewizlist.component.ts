import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../../../DALservice.service';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './salepermitdetailassetvehiclewizlist.component.html'
})

export class SellPermitAssetVehiclewizdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public AssetVehicleData: any = [];
    public generalsubcodelist: any = [];
    public isReadOnly: Boolean = false;
    public setStyle: any = [];
    private dataTamp: any = [];
    public lookupResult: any = [];
    public lookupmerk: any = [];
    public lookuptype: any = [];
    public lookupmodel: any = [];
    public isStatus: Boolean = false;
    private rental_price: any = [];
    private total_rental_period: any = [];

    //controller
    private APIController: String = 'AssetVehicle';
    private APIControllerMerk: String = 'MasterMerk';
    private APIControllerType: String = 'MasterType';
    private APIControllerModel: String = 'MasterModel';
    private APIControllerHeader: String = 'Asset';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForUpdate: String = 'Update';
    private RoleAccessCode = 'R00022270000000A';

    // form 2 way binding
    model: any = {};

    // spinner
    showSpinner: Boolean = true;
    // end

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _elementRef: ElementRef
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.Delimiter(this._elementRef);
        this.callGetrow();
        this.callGetrowHeader();
        this.isReadOnly = true;
    }

    //#region getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_asset_code': this.param
        }];
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    this.rental_price = parsedata.rental_price;
                    this.total_rental_period = parsedata.total_rental_period;

                    if (parsedata.status !== 'NEW') {
                        this.isStatus = true;
                    } else {
                        this.isStatus = false;
                    }

                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui

                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion getrow data

    //#region  form submit
    onFormSubmit(AssetVehicleForm: NgForm, isValid: boolean) {
        // validation form submit
        if (!isValid) {
            swal({
                allowOutsideClick: false,
                title: 'Warning',
                text: 'Please Fill a Mandatory Field OR Format Is Invalid',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning',
                type: 'warning'
            }).catch(swal.noop)
            return;
        } else {
            this.showSpinner = true;
        }

        this.AssetVehicleData = this.JSToNumberFloats(AssetVehicleForm);

        if (this.AssetVehicleData.p_stnk_expired_date == null || this.AssetVehicleData.p_stnk_expired_date === '') {
            this.AssetVehicleData.p_stnk_expired_date = undefined;
        }
        if (this.AssetVehicleData.p_stnk_tax_date == null || this.AssetVehicleData.p_stnk_tax_date === '') {
            this.AssetVehicleData.p_stnk_tax_date = undefined;
        }
        if (this.AssetVehicleData.p_last_maintenance_date == null || this.AssetVehicleData.p_last_maintenance_date === '') {
            this.AssetVehicleData.p_last_maintenance_date = undefined;
        }
        if (this.AssetVehicleData.p_date_of_lease_agreement == null || this.AssetVehicleData.p_date_of_lease_agreement === '') {
            this.AssetVehicleData.p_date_of_lease_agreement = undefined;
        }
        if (this.AssetVehicleData.p_start_rental_date == null || this.AssetVehicleData.p_start_rental_date === '') {
            this.AssetVehicleData.p_start_rental_date = undefined;
        }
        if (this.AssetVehicleData.p_end_rental_date == null || this.AssetVehicleData.p_end_rental_date === '') {
            this.AssetVehicleData.p_end_rental_date = undefined;
        }

        this.AssetVehicleData.p_total_rental_price = this.model.total_rental_price;

        const usersJson: any[] = Array.of(this.AssetVehicleData);

        // call web service
        this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    this.showSpinner = false;
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        this.route.navigate(['/transaction/assetwizlistdetail/' + this.param + '/assetdetailvehicledetail', this.param, parse.id]);
                        this.callGetrow()
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });

    }
    //#endregion form submit

    //#region getStyles
    getStyles(isTrue: Boolean) {
        if (isTrue) {
            this.setStyle = {
                'pointer-events': 'none',
            }
        } else {
            this.setStyle = {
                'pointer-events': 'auto',
            }
        }

        return this.setStyle;
    }
    //#endregion getStyles

    //#region Merk Lookup
    btnLookupMerk() {
        $('#datatableLookupMerk').DataTable().clear().destroy();
        $('#datatableLookupMerk').DataTable({
            'pagingType': 'first_last_numbers',
            'pageLength': 5,
            'processing': true,
            'serverSide': true,
            responsive: true,
            lengthChange: false, // hide lengthmenu
            searching: true, // jika ingin hilangin search box nya maka false
            ajax: (dtParameters: any, callback) => {
                // param tambahan untuk getrows dynamic
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_company_code': this.company_code,
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerMerk, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupmerk = parse.data;
                    if (parse.data != null) {
                        this.lookupmerk.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
            language: {
                search: 'INPUT',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowMerk(code: string, description: string) {
        this.model.merk_code = code;
        this.model.merk_name = description;
        this.model.type_code = '';
        this.model.type_name = '';
        this.model.model_code = '';
        this.model.model_name = '';
        $('#lookupModalMerk').modal('hide');
        $('#datatableLookupMerk').DataTable().ajax.reload();
    }
    //#endregion Merk lookup

    //#region Type Lookup
    btnLookupType() {
        $('#datatableLookupType').DataTable().clear().destroy();
        $('#datatableLookupType').DataTable({
            'pagingType': 'first_last_numbers',
            'pageLength': 5,
            'processing': true,
            'serverSide': true,
            responsive: true,
            lengthChange: false, // hide lengthmenu
            searching: true, // jika ingin hilangin search box nya maka false
            ajax: (dtParameters: any, callback) => {
                // param tambahan untuk getrows dynamic
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_company_code': this.company_code,
                    'p_merk_code': this.model.merk_code,
                    'p_model_code': this.model.model_code,
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerType, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookuptype = parse.data;
                    if (parse.data != null) {
                        this.lookuptype.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
            language: {
                search: 'INPUT',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowType(code: string, description: string) {
        this.model.type_code = code;
        this.model.type_name = description;
        $('#lookupModalType').modal('hide');
        $('#datatableLookupType').DataTable().ajax.reload();
    }
    //#endregion Type lookup

    //#region Model Lookup
    btnLookupModel() {
        $('#datatableLookupModel').DataTable().clear().destroy();
        $('#datatableLookupModel').DataTable({
            'pagingType': 'first_last_numbers',
            'pageLength': 5,
            'processing': true,
            'serverSide': true,
            responsive: true,
            lengthChange: false, // hide lengthmenu
            searching: true, // jika ingin hilangin search box nya maka false
            ajax: (dtParameters: any, callback) => {
                // param tambahan untuk getrows dynamic
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_company_code': this.company_code,
                    'p_merk_code': this.model.merk_code,
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerModel, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupmodel = parse.data;
                    if (parse.data != null) {
                        this.lookupmodel.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
            language: {
                search: 'INPUT',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowModel(code: string, description: string) {
        this.model.model_code = code;
        this.model.model_name = description;
        this.model.type_code = '';
        this.model.type_name = '';
        $('#lookupModalModel').modal('hide');
        $('#datatableLookupModel').DataTable().ajax.reload();
    }
    //#endregion Model lookup

    //#region header getrow data
    callGetrowHeader() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param,
        }]
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIControllerHeader, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    // const parsedata = parse.data[0];
                    const parsedata = this.getrowNgb(parse.data[0]);

                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui
                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion BatchDetail getrow data

    //#region button reload
    btnReloadOutstanding() {
        this.callGetrowHeader();
    }
    //#endregion button reload

    //#region ddl maintenance_type
    Purchase(event: any) {
        this.model.purchase = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl maintenance_type

    //#region RentalPrice
    RentalPrice(event: any) {
        this.rental_price = event.target.value;
        this.model.total_rental_price = this.total_rental_period * this.rental_price;
    }
    //#endregion RentalPrice

    //#region NumberPeriod
    NumberPeriod(event: any) {
        this.total_rental_period = event.target.value;
        this.model.total_rental_price = this.total_rental_period * this.rental_price;
    }
    //#endregion NumberPeriod
}