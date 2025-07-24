import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './assetdepretiationlist.component.html'
})

export class listassetdepretiationlistComponent extends BaseComponent implements OnInit {
    // variable
    public listassetdepretiation: any = [];
    public dataTamp: any = [];
    public dataRoleTampInsertLog: any = [];
    public dataTampGetrow: any = [];
    public parseInsert: any = [];
    public status: any;
    public month: any;
    public year: any;
    public to_date: any = [];
    public lookupCostCenter: any = [];
    private idDetailMutation: any;
    public listdataDetail: any = [];
    private dataRoleTamp: any = [];
    public jsonDataJournal: any = [];
    private dataTampAssetDepretiationData: any = [];

    //controller
    private APIController: String = 'AssetDepreciation';
    private APIControllerCostCenter: String = 'CostCenter';
    private APIControllerGlobalParam: String = 'GlobalParam';
    private APIControllerJournalDetail: String = 'JournalDetail';
    private APIControllerApiLog: String = 'ApiLog';

    //routing
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForUpdateCostCenter: String = 'UpdateCostCenter';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsertLog: String = 'ExecSpForInsertLog';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForGenerate: String = 'ExecSpForGenerate';
    private APIRouteForGetRowForThirdParty: String = 'GetRowForThirdParty';
    private APIRouteForCallThirdParty: String = 'CallThirdParty';
    private APIRouteForJournalDetail: String = 'GetRowsForThirdParty';
    private APIRouteForReturnJournal: String = 'ExecSpForReturnJournal';

    private RoleAccessCode = 'R00021890000000A';

    // form 2 way binding
    model: any = {};

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    // checklist
    public selectedAll: any;
    public checkedList: any = [];

    // spinner
    showSpinner: Boolean = false;
    // end

    constructor(private dalservice: DALService,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide(this._location, this._elementRef, this.route);
        this.loadData();
        this.status = 'POST';
    }

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
                    'p_status': this.status,
                    'p_company_code': this.company_code,
                    'p_year': this.year,
                    'p_month': this.month
                })                
                // end param tambahan untuk getrows dynamic

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.listassetdepretiation = parse.data;

                    if (parse.data != null) {
                        this.listassetdepretiation.numberIndex = dtParameters.start;
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
            columnDefs: [{ orderable: false, width: '5%', targets: [0] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region ddl Status
    PageStatus(event: any) {
        this.status = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl Status

    //#region ddl Month
    Month(event: any) {
        this.month = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl Month

    //#region ddl Month
    Year(event: any) {
        this.year = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl Month

    //#region btnPost
    btnPost() {
        // param tambahan untuk button Done dynamic
        this.dataRoleTamp = [{
            'p_year': this.year,
            'p_month': this.month,
            'p_company_code': this.company_code,
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
                                $('#datatable').DataTable().ajax.reload();
                                
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

    //     this.dataTampAssetDepretiationData = [this.JSToNumberFloats({
    //         'p_year': this.year,
    //         'p_month': this.month,
    //         'p_company_code': this.company_code,
    //         'action': 'default'
    //     })];

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
    //             // this.dalservice.ExecSp(this.dataTampAssetDepretiationData, this.APIController, this.APIRouteForPost)
    //             //     .subscribe(
    //             //         resDataAssetDepretiation => {
    //             //             const parseDataAssetDepretiation = JSON.parse(resDataAssetDepretiation);

    //             //             if (parseDataAssetDepretiation.result === 1) {
    //             this.dataTamp = [{
    //                 'p_code': "AJT"
    //             }];

    //             this.dalservice.GetrowBam(this.dataTamp, this.APIControllerGlobalParam, this.APIRouteForGetRow)
    //                 .subscribe(
    //                     resGlobalParam => {
    //                         const parseGlobalParam = JSON.parse(resGlobalParam);
    //                         const parsedataGlobalParam = parseGlobalParam.data[0];

    //                         this.dataTampGetrow = [{
    //                             'p_code': this.year + this.month,
    //                             'p_company_code': this.company_code
    //                         }];

    //                         this.dalservice.Getrow(this.dataTampGetrow, this.APIControllerJournalDetail, this.APIRouteForGetRowForThirdParty)
    //                             .subscribe(
    //                                 resJournal => {
    //                                     const parseJournal = JSON.parse(resJournal);

    //                                     if (parseJournal.data !== 'This low value data cannot be processed') {
    //                                         if (parseJournal.data.length > 0) {

    //                                             for (let j = 0; j < parseJournal.data.length; j++) {
    //                                                 const dataTampJournal = [{
    //                                                     'p_gl_link_transaction_code': parseJournal.data[j].code,
    //                                                     'p_company_code': this.company_code,
    //                                                     'action': 'getResponse'
    //                                                 }];

    //                                                 this.dalservice.ExecSp(dataTampJournal, this.APIControllerJournalDetail, this.APIRouteForJournalDetail)
    //                                                     .subscribe(
    //                                                         resJournalDetail => {
    //                                                             const parseJournalDetail = JSON.parse(resJournalDetail);

    //                                                             const JournalTrx = [];
    //                                                             for (let i = 0; i < parseJournalDetail.data.length; i++) {
    //                                                                 JournalTrx.push({
    //                                                                     "LineDescr": parseJournalDetail.data[i].remarks,
    //                                                                     "DC": parseJournalDetail.data[i].d_c,
    //                                                                     "Amount": parseJournalDetail.data[i].base_amount_db,
    //                                                                     "COA": parseJournalDetail.data[i].gl_link_code,
    //                                                                     "COABranch": parseJournalDetail.data[i].branch_code,
    //                                                                     "CostCenter": parseJournalDetail.data[i].cost_center_code
    //                                                                 });
    //                                                             }
    //                                                             const dataJournal = {
    //                                                                 "body_req":
    //                                                                 {
    //                                                                     "OfficeCode": parseJournal.data[j].branch_code,
    //                                                                     "JrNo": parseJournal.data[j].code,
    //                                                                     "TrxCode": 'FAMDPR',
    //                                                                     "PeriodYear": parseJournal.data[j].period_year,
    //                                                                     "PeriodMonth": parseJournal.data[j].month_year,
    //                                                                     "ValueDate": parseJournal.data[j].transaction_value_date,
    //                                                                     "PostingDate": parseJournal.data[j].transaction_date,
    //                                                                     "RefNo": parseJournal.data[j].transaction_code,
    //                                                                     "JrAmt": parseJournal.data[j].base_amount_db,
    //                                                                     "JournalDetail": JournalTrx
    //                                                                 }, "url": parsedataGlobalParam.value
    //                                                             };
    //                                                             const jsonDataJournal = JSON.stringify(dataJournal);
    //                                                             // console.log(dataJournal);

    //                                                             // insert to API log
    //                                                             this.dataRoleTampInsertLog = [{
    //                                                                 'p_transaction_no': parseJournal.data[j].code,
    //                                                                 'p_url_request': parsedataGlobalParam.value,
    //                                                                 'p_json_content': jsonDataJournal,
    //                                                                 'p_response_code': '',
    //                                                                 'p_response_message': '',
    //                                                                 'p_response_json': '',
    //                                                                 'p_cre_by': this.userId,
    //                                                                 'p_cre_ip_address': this.ipAddress,
    //                                                                 'p_mod_by': this.userId,
    //                                                                 'p_mod_ip_address': this.ipAddress,
    //                                                                 'action': 'default'
    //                                                             }];

    //                                                             this.dalservice.ExecSp(this.dataRoleTampInsertLog, this.APIControllerApiLog, this.APIRouteForInsertLog)
    //                                                                 .subscribe(
    //                                                                     resInsertLog => {
    //                                                                         const parseInsertLog = JSON.parse(resInsertLog);

    //                                                                         this.dalservice.CallThirdPartyAPI(dataJournal, this.APIController, this.APIRouteForCallThirdParty)
    //                                                                             .subscribe(
    //                                                                                 resAPI => {
    //                                                                                     const parseAPI = JSON.parse(resAPI);
    //                                                                                     var resultCode;

    //                                                                                     if (parseAPI.data.Code !== undefined) {
    //                                                                                         resultCode = parseAPI.data.Code;
    //                                                                                     } else if (parseAPI.data.StatusCode !== undefined) {
    //                                                                                         resultCode = parseAPI.data.StatusCode;
    //                                                                                     }

    //                                                                                     if (resultCode === '1') {

    //                                                                                         const responseJson = JSON.stringify(parseAPI.data);
    //                                                                                         // insert to API log
    //                                                                                         this.dataRoleTampInsertLog = [{
    //                                                                                             'p_transaction_no': parseJournal.data[j].code,
    //                                                                                             'p_url_request': parsedataGlobalParam.value,
    //                                                                                             'p_json_content': jsonDataJournal,
    //                                                                                             'p_response_code': resultCode,
    //                                                                                             'p_response_message': '',
    //                                                                                             'p_response_json': responseJson,
    //                                                                                             'p_cre_by': this.userId,
    //                                                                                             'p_cre_ip_address': this.ipAddress,
    //                                                                                             'p_mod_by': this.userId,
    //                                                                                             'p_mod_ip_address': this.ipAddress,
    //                                                                                             'action': 'default'
    //                                                                                         }];
    //                                                                                         this.dalservice.ExecSp(this.dataRoleTampInsertLog, this.APIControllerApiLog, this.APIRouteForInsertLog)
    //                                                                                             .subscribe(
    //                                                                                                 resInsertLog => {
    //                                                                                                     const parseInsertLog = JSON.parse(resInsertLog);
    //                                                                                                     if (parseInsertLog.result === 1) {

    //                                                                                                         if (parseJournal.data.length == j + 1) {
    //                                                                                                             this.showNotification('bottom', 'right', 'success');
    //                                                                                                             $('#datatable').DataTable().ajax.reload();
    //                                                                                                             this.showSpinner = false;
    //                                                                                                         }
    //                                                                                                     }
    //                                                                                                 },
    //                                                                                                 error => {
    //                                                                                                     const parseInsertLog = JSON.parse(error);
    //                                                                                                     this.swalPopUpMsg(parseInsertLog.data);
    //                                                                                                     this.showSpinner = false;
    //                                                                                                 });
    //                                                                                         // end insert to API log

    //                                                                                     } else {
    //                                                                                         var errorMsg;
    //                                                                                         if (parseAPI.data.ErrMsg !== undefined) {
    //                                                                                             errorMsg = parseAPI.data.ErrMsg;
    //                                                                                         } else if (parseAPI.data.ErrorMessage !== undefined) {
    //                                                                                             errorMsg = parseAPI.data.ErrorMessage;
    //                                                                                         }

    //                                                                                         const responseJson = JSON.stringify(parseAPI.data);
    //                                                                                         // insert to API log
    //                                                                                         this.dataRoleTampInsertLog = [{
    //                                                                                             'p_transaction_no': parseJournal.data[j].code,
    //                                                                                             'p_url_request': parsedataGlobalParam.value,
    //                                                                                             'p_json_content': jsonDataJournal,
    //                                                                                             'p_response_code': resultCode,
    //                                                                                             'p_response_message': errorMsg,
    //                                                                                             'p_response_json': responseJson,
    //                                                                                             'p_cre_by': this.userId,
    //                                                                                             'p_cre_ip_address': this.ipAddress,
    //                                                                                             'p_mod_by': this.userId,
    //                                                                                             'p_mod_ip_address': this.ipAddress,
    //                                                                                             'action': 'default'
    //                                                                                         }];
    //                                                                                         // console.log(this.dataRoleTampInsertLog);

    //                                                                                         this.dalservice.ExecSp(this.dataRoleTampInsertLog, this.APIControllerApiLog, this.APIRouteForInsertLog)
    //                                                                                             .subscribe(
    //                                                                                                 resInsertLog => {
    //                                                                                                     const parseInsertLog = JSON.parse(resInsertLog);
    //                                                                                                     if (parseInsertLog.result === 1) {
    //                                                                                                         // this.returnJournal();
    //                                                                                                         $('#datatable').DataTable().ajax.reload();
    //                                                                                                         this.showSpinner = false;
    //                                                                                                         this.swalPopUpMsg('V;' + errorMsg);
    //                                                                                                     }
    //                                                                                                 },
    //                                                                                                 error => {
    //                                                                                                     const parseInsertLog = JSON.parse(error);
    //                                                                                                     this.swalPopUpMsg(parseInsertLog.data);
    //                                                                                                     this.showSpinner = false;
    //                                                                                                 });
    //                                                                                         // end insert to API log
    //                                                                                     }
    //                                                                                 },
    //                                                                                 error => {
    //                                                                                     // this.returnJournal();
    //                                                                                     const parseAPI = JSON.parse(error);
    //                                                                                     this.swalPopUpMsg(parseAPI.data);
    //                                                                                     this.showSpinner = false;
    //                                                                                 });
    //                                                                     },
    //                                                                     error => {
    //                                                                         const parseInsertLog = JSON.parse(error);
    //                                                                         this.swalPopUpMsg(parseInsertLog.data);
    //                                                                         this.showSpinner = false;
    //                                                                     });
                                                                // end insert to API log

                                                                // this.dalservice.CallThirdPartyAPI(dataJournal, this.APIController, this.APIRouteForCallThirdParty)
                                                                //     .subscribe(
                                                                //         resAPI => {
                                                                //             const parseAPI = JSON.parse(resAPI);
                                                                //             var resultCode;

                                                                //             if (parseAPI.data.Code !== undefined) {
                                                                //                 resultCode = parseAPI.data.Code;
                                                                //             } else if (parseAPI.data.StatusCode !== undefined) {
                                                                //                 resultCode = parseAPI.data.StatusCode;
                                                                //             }

                                                                //             if (resultCode === '1') {

                                                                //                 const responseJson = JSON.stringify(parseAPI.data);
                                                                //                 // insert to API log
                                                                //                 this.dataRoleTampInsertLog = [{
                                                                //                     'p_transaction_no': parseJournal.data[j].code,
                                                                //                     'p_url_request': parsedataGlobalParam.value,
                                                                //                     'p_json_content': jsonDataJournal,
                                                                //                     'p_response_code': resultCode,
                                                                //                     'p_response_message': '',
                                                                //                     'p_response_json': responseJson,
                                                                //                     'p_cre_by': this.userId,
                                                                //                     'p_cre_ip_address': this.ipAddress,
                                                                //                     'p_mod_by': this.userId,
                                                                //                     'p_mod_ip_address': this.ipAddress,
                                                                //                     'action': 'default'
                                                                //                 }];
                                                                //                 this.dalservice.ExecSp(this.dataRoleTampInsertLog, this.APIControllerApiLog, this.APIRouteForInsertLog)
                                                                //                     .subscribe(
                                                                //                         resInsertLog => {
                                                                //                             const parseInsertLog = JSON.parse(resInsertLog);
                                                                //                             if (parseInsertLog.result === 1) {

                                                                //                                 if (parseJournal.data.length == j + 1) {
                                                                //                                     this.showNotification('bottom', 'right', 'success');
                                                                //                                     $('#datatable').DataTable().ajax.reload();
                                                                //                                     this.showSpinner = false;
                                                                //                                 }
                                                                //                             }
                                                                //                         },
                                                                //                         error => {
                                                                //                             const parseInsertLog = JSON.parse(error);
                                                                //                             this.swalPopUpMsg(parseInsertLog.data);
                                                                //                             this.showSpinner = false;
                                                                //                         });
                                                                //                 // end insert to API log

                                                                //             } else {
                                                                //                 var errorMsg;
                                                                //                 if (parseAPI.data.ErrMsg !== undefined) {
                                                                //                     errorMsg = parseAPI.data.ErrMsg;
                                                                //                 } else if (parseAPI.data.ErrorMessage !== undefined) {
                                                                //                     errorMsg = parseAPI.data.ErrorMessage;
                                                                //                 }

                                                                //                 const responseJson = JSON.stringify(parseAPI.data);
                                                                //                 // insert to API log
                                                                //                 this.dataRoleTampInsertLog = [{
                                                                //                     'p_transaction_no': parseJournal.data[j].code,
                                                                //                     'p_url_request': parsedataGlobalParam.value,
                                                                //                     'p_json_content': jsonDataJournal,
                                                                //                     'p_response_code': resultCode,
                                                                //                     'p_response_message': errorMsg,
                                                                //                     'p_response_json': responseJson,
                                                                //                     'p_cre_by': this.userId,
                                                                //                     'p_cre_ip_address': this.ipAddress,
                                                                //                     'p_mod_by': this.userId,
                                                                //                     'p_mod_ip_address': this.ipAddress,
                                                                //                     'action': 'default'
                                                                //                 }];
                                                                //                 // console.log(this.dataRoleTampInsertLog);

                                                                //                 this.dalservice.ExecSp(this.dataRoleTampInsertLog, this.APIControllerApiLog, this.APIRouteForInsertLog)
                                                                //                     .subscribe(
                                                                //                         resInsertLog => {
                                                                //                             const parseInsertLog = JSON.parse(resInsertLog);
                                                                //                             if (parseInsertLog.result === 1) {
                                                                //                                 // this.returnJournal();
                                                                //                                 $('#datatable').DataTable().ajax.reload();
                                                                //                                 this.showSpinner = false;
                                                                //                                 this.swalPopUpMsg('V;' + errorMsg);
                                                                //                             }
                                                                //                         },
                                                                //                         error => {
                                                                //                             const parseInsertLog = JSON.parse(error);
                                                                //                             this.swalPopUpMsg(parseInsertLog.data);
                                                                //                             this.showSpinner = false;
                                                                //                         });
                                                                //                 // end insert to API log
                                                                //             }
                                                                //         },
                                                                //         error => {
                                                                //             // this.returnJournal();
                                                                //             const parseAPI = JSON.parse(error);
                                                                //             this.swalPopUpMsg(parseAPI.data);
                                                                //             this.showSpinner = false;
                                                                //         });
                        //                                     },
                        //                                     error => {
                        //                                         // this.returnJournal();
                        //                                         const parses = JSON.parse(error);
                        //                                         this.swalPopUpMsg(parses.data);
                        //                                         this.showSpinner = false;
                        //                                     });
                        //                         }

                        //                     } else {
                        //                         this.swalPopUpMsg('V; Jurnal Tidak Dapat Terbentuk. Silahkan Cek Kembali Setting Jurnal Anda ');
                        //                         this.returnJournal();
                        //                         this.showSpinner = false;
                        //                     }
                        //                 } else {
                        //                     this.showSpinner = false;

                        //                 }
                        //             },
                        //             error => {
                        //                 // this.returnJournal();
                        //                 const parse = JSON.parse(error);
                        //                 this.swalPopUpMsg(parse.data);
                        //                 this.showSpinner = false;
                        //             });
                        // },
                        // error => {
                        //     const parse = JSON.parse(error);
                        //     this.swalPopUpMsg(parse.data);
                        //     this.showSpinner = false;
                        // });

                //     } else {
                //         this.swalPopUpMsg(parseDataAssetDepretiation.data);
                //         this.showSpinner = false;
                //     }
                // },
                // error => {
                //     this.showSpinner = false;
                //     const parse = JSON.parse(error);
                //     this.swalPopUpMsg(parse.data);
                // });
    //         } else {
    //             this.showSpinner = false;
    //         }
    //     });
    // }
    //#endregion btnPost

    //#region btnGenerate
    btnGenerate() {

        this.dataTampAssetDepretiationData = [this.JSToNumberFloats({
            // 'p_to_date': this.model.to_date,
            'p_year': this.year,
            'p_month': this.month,
            'p_company_code': this.company_code,
            'action': 'default'
        })];


        // if (this.dataRoleTamp.p_to_date == null || this.dataRoleTamp.p_to_date === '') {
        //     this.dataRoleTamp.p_to_date = undefined;
        // }

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
                this.dalservice.ExecSp(this.dataTampAssetDepretiationData, this.APIController, this.APIRouteForGenerate)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                $('#datatable').DataTable().ajax.reload();
                                this.showSpinner = false;
                                // window.location.reload()
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
    //#endregion btnGenerate

    //#region returnJournal
    returnJournal() {
        this.dataTampAssetDepretiationData = [{
            'p_code': this.year + this.month,
            'action': 'default'
        }];
        this.dalservice.ExecSp(this.dataTampAssetDepretiationData, this.APIController, this.APIRouteForReturnJournal)
            .subscribe(
                resReturn => {
                    const parseReturn = JSON.parse(resReturn);
                    if (parseReturn.result === 1) {

                        $('#datatable').DataTable().ajax.reload();
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

    //#region Cost Center Lookup
    btnLookupCostCenter(id: any) {
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
                    this.lookupCostCenter = parse.data;
                    if (parse.data != null) {
                        this.lookupCostCenter.numberIndex = dtParameters.start;
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
        this.idDetailMutation = id;
    }

    btnSelectRowCostCenter(cost_center_code: String, cost_center_name: String) {
        this.listdataDetail = [];
        var i = 0;

        var getID = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {

            if (getID[i] == this.idDetailMutation) {

                this.listdataDetail.push({
                    p_id: getID[i],
                    p_cost_center_code: cost_center_code,
                    p_cost_center_name: cost_center_name
                });
            }
            i++;
        }

        //#region web service
        this.dalservice.Update(this.listdataDetail, this.APIController, this.APIRouteForUpdateCostCenter)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        $('#datatable').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service
        $('#lookupModalCostCenter').modal('hide');
    }
    //#endregion Cost Center Lookup

    // //#region ddl to date
    // ToDate(event: any) {
    //     this.model.to_date = event;
    //     $('#datatable').DataTable().ajax.reload();
    // }
    // //#endregion ddl to date
}


