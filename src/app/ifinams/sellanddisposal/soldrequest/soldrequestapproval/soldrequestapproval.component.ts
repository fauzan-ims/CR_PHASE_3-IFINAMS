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
    templateUrl: './soldrequestapproval.component.html'
})

export class SoldRequestApprovalComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public listsaledetail: any = [];
    public listsalesdetail: any = [];
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public saleData: any = [];
    public orderdetaillist: any = [];
    public isReadOnly: Boolean = false;
    private dataTamp: any = [];
    public dataTampGetrow: any = [];
    private dataRoleTamp: any = [];
    public setStyle: any = [];
    public lookupbranch: any = [];
    public lookupAuction: any = [];
    public lookuplocation: any = [];
    public lookupreason: any = [];
    private dataTampSaleData: any = [];
    public dataRoleTampInsertLog: any = [];
    public jsonDataJournal: any = [];
    public sell_type: String;
    public isAuction: Boolean = false;

    //controller
    private APIController: String = 'Sale';
    private APIControllerAsset: String = 'SaleDetail';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerLocation: String = 'MasterLocation';
    private APIControllerAuction: String = 'MasterAuction';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForGetRows: String = 'GetRowsForSoldRequest';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForReturn: String = 'ExecSpForReturn';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForPost: String = 'ExecSpForPostSoldRequest';
    private APIRouteForReject: String = 'ExecSpForReject';
    private APIRouteForReturnJournal: String = 'ExecSpForReturnJournal';
    private RoleAccessCode = '';

    // report
    private APIControllerReport: String = 'Report';
    private APIRouteForDownload: String = 'getReport';

    // form 2 way binding
    model: any = {};

    // checklist
    public selectedAll: any;

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
        this.callGetrow();
        this.loadData();
        // if (this.param != null) {
        //     this.isReadOnly = true;
        //     this.callGetrow();
        // } else {
        //     this.showSpinner = false;
        //     this.model.company_code = this.company_code;
        //     this.model.status = 'HOLD';
        //     this.model.sale_amount_header = 0;
        //     this.model.sell_type = 'AUCTION';
        // }
    }

    //#region load all data
    loadData() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            responsive: true,
            serverSide: true,
            processing: true,
            pageLength: 5,
            lengthChange: false, // hide lengthmenu
            paging: true,
            'lengthMenu': [
                [10, 25, 50, 100],
                [10, 25, 50, 100]
            ],
            ajax: (dtParameters: any, callback) => {
                // param tambahan untuk getrows dynamic
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_sale_code': this.param,
                })
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerAsset, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    this.listsaledetail = parse.data;

                    if (parse.data != null) {
                        this.listsaledetail.numberIndex = dtParameters.start;
                    }

                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
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

    //#region getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param
        }];
        // end param tambahan untuk getrow dynamic

        // this._widgetdetailService.WidgetDetailGetrow(this.dataTamp)
        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);
                    
                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui

                    if (this.model.sell_type === 'AUCTION') {
                        this.isAuction = false
                    } else {
                        this.isAuction = true
                    }

                    if (parsedata.status != 'HOLD') {
                        this.isReadOnly = true;
                    } else {
                        this.isReadOnly = false;
                    }
                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion getrow data

    //#region form submit
    onFormSubmit(SoldRequestForm: NgForm, isValid: boolean) {

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

        this.saleData = this.JSToNumberFloats(SoldRequestForm);

        const usersJson: any[] = Array.of(this.saleData);

        if (this.param != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                            this.callGetrow();
                            $('#datatableSaleDetail').DataTable().ajax.reload();
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
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                            this.route.navigate(['/sellanddisposal/subsoldrequestlist/soldrequestdetail', parse.code]);
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
        }
    }
    //#endregion form submit

    //#region button back
    btnBack() {
        this.route.navigate(['/sellanddisposal/subsoldrequestlist']);
        $('#datatablesoldrequest').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region Sale list tabs
    saledetailwiz() {
        this.route.navigate(['/sellanddisposal/subsoldrequestlist/soldrequestdetail/' + this.param + '/soldrequestassetlist', this.param], { skipLocationChange: true });
    }
    //#endregion Sale list tabs

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

    //#region btnProceed
    btnProceed() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForProceed)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                // $('#reloadtabdetail', parent.parent.document).click();
                                // $('#docdetailwiz').click();
                                // $('#tabdetailwiz').click();
                                // $('#tabbiddingwiz').click();
                            } else {
                                this.swalPopUpMsg(parse.data);
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
        })
    }
    //#endregion btnProceed

    //#region btnReturn
    btnReturn() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForReturn)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                // $('#reloadtabdetail', parent.parent.document).click();
                                // $('#docdetailwiz').click();
                                // $('#tabdetailwiz').click();
                                // $('#tabbiddingwiz').click();
                            } else {
                                this.swalPopUpMsg(parse.data);
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
        })
    }
    //#endregion btnReturn

    //#region btnCancel
    btnCancel() {
        // param tambahan untuk button Done dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
            'action': 'default'
        }];
        // param tambahan untuk button Done dynamic

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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancel)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                // $('#reloadtabdetail', parent.parent.document).click();
                                $('#docdetailwiz').click();
                                $('#tabdetailwiz').click();
                                $('#tabbiddingwiz').click();
                            } else {
                                this.swalPopUpMsg(parse.data);
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
        })
    }
    //#endregion btnCancel

    //#region btnPost
    btnPost() {
        // param tambahan untuk button Done dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
            'action': 'default'
        }];
        // param tambahan untuk button Done dynamic

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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPost)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#docdetailwiz').click();
                                $('#tabdetailwiz').click();
                                $('#tabbiddingwiz').click();
                            } else {
                                this.swalPopUpMsg(parse.data);
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
        })
    }
    //#endregion btnPost

    //#region btnPost
    // btnPost() {
    //     // param tambahan untuk getrole dynamic
    //     this.dataRoleTamp = [{
    //         'p_code': this.param,
    //         'action': 'default'
    //     }];
    //     // param tambahan untuk getrole dynamic

    //     // call web service
    //     swal({
    //         title: 'Are you sure?',
    //         type: 'warning',
    //         showCancelButton: true,
    //         confirmButtonClass: 'btn btn-success',
    //         cancelButtonClass: 'btn btn-danger',
    //         confirmButtonText: this._deleteconf,
    //         buttonsStyling: false
    //     }).then((result) => {
    //         this.showSpinner = true;
    //         if (result.value) {
    //             this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPost)
    //                 .subscribe(
    //                     rresDataSale => {
    //                         const parseDataSale = JSON.parse(rresDataSale);

    //                         if (parseDataSale.result === 1) {
    //                             this.dataTamp = [{
    //                                 'p_code': "AJT"
    //                             }];

    //                             this.dalservice.GetrowBam(this.dataTamp, this.APIControllerGlobalParam, this.APIRouteForGetRow)
    //                                 .subscribe(
    //                                     resGlobalParam => {
    //                                         const parseGlobalParam = JSON.parse(resGlobalParam);
    //                                         const parsedataGlobalParam = parseGlobalParam.data[0];

    //                                         this.dataTampGetrow = [{
    //                                             'p_code': this.param,
    //                                             'p_company_code': this.company_code
    //                                         }];

    //                                         this.dalservice.Getrow(this.dataTampGetrow, this.APIControllerJournalDetail, this.APIRouteForGetRowForThirdParty)
    //                                             .subscribe(
    //                                                 resJournal => {
    //                                                     const parseJournal = JSON.parse(resJournal);

    //                                                     if (parseJournal.data !== 'This low value data cannot be processed') {
    //                                                         if (parseJournal.data.length > 0) {
    //                                                             const dataTampJournal = [{
    //                                                                 'p_gl_link_transaction_code': parseJournal.data[0].code,
    //                                                                 'p_company_code': this.company_code,
    //                                                                 'action': 'getResponse'
    //                                                             }];
    //                                                             this.dalservice.ExecSp(dataTampJournal, this.APIControllerJournalDetail, this.APIRouteForJournalDetail)
    //                                                                 .subscribe(
    //                                                                     resJournalDetail => {
    //                                                                         const parseJournalDetail = JSON.parse(resJournalDetail);

    //                                                                         const JournalTrx = [];

    //                                                                         for (let i = 0; i < parseJournalDetail.data.length; i++) {
    //                                                                             JournalTrx.push({
    //                                                                                 "LineDescr": parseJournalDetail.data[i].remarks,
    //                                                                                 "DC": parseJournalDetail.data[i].d_c,
    //                                                                                 "Amount": parseJournalDetail.data[i].base_amount_db,
    //                                                                                 "COA": parseJournalDetail.data[i].gl_link_code,
    //                                                                                 "COABranch": parseJournalDetail.data[i].branch_code,
    //                                                                                 "CostCenter": parseJournalDetail.data[i].cost_center_code
    //                                                                             });
    //                                                                         }
    //                                                                         const dataJournal = {
    //                                                                             "body_req":
    //                                                                             {
    //                                                                                 "OfficeCode": parseJournal.data[0].branch_code,
    //                                                                                 "JrNo": parseJournal.data[0].code,
    //                                                                                 "TrxCode": 'FAMSLE',
    //                                                                                 "PeriodYear": parseJournal.data[0].period_year,
    //                                                                                 "PeriodMonth": parseJournal.data[0].month_year,
    //                                                                                 "ValueDate": parseJournal.data[0].transaction_value_date,
    //                                                                                 "PostingDate": parseJournal.data[0].transaction_date,
    //                                                                                 "RefNo": parseJournal.data[0].transaction_code,
    //                                                                                 "JrAmt": parseJournal.data[0].base_amount_db,
    //                                                                                 "JournalDetail": JournalTrx
    //                                                                             }, "url": parsedataGlobalParam.value
    //                                                                         };
    //                                                                         const jsonDataJournal = JSON.stringify(dataJournal);

    //                                                                         // insert to API log
    //                                                                         this.dataRoleTampInsertLog = [{
    //                                                                             'p_transaction_no': parseJournal.data[0].code,
    //                                                                             'p_url_request': parsedataGlobalParam.value,
    //                                                                             'p_json_content': jsonDataJournal,
    //                                                                             'p_response_code': '',
    //                                                                             'p_response_message': '',
    //                                                                             'p_response_json': '',
    //                                                                             'p_cre_by': this.userId,
    //                                                                             'p_cre_ip_address': this.ipAddress,
    //                                                                             'p_mod_by': this.userId,
    //                                                                             'p_mod_ip_address': this.ipAddress,
    //                                                                             'action': 'default'
    //                                                                         }];

    //                                                                         this.dalservice.ExecSp(this.dataRoleTampInsertLog, this.APIControllerApiLog, this.APIRouteForInsertLog)
    //                                                                             .subscribe(
    //                                                                                 resInsertLog => {
    //                                                                                     const parseInsertLog = JSON.parse(resInsertLog);


    //                                                                                     this.dalservice.CallThirdPartyAPI(dataJournal, this.APIController, this.APIRouteForCallThirdParty)
    //                                                                                         .subscribe(
    //                                                                                             resAPI => {
    //                                                                                                 const parseAPI = JSON.parse(resAPI);
    //                                                                                                 var resultCode;

    //                                                                                                 if (parseAPI.data.Code !== undefined) {
    //                                                                                                     resultCode = parseAPI.data.Code;
    //                                                                                                 } else if (parseAPI.data.StatusCode !== undefined) {
    //                                                                                                     resultCode = parseAPI.data.StatusCode;
    //                                                                                                 }

    //                                                                                                 if (resultCode === '1') {
    //                                                                                                     const responseJson = JSON.stringify(parseAPI.data);
    //                                                                                                     // insert to API log
    //                                                                                                     this.dataRoleTampInsertLog = [{
    //                                                                                                         'p_transaction_no': parseJournal.data[0].code,
    //                                                                                                         'p_url_request': parsedataGlobalParam.value,
    //                                                                                                         'p_json_content': jsonDataJournal,
    //                                                                                                         'p_response_code': resultCode,
    //                                                                                                         'p_response_message': '',
    //                                                                                                         'p_response_json': responseJson,
    //                                                                                                         'p_cre_by': this.userId,
    //                                                                                                         'p_cre_ip_address': this.ipAddress,
    //                                                                                                         'p_mod_by': this.userId,
    //                                                                                                         'p_mod_ip_address': this.ipAddress,
    //                                                                                                         'action': 'default'
    //                                                                                                     }];
    //                                                                                                     this.dalservice.ExecSp(this.dataRoleTampInsertLog, this.APIControllerApiLog, this.APIRouteForInsertLog)
    //                                                                                                         .subscribe(
    //                                                                                                             resInsertLog => {
    //                                                                                                                 const parseInsertLog = JSON.parse(resInsertLog);
    //                                                                                                                 if (parseInsertLog.result === 1) {

    //                                                                                                                     this.showNotification('bottom', 'right', 'success');
    //                                                                                                                     this.callGetrow();
    //                                                                                                                     // $('#reloadtabdetail', parent.parent.document).click();
    //                                                                                                                     $('#docdetailwiz').click();
    //                                                                                                                     $('#tabdetailwiz').click();
    //                                                                                                                     $('#tabbiddingwiz').click();
    //                                                                                                                     this.showSpinner = false;
    //                                                                                                                 }
    //                                                                                                             },
    //                                                                                                             error => {
    //                                                                                                                 const parseInsertLog = JSON.parse(error);
    //                                                                                                                 this.swalPopUpMsg(parseInsertLog.data);
    //                                                                                                                 this.showSpinner = false;
    //                                                                                                             });
    //                                                                                                     // end insert to API log

    //                                                                                                 } else {
    //                                                                                                     this.returnJournal();
    //                                                                                                     // var errorMsg;

    //                                                                                                     var errorMsg;
    //                                                                                                     if (parseAPI.data.ErrMsg !== undefined) {
    //                                                                                                         errorMsg = parseAPI.data.ErrMsg;
    //                                                                                                     } else if (parseAPI.data.ErrorMessage !== undefined) {
    //                                                                                                         errorMsg = parseAPI.data.ErrorMessage;
    //                                                                                                     }

    //                                                                                                     const responseJson = JSON.stringify(parseAPI.data);
    //                                                                                                     // insert to API log
    //                                                                                                     this.dataRoleTampInsertLog = [{
    //                                                                                                         'p_transaction_no': parseJournal.data[0].code,
    //                                                                                                         'p_url_request': parsedataGlobalParam.value,
    //                                                                                                         'p_json_content': jsonDataJournal,
    //                                                                                                         'p_response_code': resultCode,
    //                                                                                                         'p_response_message': errorMsg,
    //                                                                                                         'p_response_json': responseJson,
    //                                                                                                         'p_cre_by': this.userId,
    //                                                                                                         'p_cre_ip_address': this.ipAddress,
    //                                                                                                         'p_mod_by': this.userId,
    //                                                                                                         'p_mod_ip_address': this.ipAddress,
    //                                                                                                         'action': 'default'
    //                                                                                                     }];
    //                                                                                                     // console.log(this.dataRoleTampInsertLog);

    //                                                                                                     this.dalservice.ExecSp(this.dataRoleTampInsertLog, this.APIControllerApiLog, this.APIRouteForInsertLog)
    //                                                                                                         .subscribe(
    //                                                                                                             resInsertLog => {
    //                                                                                                                 const parseInsertLog = JSON.parse(resInsertLog);
    //                                                                                                                 if (parseInsertLog.result === 1) {
    //                                                                                                                     // this.returnJournal();
    //                                                                                                                     this.showSpinner = false;
    //                                                                                                                     this.swalPopUpMsg('V;' + errorMsg);
    //                                                                                                                 }
    //                                                                                                             },
    //                                                                                                             error => {
    //                                                                                                                 const parseInsertLog = JSON.parse(error);
    //                                                                                                                 this.swalPopUpMsg(parseInsertLog.data);
    //                                                                                                                 this.showSpinner = false;
    //                                                                                                             });
    //                                                                                                     // end insert to API log
    //                                                                                                     // if (parseAPI.data.ErrMsg !== undefined) {
    //                                                                                                     //     errorMsg = parseAPI.data.ErrMsg;
    //                                                                                                     // } else if (parseAPI.data.ErrorMessage !== undefined) {
    //                                                                                                     //     errorMsg = parseAPI.data.ErrorMessage;
    //                                                                                                     // }
    //                                                                                                     // this.swalPopUpMsg('V;' + errorMsg);
    //                                                                                                 }
    //                                                                                             },
    //                                                                                             error => {
    //                                                                                                 this.returnJournal();
    //                                                                                                 const parseAPI = JSON.parse(error);
    //                                                                                                 this.swalPopUpMsg(parseAPI.data);
    //                                                                                                 this.showSpinner = false;
    //                                                                                             });
    //                                                                                 },
    //                                                                                 error => {
    //                                                                                     const parseInsertLog = JSON.parse(error);
    //                                                                                     this.swalPopUpMsg(parseInsertLog.data);
    //                                                                                     this.showSpinner = false;
    //                                                                                 });
    //                                                                         // end insert to API log

    //                                                                     },
    //                                                                     error => {
    //                                                                         this.returnJournal();
    //                                                                         const parses = JSON.parse(error);
    //                                                                         this.swalPopUpMsg(parses.data);
    //                                                                         this.showSpinner = false;
    //                                                                     });
    //                                                         } else {
    //                                                             this.swalPopUpMsg('V; Jurnal Tidak Dapat Terbentuk. Silahkan Cek Kembali Setting Jurnal Anda ');
    //                                                             this.returnJournal();
    //                                                             this.showSpinner = false;
    //                                                         }
    //                                                     }
    //                                                     else {
    //                                                         this.callGetrow();
    //                                                         this.showSpinner = false;
    //                                                     }
    //                                                 },
    //                                                 error => {
    //                                                     this.returnJournal();
    //                                                     const parse = JSON.parse(error);
    //                                                     this.swalPopUpMsg(parse.data);
    //                                                     this.showSpinner = false;
    //                                                 });
    //                                     },
    //                                     error => {
    //                                         const parse = JSON.parse(error);
    //                                         this.swalPopUpMsg(parse.data);
    //                                         this.showSpinner = false;
    //                                     });

    //                         } else {
    //                             this.swalPopUpMsg(parseDataSale.data);
    //                             this.showSpinner = false;
    //                         }
    //                     },
    //                     error => {
    //                         this.showSpinner = false;
    //                         const parse = JSON.parse(error);
    //                         this.swalPopUpMsg(parse.data);
    //                     });
    //         } else {
    //             this.showSpinner = false;
    //         }
    //     })
    // }
    //#endregion btnPost

    //#region returnJournal
    returnJournal() {
        this.dataTampSaleData = [{
            'p_code': this.param,
            'action': 'default'
        }];
        this.dalservice.ExecSp(this.dataTampSaleData, this.APIController, this.APIRouteForReturnJournal)
            .subscribe(
                resReturn => {
                    const parseReturn = JSON.parse(resReturn);
                    if (parseReturn.result === 1) {
                        this.callGetrow();
                        // $('#reloadtabdetail', parent.parent.document).click();
                        // $('#docdetailwiz').click();
                        // $('#tabdetailwiz').click();
                        // $('#tabbiddingwiz').click();
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

    //#region btnReject
    btnReject() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForReject)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                // $('#reloadtabdetail', parent.parent.document).click();
                                // $('#docdetailwiz').click();
                                // $('#tabdetailwiz').click();
                                // $('#tabbiddingwiz').click();
                            } else {
                                this.swalPopUpMsg(parse.data);
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
        })
    }
    //#endregion btnReject

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

    btnSelectRowBranch(code: string, description: string) {
        this.model.branch_code = code;
        this.model.branch_name = description;
        this.model.location_code = '';
        this.model.description_location = '';
        $('#lookupModalBranch').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Branch lookup

    //#region Location Lookup
    btnLookupLocation() {
        $('#datatableLookupLocation').DataTable().clear().destroy();
        $('#datatableLookupLocation').DataTable({
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
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerLocation, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookuplocation = parse.data;
                    if (parse.data != null) {
                        this.lookuplocation.numberIndex = dtParameters.start;
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

    btnSelectRowLocation(code: string, description_location: string) {
        this.model.location_code = code;
        this.model.description_location = description_location;
        $('#lookupModalLocation').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Location lookup

    //#region button Print
    btnPrint(p_code: string) {
        const rptParam = {
            p_user_id: this.userId,
            p_type: 'SALE',
            p_agreement_no: p_code,
            p_print_option: 'PDF'
        }

        const dataParam = {
            TableName: this.model.table_name,
            SpName: this.model.sp_name,
            reportparameters: rptParam
        };

        this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
            this.showSpinner = false;
            this.printRptNonCore(res);
        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    //#endregion button Print

    //#region Branch Lookup
    btnLookupAution() {
        $('#datatableLookupAuction').DataTable().clear().destroy();
        $('#datatableLookupAuction').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerAuction, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupAuction = parse.data;

                    if (parse.data != null) {
                        this.lookupAuction.numberIndex = dtParameters.start;
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

    btnSelectRowAuction(code: string, auction_name: string) {
        this.model.auction_code = code;
        this.model.auction_name = auction_name;
        this.model.location_code = '';
        this.model.description_location = '';
        $('#lookupAuction').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Branch lookup

    //#region ddl clientType
    sellType(event: any) {
        this.sell_type = event.target.value;
        if (this.sell_type === 'AUCTION') {
            this.isAuction = false
        } else {
            this.isAuction = true
        }

    }
    //#endregion ddl clientType

}

