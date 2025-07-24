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
    templateUrl: './sellpermitdetailassetpropertywizlist.component.html'
})

export class SellPermitAssetPropertywizdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public AssetPropertyData: any = [];
    public generalsubcodelist: any = [];
    public isReadOnly: Boolean = false;
    public setStyle: any = [];
    private dataTamp: any = [];
    public lookupResult: any = [];
    public lookupstatus: any = [];
    public purchase: any;
    public isStatus: Boolean = false;
    public isHidden: Boolean = true;
    private rental_price: any = [];
    private total_rental_period: any = [];

    //controller
    private APIController: String = 'AssetProperty';
    private APIControllerHeader: String = 'Asset';
    private APIControllerStatus: String = 'SysGeneralSubcode';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private RoleAccessCode = 'R00021450000000A';

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
        this.callGetrowHeader();

        // if (this.param != null) {
        this.isReadOnly = true;

        // call web service
        this.callGetrow();
        // this.callGetrowHeader();
        // } 
        // else {
        //     this.showSpinner = false;
        //     this.model.company_code = this.company_code;
        //     this.isStatus = false;
        // }
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
    onFormSubmit(AssetPropertyForm: NgForm, isValid: boolean) {
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
        this.AssetPropertyData = this.JSToNumberFloats(AssetPropertyForm);
        const usersJson: any[] = Array.of(this.AssetPropertyData);

        if (this.AssetPropertyData.p_date_of_lease_agreement == null || this.AssetPropertyData.p_date_of_lease_agreement === '') {
            this.AssetPropertyData.p_date_of_lease_agreement = undefined;
        }
        if (this.AssetPropertyData.p_start_rental_date == null || this.AssetPropertyData.p_start_rental_date === '') {
            this.AssetPropertyData.p_start_rental_date = undefined;
        }
        if (this.AssetPropertyData.p_end_rental_date == null || this.AssetPropertyData.p_end_rental_date === '') {
            this.AssetPropertyData.p_end_rental_date = undefined;
        }

        this.AssetPropertyData.p_total_rental_price = this.model.total_rental_price;


        // call web service
        this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    this.showSpinner = false;
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        this.route.navigate(['/transaction/assetwizlistdetail/' + this.param + '/assetdetailpropertydetail', this.param, parse.id]);
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
    RentalPeriod(event: any) {
        this.model.rental_period = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl maintenance_type

    //#region Status Lookup
    btnLookupStatus() {
        $('#datatableLookupStatus').DataTable().clear().destroy();
        $('#datatableLookupStatus').DataTable({
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
                    'p_general_code': 'STS',
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerStatus, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupstatus = parse.data;
                    if (parse.data != null) {
                        this.lookupstatus.numberIndex = dtParameters.start;
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
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowStatus(code: string, general_subcode_desc: string) {
        this.model.status_of_ruko = code;
        this.model.general_subcode_desc = general_subcode_desc;
        $('#lookupModalStatus').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearStatus() {
        this.model.status_of_ruko = '';
        this.model.general_subcode_desc = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Status lookup

    //#region ddl maintenance_type
    Purchase(event: any) {
        this.purchase = event.target.value;
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
