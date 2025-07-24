
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './deliverydetail.component.html'
})

export class DeliverydetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public deliveryresultData: any = [];
    public registerCodeList: any = [];
    public listDeliveryDetail: any = [];
    public lookupBranchName: any = [];
    public lookupReasonData: any = [];
    public isReadOnly: Boolean = false;
    public isButton: Boolean = false;
    public isButton2: Boolean = false;
    public isFailed: Boolean = false;
    public NumberOnlyPattern: String = this._numberonlyformat;
    public result_type: String;

    // checklist
    public selectedAll: any;
    private checkedList: any = [];

    private dataRoleTamp: any = [];
    private dataTampPush: any = [];
    private dataTamp: any = [];
    private setStyle: any = [];
    private RoleAccessCode = 'R00024270000001A';

    // API Controller
    private APIControllerDelivery: String = 'RegisterDelivery';
    private APIControllerDetail: String = 'RegisterDelivery';
    private APIControllerType: String = 'SysGeneralSubcode';

    // API Function
    private APIRouteForGetRow: String = 'GETROW';
    private APIRouteForGetRowsDeliveryDetail: String = 'GetRowsDeliveryDetail';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForGetCancel: String = 'ExecSpForDeliveryCancel';
    private APIRouteForPost: String = 'ExecSpPost';
    private APIRouteForDone: String = 'ExecSpForDeliveryDone';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForDeleteDeliveryDetail: String = 'ExecSpDeleteDeliveryDetail';

    // report
    private APIControllerReport: String = 'Report';
    private APIRouteForDownload: String = 'getReport';


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

        if (this.param != null) {
            this.isReadOnly = true;

            // call web service
            this.callGetrow();
            this.loadData();
        }
    }

    //#region getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param
        }];
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIControllerDelivery, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    if (parsedata.status !== 'HOLD') {
                        this.isButton = true;
                    } else {
                        this.isButton = false;
                    }

                    if (parsedata.status !== 'DONE') {
                        this.isButton2 = false;
                    } else {
                        this.isButton2 = true;
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
                    'p_code': this.param,
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRowsDeliveryDetail).subscribe(resp => {
                    const parse = JSON.parse(resp)

                    // if use checkAll use this
                    $('#checkalltable').prop('checked', false);
                    // end checkall
                    this.listDeliveryDetail = parse.data;

                    if (parse.data != null) {
                        this.listDeliveryDetail.numberIndex = dtParameters.start;
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
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region  set datepicker
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
    //#endregion  set datepicker

    //#region  form submit
    onFormSubmit(deliveryresultForm: NgForm, isValid: boolean) {
        if (!isValid ||
        (this.model.result === 'Failed' && (!this.model.reject_date || !this.model.reason_reject))) {
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

        this.deliveryresultData = this.JSToNumberFloats(deliveryresultForm);
        const usersJson: any[] = Array.of(this.deliveryresultData);
        // call web service
        this.dalservice.Update(usersJson, this.APIControllerDelivery, this.APIRouteForUpdate)
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
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
    }
    //#endregion form submit

    //#region button back
    btnBack() {
        $('#datatable').DataTable().ajax.reload();
        this.route.navigate(['/birojasa/subdeliverylist']);
    }
    //#endregion button back

    //#region button Post
    btnPost(deliveryresultForm: NgForm, isValid: boolean) {
        // Validasi form
        if (!isValid) {
            swal({
                title: 'Warning',
                text: 'Please Fill a Mandatory Field OR Format Is Invalid',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning',
                type: 'warning'
            }).catch(swal.noop);
            return;
        }

        // Konfirmasi swal sebelum lanjut
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
                this.showSpinner = true;

                this.deliveryresultData = this.JSToNumberFloats(deliveryresultForm.value);
                const usersJson: any[] = Array.of(this.deliveryresultData);
                
                this.dalservice.ExecSp(usersJson, this.APIControllerDelivery, this.APIRouteForPost)
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
                        }
                    );
            }
        });
    }
    //#endregion button Post

    //#region button Cancel
    btnCancel() {
        // param tambahan untuk button Cancel dynamic
        this.registerCodeList = this.listDeliveryDetail.map(item => item.code);

        this.dataRoleTamp = [{
            'p_code': this.param, // kode delivery
            'p_code_list': this.registerCodeList.join(','),
            'action': ''
        }];

        // param tambahan untuk button Cancel dynamic

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
                // call web service
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIControllerDelivery, this.APIRouteForGetCancel)
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
        });
    }
    //#endregion button Cancel

    //#region button print tanda terima
    btnPrintTandaTerima() {
        this.showSpinner = true;
        const dataParam = {
        TableName: 'RPT_TANDA_TERIMA_DELIVERY',
        SpName: 'xsp_rpt_tanda_terima_delivery',
        reportparameters: {
            p_user_id: this.userId,
            p_code: this.param,
            p_register_no: this.model.code,
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
    //#endregion button print tanda terima

    //#region ddl clientType
    resultType(event: any) {
        this.isFailed = this.model.result === 'Failed';
    }
    //#endregion ddl clientType

    //#region Lookup Parking Location
    btnLookupModalReason() {
        $('#datatableLookupModalReason').DataTable().clear().destroy();
        $('#datatableLookupModalReason').DataTable({
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
                    'p_general_code': 'RSRTN'
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerType, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupReasonData = parse.data;
                    if (parse.data != null) {
                        this.lookupReasonData.numberIndex = dtParameters.start;
                    }

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
        });
    }

    btnSelectRowModalReason(code: string, general_subcode_desc: string) {
        this.model.reason_reject_code = code;
        this.model.reason_reject = general_subcode_desc;
        $('#lookupModalReason').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearModalReason() {
        this.model.reason_reject = undefined;
        this.model.reason_code = undefined;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Lookup Parking Location

    //#region button Post
    btnDone(deliveryresultForm: NgForm, isValid: boolean) {
        // Validasi form
        if (!isValid) {
            swal({
                title: 'Warning',
                text: 'Please Fill a Mandatory Field OR Format Is Invalid',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning',
                type: 'warning'
            }).catch(swal.noop);
            return;
        }

        // Konfirmasi swal sebelum lanjut
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
                this.showSpinner = true;

                this.deliveryresultData = this.JSToNumberFloats(deliveryresultForm.value);
                if (this.model.result === 'Accepted') {
                    this.deliveryresultData.p_reject_date = null;
                    this.deliveryresultData.p_reason_reject_code = null;
                    this.deliveryresultData.p_reason_reject = null;
                } else if (this.model.result === 'Failed') {
                    this.deliveryresultData.p_received_date = null;
                    this.deliveryresultData.p_received_by = null;
                    this.deliveryresultData.p_resi_no = null;
                }
                const usersJson: any[] = Array.of(this.deliveryresultData);

                this.dalservice.ExecSp(usersJson, this.APIControllerDelivery, this.APIRouteForDone)
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
                        }
                    );
            }
        });
    }
    //#endregion button Post

        //#region checkbox all table
        btnDeleteAll() {
            this.showSpinner = true;
            this.checkedList = [];
    
            for (let i = 0; i < this.listDeliveryDetail.length; i++) {
                if (this.listDeliveryDetail[i].selected) {
                    this.checkedList.push({
                        'id': this.listDeliveryDetail[i].id,
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
                            th.dalservice.ExecSp(th.dataTampPush, th.APIControllerDetail, th.APIRouteForDeleteDeliveryDetail)
                                .subscribe(
                                    res => {
                                        const parse = JSON.parse(res);
                                        if (parse.result === 1) {
                                            if (th.checkedList.length == i + 1) {
                                                th.showNotification('bottom', 'right', 'success');
                                                $('#datatableDeliveryDetail').DataTable().ajax.reload();
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
            for (let i = 0; i < this.listDeliveryDetail.length; i++) {
                this.listDeliveryDetail[i].selected = this.selectedAll;
            }
        }
    
        checkIfAllTableSelected() {
            this.selectedAll = this.listDeliveryDetail.every(function (item: any) {
                return item.selected === true;
            })
        }
        //#endregion checkbox all table

}






