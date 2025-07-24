import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './assetuploadlistlist.component.html'
})

export class AssetUplaodListComponent extends BaseComponent implements OnInit {
    // variable
    public listassetupload: any = [];
    public dataTamp: any = [];
    private dataTampPush: any[];
    private dataRoleTamp: any = [];
    private dataSync: any = [];
    public asset_type: any;
    public upload_no: any;
    public tempFile: any;
    private base64textString: string;
    private tamps = new Array();
    public status: any;
    private tempFileSize: any;

    //controller
    private APIController: String = 'AssetUpload';
    private APIControllerElectronic: String = 'AssetElectronicUpload';
    private APIControllerFurniture: String = 'AssetFuritureUpload';
    private APIControllerMachine: String = 'AssetMachineUpload';
    private APIControllerOther: String = 'AssetOtherUpload';
    private APIControllerProperty: String = 'AssetPropertyUpload';
    private APIControllerVehicle: String = 'AssetVehicleUpload';
    private APIControllerSysGlobalparam: String = 'SysGlobalparam';

    //routing
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForDelete: String = 'DELETE';
    private APIRouteForDownloadELCT: String = 'DownloadFileELCT';
    private APIRouteForDownloadFNTR: String = 'DownloadFileFNTR';
    private APIRouteForDownloadMCHN: String = 'DownloadFileMCHN';
    private APIRouteForDownloadOTHR: String = 'DownloadFileOTHR';
    private APIRouteForDownloadPRTY: String = 'DownloadFilePRTY';
    private APIRouteForDownloadVHCL: String = 'DownloadFileVHCL';
    private APIRouteForView: String = 'PrintFileView';
    private APIRouteForSync: String = 'ExecSpForSync';
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForReject: String = 'ExecSpForReject';
    private APIRouteForUploadDataFile: String = 'UploadDataExcel';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForGetRow: String = 'GETROW';

    //role code
    private RoleAccessCode = 'R00021450000000A';

    // checklist
    public selectedAll: any;
    private checkedList: any = [];
    private checkedLookup: any = [];
    public selectedAllLookup: any;

    // spinner
    showSpinner: Boolean = false;
    // end

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide(this._location, this._elementRef, this.route);
        this.loadData();
        this.callGetrowDoc();
        this.asset_type = 'ELCT';
        this.status = 'NEW';
    }

    //#region ddl AssetType
    PageAssetType(event: any) {
        this.asset_type = event.target.value;
        $('#datatableassetupload').DataTable().ajax.reload();
    }
    //#endregion ddl AssetType

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
                    'p_company_code': this.company_code,
                    'p_asset_type': this.asset_type,
                    'p_status': this.status,
                });
                // end param tambahan untuk getrows dynamic

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)
                    this.listassetupload = parse.data;

                    if (parse.data != null) {
                        this.listassetupload.numberIndex = dtParameters.start;
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

    //#region button edit
    btnEdit(codeEdit: string) {
        this.route.navigate(['/interfacefromcore/subinterfacedeskcolllist/deskcolldetail', codeEdit]);
    }
    //#endregion button edit

    //#region upload excel reader
    handleFile(event) {
        const binaryString = event.target.result;
        this.base64textString = btoa(binaryString);

        // this.tamps.push({
        //     p_company_code: this.company_code,
        //     p_asset_type: this.asset_type,
        //     filename: this.tempFile,
        //     base64: this.base64textString,
        // });
    }

    onUploadReader(event) {
        const files = event.target.files;
        const file = files[0];

        if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
            this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
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
        }

        this.tempFile = files[0].name.toUpperCase();

        // if (this.tempFile !== 'ASSETUPLOAD.XLSX' && this.tempFile !== 'asset_upload.xlsx') {
        //     this.tempFile = '';
        //     swal({
        //         title: 'Warning',
        //         text: 'Invalid Template Name',
        //         buttonsStyling: false,
        //         confirmButtonClass: 'btn btn-danger',
        //         type: 'warning'
        //     }).catch(swal.noop)
        //     return;
        // } else {
        //     this.showSpinner = true;
        // }

        // param tambahan untuk getrole dynamic
        this.dataTampPush = [this.JSToNumberFloats({
            'p_company_code': this.company_code,
            'p_asset_type': this.asset_type
        })];
        // param tambahan untuk getrole dynamic

        // this.tampDocumentCode = code;
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
        }).then((result) => {
            this.showSpinner = true;
            if (result.value) {
                this.dalservice.Delete(this.dataTampPush, this.APIController, this.APIRouteForDelete)
                    .subscribe(
                        resDelete => {
                            const parseDelete = JSON.parse(resDelete);
                        },
                        error => {
                            const parseDelete = JSON.parse(error);
                            this.swalPopUpMsg(parseDelete.data);
                        });
                // call web service
                this.dalservice.Insert(this.dataTampPush, this.APIController, this.APIRouteForInsert)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parseAdd = JSON.parse(res);
                            this.upload_no = parseAdd.code;

                            this.tamps.push({
                                p_company_code: this.company_code,
                                p_asset_type: this.asset_type,
                                filename: this.tempFile,
                                base64: this.base64textString,
                                p_upload_no: this.upload_no,
                            });

                            if (this.asset_type == 'ELCT') {
                                this.dalservice.UploadFile(this.tamps, this.APIControllerElectronic, this.APIRouteForUploadDataFile)
                                    .subscribe(
                                        res => {
                                            const parse = JSON.parse(res);
                                            if (parse.result === 1) {
                                                // this.tamps = [];
                                                this.showSpinner = false;
                                                this.showNotification('bottom', 'right', 'success');
                                                $('#datatableassetupload').DataTable().ajax.reload();
                                                this.tempFile = '';

                                            } else {
                                                this.showSpinner = false;
                                                this.swalPopUpMsg(parse.data);
                                                $('#fileControl').val('');
                                                $('#datatableassetupload').DataTable().ajax.reload();
                                                this.tempFile = '';
                                                //this.tamps = [];
                                                // window.location.reload();
                                            }
                                        }, error => {
                                            this.showSpinner = false;
                                            const parse = JSON.parse(error);
                                            this.swalPopUpMsg(parse.data);
                                            $('#fileControl').val('');
                                            this.tempFile = '';
                                            //this.tamps = [];
                                            // window.location.reload();
                                        });
                            }
                            else if (this.asset_type == 'FNTR') {
                                this.dalservice.UploadFile(this.tamps, this.APIControllerFurniture, this.APIRouteForUploadDataFile)
                                    .subscribe(
                                        res => {
                                            const parse = JSON.parse(res);

                                            if (parse.result === 1) {
                                                // this.tamps = [];
                                                this.showSpinner = false;
                                                this.showNotification('bottom', 'right', 'success');
                                                $('#datatableassetupload').DataTable().ajax.reload();
                                                this.tempFile = '';
                                            } else {
                                                this.showSpinner = false;
                                                this.swalPopUpMsg(parse.data);
                                                $('#fileControl').val('');
                                                $('#datatableassetupload').DataTable().ajax.reload();
                                                this.tempFile = '';
                                                //this.tamps = [];
                                                // window.location.reload();
                                            }
                                        }, error => {
                                            this.showSpinner = false;
                                            const parse = JSON.parse(error);
                                            this.swalPopUpMsg(parse.data);
                                            $('#fileControl').val('');
                                            this.tempFile = '';
                                            //this.tamps = [];
                                            // window.location.reload();
                                        });
                            }
                            else if (this.asset_type == 'MCHN') {
                                this.dalservice.UploadFile(this.tamps, this.APIControllerMachine, this.APIRouteForUploadDataFile)
                                    .subscribe(
                                        res => {
                                            const parse = JSON.parse(res);

                                            if (parse.result === 1) {
                                                // this.tamps = [];
                                                this.showSpinner = false;
                                                this.showNotification('bottom', 'right', 'success');
                                                $('#datatableassetupload').DataTable().ajax.reload();
                                                this.tempFile = '';
                                            } else {
                                                this.showSpinner = false;
                                                this.swalPopUpMsg(parse.data);
                                                $('#fileControl').val('');
                                                $('#datatableassetupload').DataTable().ajax.reload();
                                                this.tempFile = '';
                                                //this.tamps = [];
                                                // window.location.reload();
                                            }
                                        }, error => {
                                            this.showSpinner = false;
                                            const parse = JSON.parse(error);
                                            this.swalPopUpMsg(parse.data);
                                            $('#fileControl').val('');
                                            this.tempFile = '';
                                            //this.tamps = [];
                                            // window.location.reload();
                                        });
                            }
                            else if (this.asset_type == 'OTHR') {
                                this.dalservice.UploadFile(this.tamps, this.APIControllerOther, this.APIRouteForUploadDataFile)
                                    .subscribe(
                                        res => {
                                            const parse = JSON.parse(res);

                                            if (parse.result === 1) {
                                                // this.tamps = [];
                                                this.showSpinner = false;
                                                this.showNotification('bottom', 'right', 'success');
                                                $('#datatableassetupload').DataTable().ajax.reload();
                                                this.tempFile = '';
                                            } else {
                                                this.showSpinner = false;
                                                this.swalPopUpMsg(parse.data);
                                                $('#fileControl').val('');
                                                $('#datatableassetupload').DataTable().ajax.reload();
                                                this.tempFile = '';
                                                //this.tamps = [];
                                                // window.location.reload();
                                            }
                                        }, error => {
                                            this.showSpinner = false;
                                            const parse = JSON.parse(error);
                                            this.swalPopUpMsg(parse.data);
                                            $('#fileControl').val('');
                                            this.tempFile = '';
                                            //this.tamps = [];
                                            // window.location.reload();
                                        });
                            }
                            else if (this.asset_type == 'PRTY') {
                                this.dalservice.UploadFile(this.tamps, this.APIControllerProperty, this.APIRouteForUploadDataFile)
                                    .subscribe(
                                        res => {
                                            const parse = JSON.parse(res);

                                            if (parse.result === 1) {
                                                // this.tamps = [];
                                                this.showSpinner = false;
                                                this.showNotification('bottom', 'right', 'success');
                                                $('#datatableassetupload').DataTable().ajax.reload();
                                                this.tempFile = '';
                                            } else {
                                                this.showSpinner = false;
                                                this.swalPopUpMsg(parse.data);
                                                $('#fileControl').val('');
                                                $('#datatableassetupload').DataTable().ajax.reload();
                                                this.tempFile = '';
                                                //this.tamps = [];
                                                // window.location.reload();
                                            }
                                        }, error => {
                                            this.showSpinner = false;
                                            const parse = JSON.parse(error);
                                            this.swalPopUpMsg(parse.data);
                                            $('#fileControl').val('');
                                            this.tempFile = '';
                                            //this.tamps = [];
                                            // window.location.reload();
                                        });
                            }
                            else if (this.asset_type == 'VHCL') {
                                this.dalservice.UploadFile(this.tamps, this.APIControllerVehicle, this.APIRouteForUploadDataFile)
                                    .subscribe(
                                        res => {
                                            const parse = JSON.parse(res);
                                            if (parse.result === 1) {
                                                // this.tamps = [];
                                                this.showSpinner = false;
                                                this.showNotification('bottom', 'right', 'success');
                                                $('#datatableassetupload').DataTable().ajax.reload();
                                                this.tempFile = '';
                                            } else {
                                                this.showSpinner = false;
                                                this.swalPopUpMsg(parse.data);
                                                $('#fileControl').val('');
                                                $('#datatableassetupload').DataTable().ajax.reload();
                                                this.tempFile = '';
                                                //this.tamps = [];
                                                // window.location.reload();
                                            }
                                        }, error => {
                                            this.showSpinner = false;
                                            const parse = JSON.parse(error);
                                            this.swalPopUpMsg(parse.data);
                                            $('#fileControl').val('');
                                            this.tempFile = '';
                                            //this.tamps = [];
                                            // window.location.reload();
                                        });
                            }
                        },
                        error => {
                            const parseAdd = JSON.parse(error);
                            this.swalPopUpMsg(parseAdd.data);
                        });
                // if (this.asset_type == 'ELCT') {
                //     this.dalservice.UploadFile(this.tamps, this.APIControllerElectronic, this.APIRouteForUploadDataFile)
                //         .subscribe(
                //             res => {
                //                 const parse = JSON.parse(res);

                //                 if (parse.result === 1) {
                //                     // this.tamps = [];
                //                     this.showSpinner = false;
                //                     this.showNotification('bottom', 'right', 'success');
                //                     $('#datatableassetupload').DataTable().ajax.reload();
                //                     this.tempFile = '';

                //                 } else {
                //                     this.showSpinner = false;
                //                     this.swalPopUpMsg(parse.data);
                //                     $('#fileControl').val('');
                //                     $('#datatableassetupload').DataTable().ajax.reload();
                //                     this.tempFile = '';
                //                     //this.tamps = [];
                //                     // window.location.reload();
                //                 }
                //             }, error => {
                //                 this.showSpinner = false;
                //                 const parse = JSON.parse(error);
                //                 this.swalPopUpMsg(parse.data);
                //                 $('#fileControl').val('');
                //                 this.tempFile = '';
                //                 //this.tamps = [];
                //                 // window.location.reload();
                //             });
                // }
                // else if (this.asset_type == 'FNTR') {
                //     this.dalservice.UploadFile(this.tamps, this.APIControllerFurniture, this.APIRouteForUploadDataFile)
                //         .subscribe(
                //             res => {
                //                 const parse = JSON.parse(res);

                //                 if (parse.result === 1) {
                //                     // this.tamps = [];
                //                     this.showSpinner = false;
                //                     this.showNotification('bottom', 'right', 'success');
                //                     $('#datatableassetupload').DataTable().ajax.reload();
                //                     this.tempFile = '';
                //                 } else {
                //                     this.showSpinner = false;
                //                     this.swalPopUpMsg(parse.data);
                //                     $('#fileControl').val('');
                //                     $('#datatableassetupload').DataTable().ajax.reload();
                //                     this.tempFile = '';
                //                     //this.tamps = [];
                //                     // window.location.reload();
                //                 }
                //             }, error => {
                //                 this.showSpinner = false;
                //                 const parse = JSON.parse(error);
                //                 this.swalPopUpMsg(parse.data);
                //                 $('#fileControl').val('');
                //                 this.tempFile = '';
                //                 //this.tamps = [];
                //                 // window.location.reload();
                //             });
                // }
                // else if (this.asset_type == 'MCHN') {
                //     this.dalservice.UploadFile(this.tamps, this.APIControllerMachine, this.APIRouteForUploadDataFile)
                //         .subscribe(
                //             res => {
                //                 const parse = JSON.parse(res);

                //                 if (parse.result === 1) {
                //                     // this.tamps = [];
                //                     this.showSpinner = false;
                //                     this.showNotification('bottom', 'right', 'success');
                //                     $('#datatableassetupload').DataTable().ajax.reload();
                //                     this.tempFile = '';
                //                 } else {
                //                     this.showSpinner = false;
                //                     this.swalPopUpMsg(parse.data);
                //                     $('#fileControl').val('');
                //                     $('#datatableassetupload').DataTable().ajax.reload();
                //                     this.tempFile = '';
                //                     //this.tamps = [];
                //                     // window.location.reload();
                //                 }
                //             }, error => {
                //                 this.showSpinner = false;
                //                 const parse = JSON.parse(error);
                //                 this.swalPopUpMsg(parse.data);
                //                 $('#fileControl').val('');
                //                 this.tempFile = '';
                //                 //this.tamps = [];
                //                 // window.location.reload();
                //             });
                // }
                // else if (this.asset_type == 'OTHR') {
                //     this.dalservice.UploadFile(this.tamps, this.APIControllerOther, this.APIRouteForUploadDataFile)
                //         .subscribe(
                //             res => {
                //                 const parse = JSON.parse(res);

                //                 if (parse.result === 1) {
                //                     // this.tamps = [];
                //                     this.showSpinner = false;
                //                     this.showNotification('bottom', 'right', 'success');
                //                     $('#datatableassetupload').DataTable().ajax.reload();
                //                     this.tempFile = '';
                //                 } else {
                //                     this.showSpinner = false;
                //                     this.swalPopUpMsg(parse.data);
                //                     $('#fileControl').val('');
                //                     $('#datatableassetupload').DataTable().ajax.reload();
                //                     this.tempFile = '';
                //                     //this.tamps = [];
                //                     // window.location.reload();
                //                 }
                //             }, error => {
                //                 this.showSpinner = false;
                //                 const parse = JSON.parse(error);
                //                 this.swalPopUpMsg(parse.data);
                //                 $('#fileControl').val('');
                //                 this.tempFile = '';
                //                 //this.tamps = [];
                //                 // window.location.reload();
                //             });
                // }
                // else if (this.asset_type == 'PRTY') {
                //     this.dalservice.UploadFile(this.tamps, this.APIControllerProperty, this.APIRouteForUploadDataFile)
                //         .subscribe(
                //             res => {
                //                 const parse = JSON.parse(res);

                //                 if (parse.result === 1) {
                //                     // this.tamps = [];
                //                     this.showSpinner = false;
                //                     this.showNotification('bottom', 'right', 'success');
                //                     $('#datatableassetupload').DataTable().ajax.reload();
                //                     this.tempFile = '';
                //                 } else {
                //                     this.showSpinner = false;
                //                     this.swalPopUpMsg(parse.data);
                //                     $('#fileControl').val('');
                //                     $('#datatableassetupload').DataTable().ajax.reload();
                //                     this.tempFile = '';
                //                     //this.tamps = [];
                //                     // window.location.reload();
                //                 }
                //             }, error => {
                //                 this.showSpinner = false;
                //                 const parse = JSON.parse(error);
                //                 this.swalPopUpMsg(parse.data);
                //                 $('#fileControl').val('');
                //                 this.tempFile = '';
                //                 //this.tamps = [];
                //                 // window.location.reload();
                //             });
                // }
                // else if (this.asset_type == 'VHCL') {
                //     this.dalservice.UploadFile(this.tamps, this.APIControllerVehicle, this.APIRouteForUploadDataFile)
                //         .subscribe(
                //             res => {
                //                 const parse = JSON.parse(res);

                //                 if (parse.result === 1) {
                //                     // this.tamps = [];
                //                     this.showSpinner = false;
                //                     this.showNotification('bottom', 'right', 'success');
                //                     $('#datatableassetupload').DataTable().ajax.reload();
                //                     this.tempFile = '';
                //                 } else {
                //                     this.showSpinner = false;
                //                     this.swalPopUpMsg(parse.data);
                //                     $('#fileControl').val('');
                //                     $('#datatableassetupload').DataTable().ajax.reload();
                //                     this.tempFile = '';
                //                     //this.tamps = [];
                //                     // window.location.reload();
                //                 }
                //             }, error => {
                //                 this.showSpinner = false;
                //                 const parse = JSON.parse(error);
                //                 this.swalPopUpMsg(parse.data);
                //                 $('#fileControl').val('');
                //                 this.tempFile = '';
                //                 //this.tamps = [];
                //                 // window.location.reload();
                //             });
                // }
            } else {
                this.showSpinner = false;
                $('#fileControl').val('');
                $('#datatableassetupload').DataTable().ajax.reload();
                this.tempFile = '';
                //.tamps = [];
                // window.location.reload();
            }
        })

    }
    //#endregion button select image

    //#region btnDownload
    btnDownload() {
        this.showSpinner = true;

        const dataParam = [this.JSToNumberFloats(
            {
                'p_asset_type': this.asset_type
            }
        )];
        // param tambahan untuk button Reject dynamic

        this.showSpinner = true;
        if (this.asset_type == 'ELCT') {
            this.dalservice.DownloadTemplate(dataParam, this.APIController, this.APIRouteForDownloadELCT).subscribe(res => {
                this.showSpinner = false;
                var contentDisposition = res.headers.get('content-disposition');
                var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

                const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                // window.open(url);

            }, err => {
                this.showSpinner = false;
                const parse = JSON.parse(err);
                this.swalPopUpMsg(parse.data);
            });
        }
        else if (this.asset_type == 'FNTR') {
            this.dalservice.DownloadTemplate(dataParam, this.APIController, this.APIRouteForDownloadFNTR).subscribe(res => {
                this.showSpinner = false;
                var contentDisposition = res.headers.get('content-disposition');
                var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

                const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                // window.open(url);

            }, err => {
                this.showSpinner = false;
                const parse = JSON.parse(err);
                this.swalPopUpMsg(parse.data);
            });
        }
        else if (this.asset_type == 'MCHN') {
            this.dalservice.DownloadTemplate(dataParam, this.APIController, this.APIRouteForDownloadMCHN).subscribe(res => {
                this.showSpinner = false;
                var contentDisposition = res.headers.get('content-disposition');
                var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

                const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                // window.open(url);

            }, err => {
                this.showSpinner = false;
                const parse = JSON.parse(err);
                this.swalPopUpMsg(parse.data);
            });
        }
        else if (this.asset_type == 'OTHR') {
            this.dalservice.DownloadTemplate(dataParam, this.APIController, this.APIRouteForDownloadOTHR).subscribe(res => {
                this.showSpinner = false;
                var contentDisposition = res.headers.get('content-disposition');
                var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

                const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                // window.open(url);

            }, err => {
                this.showSpinner = false;
                const parse = JSON.parse(err);
                this.swalPopUpMsg(parse.data);
            });
        }
        else if (this.asset_type == 'PRTY') {
            this.dalservice.DownloadTemplate(dataParam, this.APIController, this.APIRouteForDownloadPRTY).subscribe(res => {
                this.showSpinner = false;
                var contentDisposition = res.headers.get('content-disposition');
                var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

                const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                // window.open(url);

            }, err => {
                this.showSpinner = false;
                const parse = JSON.parse(err);
                this.swalPopUpMsg(parse.data);
            });
        }
        else if (this.asset_type == 'VHCL') {
            this.dalservice.DownloadTemplate(dataParam, this.APIController, this.APIRouteForDownloadVHCL).subscribe(res => {
                this.showSpinner = false;
                var contentDisposition = res.headers.get('content-disposition');
                var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

                const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                // window.open(url);

            }, err => {
                this.showSpinner = false;
                const parse = JSON.parse(err);
                this.swalPopUpMsg(parse.data);
            });
        }


    }
    // #endregion btnDownload

    //#region btnDownload
    // btnDownload() {
    //     this.showSpinner = true;
    //     this.dalservice.DownloadTemplate(this.APIController, this.APIRouteForDownloadExcel).subscribe(res => {

    //         this.showSpinner = false;
    //         var contentDisposition = res.headers.get('content-disposition');

    //         var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
    //         const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //         const url = window.URL.createObjectURL(blob);
    //         var link = document.createElement('a');
    //         link.href = url;
    //         link.download = filename;
    //         link.click();
    //         // window.open(url);

    //     }, err => {
    //         this.showSpinner = false;
    //         const parse = JSON.parse(err);
    //         this.swalPopUpMsg(parse.data);

    //     });

    // }
    // #endregion btnDownload

    //#region btnPost
    btnPost() {
        this.checkedLookup = [];
        for (let i = 0; i < this.listassetupload.length; i++) {
            if (this.listassetupload[i].selected) {
                this.checkedLookup.push(this.listassetupload[i].upload_no);
            }
        }

        // jika tidak di checklist
        if (this.checkedLookup.length === 0) {
            swal({
                title: this._listdialogconf,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger'
            }).catch(swal.noop)
            return
        }
        for (let J = 0; J < this.checkedLookup.length; J++) {
            const codeData = this.checkedLookup[J];
            this.dataTamp = [{
                'p_upload_no': codeData,
                'p_company_code': this.company_code,
            }];

            // end param tambahan untuk getrow dynamic
            this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForPost)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            if (this.checkedLookup.length == J + 1) {
                                this.showNotification('bottom', 'right', 'success');
                                $('#datatableassetupload').DataTable().ajax.reload();
                                this.showSpinner = false;
                            }
                            // })
                        } else {
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                        this.showSpinner = false;
                    })
        }
    }

    selectAllTable() {
        for (let i = 0; i < this.listassetupload.length; i++) {
            this.listassetupload[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listassetupload.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion btnPost

    //#region btnReject
    btnReject() {
        this.checkedLookup = [];
        for (let i = 0; i < this.listassetupload.length; i++) {
            if (this.listassetupload[i].selected) {
                this.checkedLookup.push(this.listassetupload[i].upload_no);
            }
        }

        // jika tidak di checklist
        if (this.checkedLookup.length === 0) {
            swal({
                title: this._listdialogconf,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger'
            }).catch(swal.noop)
            return
        }
        for (let J = 0; J < this.checkedLookup.length; J++) {
            const codeData = this.checkedLookup[J];
            this.dataTamp = [{
                'p_upload_no': codeData
            }];

            // end param tambahan untuk getrow dynamic
            this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForReject)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            if (this.checkedLookup.length == J + 1) {
                                this.showNotification('bottom', 'right', 'success');
                                $('#datatableassetupload').DataTable().ajax.reload();
                            }
                            // })
                        } else {
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                    })
        }
    }
    //#endregion btnReject

    //#region btnSync
    btnSync() {
        // param tambahan untuk getrole dynamic
        this.dataSync = [{
            'p_company_code': this.company_code,
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
                this.dalservice.ExecSp(this.dataSync, this.APIController, this.APIRouteForSync)
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
    //#endregion btnSync

    //#region ddl Status
    PageStatus(event: any) {
        this.status = event.target.value;
        $('#datatableassetupload').DataTable().ajax.reload();
    }
    //#endregion ddl Status

    //#region btnView
    btnView() {
        this.checkedLookup = [];
        for (let i = 0; i < this.listassetupload.length; i++) {
            if (this.listassetupload[i].selected) {
                this.checkedLookup.push(this.listassetupload[i].upload_no);
            }
        }

        // jika tidak di checklist
        if (this.checkedLookup.length === 0) {
            swal({
                title: this._listdialogconf,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger'
            }).catch(swal.noop)
            return
        }
        for (let J = 0; J < this.checkedLookup.length; J++) {
            const codeData = this.checkedLookup[J];
            this.dataTamp = [{
                'p_upload_no': codeData,
                'p_asset_type': this.asset_type
            }];
            this.dalservice.DownloadFileWithData(this.dataTamp, this.APIController, this.APIRouteForView).subscribe(res => {

                this.showSpinner = false;
                var contentDisposition = res.headers.get('content-disposition');
                var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

                const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                // window.open(url);

            }, err => {
                this.showSpinner = false;
                const parse = JSON.parse(err);
                this.swalPopUpMsg(parse.data);
            });
        }
    }
    //#endregion btnView
}
