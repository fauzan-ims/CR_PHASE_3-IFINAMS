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
    templateUrl: './disposalapproval.component.html'
})

export class DisposedApprovalComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public listdisposaldetail: any = [];
    public listdataDetail: any = [];
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public disposalData: any = [];
    public orderdetaillist: any = [];
    public isReadOnly: Boolean = false;
    public setStyle: any = [];
    public lookupbranch: any = [];
    public lookuplocation: any = [];
    public lookupreason: any = [];
    private dataTamp: any = [];
    public dataTampGetrow: any = [];
    private dataTampRole: any = [];
    private dataTampDisposalData: any = [];
    public dataRoleTampInsertLog: any = [];
    public jsonDataJournal: any = [];

    //controller
    private APIController: String = 'Disposal';
    private APIControllerAsset: String = 'DisposalDetail';
    private APIControllerType: String = 'SysGeneralSubcode';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerLocation: String = 'MasterLocation';
    private APIControllerMasterItem: String = 'MasterItem';
    private APIControllerGlobalParam: String = 'GlobalParam';
    private APIControllerJournalDetail: String = 'JournalDetail';
    private APIControllerApiLog: String = 'ApiLog';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForReturn: String = 'ExecSpForReturn';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForReject: String = 'ExecSpForReject';
    private APIRouteForGetRowItem: string = 'GetRowForItemGroupGl'
    private APIRouteForGetRowForThirdParty: String = 'GetRowForThirdParty';
    private APIRouteForCallThirdParty: String = 'CallThirdParty';
    private APIRouteForJournalDetail: String = 'GetRowsForThirdParty';
    private APIRouteForReturnJournal: String = 'ExecSpForReturnJournal';
    private APIRouteForInsertLog: String = 'ExecSpForInsertLog';
    private APIRouteForInsertGlAssetCode: string = 'UpdateGlAssetCode';

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
        //     this.loadData();
        // } else {
        //     this.showSpinner = false;
        //     this.model.company_code = this.company_code;
        //     this.model.status = 'NEW';
        // }
    }

    //#region load all data
    loadData() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            responsive: true,
            serverSide: true,
            processing: true,
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
                    'p_disposal_code': this.param,
                })
                // end param tambahan untuk getrows dynamic
                
                
                this.dalservice.Getrows(dtParameters, this.APIControllerAsset, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    
                    
                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    this.listdisposaldetail = parse.data;

                    if (parse.data != null) {
                        this.listdisposaldetail.numberIndex = dtParameters.start;
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
    onFormSubmit(DisposalForm: NgForm, isValid: boolean) {

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

        this.disposalData = this.JSToNumberFloats(DisposalForm);

        const usersJson: any[] = Array.of(this.disposalData);

        if (this.param != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                            this.callGetrow();
                            $('#datatableDisposalDetail').DataTable().ajax.reload();
                            // $('#datatableDisposalAsset').DataTable().ajax.reload();
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
                            this.route.navigate(['/sellanddisposal/subdisposedlist/disposaldetail', parse.code]);
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
        this.route.navigate(['/sellanddisposal/subdisposedlist']);
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region Disposal list tabs
    disposaldetailwiz() {
        this.route.navigate(['/sellanddisposal/subdisposedlist/disposaldetail/' + this.param + '/disposaldetaillist', this.param], { skipLocationChange: true });
    }
    //#endregion Disposal list tabs

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
        this.dataTampDisposalData = [{
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
            if (result.value) {
                this.dalservice.ExecSp(this.dataTampDisposalData, this.APIController, this.APIRouteForProceed)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                // $('#reloadtabdetail', parent.parent.document).click();
                                $('#docdetailwiz').click();
                                $('#tabdetailwiz').click();
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

    //#region btnReturn
    btnReturn() {
        // param tambahan untuk getrole dynamic
        this.dataTampDisposalData = [{
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
                this.dalservice.ExecSp(this.dataTampDisposalData, this.APIController, this.APIRouteForReturn)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                // $('#reloadtabdetail', parent.parent.document).click();
                                $('#docdetailwiz').click();
                                $('#tabdetailwiz').click();
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
        // param tambahan untuk button Done dynamic
        this.dataTampDisposalData = [{
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
                this.dalservice.ExecSp(this.dataTampDisposalData, this.APIController, this.APIRouteForCancel)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                // $('#reloadtabdetail', parent.parent.document).click();
                                $('#docdetailwiz').click();
                                $('#tabdetailwiz').click();
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

    //#region btnApprove
    btnApprove() {
        // param tambahan untuk button Done dynamic
        this.dataTampDisposalData = [{
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
                this.dalservice.ExecSp(this.dataTampDisposalData, this.APIController, this.APIRouteForPost)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#tabdetailwiz').click();
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
    //#endregion btnApprove
  
    //#region btnReject
    btnReject() {
        // param tambahan untuk getrole dynamic
        this.dataTampDisposalData = [{
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
                this.dalservice.ExecSp(this.dataTampDisposalData, this.APIController, this.APIRouteForReject)
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
        this.dataTampDisposalData = [{
            'p_code': this.param,
            'action': 'default'
        }];
        this.dalservice.ExecSp(this.dataTampDisposalData, this.APIController, this.APIRouteForReturnJournal)
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
        // this.model.company_code = company_code;
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
        this.model.location_name = description_location;
        $('#lookupModalLocation').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Location lookup

    //#region Reason Lookup
    btnLookupReason() {
        $('#datatableLookupReason').DataTable().clear().destroy();
        $('#datatableLookupReason').DataTable({
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
                    'p_general_code': 'DSPRSN'
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerType, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupreason = parse.data;
                    if (parse.data != null) {
                        this.lookupreason.numberIndex = dtParameters.start;
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

    btnSelectRowReason(code: string, general_subcode_desc: string) {
        this.model.reason_type = code;
        this.model.general_subcode_desc = general_subcode_desc;
        $('#lookupModalReason').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Reason lookup

    //#region button Print
    btnPrint(p_code: string) {
        const rptParam = {
            p_user_id: this.userId,
            p_type: 'DISPOSAL',
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

    
}

