
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../base.component';
import { DALService } from '../../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './paymentapproval.component.html'
})

export class PaymentapprovalComponent extends BaseComponent implements OnInit {
    // get param from url
    PaymentCode = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public paymentdetaillist: any = [];
    public dataTampPush: any = [];
    public paymentData: any = [];
    public lookupbranch: any = [];
    public NumberOnlyPattern = this._numberonlyformat;
    public lookupcollateral: any = [];
    public lookupapproval: any = [];
    public isReadOnly: Boolean = false;
    public isStatus: Boolean = false;
    public tampStatus: String;
    public tempFile: any;
    private tampDocumentCode: String;
    private base64textString: string;
    private tamps = new Array();

    private dataRoleTamp: any = [];
    private dataTamp: any = [];
    private setStyle: any = [];
    private RoleAccessCode = 'R00023960000001A';

    // API Controller
    private APIController: String = 'PaymentTransaction';
    private APIControllerPaymentDetail: String = 'PaymentTransactionDetail';
    private APIControllerSysBranch: String = 'SysBranch';
    private APIControllerApprovalSchedule: String = 'ApprovalSchedule';

    // API Function
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForDelete: String = 'Delete';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForCancelReceived: String = 'ExecSpForCancelReceived';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForUploadFile: String = 'Upload';
    private APIRouteForDeleteFile: String = 'Deletefile';
    private APIRouteForPriviewFile: String = 'Priview';

    // checklist
    public selectedAll: any;
    public selectedAllTable: any;
    public checkedList: any = [];


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
        this.Delimiter(this._elementRef);
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        if (this.PaymentCode != null) {
            this.isReadOnly = true;
            this.loadData();
            // call web service
            this.callGetrow();
        } else {
            this.model.payment_status = 'HOLD';
            this.model.payment_amount = 0;
            this.showSpinner = false;
        }
    }

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
                    'p_code': this.PaymentCode,
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerPaymentDetail, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)

                    // if use checkAll use this
                    $('#checkalltable').prop('checked', false);
                    // end checkall
                    this.paymentdetaillist = parse.data;

                    if (parse.data != null) {
                        this.paymentdetaillist.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });

                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 7] }], // for disabled coloumn
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
            'p_code': this.PaymentCode,
        }];
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    if (parsedata.payment_status !== 'HOLD') {
                        this.isStatus = true;
                    } else {
                        this.isStatus = false;
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

    //#region button select image
    onUpload(event, code: String) {
        const files = event.target.files;
        const file = files[0];

        if (this.CheckFileSize(files[0].size, this.model.value)) {
            this.swalPopUpMsg('V;File size must be less or equal to ' + this.model.value + ' MB');
            // $('#datatableReceiveDetail').DataTable().ajax.reload();
        } else {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();

                reader.readAsDataURL(event.target.files[0]); // read file as data url

                // tslint:disable-next-line:no-shadowed-variable
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

    //#region button edit
    btnEdit(codeEdit: string,source: string) {
        if (source=='WORK ORDER'){
            this.route.navigate(['objectinfopaymentapproval/subworkorder', codeEdit, this.PaymentCode]);
        }
        if (source=='REALIZATION FOR PUBLIC SERVICE'){
            this.route.navigate(['objectinfopaymentapproval/subrealization', codeEdit, this.PaymentCode]);
        }
        if (source=='DP ORDER PUBLIC SERVICE'){
            this.route.navigate(['objectinfopaymentapproval/subdporder', codeEdit, this.PaymentCode]);
        }
        if (source=='POLICY'){
            this.route.navigate(['objectinfopaymentapproval/subpolicy', codeEdit, this.PaymentCode]);
        }
    }
    //#endregion button edit

    //#region convert to base64
    handleFile(event) {
        this.showSpinner = true;
        const binaryString = event.target.result;
        this.base64textString = btoa(binaryString);

        this.tamps.push({
            p_header: 'PAYMENT_TRANSACTION',
            p_module: 'IFINAMS',
            p_child: this.PaymentCode,
            // p_id: this.tampDocumentCode,
            p_code: this.tampDocumentCode,
            p_file_paths: this.PaymentCode,
            p_file_name: this.tempFile,
            p_base64: this.base64textString
        });


        this.dalservice.UploadFile(this.tamps, this.APIController, this.APIRouteForUploadFile)
            .subscribe(
                // tslint:disable-next-line:no-shadowed-variable
                res => {
                    this.tamps = new Array();
                    // tslint:disable-next-line:no-shadowed-variable
                    const parses = JSON.parse(res);
                    if (parses.result === 1) {
                        this.showSpinner = false;
                    } else {
                        this.showSpinner = false;
                        this.swalPopUpMsg(parses.message);
                    }
                    // $('#datatableReceiveDetail').DataTable().ajax.reload();
                    this.callGetrow()
                },
                error => {
                    this.showSpinner = false;
                    this.tamps = new Array();
                    // tslint:disable-next-line:no-shadowed-variable
                    const parses = JSON.parse(error);
                    this.swalPopUpMsg(parses.message);
                    // $('#datatableReceiveDetail').DataTable().ajax.reload();
                });
    }
    //#endregion convert to base64

    //#region button delete image
    deleteImage(file_name: any, paths: any) {
        this.showSpinner = true;
        const usersJson: any[] = Array.of();
        usersJson.push({
            'p_code': this.PaymentCode,
            'p_file_name': file_name,
            'p_file_paths': paths
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
                                this.showNotification('bottom', 'right', 'success');
                                $('#fileControl').val(undefined);
                                this.tempFile = undefined;
                            } else {
                                this.showSpinner = false;
                                this.swalPopUpMsg(parse.message);
                            }
                            this.callGetrow()
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
    //#endregion button priview image

    //#region form submitpaymentForm
    onFormSubmit(paymentForm: NgForm, isValid: boolean) {
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

        this.paymentData = this.JSToNumberFloats(paymentForm);
        const usersJson: any[] = Array.of(this.paymentData);

        if (this.PaymentCode != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);

                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success')
                            this.callGetrow();
                        } else {
                            this.swalPopUpMsg(parse.data)
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data)
                    });
        } else {
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success')
                            this.route.navigate(['/payment/subpaymentlist/paymentdetail', parse.code]);
                        } else {
                            this.swalPopUpMsg(parse.data)
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data)
                        // console.log('There was an error while Updating Data(API) !!!' + error);
                    });
        }
    }
    //#endregion form submit

    //#region button back
    btnBack() {
        $('#datatable').DataTable().ajax.reload();
        this.route.navigate(['/payment/subpaymentlist']);
    }
    //#endregion button back

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
                    'default': ''
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBase(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupbranch = parse.data;
                    this.lookupbranch.numberIndex = dtParameters.start;

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            'lengthMenu': [
                [5, 25, 50, 100],
                [5, 25, 50, 100]
            ],
            columnDefs: [{ orderable: false, width: '5%', targets: [3] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowBranch(branch_code: String, branch_desc: string) {
        this.model.branch_code = branch_code;
        this.model.branch_name = branch_desc;
        this.model.agreement_no = '';
        this.model.agreement_external_no = '';
        this.model.client_name = '';
        this.model.collateral_no = '';
        this.model.collateral_external_no = '';
        this.model.collateral_name = '';
        $('#lookupModalBranch').modal('hide');
    }
    //#endregion Branch lookup

    //#region checkbox all table
    btnDeleteAll() {
        this.checkedList = [];
        for (let i = 0; i < this.paymentdetaillist.length; i++) {
            if (this.paymentdetaillist[i].selected) {
                this.checkedList.push(this.paymentdetaillist[i].id);
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
        this.dataTampPush = [];
        for (let J = 0; J < this.checkedList.length; J++) {
            // param tambahan untuk getrow dynamic
            this.dataTampPush.push({
                'p_id': this.checkedList[J]
            });
            // end param tambahan untuk getrow dynamic
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
            this.showSpinner = true;
            if (result.value) {
                this.dalservice.Delete(this.dataTampPush, this.APIControllerPaymentDetail, this.APIRouteForDelete)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                $('#datatablepaymentdetaillist').DataTable().ajax.reload();
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                            } else {
                                this.swalPopUpMsg(parse.data)
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data)
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }

    selectAllTable() {
        for (let i = 0; i < this.paymentdetaillist.length; i++) {
            this.paymentdetaillist[i].selected = this.selectedAllTable;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAllTable = this.paymentdetaillist.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion checkbox all table

    //#region btnCancel
    btnCancel() {
        // param tambahan untuk button Done dynamic
        this.dataRoleTamp = [{
            'p_code': this.PaymentCode,
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

    //#region btnProceed
    btnProceed() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.PaymentCode,
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
                                this.ngOnInit();
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

    //#region btnPost
    btnPost() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.PaymentCode,
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
                    'p_reff_no': this.PaymentCode
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

