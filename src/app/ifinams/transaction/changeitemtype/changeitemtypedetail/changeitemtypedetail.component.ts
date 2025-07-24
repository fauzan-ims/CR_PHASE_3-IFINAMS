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
    templateUrl: './changeitemtypedetail.component.html'
})

export class ChangeitemtypedetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public disposalData: any = [];
    public orderdetaillist: any = [];
    public isReadOnly: Boolean = false;
    public setStyle: any = [];
    public lookupbranch: any = [];
    public lookuplocation: any = [];
    public lookupfromitem: any = [];
    public lookuptoitem: any = [];
    public lookupreason: any = [];
    private dataTamp: any = [];
    private dataRoleTamp: any = [];
    public dataTampGetrow: any = [];
    private dataTampChangeItemData: any = [];
    public lookupdeprecomm: any = [];
    public lookupdeprefiscal: any = [];
    public lookupcostcenter: any = [];
    public dataRoleTampInsertLog: any = [];
    public jsonDataJournal: any = [];


    //controller
    private APIController: String = 'ChangeItemType';
    private APIControllerFromItem: String = 'Asset';
    private APIControllerToItem: String = 'MasterItem';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerLocation: String = 'MasterLocation';
    private APIControllerCostCenter: String = 'CostCenter';
    private APIControllerGlobalParam: String = 'GlobalParam';
    private APIControllerJournalDetail: String = 'JournalDetail';
    private APIControllerApiLog: String = 'ApiLog';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteLookupFromItem: String = 'GetRowsForLookupChangeCat';
    private APIRouteLookupToItem: String = 'GetRowsForLookupChangeItem';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForReturn: String = 'ExecSpForReturn';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForReject: String = 'ExecSpForReject';
    private APIRouteForGetRowForThirdParty: String = 'GetRowForThirdParty';
    private APIRouteForCallThirdParty: String = 'CallThirdParty';
    private APIRouteForJournalDetail: String = 'GetRowsForThirdParty';
    private APIRouteForReturnJournal: String = 'ExecSpForReturnJournal';
    private APIRouteForInsertLog: String = 'ExecSpForInsertLog';

    private RoleAccessCode = 'R00021920000000A';

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
        if (this.param != null) {
            this.isReadOnly = true;
            this.callGetrow();
        } else {
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.status = 'NEW';
            this.model.to_net_book_value_fiscal = 0;
            this.model.to_net_book_value_comm = 0;

        }
    }

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

    //#region form submit
    onFormSubmit(ChangeItemTypeForm: NgForm, isValid: boolean) {

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

        this.disposalData = this.JSToNumberFloats(ChangeItemTypeForm);
        console.table(this.disposalData)

        const usersJson: any[] = Array.of(this.disposalData);

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
                            this.route.navigate(['/transaction/subchangeitemtypelist/changeitemtypedetail', parse.code]);
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
        this.route.navigate(['/transaction/subchangeitemtypelist']);
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
                'pointer-events': 'auto',
            }
        }

        return this.setStyle;
    }
    //#endregion getStyles

    //#region btnProceed
    btnProceed() {
        // param tambahan untuk getrole dynamic
        this.dataTampChangeItemData = [{
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
                this.dalservice.ExecSp(this.dataTampChangeItemData, this.APIController, this.APIRouteForProceed)
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
        this.dataTampChangeItemData = [{
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
                this.dalservice.ExecSp(this.dataTampChangeItemData, this.APIController, this.APIRouteForReturn)
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
        this.dataTampChangeItemData = [{
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
                this.dalservice.ExecSp(this.dataTampChangeItemData, this.APIController, this.APIRouteForCancel)
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
    //#endregion btnPost

    //#region btnPost
    // btnPost() {
    //     this.dataTampChangeItemData = [{
    //         'p_code': this.param,
    //         'action': 'default'
    //     }];

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
    //             this.dalservice.ExecSp(this.dataTampChangeItemData, this.APIController, this.APIRouteForPost)
    //                 .subscribe(
    //                     resDataChangeItem => {
    //                         const parseDataChangeItem = JSON.parse(resDataChangeItem);

    //                         if (parseDataChangeItem.result === 1) {
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
    //                                                                                 "TrxCode": 'FAMCIT',
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
    //                                                                                                                     $('#reloadtabdetail', parent.parent.document).click();
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
    //                             this.swalPopUpMsg(parseDataChangeItem.data);
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
    //     });
    // }
    //#endregion btnPost

    //#region btnReject
    btnReject() {
        // param tambahan untuk getrole dynamic
        this.dataTampChangeItemData = [{
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
                this.dalservice.ExecSp(this.dataTampChangeItemData, this.APIController, this.APIRouteForReject)
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

    //#region returnJournal
    returnJournal() {
        this.dataTampChangeItemData = [{
            'p_code': this.param,
            'action': 'default'
        }];
        this.dalservice.ExecSp(this.dataTampChangeItemData, this.APIController, this.APIRouteForReturnJournal)
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

        this.model.asset_code = '';
        this.model.item_name = '';
        this.model.depre_category_comm_code = '';
        this.model.depre_category_comm_name = '';
        this.model.depre_category_fiscal_code = '';
        this.model.depre_category_fiscal_name = '';
        this.model.from_category_code = '';
        this.model.from_category_name = '';
        this.model.category_code = '';
        this.model.from_item_code = '';
        this.model.item_code = '';
        this.model.original_price = '';
        this.model.net_book_value_comm = '';
        this.model.to_category_code = '';
        this.model.fa_category_name = '';
        this.model.item_group_code = '';
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
        this.model.location_name = description_location;
        $('#lookupModalLocation').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Location lookup

    //#region From Item Lookup
    btnLookupFromItem() {
        $('#datatableLookupFromItem').DataTable().clear().destroy();
        $('#datatableLookupFromItem').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerFromItem, this.APIRouteLookupFromItem).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupfromitem = parse.data;
                    if (parse.data != null) {
                        this.lookupfromitem.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 5] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowFromItem(code: string, barcode: string, item_name: string, depre_category_comm_code: string, depre_category_comm_name: string, depre_category_fiscal_code: string
        , depre_category_fiscal_name: string, category_code: string, category_name: string, item_code: string, purchase_price: string, net_book_value_comm: string, net_book_value_fiscal: string) {
        this.model.asset_code = code;
        this.model.barcode = barcode;
        this.model.from_item_name = item_name;
        this.model.depre_category_comm_code = depre_category_comm_code;
        this.model.depre_category_comm_name = depre_category_comm_name;
        this.model.depre_category_fiscal_code = depre_category_fiscal_code;
        this.model.depre_category_fiscal_name = depre_category_fiscal_name;
        this.model.from_category_code = category_code;
        this.model.from_category_name = category_name;
        this.model.from_item_code = item_code;
        this.model.item_code = item_code;
        this.model.purchase_price = purchase_price;
        this.model.from_net_book_value_comm = net_book_value_comm;
        this.model.from_net_book_value_fiscal = net_book_value_fiscal;
        $('#lookupModalFromItem').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion From Item lookup

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
        // this.model.company_code = company_code;
        this.model.cost_center_code = code;
        this.model.cost_center_name = description;
        $('#lookupModalCostCenter').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Cost Center lookup

    //#region To Item Lookup
    btnLookupToItem() {
        $('#datatableLookupToItem').DataTable().clear().destroy();
        $('#datatableLookupToItem').DataTable({
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
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerToItem, this.APIRouteLookupToItem).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookuptoitem = parse.data;
                    if (parse.data != null) {
                        this.lookuptoitem.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 5] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowToItem(code: string, description: string, fa_category_code: string, fa_category_name: string, item_group_code: string) {
        this.model.to_item_code = code;
        this.model.to_item_name = description;
        this.model.to_category_code = fa_category_code;
        this.model.to_category_name = fa_category_name;
        this.model.item_group_code = item_group_code;
        $('#lookupModalToItem').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion To Item lookup
}

