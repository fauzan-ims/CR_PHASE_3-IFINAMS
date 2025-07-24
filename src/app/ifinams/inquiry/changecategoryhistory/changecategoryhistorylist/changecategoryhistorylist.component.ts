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
    templateUrl: './changecategoryhistorylist.component.html'
})

export class ChangeCategoryHistoryListComponent extends BaseComponent implements OnInit {
    // variable
    public listchangecategory: any = [];
    public dataTamp: any = [];
    public lookupbranch: any = [];
    public lookuplocation: any = [];
    public status: any;
    public branch_code: any;
    private base64textString: string;
    private tamps = new Array();
    public tempFile: any;
    private dataTampPush: any[];
    private tempFileSize: any;

    //controller
    private APIController: String = 'ChangeCategoryHistory';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerLocation: String = 'MasterLocation';
    private APIControllerUpload: String = 'DisposalUpload';
    private APIControllerSysGlobalparam: String = 'SysGlobalparam';

    //routing
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteLookupLocation: String = 'GetRowsForLookupList';
    private APIRouteForDelete: String = 'DELETE';
    private APIRouteForUploadDataFile: String = 'UploadDataExcel';
    private APIRouteForDownload: String = 'DownloadFile';
    private RoleAccessCode = 'R00022170000000A';

    // form 2 way binding
    model: any = {};

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    // checklist
    public selectedAll: any;

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
        this.callGetrowDoc();
        this.status = 'ALL';
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
                    'p_company_code': this.company_code,
                    'p_branch_code': this.model.branch_code,
                    'p_location_code': this.model.location_code,
                    'p_status': this.status,
                })
                // end param tambahan untuk getrows dynamic

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall
                    this.listchangecategory = parse.data;

                    if (parse.data != null) {
                        this.listchangecategory.numberIndex = dtParameters.start;
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
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 9] }], // for disabled coloumn
            order: [['3', 'desc']],
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
        this.route.navigate(['/inquiry/subchangecategoryhistorylist/changecategoryhistorydetail', codeEdit]);
    }
    //#endregion button edit

    //#region ddl Status
    PageStatus(event: any) {
        this.status = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl Status

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

    btnClearLookupBranch() {
        this.model.branch_code = '';
        this.model.branch_name = '';
        this.model.location_code = '';
        this.model.description_location = '';
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
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerLocation, this.APIRouteLookupLocation).subscribe(resp => {
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

    btnClearLookupLocation() {
        this.model.location_code = '';
        this.model.description_location = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Location lookup

    //#region upload excel reader
    handleFile(event) {
        const binaryString = event.target.result;
        this.base64textString = btoa(binaryString);

        this.tamps.push({
            p_company_code: this.company_code,
            filename: this.tempFile,
            base64: this.base64textString
        });
    }

    onUploadReader(event) {
        const files = event.target.files;
        const file = files[0];

        if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
            this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
            $('#datatableregisterdocument').DataTable().ajax.reload();
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

        if (this.tempFile !== 'DISPOSALUPLOAD.XLSX' && this.tempFile !== 'disposal_upload.xlsx') {
            this.tempFile = '';
            swal({
                title: 'Warning',
                text: 'Invalid Template Name',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger',
                type: 'warning'
            }).catch(swal.noop)
            return;
        } else {
            this.showSpinner = true;
        }

        // param tambahan untuk getrole dynamic
        this.dataTampPush = [this.JSToNumberFloats({
            'p_company_code': this.company_code
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
                this.dalservice.Delete(this.dataTampPush, this.APIControllerUpload, this.APIRouteForDelete)
                    .subscribe(
                        resDelete => {
                            const parseDelete = JSON.parse(resDelete);
                        },
                        error => {
                            const parseDelete = JSON.parse(error);
                            this.swalPopUpMsg(parseDelete.data);
                        });

                this.dalservice.UploadFile(this.tamps, this.APIControllerUpload, this.APIRouteForUploadDataFile)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);

                            if (parse.result === 1) {
                                this.tamps = [];
                                this.showNotification('bottom', 'right', 'success');
                                $('#datatable').DataTable().ajax.reload();
                                this.tempFile = '';
                            } else {
                                this.swalPopUpMsg(parse.data);
                                $('#fileControl').val('');
                                $('#datatable').DataTable().ajax.reload();
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
            } else {
                this.showSpinner = false;
                $('#fileControl').val('');
                $('#datatable').DataTable().ajax.reload();
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
        this.dalservice.DownloadFile(this.APIControllerUpload, this.APIRouteForDownload).subscribe(res => {

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
    // #endregion btnDownload
}


