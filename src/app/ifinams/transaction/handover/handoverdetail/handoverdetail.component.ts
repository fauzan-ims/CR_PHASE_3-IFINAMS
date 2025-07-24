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
    templateUrl: './handoverdetail.component.html'
})

export class HandoverdetailComponent extends BaseComponent implements OnInit {
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
    public lookupreason: any = [];
    private dataTamp: any = [];
    public dataTampGetrow: any = [];
    private dataTampHandover: any = [];
    private dataTampValidate: any = [];
    public dataRoleTampInsertLog: any = [];
    public jsonDataJournal: any = [];
    public maintenance_type: any;
    public type: any;
    public lookupprocessstatus: any = [];
    public dateData: any = [];
    public isButtonBAST: Boolean = false;
    public ishidden: Boolean = false;

    //controller
    private APIController: String = 'HandoverAsset';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerType: String = 'SysGeneralSubcode';
    private APIControllerPO: String = 'GoodReceiptNote';
    private APIControllerRealization: String = 'Realization';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForReject: String = 'ExecSpForReject';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForProcessStatus: String = 'GetRowsForLookupProcessStatus';
    private APIRouteForValidasi: String = 'ExecSpForValidateDate';

    // report
    private APIControllerReport: String = 'Report';
    private APIRouteForDownload: String = 'getReport';

    private RoleAccessCode = 'R00021880000000A';

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
        this.wizard();
        if (this.param != null) {
            this.isReadOnly = true;
            this.callGetrow();
            this.assetdocumentwiz();
        } else {
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.status = 'NEW';
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

                    this.type = parsedata.type;

                    if (parsedata.type == 'DELIVERY') {
                        this.isButtonBAST = false;
                    } else if (parsedata.type == 'PICK UP') {
                        this.isButtonBAST = false;
                    } else {
                        this.isButtonBAST = true;
                    }

                    if (parsedata.type == 'REPLACE IN' || parsedata.type == 'REPLACE OUT' || parsedata.type == 'REPLACE GTS IN' || parsedata.type == 'REPLACE GTS OUT') {
                        this.ishidden = true;
                    } else {
                        this.ishidden = false;
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
        this.dataTampValidate = [{
            'p_agreement_no': this.model.agreement_no,
            'p_handover_date': this.disposalData.p_handover_date
        }];

        const usersJson: any[] = Array.of(this.disposalData);

        if (this.param != null) {
            // call web service
            this.dalservice.ExecSpOpl(this.dataTampValidate, this.APIControllerRealization, this.APIRouteForValidasi)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
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
                            this.swalPopUpMsg(parse.data);
                            this.showSpinner = false;
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.message);
                    });
        } else {
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                            this.route.navigate(['/transaction/subdisposal/disposaldetail', parse.code]);
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
        this.route.navigate(['/transaction/subhandoverlist']);
        $('#datatablehandoverlist').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region Handover list tabs
    assetcheklistwiz() {
        this.route.navigate(['/transaction/subhandoverlist/handoverdetail/' + this.param + '/handoverchecklist', this.param], { skipLocationChange: true });
    }
    assetdocumentwiz() {
        this.route.navigate(['/transaction/subhandoverlist/handoverdetail/' + this.param + '/handoverdocument', this.param], { skipLocationChange: true });
    }
    //#endregion Handover list tabs

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
        this.dataTampHandover = [{
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
                this.dalservice.ExecSp(this.dataTampHandover, this.APIController, this.APIRouteForProceed)
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

    //#region btnReject
    btnReject() {
        // param tambahan untuk getrole dynamic
        this.dataTampHandover = [{
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
                this.dalservice.ExecSp(this.dataTampHandover, this.APIController, this.APIRouteForReject)
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

    //#region ddl Type
    Type(event: any) {
        this.model.type = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl Type

    //#region btnPost
    btnPost() {
        this.dataTampValidate = [{
            'p_reff_code': this.model.reff_code,
            'p_code': this.model.code,
            'action': 'getResponse'
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
                this.dalservice.ExecSpProc(this.dataTampValidate, this.APIControllerPO, this.APIRouteForValidasi)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                if (parse.data[0].status != null) {
                                    this.swalPopUpMsg(parse.data[0].status);
                                }
                                else {
                                    this.dataTampHandover = [{
                                        'p_code': this.param,
                                        'p_fa_code': this.model.fa_code,
                                        'action': 'default'
                                    }];
                                    this.dalservice.ExecSp(this.dataTampHandover, this.APIController, this.APIRouteForPost)
                                        .subscribe(
                                            res => {
                                                const parse = JSON.parse(res);
                                                if (parse.result === 1) {
                                                    this.showNotification('bottom', 'right', 'success');
                                                    this.callGetrow();
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
                                }

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
    //#endregion btnPost

    //#region btnCancel
    btnCancel() {
        this.dataTampHandover = [{
            'p_code': this.param,
            'p_fa_code': this.model.fa_code,
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
                this.dalservice.ExecSp(this.dataTampHandover, this.APIController, this.APIRouteForCancel)
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

    // handoverType(event: any){
    //     console.log(event.target.value);
    //     console.log(this.model.type);

    // }

    //#region button print
    btnPrint() {
        this.showSpinner = true;
        let in_or_out = null;
        if (this.model.type === 'DELIVERY' || this.model.type === 'REPLACE OUT' || this.model.type === 'RETURN OUT') {
            in_or_out = 'TERIMA'
        } else {
            in_or_out = 'KEMBALI'
        }

        const dataParam = {
            TableName: 'rpt_berita_acara_serah_terima',
            SpName: 'xsp_rpt_berita_acara_serah_terima',
            reportparameters: {
                p_user_id: this.userId,
                p_code: this.param,
                p_bast_type: this.model.type,
                p_in_or_out: in_or_out,
                p_print_option: 'PDF'
            }
        };

        this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
            this.printRptNonCore(res);
            this.showSpinner = false;
        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    //#endregion button print

    //#region button print
    btnPrintGatePass() {
        this.showSpinner = true;

        const dataParam = {
            TableName: 'rpt_gate_pass',
            SpName: 'xsp_rpt_gate_pass',
            reportparameters: {
                p_user_id: this.userId,
                p_code: this.param,
                p_print_option: 'PDF'
            }
        };


        this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
            this.printRptNonCore(res);
            this.showSpinner = false;
        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    //#endregion button print

    //#region button print
    btnPrintSuratJalan() {
        this.showSpinner = true;

        const dataParam = {
            TableName: 'rpt_surat_jalan',
            SpName: 'xsp_rpt_surat_jalan',
            reportparameters: {
                p_user_id: this.userId,
                p_code: this.param,
                p_print_option: 'PDF'
            }
        };

        this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
            this.printRptNonCore(res);
            this.showSpinner = false;
        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    //#endregion button print

    //#region button print
    btnPrintDeliveryCollect() {
        this.showSpinner = true;

        const dataParam = {
            TableName: 'rpt_delivery_and_collect_order',
            SpName: 'xsp_rpt_delivery_and_collect_order',
            reportparameters: {
                p_user_id: this.userId,
                p_code: this.param,
                p_print_option: 'PDF'
            }
        };


        this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
            this.printRptNonCore(res);
            this.showSpinner = false;
        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    //#endregion button print

    //#region Lookup Process Status
    btnLookupProcessStatus() {
        $('#datatableLookupProcessStatus').DataTable().clear().destroy();
        $('#datatableLookupProcessStatus').DataTable({
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
                    'p_general_code': 'PRSTS'
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerType, this.APIRouteForProcessStatus).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupprocessstatus = parse.data;
                    if (parse.data != null) {
                        this.lookupprocessstatus.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 3] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowProcessStatus(general_subcode_desc: string) {
        this.model.process_status = general_subcode_desc;
        $('#lookupModalProcessStatus').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearProcessStatus() {
        this.model.process_status = undefined;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Lookup Process Status

}

