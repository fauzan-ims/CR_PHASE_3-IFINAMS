import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';
// import { log } from 'console';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './adjustmenthistorydetail.component.html'
})

export class AdjustmentHistorydetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public AdjustmentData: any = [];
    public orderdetaillist: any = [];
    public isReadOnly: Boolean = false;
    public isButton: Boolean = false;
    public setStyle: any = [];
    public lookupbranchrequest: any = [];
    public lookupmaintenance: any = [];
    public lookupAssetDetail: any = [];
    public lookupAsset: any = [];
    public lookupVendor: any = [];
    public listmutationdocument: any = [];
    public uploadFile: any = [];
    public lookupasset: any = [];
    public datauploadlist: any = [];
    public listdataDetail: any = [];
    public tempFile: any;
    private dataTamp: any = [];
    private dataTampAdjustmentData: any = [];
    public payment_by: any;
    public lookupvendor: any = [];
    public lookupbranch: any = [];
    public dataTampGetrow: any = [];
    public lookupcostcenter: any = [];
    public RevalNonReval: any = [];
    public dataRoleTampInsertLog: any = [];
    public jsonDataJournal: any = [];

    //controller
    private APIController: String = 'AdjustmentHistory';
    private APIControllerAsset: String = 'Asset';
    private APIControllerAdjustment: String = 'Adjustment';
    private APIControllerVendor: String = 'MasterVendor';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerCostCenter: String = 'CostCenter';
    private APIControllerGlobalParam: String = 'GlobalParam';
    private APIControllerJournalDetail: String = 'JournalDetail';
    private APIControllerApiLog: String = 'ApiLog';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForReject: String = 'ExecSpForReject';
    private APIRouteForReturn: String = 'ExecSpForReturn';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteLookupFixedAsset: String = 'GetRowsForLookupFixedAsset';
    private APIRouteForGetRowForThirdParty: String = 'GetRowForThirdParty';
    private APIRouteForCallThirdParty: String = 'CallThirdParty';
    private APIRouteForJournalDetail: String = 'GetRowsForThirdParty';
    private APIRouteForReturnJournal: String = 'ExecSpForReturnJournal';
    private APIRouteForInsertLog: String = 'ExecSpForInsertLog';

    private RoleAccessCode = 'R00022130000000A';

    // form 2 way binding
    model: any = {};

    // checklist
    public selectedAll: any;
    private checkedList: any = [];

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
        private datePipe: DatePipe,
        private _elementRef: ElementRef,
        private parserFormatter: NgbDateParserFormatter
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.Delimiter(this._elementRef);
        this.wizard();

        if (this.param != null) {
            this.isReadOnly = true;
            this.callGetrow();
            this.adjustmentdetailwiz();
        } else {
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.status = 'NEW';
            this.model.original_price = 0;
            this.model.purchase_price = 0;
            this.model.net_book_value_comm = 0;
            this.model.net_book_value_fiscal = 0;
            this.model.new_netbook_value = 0;
            this.model.new_netbook_value_comm = 0;
            this.model.new_netbook_value_fiscal = 0;
            this.model.total_adjustment = 0;
            this.model.payment_by = 'HO';
            this.model.adjustment_type = 'NONREVAL';
        }
    }

    //#region ddl Payment By
    PagePaymentBy(event: any) {
        this.payment_by = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Payment By

    // btnReval() {
    //     this.isButton = true
    // }

    // btnNonReval() {
    //     this.isButton = false
    // }

    //#region getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param
        }];
        // end param tambahan untuk getrow dynamic        
        
        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    if (parsedata.adjustment_type === 'REVAL') {
                        this.isButton = true;
                    }
                    else {
                        this.isButton = false;
                    }
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui

                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion getrow data

    //#region form submit
    onFormSubmit(AdjustmentForm: NgForm, isValid: boolean) {
        // validation form submit
        if (!isValid) {
            swal({
                title: 'Warning',
                text: 'Please Fill a Mandatory Field OR Format Is Invalid',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger',
                type: 'warning'
            }).catch(swal.noop)
            return;
        } else {
            this.showSpinner = true;
        }

        this.AdjustmentData = this.JSToNumberFloats(AdjustmentForm);

        const usersJson: any[] = Array.of(this.AdjustmentData);

        if (this.param != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                            this.callGetrow()
                        } else {
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
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
                            this.route.navigate(['/transaction/subadjustmentlist/adjustmentdetail', parse.code]);
                        } else {
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                    });
        }
    }
    //#endregion form submit

    //#region button back
    btnBack() {
        this.route.navigate(['/inquiry/subadjustmenthistorylist']);
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region getStyles
    getStyles(isTrue: Boolean) {
        if (isTrue) {
            this.setStyle = {
                'pointer-events': 'none',
            }
        } else {
            this.setStyle = {
                'pointer-events': 'unset',
            }
        }

        return this.setStyle;
    }
    //#endregion getStyles

    //#region Asset Lookup
    btnLookupAsset() {
        $('#datatableLookupAsset').DataTable().clear().destroy();
        $('#datatableLookupAsset').DataTable({
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
                    'p_branch_code': this.model.branch_code,
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerAdjustment, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupAsset = parse.data;

                    if (parse.data != null) {
                        this.lookupAsset.numberIndex = dtParameters.start;
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

    btnSelectRowAsset(code: string, barcode: string, item_name: string, item_code: string, location_code: string,
        description_location: string, division_code: string, division_name: string,
        department_code: string, department_name: string, sub_department_code: string,
        sub_department_name: string, units_code: string, units_name: string, net_book_value_comm: string,
        net_book_value_fiscal: string, original_price: string, purchase_price: string, new_purchase_date: string
    ) {
        this.model.asset_code = code;
        this.model.barcode = barcode;
        this.model.asset_name = item_name;
        this.model.item_code = item_code;
        this.model.item_name = item_name;
        this.model.location_code = location_code;
        this.model.description_location = description_location;
        this.model.division_code = division_code;
        this.model.division_name = division_name;
        this.model.department_code = department_code;
        this.model.department_name = department_name;
        this.model.sub_department_code = sub_department_code;
        this.model.sub_department_name = sub_department_name;
        this.model.units_code = units_code;
        this.model.units_name = units_name;
        this.model.old_netbook_value_comm = net_book_value_comm;
        this.model.new_netbook_value_comm = net_book_value_comm;
        this.model.old_netbook_value_fiscal = net_book_value_fiscal;
        this.model.new_netbook_value_fiscal = net_book_value_fiscal;
        this.model.original_price = original_price;
        this.model.purchase_price = purchase_price;
        this.model.new_purchase_date = this.dateFormater(new_purchase_date);

        $('#lookupModalAsset').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Asset lookup

    //#region Vendor Lookup
    btnLookupVendor() {
        $('#datatableLookupVendor').DataTable().clear().destroy();
        $('#datatableLookupVendor').DataTable({
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
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerVendor, this.APIRouteLookupFixedAsset).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupvendor = parse.data;
                    if (parse.data != null) {
                        this.lookupvendor.numberIndex = dtParameters.start;
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

    btnSelectRowVendor(code: string, name: string) {
        this.model.vendor_code = code;
        this.model.vendor_name = name;
        $('#lookupModalVendor').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Vendor lookup

    //#region btnProceed
    btnProceed() {
        // param tambahan untuk getrole dynamic
        this.dataTampAdjustmentData = [{
            'p_code': this.param,
            'action': 'default'
        }];
        // param tambahan untuk getrole dynamic

        // call web service
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                this.dalservice.ExecSp(this.dataTampAdjustmentData, this.APIController, this.APIRouteForProceed)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#btnAdjustmentDocumentWiz').click();
                                $('#btnAdjustmentDetailWiz').click();
                                this.showSpinner = false;
                            } else {
                                this.swalPopUpMsg(parse.data);
                                this.showSpinner = false;
                            }
                        },
                        error => {
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data);
                            this.showSpinner = false;
                        });
            } else {
                this.showSpinner = false;
            }
        })
    }
    //#endregion btnProceed

    //#region btnPost
    btnPost() {
        this.dataTampAdjustmentData = [{
            'p_code': this.param,
            'action': 'default'
        }];

        // call web service
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            this.showSpinner = true;
            if (result.value) {
                this.dalservice.ExecSp(this.dataTampAdjustmentData, this.APIController, this.APIRouteForPost)
                    .subscribe(
                        resDataAdjustment => {
                            const parseDataAdjustment = JSON.parse(resDataAdjustment);

                            if (parseDataAdjustment.result === 1) {
                                this.dataTamp = [{
                                    'p_code': "AJT"
                                }];

                                this.dalservice.GetrowBam(this.dataTamp, this.APIControllerGlobalParam, this.APIRouteForGetRow)
                                    .subscribe(
                                        resGlobalParam => {
                                            const parseGlobalParam = JSON.parse(resGlobalParam);
                                            const parsedataGlobalParam = parseGlobalParam.data[0];

                                            this.dataTampGetrow = [{
                                                'p_code': this.param,
                                                'p_company_code': this.company_code
                                            }];

                                            this.dalservice.Getrow(this.dataTampGetrow, this.APIControllerJournalDetail, this.APIRouteForGetRowForThirdParty)
                                                .subscribe(
                                                    resJournal => {
                                                        const parseJournal = JSON.parse(resJournal);

                                                        if (parseJournal.data !== 'This low value data cannot be processed') {
                                                            if (parseJournal.data.length > 0) {
                                                                const dataTampJournal = [{
                                                                    'p_gl_link_transaction_code': parseJournal.data[0].code,
                                                                    'p_company_code': this.company_code,
                                                                    'action': 'getResponse'
                                                                }];
                                                                this.dalservice.ExecSp(dataTampJournal, this.APIControllerJournalDetail, this.APIRouteForJournalDetail)
                                                                    .subscribe(
                                                                        resJournalDetail => {
                                                                            const parseJournalDetail = JSON.parse(resJournalDetail);

                                                                            const JournalTrx = [];

                                                                            for (let i = 0; i < parseJournalDetail.data.length; i++) {
                                                                                JournalTrx.push({
                                                                                    "LineDescr": parseJournalDetail.data[i].remarks,
                                                                                    "DC": parseJournalDetail.data[i].d_c,
                                                                                    "Amount": parseJournalDetail.data[i].base_amount_db,
                                                                                    "COA": parseJournalDetail.data[i].gl_link_code,
                                                                                    "COABranch": parseJournalDetail.data[i].branch_code,
                                                                                    "CostCenter": parseJournalDetail.data[i].cost_center_code
                                                                                });
                                                                            }
                                                                            const dataJournal = {
                                                                                "body_req":
                                                                                {
                                                                                    "OfficeCode": parseJournal.data[0].branch_code,
                                                                                    "JrNo": parseJournal.data[0].code,
                                                                                    "TrxCode": 'FAMADJ',
                                                                                    "PeriodYear": parseJournal.data[0].period_year,
                                                                                    "PeriodMonth": parseJournal.data[0].month_year,
                                                                                    "ValueDate": parseJournal.data[0].transaction_value_date,
                                                                                    "PostingDate": parseJournal.data[0].transaction_date,
                                                                                    "RefNo": parseJournal.data[0].transaction_code,
                                                                                    "JrAmt": parseJournal.data[0].base_amount_db,
                                                                                    "JournalDetail": JournalTrx
                                                                                }, "url": parsedataGlobalParam.value
                                                                            };
                                                                            const jsonDataJournal = JSON.stringify(dataJournal);

                                                                            // insert to API log
                                                                            this.dataRoleTampInsertLog = [{
                                                                                'p_transaction_no': parseJournal.data[0].code,
                                                                                'p_url_request': parsedataGlobalParam.value,
                                                                                'p_json_content': jsonDataJournal,
                                                                                'p_response_code': '',
                                                                                'p_response_message': '',
                                                                                'p_response_json': '',
                                                                                'p_cre_by': this.userId,
                                                                                'p_cre_ip_address': this.ipAddress,
                                                                                'p_mod_by': this.userId,
                                                                                'p_mod_ip_address': this.ipAddress,
                                                                                'action': 'default'
                                                                            }];

                                                                            this.dalservice.ExecSp(this.dataRoleTampInsertLog, this.APIControllerApiLog, this.APIRouteForInsertLog)
                                                                                .subscribe(
                                                                                    resInsertLog => {
                                                                                        const parseInsertLog = JSON.parse(resInsertLog);

                                                                                        this.dalservice.CallThirdPartyAPI(dataJournal, this.APIController, this.APIRouteForCallThirdParty)
                                                                                            .subscribe(
                                                                                                resAPI => {
                                                                                                    const parseAPI = JSON.parse(resAPI);
                                                                                                    var resultCode;

                                                                                                    if (parseAPI.data.Code !== undefined) {
                                                                                                        resultCode = parseAPI.data.Code;
                                                                                                    } else if (parseAPI.data.StatusCode !== undefined) {
                                                                                                        resultCode = parseAPI.data.StatusCode;
                                                                                                    }

                                                                                                    if (resultCode === '1') {
                                                                                                        const responseJson = JSON.stringify(parseAPI.data);
                                                                                                        // insert to API log
                                                                                                        this.dataRoleTampInsertLog = [{
                                                                                                            'p_transaction_no': parseJournal.data[0].code,
                                                                                                            'p_url_request': parsedataGlobalParam.value,
                                                                                                            'p_json_content': jsonDataJournal,
                                                                                                            'p_response_code': resultCode,
                                                                                                            'p_response_message': '',
                                                                                                            'p_response_json': responseJson,
                                                                                                            'p_cre_by': this.userId,
                                                                                                            'p_cre_ip_address': this.ipAddress,
                                                                                                            'p_mod_by': this.userId,
                                                                                                            'p_mod_ip_address': this.ipAddress,
                                                                                                            'action': 'default'
                                                                                                        }];
                                                                                                        this.dalservice.ExecSp(this.dataRoleTampInsertLog, this.APIControllerApiLog, this.APIRouteForInsertLog)
                                                                                                            .subscribe(
                                                                                                                resInsertLog => {
                                                                                                                    const parseInsertLog = JSON.parse(resInsertLog);
                                                                                                                    if (parseInsertLog.result === 1) {

                                                                                                                        this.showNotification('bottom', 'right', 'success');
                                                                                                                        this.callGetrow();
                                                                                                                        $('#btnAdjustmentDocumentWiz').click();
                                                                                                                        $('#btnAdjustmentDetailWiz').click();
                                                                                                                        this.showSpinner = false;

                                                                                                                    }
                                                                                                                },
                                                                                                                error => {
                                                                                                                    const parseInsertLog = JSON.parse(error);
                                                                                                                    this.swalPopUpMsg(parseInsertLog.data);
                                                                                                                    this.showSpinner = false;
                                                                                                                });
                                                                                                        // end insert to API log

                                                                                                    } else {
                                                                                                        this.returnJournal();
                                                                                                        // var errorMsg;

                                                                                                        var errorMsg;
                                                                                                        if (parseAPI.data.ErrMsg !== undefined) {
                                                                                                            errorMsg = parseAPI.data.ErrMsg;
                                                                                                        } else if (parseAPI.data.ErrorMessage !== undefined) {
                                                                                                            errorMsg = parseAPI.data.ErrorMessage;
                                                                                                        }

                                                                                                        const responseJson = JSON.stringify(parseAPI.data);
                                                                                                        // insert to API log
                                                                                                        this.dataRoleTampInsertLog = [{
                                                                                                            'p_transaction_no': parseJournal.data[0].code,
                                                                                                            'p_url_request': parsedataGlobalParam.value,
                                                                                                            'p_json_content': jsonDataJournal,
                                                                                                            'p_response_code': resultCode,
                                                                                                            'p_response_message': errorMsg,
                                                                                                            'p_response_json': responseJson,
                                                                                                            'p_cre_by': this.userId,
                                                                                                            'p_cre_ip_address': this.ipAddress,
                                                                                                            'p_mod_by': this.userId,
                                                                                                            'p_mod_ip_address': this.ipAddress,
                                                                                                            'action': 'default'
                                                                                                        }];
                                                                                                        // console.log(this.dataRoleTampInsertLog);

                                                                                                        this.dalservice.ExecSp(this.dataRoleTampInsertLog, this.APIControllerApiLog, this.APIRouteForInsertLog)
                                                                                                            .subscribe(
                                                                                                                resInsertLog => {
                                                                                                                    const parseInsertLog = JSON.parse(resInsertLog);
                                                                                                                    if (parseInsertLog.result === 1) {
                                                                                                                        // this.returnJournal();
                                                                                                                        this.showSpinner = false;
                                                                                                                        this.swalPopUpMsg('V;' + errorMsg);
                                                                                                                    }
                                                                                                                },
                                                                                                                error => {
                                                                                                                    const parseInsertLog = JSON.parse(error);
                                                                                                                    this.swalPopUpMsg(parseInsertLog.data);
                                                                                                                    this.showSpinner = false;
                                                                                                                });
                                                                                                        // end insert to API log
                                                                                                        // if (parseAPI.data.ErrMsg !== undefined) {
                                                                                                        //     errorMsg = parseAPI.data.ErrMsg;
                                                                                                        // } else if (parseAPI.data.ErrorMessage !== undefined) {
                                                                                                        //     errorMsg = parseAPI.data.ErrorMessage;
                                                                                                        // }
                                                                                                        // this.swalPopUpMsg('V;' + errorMsg);
                                                                                                    }
                                                                                                },
                                                                                                error => {
                                                                                                    this.returnJournal();
                                                                                                    const parseAPI = JSON.parse(error);
                                                                                                    this.swalPopUpMsg(parseAPI.data);
                                                                                                    this.showSpinner = false;
                                                                                                });
                                                                                    },
                                                                                    error => {
                                                                                        const parseInsertLog = JSON.parse(error);
                                                                                        this.swalPopUpMsg(parseInsertLog.data);
                                                                                        this.showSpinner = false;
                                                                                    });
                                                                            // end insert to API log
                                                                        },
                                                                        error => {
                                                                            this.returnJournal();
                                                                            const parses = JSON.parse(error);
                                                                            this.swalPopUpMsg(parses.data);
                                                                            this.showSpinner = false;
                                                                        });

                                                            } else {
                                                                this.swalPopUpMsg('V; Jurnal Tidak Dapat Terbentuk. Silahkan Cek Kembali Setting Jurnal Anda ');
                                                                this.returnJournal();
                                                                this.showSpinner = false;
                                                            }
                                                        }
                                                        else {
                                                            this.callGetrow();
                                                            this.showSpinner = false;
                                                        }
                                                    },
                                                    error => {
                                                        this.returnJournal();
                                                        const parse = JSON.parse(error);
                                                        this.swalPopUpMsg(parse.data);
                                                        this.showSpinner = false;
                                                    });
                                        },
                                        error => {
                                            const parse = JSON.parse(error);
                                            this.swalPopUpMsg(parse.data);
                                            this.showSpinner = false;
                                        });

                            } else {
                                this.swalPopUpMsg(parseDataAdjustment.data);
                                this.showSpinner = false;
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data);
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion btnPost

    //#region btnReject
    btnReject() {
        // param tambahan untuk getrole dynamic
        this.dataTampAdjustmentData = [{
            'p_code': this.param,
            'action': 'default'
        }];
        // param tambahan untuk getrole dynamic

        // call web service
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                this.dalservice.ExecSp(this.dataTampAdjustmentData, this.APIController, this.APIRouteForReject)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#btnAdjustmentDocumentWiz').click();
                                $('#btnAdjustmentDetailWiz').click();
                                this.showSpinner = false;
                            } else {
                                this.swalPopUpMsg(parse.data);
                                this.showSpinner = false;
                            }
                        },
                        error => {
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data);
                            this.showSpinner = false;
                        });
            } else {
                this.showSpinner = false;
            }
        })
    }
    //#endregion btnReject

    //#region btnReturn
    btnReturn() {
        // param tambahan untuk getrole dynamic
        this.dataTampAdjustmentData = [{
            'p_code': this.param,
            'action': 'default'
        }];
        // param tambahan untuk getrole dynamic

        // call web service
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                this.dalservice.ExecSp(this.dataTampAdjustmentData, this.APIController, this.APIRouteForReturn)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#btnAdjustmentDocumentWiz').click();
                                $('#btnAdjustmentDetailWiz').click();
                                this.showSpinner = false;
                            } else {
                                this.swalPopUpMsg(parse.data);
                                this.showSpinner = false;
                            }
                        },
                        error => {
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data);
                            this.showSpinner = false;
                        });
            } else {
                this.showSpinner = false;
            }
        })
    }
    //#endregion btnReturn

    //#region btnCancel
    btnCancel() {
        // param tambahan untuk getrole dynamic
        this.dataTampAdjustmentData = [{
            'p_code': this.param,
            'action': 'default'
        }];
        // param tambahan untuk getrole dynamic

        // call web service
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                this.dalservice.ExecSp(this.dataTampAdjustmentData, this.APIController, this.APIRouteForCancel)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#btnAdjustmentDocumentWiz').click();
                                $('#btnAdjustmentDetailWiz').click();
                                this.showSpinner = false;
                            } else {
                                this.swalPopUpMsg(parse.data);
                                this.showSpinner = false;
                            }
                        },
                        error => {
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data);
                            this.showSpinner = false;
                        });
            } else {
                this.showSpinner = false;
            }
        })
    }
    //#endregion btnCancel

    //#region returnJournal
    returnJournal() {
        this.dataTampAdjustmentData = [{
            'p_code': this.param,
            'action': 'default'
        }];
        this.dalservice.ExecSp(this.dataTampAdjustmentData, this.APIController, this.APIRouteForReturnJournal)
            .subscribe(
                resReturn => {
                    const parseReturn = JSON.parse(resReturn);
                    if (parseReturn.result === 1) {
                        this.callGetrow();
                        $('#reloadtabdetail', parent.parent.document).click();
                        this.showSpinner = false;
                    } else {
                        this.swalPopUpMsg(parseReturn.data);
                        this.showSpinner = false;
                    }
                },
                error => {
                    const parseReturn = JSON.parse(error);
                    this.swalPopUpMsg(parseReturn.data);
                    this.showSpinner = false;
                });
    }
    //#endregion returnJournal

    //#region Disposal list tabs
    adjustmentdetailwiz() {
        this.route.navigate(['/inquiry/subadjustmenthistorylist/adjustmenthistorydetail/' + this.param + '/adjustmentdetailhistorylist', this.param], { skipLocationChange: true });
    }
    adjustmentdocumentwiz() {
        this.route.navigate(['/inquiry/subadjustmenthistorylist/adjustmenthistorydetail/' + this.param + '/adjustmentdocumenthistorylist', this.param], { skipLocationChange: true });
    }
    //#endregion Disposal list tabs

    //#region Branch Lookup
    btnLookupBranch() {
        $('#datatableLookupBranch').DataTable().clear().destroy();
        $('#datatableLookupBranch').DataTable({
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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerBranch, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupbranch = parse.data;
                    if (parse.data != null) {
                        this.lookupbranch.numberIndex = dtParameters.start;
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

    btnSelectRowBranch(code: String, description: String
    ) {
        this.model.branch_code = code;
        this.model.branch_name = description;
        this.model.barcode = '';
        this.model.asset_code = '';
        this.model.asset_name = '';
        $('#lookupModalBranch').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Branch lookup

    //#region Cost Center Lookup
    btnLookupCostCenter() {
        $('#datatableLookupCostCenter').DataTable().clear().destroy();
        $('#datatableLookupCostCenter').DataTable({
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
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerCostCenter, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupcostcenter = parse.data;
                    if (parse.data != null) {
                        this.lookupcostcenter.numberIndex = dtParameters.start;
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

    btnSelectRowCostCenter(code: string, description: string) {
        this.model.cost_center_code = code;
        this.model.cost_center_name = description;
        $('#lookupModalCostCenter').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Cost Center lookup

    //#region Radio Buttn
    NonReval(event: any) {
        this.RevalNonReval = event.target.value;
        if (this.RevalNonReval == 'REVAL') {
            this.isButton = true;
        }
        else {
            this.isButton = false;
        }
    }
    //#endregion Radio Button
}

