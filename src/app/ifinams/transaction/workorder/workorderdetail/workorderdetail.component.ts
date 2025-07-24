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
    templateUrl: './workorderdetail.component.html'
})

export class WorkOrderDetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public WorkOrderData: any = [];
    public orderdetaillist: any = [];
    public isReadOnly: Boolean = false;
    public setStyle: any = [];
    public lookupbranchrequest: any = [];
    public lookupmaintenance: any = [];
    public lookupasset: any = [];
    public lookupAssetDetail: any = [];
    public listmutationdocument: any = [];
    public uploadFile: any = [];
    public datauploadlist: any = [];
    public listdataDetail: any = [];
    public tempFile: any;
    private dataTamp: any = [];
    private dataRoleTamp: any = [];
    private dataTampPush: any = [];
    private idDetailForReason: any;
    private tampDocumentCode: String;
    private tamps = new Array();
    private base64textString: string;
    private tempFileSize: any;
    public lookupTax: any = [];
    public tampHidden: Boolean = false;
    public tampHiddenforView: Boolean = false;
    public isButton: Boolean = false;
    public approveinsurance: Boolean = false;
    public isapproveinsurance: Boolean = false;
    public ProceedData: any = [];
    public lookupapproval: any = [];

    //controller
    private APIController: String = 'WorkOrder';
    private APIControllerDetail: String = 'WorkOrderDetail';
    private APIControllerAsset: String = 'Asset';
    private APIControllerMaintenance: String = 'Maintenance';
    private APIControllerSysGlobalparam: String = 'SysGlobalparam';
    private APIControllerTaxCode: String = 'MasterTaxScheme';
    private APIControllerApprovalSchedule: String = 'ApprovalSchedule';

    // report
    private APIControllerReport: String = 'Report';
    private APIRouteForDownload: String = 'getReport';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForDeleteFile: String = 'Deletefile';
    private APIControllerMasterService: String = 'MasterService';
    private APIRouteForUploadFile: String = 'Upload';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForPriviewFile: String = 'Priview';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForUpdateMaintenance: String = 'UpdateForWorkOrder';
    private APIRouteForUpdateTaxMaintenance: String = 'UpdateTaxForWorkOrder';
    private APIRouteForUpdateMaintenanceTypeService: String = 'UpdateForLookupTypeService';
    private APIRouteForDelete: String = 'DELETE';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForOnRepair: String = 'ExecSpForRepair';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForReturn: String = 'ExecSpForReturn';
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForDone: String = 'ExecSpForDone';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForValidate: string = 'ExecSpForValidate';
    private APIRouteForReturnMaintenance: string = 'ExecSpForReturnForMaintenance';

    //Role code
    private RoleAccessCode = 'R00021840000000A';

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
        if (this.param != null) {
            this.isReadOnly = true;
            this.callGetrow();
            this.loadData();
            this.callGetrowDoc();

        } else {
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.maintenance_by = 'INT';
            this.model.status = 'HOLD';
            this.model.transaction_amount = 0;
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
                    //const parsedata = parse.data[0];

                    // checkbox
                    if (parsedata.is_reimburse === '1') {
                        parsedata.is_reimburse = true;
                    } else {
                        parsedata.is_reimburse = false;
                    }
                    // end checkbox

                    if (parsedata.file_name === '' || parsedata.file_name == null) {
                        this.tampHidden = false;
                    } else {
                        this.tampHidden = true;

                    }

                    if (parsedata.status !== 'HOLD') {
                        this.tampHiddenforView = true;
                    } else {
                        this.tampHiddenforView = false;
                    }

                    if (parsedata.status !== 'HOLD') {
                        this.isButton = true;
                    } else {
                        this.isButton = false;
                    }

                    if (parsedata.is_claim_approve === '1') {
                        this.isapproveinsurance = false;
                        parsedata.is_claim_approve = true;
                    } else {
                        this.isapproveinsurance = true;
                        parsedata.is_claim_approve = false;
                    }

                    this.showSpinner = false;

                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    $('#datatableDocument').DataTable().ajax.reload();
                    // end mapper dbtoui

                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion getrow data

    //#region getrow data
    callGetrowDoc() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': 'FUPS'
        }];
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIControllerSysGlobalparam, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = parse.data[0];

                    this.tempFileSize = parsedata.value

                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion getrow data

    //#region form submit
    onFormSubmit(WorkOrderForm: NgForm, isValid: boolean) {
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

        this.WorkOrderData = this.JSToNumberFloats(WorkOrderForm);

        const usersJson: any[] = Array.of(this.WorkOrderData);

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
                            this.route.navigate(['/transaction/subworkorderlist/workorderdetail', parse.id]);
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
        this.route.navigate(['/transaction/subworkorderlist']);
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
    btnProceed(WorkOrderForm: NgForm, isValid: boolean) {
        this.ProceedData = this.JSToNumberFloats(WorkOrderForm);

        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
            'p_is_claim_approve': this.approveinsurance, //this.ProceedData.is_claim_approve,
            'p_claim_approve_claim_date': this.ProceedData.p_claim_approve_claim_date,
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

    //#region btnOnRepair
    btnOnRepair() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_id': this.param,
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForOnRepair)
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
    //#endregion btnOnRepair

    //#region btnCancel
    btnCancel() {
        // param tambahan untuk button Done dynamic
        this.dataRoleTamp = [{
            'p_id': this.param,
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
                                this.callGetrow();
                                this.showNotification('bottom', 'right', 'success');
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
                                this.ngOnInit();
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

    //#region btnReturn
    btnReturnForMaintenance() {
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForReturnMaintenance)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.ngOnInit();
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

    //#region btnPost
    btnPost() {
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPost)
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
    //#endregion btnPost

    //#region btnDone
    btnDone() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_id': this.param,
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForDone)
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
    //#endregion btnDone

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
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerAsset, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupasset = parse.data;

                    if (parse.data != null) {
                        this.lookupasset.numberIndex = dtParameters.start;
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

    btnSelectRowAsset(code: string, item_name: string) {
        this.model.asset_code = code;
        this.model.item_name = item_name;
        $('#lookupModalAsset').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearAsset() {
        this.model.code = '';
        this.model.item_name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Asset lookup

    //#region checkbox all table
    btnDeleteAll() {
        this.showSpinner = true;
        this.checkedList = [];
        // for (let i = 0; i < this.listmutationdocument.length; i++) {
        //     if (this.listmutationdocument[i].selected) {
        //         this.checkedList.push(this.listmutationdocument[i].id);
        //     }
        // }

        for (let i = 0; i < this.listmutationdocument.length; i++) {
            if (this.listmutationdocument[i].selected) {
                this.checkedList.push({
                    'id': this.listmutationdocument[i].id,
                })
            }
        }

        // jika tidak di checklist
        if (this.checkedList.length === 0) {
            swal({
                title: this._listdialogconf,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger'
            }).catch(swal.noop)
            return
        }

        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            // if (result.value) {
            //     this.dataTampPush = [];
            //     for (let J = 0; J < this.checkedList.length; J++) {
            //         const id = this.checkedList[J];
            //         // param tambahan untuk getrow dynamic
            //         this.dataTampPush = [{
            //             'p_id': id
            //         }];
            //         // end param tambahan untuk getrow dynamic
            //         this.dalservice.Delete(this.dataTampPush, this.APIControllerDetail, this.APIRouteForDelete)
            //             .subscribe(
            //                 res => {
            //                     this.showSpinner = false;
            //                     const parse = JSON.parse(res);
            //                     if (parse.result === 1) {
            //                         if (this.checkedList.length == J + 1) {
            //                             this.showNotification('bottom', 'right', 'success');
            //                             $('#datatableDocument').DataTable().ajax.reload();
            //                             this.callGetrow();
            //                         }
            //                     } else {
            //                         this.swalPopUpMsg(parse.data);
            //                     }
            //                 },
            //                 error => {
            //                     const parse = JSON.parse(error);
            //                     this.swalPopUpMsg(parse.data);
            //                 });
            //     }
            // } else {
            //     this.showSpinner = false;
            // }
            if (result.value) {

                let th = this;
                var i = 0;
                (function loopProcurementProceed() {
                    if (i < th.checkedList.length) {
                        th.dataTampPush = [{
                            'p_id': th.checkedList[i].id,
                            'action': ''
                        }];
                        //Proceed data dan insert into quotation / supplier selection
                        th.dalservice.ExecSp(th.dataTampPush, th.APIControllerDetail, th.APIRouteForDelete)
                            .subscribe(
                                res => {
                                    const parse = JSON.parse(res);
                                    if (parse.result === 1) {
                                        if (th.checkedList.length == i + 1) {
                                            th.showNotification('bottom', 'right', 'success');
                                            $('#datatableDocument').DataTable().ajax.reload();
                                            th.showSpinner = false;
                                        } else {
                                            i++;
                                            loopProcurementProceed();
                                        }
                                    } else {
                                        th.swalPopUpMsg(parse.data);
                                        th.showSpinner = false;
                                    }
                                },
                                error => {
                                    const parse = JSON.parse(error);
                                    th.swalPopUpMsg(parse.data);
                                    th.showSpinner = false;
                                });
                    }
                })();
            } else {
                this.showSpinner = false;
            }
        });
    }

    selectAll() {
        for (let i = 0; i < this.listmutationdocument.length; i++) {
            this.listmutationdocument[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listmutationdocument.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion checkbox all table

    //#region Asset Detail Lookup
    btnLookupAssetDetail(id: any, type_code: any) {
        $('#datatableLookupAssetDetail').DataTable().clear().destroy();
        $('#datatableLookupAssetDetail').DataTable({
            'pagingType': 'first_last_numbers',
            'pageLength': 5,
            'processing': true,
            'serverSide': true,
            responsive: true,
            lengthChange: false, // hide lengthmenu
            searching: true, // jika ingin hilangin search box nya maka false
            ajax: (dtParameters: any, callback) => {
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_company_code': this.company_code,
                    'p_type_asset_code': type_code,
                });
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerMasterService, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupAssetDetail = parse.data;
                    if (parse.data != null) {
                        this.lookupAssetDetail.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    })
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

        this.idDetailForReason = id;

    }

    btnSelectRowAssetDetail(code: String, description: String, service_type: String) {

        this.listdataDetail = [];

        var i = 0;

        var getID = $('[name="p_id_doc"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {

            if (getID[i] == this.idDetailForReason) {

                this.listdataDetail.push({
                    p_id: getID[i],
                    p_service_code: code,
                    p_service_name: description,
                    p_service_type: service_type,
                });
            }
            i++;
        }

        //#region web service
        this.dalservice.Update(this.listdataDetail, this.APIControllerDetail, this.APIRouteForUpdateMaintenanceTypeService)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        $('#datatableDocument').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service
        $('#lookupModalAssetDetail').modal('hide');
    }
    //#endregion Asset Detail Lookup

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
                    'p_work_order_code': this.param
                })

                // end param tambahan untuk getrows dynamic

                this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    for (let i = 0; i < parse.data.length; i++) {
                        this.listmutationdocument = parse.data;
                    }

                    this.listmutationdocument = parse.data;

                    if (parse.data != null) {
                        this.listmutationdocument.numberIndex = dtParameters.start;
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

    //#region button priview image
    previewFile(row1, row2) {
        this.showSpinner = true;
        const usersJson: any[] = Array.of();

        usersJson.push({
            p_file_name: row1,
            p_file_paths: row2
        });
        this.dalservice.PriviewFile(usersJson, this.APIController, this.APIRouteForPriviewFile)
            .subscribe(
                (res) => {
                    const parse = JSON.parse(res);
                    if (parse.value.filename !== '') {
                        const fileType = parse.value.filename.split('.').pop();
                        if (fileType === 'PNG') {
                            this.downloadFile(parse.value.data, parse.value.filename, fileType);
                            // const newTab = window.open();
                            // newTab.document.body.innerHTML = this.pngFile(parse.value.data);
                            // this.showSpinner = false;
                        }
                        if (fileType === 'JPEG' || fileType === 'JPG') {
                            this.downloadFile(parse.value.data, parse.value.filename, fileType);
                            // const newTab = window.open();
                            // newTab.document.body.innerHTML = this.jpgFile(parse.value.data);
                            // this.showSpinner = false;
                        }
                        if (fileType === 'PDF') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'pdf');
                            // const newTab = window.open();
                            // newTab.document.body.innerHTML = this.pdfFile(parse.value.data);
                            // this.showSpinner = false;
                        }
                        if (fileType === 'DOCX' || fileType === 'DOC') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'msword');
                        }
                        if (fileType === 'XLSX') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'vnd.ms-excel');
                        }
                        if (fileType === 'PPTX') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'vnd.ms-powerpoint');
                        }
                        if (fileType === 'TXT') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'txt');
                        }
                        if (fileType === 'ODT' || fileType === 'ODS' || fileType === 'ODP') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'vnd.oasis.opendocument');
                        }
                        if (fileType === 'ZIP') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'zip');
                        }
                        if (fileType === '7Z') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'x-7z-compressed');
                        }
                        if (fileType === 'RAR') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'vnd.rar');
                        }
                    }
                }
            );
    }

    downloadFile(base64: string, fileName: string, extention: string) {
        var temp = 'data:application/' + extention + ';base64,'
            + encodeURIComponent(base64);
        var download = document.createElement('a');
        download.href = temp;
        download.download = fileName;
        document.body.appendChild(download);
        download.click();
        document.body.removeChild(download);
        this.showSpinner = false;
    }

    //#region button previewFileList
    previewFileList(row1, row2) {
        const usersJson: any[] = Array.of();

        usersJson.push({
            p_file_name: row1,
            p_file_paths: row2
        });

        this.dalservice.PriviewFile(usersJson, this.APIControllerDetail, this.APIRouteForPriviewFile)
            .subscribe(
                (res) => {
                    const parse = JSON.parse(res);

                    if (parse.value.filename !== '') {
                        const fileType = parse.value.filename.split('.').pop();
                        if (fileType === 'PNG') {
                            // const newTab = window.open();
                            // newTab.document.body.innerHTML = this.pngFileList(parse.value.data);
                            this.pngFileList(parse.value.data);
                        }
                        if (fileType === 'JPEG' || fileType === 'JPG') {
                            // const newTab = window.open();
                            // newTab.document.body.innerHTML = this.jpgFileList(parse.value.data);
                            this.jpgFileList(parse.value.data);
                        }
                    }
                }
            );
    }
    //#endregion button previewFileList

    //#region Maintenance Lookup
    btnLookupMaintenance() {
        $('#datatableLookupMaintenance').DataTable().clear().destroy();
        $('#datatableLookupMaintenance').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerMaintenance, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupmaintenance = parse.data;

                    if (parse.data != null) {
                        this.lookupmaintenance.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowMaintenance(code: string, unit_code: string, unit_name: string) {
        this.model.maintenance_code = code;
        this.model.unit_code = unit_code;
        this.model.unit_name = unit_name;
        $('#lookupModalMaintenance').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Maintenance lookup

    //#region button add
    btnAdd() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [this.JSToNumberFloats({
            'p_work_order_code': this.param,
            'p_asset_code': '',
            'p_file_name': '',
            'p_path': '',
        })];

        // param tambahan untuk getrole dynamic
        this.dalservice.Insert(this.dataRoleTamp, this.APIControllerDetail, this.APIRouteForInsert)
            .subscribe(
                res => {
                    this.showSpinner = false;
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {
                        $('#datatableDocument').DataTable().ajax.reload();
                        this.showNotification('bottom', 'right', 'success');
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
    }
    //#endregion button add

    //#region button select image
    onUpload(event, code: String) {
        const files = event.target.files;
        const file = files[0];

        if (this.CheckFileSize(files[0].size, this.model.value)) {
            this.swalPopUpMsg('V;File size must be less or equal to ' + this.model.value + ' MB');
            this.callGetrow();
        } else {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();

                reader.readAsDataURL(event.target.files[0]); // read file as data url

                reader.onload = (event) => {
                    reader.onload = this.handleFile.bind(this);
                    reader.readAsBinaryString(file);
                }
            }
            this.tempFile = files[0].name;
            this.tampDocumentCode = code;

        }
    }
    //#endregion button select image

    //#region convert to base64
    handleFile(event) {
        this.showSpinner = true;
        const binaryString = event.target.result;
        this.base64textString = btoa(binaryString);

        this.tamps.push({
            p_header: 'WORK_ORDER_DETAIL',
            p_module: 'IFINAMS',
            p_child: this.param,
            p_code: this.tampDocumentCode,
            p_file_paths: this.param,
            p_file_name: this.tempFile,
            p_base64: this.base64textString
        });

        this.dalservice.UploadFile(this.tamps, this.APIController, this.APIRouteForUploadFile)
            .subscribe(
                res => {
                    this.tamps = new Array();

                    const parses = JSON.parse(res);
                    if (parses.result === 1) {
                        this.showSpinner = false;
                        $('#fileControl').val('');
                        this.tempFile = undefined
                        this.callGetrow
                    } else {
                        this.showSpinner = false;
                        this.swalPopUpMsg(parses.message);
                        $('#fileControl').val('');
                        this.tempFile = undefined
                    }
                    this.callGetrow();
                },
                error => {
                    this.showSpinner = false;
                    this.tamps = new Array();
                    const parses = JSON.parse(error);
                    this.swalPopUpMsg(parses.message);
                    this.callGetrow();
                });
    }
    //#endregion convert to base64

    //#region button save in list
    btnSaveList() {

        this.uploadFile = [];
        this.showSpinner = true;
        this.datauploadlist = [];
        let j = 0;

        const getID = $('[name="p_id_doc"]')
            .map(function () { return $(this).val(); }).get();

        const getAsset = $('[name="p_asset_code_detail"]')
            .map(function () { return $(this).val(); }).get();

        const getServiceFee = $('[name="p_service_fee"]')
            .map(function () { return $(this).val(); }).get();

        const getPPN = $('[name="p_ppn_amount"]')
            .map(function () { return $(this).val(); }).get();

        const getPPH = $('[name="p_pph_amount"]')
            .map(function () { return $(this).val(); }).get();

        const getQty = $('[name="p_quantity"]')
            .map(function () { return $(this).val(); }).get();

        const getPartNumber = $('[name="p_part_number"]')
            .map(function () { return $(this).val(); }).get();


        while (j < getID.length) {

            while (j < getAsset.length) {

                while (j < getServiceFee.length) {

                    while (j < getQty.length) {

                        while (j < getPartNumber.length) {

                            while (j < getPPH.length) {

                                if (getAsset[j] == null) {
                                    swal({
                                        title: 'Warning',
                                        text: 'Please fill in assets first.',
                                        buttonsStyling: false,
                                        confirmButtonClass: 'btn btn-danger',
                                        type: 'warning'
                                    }).catch(swal.noop)
                                    return;
                                }
                                this.datauploadlist.push(
                                    {
                                        p_id: getID[j],
                                        p_asset_code: getAsset[j],
                                        p_service_fee: getServiceFee[j],
                                        p_quantity: getQty[j],
                                        p_part_number: getPartNumber[j],
                                        p_pph_amount: getPPH[j],
                                        p_ppn_amount: getPPN[j] // (+) Ari 2023-12-28 ket : add ppn amount
                                    });
                                j++
                            }
                            j++;
                        }
                        j++;
                    }
                    j++;
                }
                j++;
            }
            j++;
        }

        //#region web service
        this.dalservice.Update(this.datauploadlist, this.APIControllerDetail, this.APIRouteForUpdateMaintenance)
            .subscribe(
                res => {
                    this.showSpinner = false;

                    const parse = JSON.parse(res);
                    this.callGetrow();
                    if (parse.result === 1) {
                        if (this.tamps.length > 0) {
                            for (let i = 0; i < this.tamps.length; i++) {
                                this.uploadFile.push({
                                    p_module: 'IFINAMS',
                                    p_header: 'PHOTO',
                                    p_child: this.param,
                                    p_company_code: this.company_code,
                                    p_id: this.tampDocumentCode,
                                    p_file_paths: this.param,
                                    p_file_name: this.tempFile,
                                    p_base64: this.base64textString
                                });
                            }

                            this.dalservice.UploadFile(this.uploadFile, this.APIControllerDetail, this.APIRouteForUploadFile)
                                .subscribe(
                                    res => {
                                        const parse = JSON.parse(res);
                                        if (parse.result === 1) {
                                            this.showSpinner = false;
                                            this.showNotification('bottom', 'right', 'success');
                                            $('#datatableDocument').DataTable().ajax.reload();
                                            this.tamps = [];
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
                            this.showNotification('bottom', 'right', 'success');
                            $('#datatableDocument').DataTable().ajax.reload();
                        }
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service

    }
    //#region onBlur
    onBlur(event, i, type) {
        if (type === 'service_fee') {
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
        } else if (type === 'pph_amount') {
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
        } else if (type === 'ppn_amount') {
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

        if (type === 'service_fee') {
            $('#service_fee' + i)
                .map(function () { return $(this).val(event); }).get();
        } else if (type === 'pph_amount') {
            $('#pph_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        } else if (type === 'ppn_amount') {
            $('#ppn_amount' + i)
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

        if (type === 'service_fee') {
            $('#service_fee' + i)
                .map(function () { return $(this).val(event); }).get();
        } else if (type === 'pph_amount') {
            $('#pph_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        } else if (type === 'ppn_amount') {
            $('#ppn_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onFocus
    //#endregion button save in list

    //#region button delete image
    deleteImage(file_name: any, row2) {
        const usersJson: any[] = Array.of();

        usersJson.push({
            p_code: this.model.code,
            p_file_name: file_name,
            p_file_paths: row2
        });
        swal({
            allowOutsideClick: false,
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: 'Yes',
            buttonsStyling: false
        }).then((result) => {
            this.showSpinner = true;
            if (result.value) {
                this.dalservice.DeleteFile(usersJson, this.APIController, this.APIRouteForDeleteFile)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showSpinner = false;
                                this.callGetrow();
                                this.tempFile = undefined;
                                this.showNotification('bottom', 'right', 'success');
                            } else {
                                this.showSpinner = false;
                                this.swalPopUpMsg(parse.message);
                            }
                            this.callGetrow();
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.message);
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button delete image

    //#region button print
    btnPrint() {
        this.showSpinner = true;

        this.dataRoleTamp = [{
            'p_code': this.param,
            'action': 'default'
        }];

        const dataParam = {
            TableName: 'rpt_permohonan_pembayaran_service',
            SpName: 'xsp_rpt_permohonan_pembayaran_service',
            reportparameters: {
                p_user_id: this.userId,
                p_code: this.param,
                p_print_option: 'PDF'
            }
        };
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForValidate).subscribe(res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
                this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
                    this.printRptNonCore(res);
                    this.showSpinner = false;
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                    } else {
                        // this.showSpinner = false;
                        this.swalPopUpMsg(parse.data);
                    }

                })
            } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.data);
            }

        }, err => {
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
        // this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
        //     this.printRptNonCore(res);
        //     this.showSpinner = false;
        //     const parse = JSON.parse(res);
        //     if (parse.result === 1) {
        //         this.showNotification('bottom', 'right', 'success');
        //     } else {
        //         this.swalPopUpMsg(parse.data);
        //     }

        // }, err => {
        //     this.showSpinner = false;
        //     const parse = JSON.parse(err);
        //     this.swalPopUpMsg(parse.data);
        // });
    }
    //#endregion button print

    //#region tax Lookup
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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerTaxCode, this.APIRouteForLookup).subscribe(resp => {
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
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 5] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });

        this.idDetailForReason = id;
    }

    btnSelectRowTax(code: string, description: string, ppn_pct: string, pph_pct: string) {

        this.model.tax_code = code;
        this.model.tax_name = description;
        this.model.ppn_pct = ppn_pct;
        this.model.pph_pct = pph_pct;

        const listdataTax = [];

        listdataTax.push({
            p_id: this.idDetailForReason,
            p_tax_code: code,
            p_tax_name: description,
            p_ppn_pct: ppn_pct,
            p_pph_pct: pph_pct,
        });

        //#region web service
        this.dalservice.Update(listdataTax, this.APIControllerDetail, this.APIRouteForUpdateTaxMaintenance)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.callGetrow();
                        $('#datatableDocument').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service
        $('#lookupModalTax').modal('hide');
    }
    //#endregion tax lookup

    //#region ddl master module
    ApproveInsurance(event: any) {
        this.approveinsurance = event.target.checked;
        if (this.approveinsurance == true) {
            this.isapproveinsurance = false;
        } else {
            this.isapproveinsurance = true;
        }
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl master module

    //#region approval Lookup
    btnViewApproval() {
        $('#datatableLookupApproval').DataTable().clear().destroy();
        $('#datatableLookupApproval').DataTable({
            'pagingType': 'first_last_numbers',
            'pageLength': 5,
            'processing': true,
            'serverSide': true,
            responsive: true,
            lengthChange: false, // hide lengthmenu
            searching: true, // jika ingin hilangin search box nya maka false

            ajax: (dtParameters: any, callback) => {

                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_reff_no': this.param
                });
                this.dalservice.GetrowsApv(dtParameters, this.APIControllerApprovalSchedule, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupapproval = parse.data;

                    if (parse.data != null) {
                        this.lookupapproval.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
            order: [[5, 'ASC']],
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }
    //#endregion approval Lookup
}

