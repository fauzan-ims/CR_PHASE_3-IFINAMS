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
    templateUrl: './policymainassetdetail.component.html'
})

export class PolicyMainAssetdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public publicserviceAddressData: any = [];
    public NumberOnlyPattern = this._numberonlyformat;
    public isReadOnly: Boolean = false;
    public listpolicyassetcoverage: any = [];
    public listpolicyassetcoverage2: any = [];
    //(+) Ari 2024-01-08
    private idDetailForSale: any;
    public lookupTax: any = [];

    private dataRoleTamp: any = [];
    private dataTamp: any = [];
    private RoleAccessCode = 'R00022090000000A';

    // API Controller
    private APIController: String = 'InsurancePolicyAsset';
    private APIControllerDetail: String = 'InsurancePolicyAssetCoverage';
    private APIControllerHeader: String = 'InsurancePolicyMain';
    private APIControllerTaxCode: String = 'MasterTaxScheme'; // (+) Ari 2024-01-08 ket : add tax

    // API Function
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForInsert: String = 'Insert';
    // (+) Ari 2024-01-08 ket : add tax
    private APIRouteForLookupTax: String = 'GetRowsForLookup'; 
    private APIRouteForUpdateTax: String = 'ExecSpForUpdateTax';


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
            this.loadData();
        } else {
            this.showSpinner = false;
            this.model.id = this.param;
        }
    }

    //#region getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.params,
        }];
        // end param tambahan untuk getrow dynamics
        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = parse.data[0];

                    // checkbox
                    if (parsedata.is_authorized_workshop === '1') {
                        parsedata.is_authorized_workshop = true;
                    } else {
                        parsedata.is_authorized_workshop = false;
                    }
                    if (parsedata.is_commercial === '1') {
                        parsedata.is_commercial = true;
                    } else {
                        parsedata.is_commercial = false;
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
    //#endregion getrow data

    //#region Header getrow data
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

    //#region form submit
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
    //#endregion form submit

    //#region button back
    btnBack() {
        $('#datatablespolicyasset').DataTable().ajax.reload();
        this.route.navigate(['/registration/subpolicylist/policydetail/' + this.param + '/subpolicyassetlist', this.param], { skipLocationChange: true });
    }
    //#endregion button back

    //#region load all data
    loadData() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            responsive: true,
            serverSide: true,
            processing: true,
            paging: true,
            'lengthMenu': [
                [10, 25, 50, 100],
                [10, 25, 50, 100]
            ],
            ajax: (dtParameters: any, callback) => {
                // param tambahan untuk getrows dynamic
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_register_asset_code': this.params
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRows).subscribe(resp => {
                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    const parse = JSON.parse(resp)

                    this.listpolicyassetcoverage = parse.data;
                    this.listpolicyassetcoverage.numberIndex = dtParameters.start;

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            order: [[1, 'asc']],
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region button save list
    btnSaveList() {

        this.listpolicyassetcoverage2 = [];

        var i = 0;

        var getID = $('[name="p_id_detail"]')
            .map(function () { return $(this).val(); }).get();

        var getBuyAmount = $('[name="p_initial_buy_amount"]')
            .map(function () { return $(this).val(); }).get();

        var getDiscountAmount = $('[name="p_initial_discount_amount"]')
            .map(function () { return $(this).val(); }).get();

        var getDiscountPPNAmount = $('[name="p_initial_discount_ppn"]')
            .map(function () { return $(this).val(); }).get();

        var getDiscountPPHAmount = $('[name="p_initial_discount_pph"]')
            .map(function () { return $(this).val(); }).get();

        var getAdminFeeAmount = $('[name="p_initial_admin_fee_amount"]')
            .map(function () { return $(this).val(); }).get();

        var getStampFeeAmount = $('[name="p_initial_stamp_fee_amount"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {

            while (i < getBuyAmount.length) {
                while (i < getDiscountAmount.length) {
                    while (i < getDiscountPPNAmount.length) {
                        while (i < getDiscountPPHAmount.length) {
                            while (i < getAdminFeeAmount.length) {
                                while (i < getStampFeeAmount.length) {
                                    this.listpolicyassetcoverage2.push(
                                        this.JSToNumberFloats({
                                            p_id: getID[i],
                                            p_initial_buy_amount: getBuyAmount[i],
                                            p_initial_discount_amount: getDiscountAmount[i],
                                            p_initial_discount_ppn: getDiscountPPNAmount[i],
                                            p_initial_discount_pph: getDiscountPPHAmount[i],
                                            p_initial_admin_fee_amount: getAdminFeeAmount[i],
                                            p_initial_stamp_fee_amount: getStampFeeAmount[i]
                                        })
                                    );
                                    i++;
                                } i++;
                            } i++;
                        } i++;
                    } i++;
                } i++;
            }
            i++;
        }

        //#region web service
        this.dalservice.Update(this.listpolicyassetcoverage2, this.APIControllerDetail, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatablespolicyassetcoverage').DataTable().ajax.reload();
                        $('#reloadHeader').click();
                        $('#reloadpolicydetail').click();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);

                });
        //#endregion web service

    }
    //#region onBlur
    onBlur(event, i, type) {
        if (type === 'amount') {
            if (event.target.value.match('[0-9]+(,[0-9]+)')) {
                if (event.target.value.match('(\.\d+)')) {

                    event = '' + event.target.value;
                    event = event.trim();
                    event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                } else {
                    event = '' + event.target.value;
                    event = event.trim();
                    event = parseFloat(event.replace(/,/g, '')).toFixed(2); // ganti jadi 6 kalo mau pct
                    event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                }
            } else {
                event = '' + event.target.value;
                event = event.trim();
                event = parseFloat(event).toFixed(2); // ganti jadi 6 kalo mau pct
                event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            }
        } else {
            event = '' + event.target.value;
            event = event.trim();
            event = parseFloat(event).toFixed(6);
        }

        if (event === 'NaN') {
            event = 0;
            event = parseFloat(event).toFixed(2);
        }

        if (type === 'amount') {
            $('#buy_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        } else {
            $('#buy_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onBlur

    //#region onFocus
    onFocus(event, i, type) {
        event = '' + event.target.value;

        if (event != null) {
            event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
        }

        if (type === 'amount') {
            $('#buy_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        } else {
            $('#buy_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onFocus

    //#endregion button save list

    //(+) Ari 2024-01-08 ket : add tax
    //#region tax
    btnLookupTaxCode(id: any) {
        $('#datatableLookupTax').DataTable().clear().destroy();
        $('#datatableLookupTax').DataTable({
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
                    'action': 'getResponse'
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerTaxCode, this.APIRouteForLookupTax).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupTax = parse.data;
                    if (parse.data != null) {
                        this.lookupTax.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API)' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });

        this.idDetailForSale = id;
    }

    btnSelectRowTax(code: string, description: string, ppn_pct: string, pph_pct: string) {

        this.model.master_tax_code = code;
        this.model.tax_master_tax_description = description;
        this.model.master_tax_ppn_pct = ppn_pct;
        this.model.master_tax_pph_pct = pph_pct;

        const listdataDetailPolicyAssetCoverage = [];

        listdataDetailPolicyAssetCoverage.push({
            p_id: this.idDetailForSale,
            p_tax_code: code,
            p_tax_name: description,
            p_ppn_pct: ppn_pct,
            p_pph_pct: pph_pct,
        });


        //#region web service
        this.dalservice.Update(listdataDetailPolicyAssetCoverage, this.APIController, this.APIRouteForUpdateTax)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        $('#datatablespolicyassetcoverage').DataTable().ajax.reload();
                        $('#reloadHeader').click();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        // #endregion web service
        $('#lookupModalTax').modal('hide');
    }
    //#endregion tax 

}


