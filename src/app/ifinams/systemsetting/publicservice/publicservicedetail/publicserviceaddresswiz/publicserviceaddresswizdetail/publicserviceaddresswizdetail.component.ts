import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './publicserviceaddresswizdetail.component.html'
})

export class PublicserviceaddressdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public publicserviceAddressData: any = [];
    public lookupProvince: any = [];
    public NumberOnlyPattern = this._numberonlyformat;
    public lookupcity: any = [];
    public lookupzipcode: any = [];
    public isReadOnly: Boolean = false;

    private dataRoleTamp: any = [];
    private dataTamp: any = [];
    private RoleAccessCode = 'R00021430000000A';

    // API Controller
    private APIController: String = 'MasterPublicserviceAddress';
    private APIControllerSysProvince: String = 'SysProvince';
    private APIControllerSysCity: String = 'SysCity';
    private APIControllerSysZipcode: String = 'SysZipcode';

    // API Function
    private APIRouteForLookupProvince: String = 'GetRowsForLookup';
    private APIRouteForLookupCity: String = 'GetRowsLookupByProvinceCode';
    private APIRouteForLookupZipCode: String = 'GetRowsLookupByCityCode';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForInsert: String = 'Insert';


    // form 2 way binding
    model: any = {};

    // spinner
    showSpinner: Boolean = true;
    // end

    // datatable
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _elementRef: ElementRef, private datePipe: DatePipe
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

        if (this.params != null) {
            this.isReadOnly = true;
            this.wizard();

            // call web service
            this.callGetrow();
        } else {
            this.showSpinner = false;
            this.model.id = this.param;
        }
    }

    //#region publicserviceAddressDetail getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_id': this.params,
        }];
        // end param tambahan untuk getrow dynamics
        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = parse.data[0];

                    // checkbox
                    if (parsedata.is_latest === '1') {
                        parsedata.is_latest = true;
                    } else {
                        parsedata.is_latest = false;
                    }
                    // end checkbox

                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui

                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion publicserviceAddressDetail getrow data

    //#region publicserviceAddressDetail form submit
    onFormSubmit(publicserviceaddressForm: NgForm, isValid: boolean) {
        // validation form submit
        if (!isValid) {
            swal({
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

        this.publicserviceAddressData = publicserviceaddressForm;
        if (this.publicserviceAddressData.p_is_latest == null) {
            this.publicserviceAddressData.p_is_latest = false;
        }

        this.publicserviceAddressData.p_public_service_code = this.param;
        const usersJson: any[] = Array.of(this.publicserviceAddressData);

        if (this.params != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                            this.callGetrow();
                        } else {
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                        // console.log('There was an error while Updating Data(API) !!!' + error);
                    });
        } else {
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                            this.route.navigate(['/systemsetting/subpublicservice/publicservicedetail/' + this.param + '/publicserviceaddresslist/' + this.param + '/publicserviceaddressdetail', this.param, parse.id], { skipLocationChange: true });
                        } else {
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                        // console.log('There was an error while Updating Data(API) !!!' + error);
                    });
        }
    }
    //#endregion publicserviceAddressDetail form submit

    //#region publicserviceAddressDetail button back
    btnBack() {
        $('#datatables ').DataTable().ajax.reload();
        this.route.navigate(['/systemsetting/subpublicservice/publicservicedetail/' + this.param + '/publicserviceaddresslist', this.param], { skipLocationChange: true });
    }
    //#endregion publicserviceAddressDetail button back

    //#region Province Lookup
    btnLookupProvince() {
        $('#datatableLookupProvince').DataTable().clear().destroy();
        $('#datatableLookupProvince').DataTable({
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
                    'default': ''
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBase(dtParameters, this.APIControllerSysProvince, this.APIRouteForLookupProvince).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupProvince = parse.data;
                    this.lookupProvince.numberIndex = dtParameters.start;

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

    btnSelectRowProvince(province_code: String, province_name: string) {
        this.model.province_code = province_code;
        this.model.province_name = province_name;
        this.model.city_code = '';
        this.model.city_name = '';
        this.model.zip_code = '';
        this.model.sub_district = '';
        this.model.village = '';
        $('#lookupModalProvince').modal('hide');
    }
    //#endregion Province lookup

    //#region Lookup City
    btnLookupCity() {
        $('#datatableLookupCity').DataTable().clear().destroy();
        $('#datatableLookupCity').DataTable({
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
                    'p_province_code': this.model.province_code
                });
                // end param tambahan untuk getrows dynamic

                this.dalservice.GetrowsBase(dtParameters, this.APIControllerSysCity, this.APIRouteForLookupCity).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupcity = parse.data;
                    if (parse.data != null) {
                        this.lookupcity.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, targets: [0, 1, 4] }],
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowCity(code: String, description: string) {
        this.model.city_code = code;
        this.model.city_name = description;
        this.model.zip_code = '';
        this.model.sub_district = '';
        this.model.village = '';
        $('#lookupModalCity').modal('hide');
    }
    //#endregion Lookup City

    //#region zip code lookup
    btnLookupZipCode() {
        $('#datatableLookupZipCode').DataTable().clear().destroy();
        $('#datatableLookupZipCode').DataTable({
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
                    'p_city_code': this.model.city_code,
                    'p_province_code': this.model.province_code
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBase(dtParameters, this.APIControllerSysZipcode, this.APIRouteForLookupZipCode).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupzipcode = parse.data;
                    if (parse.data != null) {
                        this.lookupzipcode.numberIndex = dtParameters.start;
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

    btnSelectRowLookupZipCode(zip_code: String, sub_district: string, village: string) {
        this.model.zip_code = zip_code;
        this.model.sub_district = sub_district;
        this.model.village = village;
        $('#lookupModalZipCode').modal('hide');
    }
    //#endregion zip code lookup

}


