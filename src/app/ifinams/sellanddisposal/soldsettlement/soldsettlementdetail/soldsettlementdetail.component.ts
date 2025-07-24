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
    templateUrl: './soldsettlementdetail.component.html'
})

export class SoldSettlementdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public tempFile: any;
    private tamps = new Array();
    public tampDocumentCode: String;
    private base64textString: string;
    public EmailPattern = this._emailformat;
    public saleData: any = [];
    public orderdetaillist: any = [];
    public isReadOnly: Boolean = false;
    public isSellType: Boolean = false;
    public isReadOnly2: Boolean = false;
    public isSellType2: Boolean = false;
    public isPrintPJB: Boolean = false;
    public tampHidden: Boolean = true;
    public tampHiddenFile: Boolean = true;
    private dataTamp: any = [];
    public dataTampGetrow: any = [];
    private dataRoleTamp: any = [];
    public setStyle: any = [];
    public lookupbranch: any = [];
    public lookuplocation: any = [];
    public lookupreason: any = [];
    private dataTampSaleData: any = [];
    public dataRoleTampInsertLog: any = [];
    public jsonDataJournal: any = [];
    public NpwpPattern = this._npwpformat;
    public buyer_npwp: String;

    //controller
    private APIController: String = 'SaleDetail';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerLocation: String = 'MasterLocation';
    private APIControllerMasterItem: String = 'MasterItem';


    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'UpdateForSoldSettlement';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForReturnSell: String = 'ExecSpForReturnSell';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForReject: String = 'ExecSpForReject';
    private APIRouteForReturnJournal: String = 'ExecSpForReturnJournal';
    private APIRouteForGetRowItem: string = 'GetRowForItemGroupGl'
    private APIRouteForUpdateGlAssetCode: string = 'ExecSpForUpdateGlAssetCode';
    private APIRouteForUploadFile: String = 'Upload';
    private APIRouteForDeleteFile: String = 'Deletefile';
    private APIRouteForPriviewFile: String = 'Priview';
    private APIRouteForDownloadPJB: String = 'PrintPJB';

    private RoleAccessCode = 'R00022590000001A';

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
        if (this.param != null) {
            this.isReadOnly = true;
            this.callGetrow();
        } else {
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.sale_amount_header = 0;
            this.model.is_sold = '1';
            this.tampHidden = true;
            this.tampHiddenFile = true;
        }
    }

    //#region getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_id': this.param
        }];
        // end param tambahan untuk getrow dynamic
        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    if (parsedata.sale_detail_status != 'HOLD') {
                        this.isReadOnly = true;
                        this.isReadOnly2 = true;
                    } else {
                        this.isReadOnly = false;
                        this.isReadOnly2 = false;
                    }

                    if (parsedata.sell_type == 'COP') {
                        this.isSellType = true;
                        this.isSellType2 = true;
                    } else {
                        this.isSellType = false;
                        this.isSellType2 = false;
                    }

                    if (parsedata.sell_type == 'COP') {
                        this.isPrintPJB = false;
                    } else {
                        this.isPrintPJB = true;
                    }

                    if (parsedata.file_name === '' || parsedata.file_name == null) {
                        this.tampHidden = false;
                    } else {
                        this.tampHidden = true;

                    }


                    this.wizard();
                    this.saledetailfeewiz();

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
    onFormSubmit(soldSettlementForm: NgForm, isValid: boolean) {

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

        this.saleData = this.JSToNumberFloats(soldSettlementForm);

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
        this.route.navigate(['/sellanddisposal/subsoldsettlement']);
        $('#datatablesoldrequest').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region Sale list tabs
    saledetailfeewiz() {
        this.route.navigate(['/sellanddisposal/subsoldsettlement/soldsettlementdetail/' + this.param + '/soldsettlement', this.param], { skipLocationChange: true });
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForProceed)
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
    //#endregion btnProceed

    //#region button print pajak
    btnPrintPajak() {
    this.showSpinner = true;
    const dataParam = {
        TableName: 'rpt_list_faktur_pajak_ar_detail_sell',
        SpName: 'xsp_rpt_list_faktur_pajak_ar_detail_sell',
        reportparameters: {
        p_user_id: this.userId,
        p_sell_code: this.param,
        p_print_option: 'Excel'
        
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

    //#region btnReturn
    btnReturn() {
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForReturnSell)
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
                this.showSpinner = true;
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPost)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                this.showSpinner = false;
                            } else {
                                this.showSpinner = false;
                                this.swalPopUpMsg(parse.data);
                            }
                        })
            } else {
                this.showSpinner = false;
            }
        })
    }
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
                        $('#docdetailwiz').click();
                        $('#tabdetailwiz').click();
                        $('#tabbiddingwiz').click();
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

    //#region button delete image
    deleteImage(file_name: any, row2) {
        const usersJson: any[] = Array.of();

        usersJson.push({
            p_code: this.model.sale_code,
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
            p_header: 'SALE_DETAIL',
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

    //#region btnPrintPJB
    btnPrintPJB(p_sale_code: string, rpt_code: string, report_name: string) {
        this.showSpinner = true;

        const rptParam = {
            p_user_id: this.userId,
            p_sell_code: this.model.sale_code,
            p_buyer_name: this.model.buyer_name,
            p_buyer_type: this.model.buyer_type,
            p_buyer_ktp_no: this.model.ktp_no,
            p_sell_type: this.model.sell_type,
            p_buyer_npwp: this.model.buyer_npwp,
            // p_sell_date: this.model.sale_date,
            p_code: rpt_code,
            p_report_name: report_name,
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
    //#endregion btnPrintPJB

    //#region print
    // btnPrintPJB(buyer_type: any) {
    //     this.showSpinner = true;
    //     if (buyer_type == "CORPORATE") {
    //         let filename = ""


    //         filename = "REPORT_PERJANJIAN_JUAL_BELI_CORPORATE"

    //         const dataParamOfferingLater = [{
    //             "p_file_name": filename,
    //             "p_user_id": this.userId,
    //             "p_code": this.model.sale_code,
    //         }];


    //         this.dalservice.DownloadFileWithParam(dataParamOfferingLater, this.APIController, this.APIRouteForDownloadPJB).subscribe(res => {

    //             this.showSpinner = false;
    //             var contentOfferingLater = res.headers.get('content-disposition');

    //             var filename = contentOfferingLater.split(';')[1].split('filename')[1].split('=')[1].trim();

    //             const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //             const url = window.URL.createObjectURL(blob);
    //             var link = document.createElement('a');
    //             link.href = url;
    //             link.download = filename;
    //             link.click();
    //             this.showNotification('bottom', 'right', 'success');
    //             // $('#datatables').DataTable().ajax.reload();
    //             // window.open(url);

    //         },
    //             err => {
    //                 this.showSpinner = false;
    //                 const parse = JSON.parse(err);
    //                 this.swalPopUpMsg(parse.data);
    //             });
    //     } else if (buyer_type == "PERSONAL") {

    //         let filename = ""

    //         filename = "REPORT_PERJANJIAN_JUAL_BELI"

    //         const dataParamOfferingLater = [{
    //             "p_file_name": filename,
    //             "p_user_id": this.userId,
    //             "p_code": this.model.sale_code,
    //         }];

    //         this.dalservice.DownloadFileWithParam(dataParamOfferingLater, this.APIController, this.APIRouteForDownloadPJB).subscribe(res => {

    //             this.showSpinner = false;
    //             var contentOfferingLater = res.headers.get('content-disposition');

    //             var filename = contentOfferingLater.split(';')[1].split('filename')[1].split('=')[1].trim();

    //             const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //             const url = window.URL.createObjectURL(blob);
    //             var link = document.createElement('a');
    //             link.href = url;
    //             link.download = filename;
    //             link.click();
    //             this.showNotification('bottom', 'right', 'success');
    //             // $('#datatables').DataTable().ajax.reload();
    //             // window.open(url);

    //         },
    //             err => {
    //                 this.showSpinner = false;
    //                 const parse = JSON.parse(err);
    //                 this.swalPopUpMsg(parse.data);
    //             });
    //     }
    // }
    //#endregion print

    //#region change
    changeData(event: any) {
        this.model.buyer_address = '';
        this.model.buyer_type = '';
        this.model.buyer_name = '';
        this.model.buyer_area_phone = '';
        this.model.buyer_area_phone_no = '';
        this.model.ppn_asset = 0;
        this.model.total_fee_amount = 0;
        this.model.gain_loss_profit = 0;
        this.model.sold_amount = 0;
        this.model.net_receive = 0;
    }
    //#endregion change

    
    // #region changeSettlementStatus 
    changeBuyerType(event: any) {
        this.model.ktp_no = '';
        this.model.buyer_npwp = '';
        this.model.buyer_signer_name = '';
    }
    // #endregion changeSettlementStatus 

    //#region npwp
    // onKeydownNpwp(event: any) {

    //     let ctrlDown = false;

    //     if (event.keyCode == 17 || event.keyCode == 91) {
    //         ctrlDown = true;
    //     }

    //     if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)
    //         || (ctrlDown && (event.keyCode == 86 || event.keyCode == 67 || event.keyCode == 65 || event.keyCode == 90))
    //         || event.keyCode == 8 || event.keyCode == 9
    //         || (event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 38 || event.keyCode == 40)
    //     )) {

    //         return false;
    //     }

    // }

    // onPasteNpwp(event: any) {

    //     if (!event.originalEvent.clipboardData.getData('Text').match(/^[0-9,.-]*$/)) {
    //         event.preventDefault();
    //     }

    // }

    // onFokusNpwp(event: any) {
    //     let valEvent: any;
    //     valEvent = '' + event.target.value;

    //     if (valEvent != null) {
    //         this.model.buyer_npwp = valEvent.replace(/[^0-9]/g, '');
    //     }

    // }

    // onChangeNpwp(event: any) {

    //     let valEvent: any;

    //     valEvent = '' + event.target.value;
    //     var x = valEvent.split('');

    //     if (x.length == 15) {
    //         var tt = x[0] + x[1] + '.';
    //         var dd = tt + x[2] + x[3] + x[4] + '.';
    //         var ee = dd + x[5] + x[6] + x[7] + '.';
    //         var ff = ee + x[8] + '-';
    //         var gg = ff + x[9] + x[10] + x[11] + '.';
    //         var hh = gg + x[12] + x[13] + x[14];

    //         this.model.buyer_npwp = hh;
    //     }

    // }
    //#endregion npwp
}

