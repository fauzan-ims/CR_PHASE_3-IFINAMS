import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { DatePipe } from '@angular/common';
// import { log } from 'console';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './workorderapproval.component.html'
})

export class WorkOrderApprovalComponent extends BaseComponent implements OnInit {
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

    //controller
    private APIController: String = 'WorkOrder';
    private APIControllerDetail: String = 'WorkOrderDetail';
    private APIControllerAsset: String = 'Asset';
    private APIControllerMaintenance: String = 'Maintenance';
    private APIControllerSysGlobalparam: String = 'SysGlobalparam';
    private APIControllerTaxCode: String = 'MasterTaxScheme';

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

                    if (parsedata.status !== 'POST') {
                        this.tampHiddenforView = false;
                    } else {
                        this.tampHiddenforView = true;
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
        this.route.navigate(['/objectinfopaymentapproval/subpaymentapproval',this.params]);
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

    //#region load all data
    loadData() {
        this.dtOptions = {
            'pagingType': 'first_last_numbers',
            'pageLength': 10,
            'processing': true,
            'serverSide': true,
            responsive: true,
            lengthChange: false, // hide lengthmenu
            searching: false, // jika ingin hilangin search box nya maka false
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
    //#endregion 

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

}

