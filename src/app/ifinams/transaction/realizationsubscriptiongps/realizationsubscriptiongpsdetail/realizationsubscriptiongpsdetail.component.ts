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
    templateUrl: './realizationsubscriptiongpsdetail.component.html'
})

export class RealizationSubscriptionGpsDetailComponent extends BaseComponent implements OnInit {
    // get param from url

    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public realizationSubcriptionData: any = [];
    public isReadOnly: Boolean = false;
    public setStyle: any = [];
    public lookupReasonUnsubsribe: any = [];
    public tempFile: any;
    private dataTamp: any = [];
    public lookupcategory: any = [];
    public lookupvendor: any = [];
    public lookupbank: any = [];
    public lookupTax: any = [];
    public maintenanceby: any = [];
    public isDate: Boolean = false;
    public lookupSpafAsset: any = [];
    public lookupapproval: any = [];
    private dataRoleTamp: any = [];
    private tamps = new Array();
    private tampDocumentCode: String;
    private tempFileSize: any;
    private base64textString: string;

    //controller
    private APIController: String = 'MonitoringGps';
    private APIControllerType: String = 'SysGeneralSubcode';
    private APIControllerSysBank: String = 'SysBank';
    private APIControllerTaxCode: String = 'MasterTaxScheme';
    private APIControllerApprovalSchedule: String = 'ApprovalSchedule';

    //routing
    private APIRouteForGetRowForGpsRealizationSubcription: String = 'GetRowForGpsRealizationSubcription';
    private APIRouteForGpsRealizationSubcriptionUpdate: String = 'GpsRealizationSubcriptionUpdate';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForUnsubscribe: String = 'Insert';
    private APIRouteLookup: String = 'GetRowsForLookupForReasonUnsubscribe';
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForDeleteFile: String = 'Deletefile';
    private APIRouteForUploadFile: String = 'Upload';
    private APIRouteForPriviewFile: String = 'Priview';
    private APIRouteForProceedApproval: String = 'GpsRealizationSubcriptionProceed';
    private APIRouteForCancel: String = 'GpsRealizationSubcriptionCancel';
    private RoleAccessCode = 'R00024710000001A';

    // form 2 way binding
    model: any = {};

    // checklist
    public selectedAll: any;
    private checkedList: any = [];
    private checkedLookup: any = [];
    public selectedAllLookup: any;

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
            if (this.model != 'HOLD'){
                this.isReadOnly = false;
            }
            this.callGetrow();
        } else {
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.gps_status = 'ALL';
        }
    }

    //#region getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param,
            'p_realization_no': this.param
        }];
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRowForGpsRealizationSubcription)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui
                    // console.log(this.model)
                    console.log(this.model.realization_date) 

                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion getrow data

    //#region button back
    btnBack() {
        this.route.navigate(['/transaction/subrealizationsubscriptiongpslist']);
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

    //#region onSubmit
    onFormSubmit(RealizationSubscriptionGpsForm: NgForm, isValid: boolean) {
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

        this.realizationSubcriptionData = this.JSToNumberFloats(RealizationSubscriptionGpsForm);
        const usersJson: any[] = Array.of(this.realizationSubcriptionData);
        // call web service
        this.dalservice.ExecSp(usersJson, this.APIController, this.APIRouteForGpsRealizationSubcriptionUpdate)
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
    //#endregion onSubmit

    //#region Lookup Process Status
    btnLookupReasonUnsubscribe() {
        $('#datatableLookupReasonUnsubsribe').DataTable().clear().destroy();
        $('#datatableLookupReasonUnsubsribe').DataTable({
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
                    'p_general_code': 'RSUNSB'
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerType, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupReasonUnsubsribe = parse.data;
                    if (parse.data != null) {
                        this.lookupReasonUnsubsribe.numberIndex = dtParameters.start;
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

    btnSelectRowReasonUnsubsribe(general_subcode_desc: string) {
        this.model.reason_unsubscribe = general_subcode_desc;
        $('#lookupModalReasonUnsubsribe').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearReasonUnsubsribe() {
        this.model.reason_unsubscribe = undefined;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Lookup Process Status

    //#region lookup close
    btnLookupClose() {
        this.callGetrow();
    }
    //#endregion lookup close

    //#region btnUnsubscribe
    btnUnsubscribe(remark: string) {
        // param tambahan untuk getrole dynamic
        this.dataTamp = [{
            'p_fa_code': this.param,
            'p_source_reff_no': this.param,
            'p_remark': remark
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
                this.dalservice.Insert(this.dataTamp, this.APIController, this.APIRouteForUnsubscribe)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.ngOnInit();
                                this.callGetrow();
                                // this.route.navigate(['transaction/submonitoringgpslist']);
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
    //#endregion btnUnsubscribe

    //#region PublicserviceBankDetail Bank Lookup
    btnLookupBank() {
        $('#datatableLookupBank').DataTable().clear().destroy();
        $('#datatableLookupBank').DataTable({
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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBank, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupbank = parse.data;

                    if (parse.data != null) {
                        this.lookupbank.numberIndex = dtParameters.start;
                    }

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
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowBank(bank_code: String, bank_name: string) {
        this.model.bank_code = bank_code;
        this.model.bank_name = bank_name;
        $('#lookupModalBank').modal('hide');
    }
    //#endregion NotaryDetail Bank lookup

    //#region Tax Lookup
    btnLookupTaxCode() {
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

    btnSelectRowTax(code: String, description: String, ppn_pct: String, pph_pct: String) {
        this.model.tax_code = code;
        this.model.tax_name = description;
        this.model.tax_ppn = ppn_pct;
        this.model.tax_pph = pph_pct;
        $('#lookupModalTax').modal('hide');
    }
    //#endregion Tax lookup

    //#region onBlur
    onBlur(event, type) {
        // if (event.target.value.match('[A-Za-z]')) {
        //   event.target.value = 0;
        // }

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

        // if (type === 'amount') {
        //     $('#dp_to_public_service_amount' + i)
        //         .map(function () { return $(this).val(event); }).get();
        // } else {
        //     $('#dp_to_public_service_pct' + i)
        //         .map(function () { return $(this).val(event); }).get();
        // }
    }
    //#endregion onBlur

    //#region onFocus
    onFocus(event, i, type) {
        event = '' + event.target.value;

        if (event != null) {
            event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
        }

        if (type === 'amount') {
            $('#dp_to_public_service_amount' + i)
                .map(function () { return $(this).val(event); }).get();

        } else {
            $('#dp_to_public_service_pct' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onFocus

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

    //#region button preview
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
    
    priviewFile(row1, row2) {
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
    //#endregion button preview

    //#region button select image
  onUpload(event, id) {
    const files = event.target.files;
    const file = files[0];

    if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
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
      this.tampDocumentCode = id;
    }
  }
  //#endregion button select image 

  //#region convert to base64
  handleFile(event) {
    this.showSpinner = true;
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);

    this.tamps.push({
      p_header: 'TEMPAMS',
      p_module: 'IFINAMS',
      p_child: this.tampDocumentCode,
      p_code: this.tampDocumentCode,
      p_file_paths: this.tampDocumentCode,
      p_file_name: this.tempFile,
      p_base64: this.base64textString
    });

    this.dalservice.UploadFile(this.tamps, this.APIController, this.APIRouteForUploadFile)
      .subscribe(
        res => {
          this.tamps = new Array();
          const parses = JSON.parse(res);
          if (parses.result === 1) {
            $('#fileControl').val('');
            this.showSpinner = false;
          } else {
            $('#fileControl').val('');
            this.showSpinner = false;
            this.swalPopUpMsg(parses.message);
          }
          $('#datatableTemporaryDocumentUploadList').DataTable().ajax.reload();
        },
        error => {
          $('#fileControl').val('');
          this.showSpinner = false;
          this.tamps = new Array();
          const parses = JSON.parse(error);
          this.swalPopUpMsg(parses.message);
        });
  }
  //#endregion convert to base64

  //#region button delete image
  deleteImage(file_name: any, paths: any, realization_no: any) {
        this.showSpinner = true;
        const usersJson: any[] = Array.of();
        usersJson.push({
            'p_code': realization_no,
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
                    $('#fileControl').val();
                    this.tempFile = undefined;
                } else {
                    this.showSpinner = false;
                    this.swalPopUpMsg(parse.message);
                }
                $('#datatableTemporaryDocumentUploadList').DataTable().ajax.reload();
                // $('#datatableReturnDetail').DataTable().ajax.reload();
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


    //#region button proceed
    btnProceed(RealizationSubscriptionGpsForm: NgForm, isValid: boolean) {
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
        // param tambahan untuk button Proceed dynamic
        this.dataRoleTamp = [{
            ...RealizationSubscriptionGpsForm, // spread semua nilai form ke dalam object
            'p_code': this.param,
            'action': ''
        }];
        // param tambahan untuk button Proceed dynamic

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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForProceedApproval)
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
    //#endregion button proceed

    //#region button proceed
    btnCancel() {
        // param tambahan untuk button Proceed dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
            'action': ''
        }];
        // param tambahan untuk button Proceed dynamic

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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancel)
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
    //#endregion button proceed
}

