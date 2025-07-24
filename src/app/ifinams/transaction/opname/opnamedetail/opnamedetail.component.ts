import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../DALservice.service';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './opnamedetail.component.html'
})

export class OpnamedetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public OpnameData: any = [];
    public NumberOnlyPattern = this._numberonlyformat;
    public MasterBarcodeDetailData: any = [];
    public listopnamedetail: any = [];
    public generalsubcodelist: any = [];
    public isReadOnly: Boolean = false;
    public lookupbranch: any = [];
    public lookuppic: any = [];
    public lookuplocation: any = [];
    public setStyle: any = [];
    private dataTamp: any = [];
    private dataTampPush: any = [];
    private dataRoleTamp: any = [];
    public idDetailList: string;
    public listdataDetail: any = [];
    public readOnlyListDetail: string;
    public tempFile: any;
    private tampDocumentCode: String;
    private tamps = new Array();
    private base64textString: string;
    public uploadFile: any = [];
    public datauploadlist: any = [];
    public lookupdivision: any = [];
    public lookupdepartment: any = [];
    private tempFileSize: any;
    public lookupAssetDetail: any = [];
    public idlocation: String;
    public lookupOpnameDetail: any = [];
    public isReadOnlyDate: Boolean = false;
    public dataphotolist: any = [];
    public datedetail: String;
    public kmdetail: String;
    public conditiondetail: String;

    //controller
    private APIControllerSysGlobalparam: String = 'SysGlobalparam';
    private APIController: String = 'Opname';
    private APIControllerDetail: String = 'OpnameDetail';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerPIC: String = 'SysEmployeeMain';
    private APIControllerLocation: String = 'MasterLocation';
    private APIControllerDivision: String = 'SysDivision';
    private APIControllerDepartment: String = 'SysDepartment';
    private APIControllerAsset: String = 'Asset';

    //routing
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIControllerMasterLocation: String = 'MasterLocation';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForReject: String = 'ExecSpForReject';
    private APIRouteForReturn: String = 'ExecSpForReturn';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForDelete: String = 'DELETE';
    private APIRouteForPriviewFile: String = 'Priview';
    private APIRouteForDeleteFile: String = 'Deletefile';
    private APIRouteForUploadFile: String = 'Upload';
    private APIRouteForUpdateOpname: String = 'ExecSpForUpdateOpname';
    private APIRouteLookupForOpname: String = 'GetRowsForLookupOpname';
    private RoleAccessCode = 'R00021850000000A';

    // report
    private APIControllerReport: String = 'Report';
    private APIRouteForDownload: String = 'getReport';

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
        private _elementRef: ElementRef
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.Delimiter(this._elementRef);
        if (this.param != null) {
            this.isReadOnly = true;

            // call web service
            this.callGetrow();
            this.loadData();
            this.callGetrowDoc();
        } else {
            this.model.status = 'HOLD';
            this.showSpinner = false;
            this.model.company_code = this.company_code;
        }
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
                    'p_opname_code': this.param
                });
                // end param tambahan untuk getrows dynamic


                this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.listopnamedetail = parse.data;
                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    if (parse.data != null) {
                        this.listopnamedetail.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 8] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region Asset Detail Lookup
    btnLookupAssetDetail(code: any, branch_code: any) {
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
                    'p_branch_code': branch_code,
                });

                this.dalservice.GetrowsBam(dtParameters, this.APIControllerMasterLocation, this.APIRouteLookup).subscribe(resp => {
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
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 4] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }
    //#endregion Asset Detail Lookup

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

                    if (parsedata.status != 'ON PROCESS') {
                        this.isReadOnlyDate = true;
                    }
                    else {
                        this.isReadOnlyDate = false;
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

    //#region  form submit
    onFormSubmit(OpnameForm: NgForm, isValid: boolean) {
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

        this.OpnameData = this.JSToNumberFloats(OpnameForm);

        this.OpnameData.p_company_code = this.company_code;

        const usersJson: any[] = Array.of(this.OpnameData);
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
                            this.route.navigate(['/transaction/subopname/opnamedetail', parse.code]);
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
        this.route.navigate(['/transaction/subopname']);
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region checkbox all table
    btnDeleteAll() {
        this.showSpinner = true;
        this.checkedList = [];
        for (let i = 0; i < this.listopnamedetail.length; i++) {
            if (this.listopnamedetail[i].selected) {
                this.checkedList.push(this.listopnamedetail[i].id);
            }
        }

        // jika tidak di checklist
        if (this.checkedList.length === 0) {
            swal({
                title: this._listdialogconf,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger'
            }).catch(swal.noop)
            this.showSpinner = false;
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
                this.dataTampPush = [];
                for (let J = 0; J < this.checkedList.length; J++) {

                    // param tambahan untuk getrow dynamic
                    this.dataTampPush.push({
                        'p_id': this.checkedList[J]
                    });
                    // end param tambahan untuk getrow dynamic
                    this.dalservice.Delete(this.dataTampPush, this.APIControllerDetail, this.APIRouteForDelete)
                        .subscribe(
                            res => {
                                this.showSpinner = false;
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    if (this.checkedList.length == J + 1) {
                                        this.callGetrow();
                                        $('#datatables').DataTable().ajax.reload();
                                        this.showNotification('bottom', 'right', 'success');
                                    }
                                } else {
                                    this.swalPopUpMsg(parse.data);
                                }
                            },
                            error => {
                                const parse = JSON.parse(error);
                                this.swalPopUpMsg(parse.data);
                            });
                }

            } else {
                this.showSpinner = false;
            }
        });
    }

    selectAll() {
        for (let i = 0; i < this.listopnamedetail.length; i++) {
            if (this.listopnamedetail[i].bigger_than_effective_date !== '0') {
                this.listopnamedetail[i].selected = this.selectedAll;
            }
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listopnamedetail.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion checkbox all table

    //#region btnPost
    btnPost() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
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
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#reloadtabdetail', parent.parent.document).click();
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

    //#region Branch Lookup
    btnLookupPIC() {
        $('#datatableLookupPic').DataTable().clear().destroy();
        $('#datatableLookupPic').DataTable({
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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerPIC, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookuppic = parse.data;
                    if (parse.data != null) {
                        this.lookuppic.numberIndex = dtParameters.start;
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
    btnSelectRowPic(code: string, description: string) {
        this.model.pic_code = code;
        this.model.pic_name = description;
        this.model.location_code = '';
        this.model.description_location = '';
        $('#lookupModalPic').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Branch lookup

    //#region Location Lookup
    btnLookupLocation(id: any) {
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
                    'p_branch_code': 'ALL',
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

        this.idlocation = id;
    }

    btnSelectRowLocation(location_code: string, location_name: string) {
        // this.model.company_code = company_code;
        let tempLocation = [];
        tempLocation = [{
            'p_id': this.idlocation,
            'p_location_code': location_code,
            'p_location_name': location_name,
        }]
        this.dalservice.Update(tempLocation, this.APIControllerDetail, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.showSpinner = false;
                        // $('#datatable').DataTable().ajax.reload();
                        $('#datatables').DataTable().ajax.reload();
                        this.callGetrow();
                        this.showNotification('bottom', 'right', 'success');
                    } else {
                        this.showSpinner = false;
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data)
                });

        this.model.location_code = location_code;
        this.model.location_name = location_name;
        $('#lookupModalLocation').modal('hide');
        $('#datatables').DataTable().ajax.reload();
    }
    //#endregion Location lookup

    //#region Division Lookup
    btnLookupDivision() {
        $('#datatableLookupDivision').DataTable().clear().destroy();
        $('#datatableLookupDivision').DataTable({
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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerDivision, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupdivision = parse.data;
                    if (parse.data != null) {
                        this.lookupdivision.numberIndex = dtParameters.start;
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

    btnSelectRowDivision(code: string, description: string) {
        // this.model.company_code = company_code;
        this.model.division_code = code;
        this.model.division_name = description;
        this.model.department_code = '';
        this.model.department_name = '';
        this.model.sub_department_code = '';
        this.model.sub_department_name = '';
        this.model.units_code = '';
        this.model.units_name = '';
        $('#lookupModalDivision').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearDivision() {
        this.model.division_code = '';
        this.model.division_name = '';
        this.model.department_code = '';
        this.model.department_name = '';
        this.model.sub_department_code = '';
        this.model.sub_department_name = '';
        this.model.units_code = '';
        this.model.units_name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Division lookup

    //#region Department Lookup
    btnLookupDepartment() {
        $('#datatableLookupDepartment').DataTable().clear().destroy();
        $('#datatableLookupDepartment').DataTable({
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
                    'p_division_code': this.model.division_code
                });


                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerDepartment, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupdepartment = parse.data;
                    if (parse.data != null) {
                        this.lookupdepartment.numberIndex = dtParameters.start;
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

    btnSelectRowDepartment(code: string, description: string) {
        this.model.department_code = code;
        this.model.department_name = description;
        this.model.sub_department_code = '';
        this.model.sub_department_name = '';
        this.model.units_code = '';
        this.model.units_name = '';
        $('#lookupModalDepartment').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearDepartment() {
        this.model.department_code = '';
        this.model.department_name = '';
        this.model.sub_department_code = '';
        this.model.sub_department_name = '';
        this.model.units_code = '';
        this.model.units_name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Department lookup

    // #region Change Status
    changeStatus(status: any, id: any) {

        this.idDetailList = id;

        this.readOnlyListDetail = status.target.value;

        this.listdataDetail = [];

        var j = 0;

        var getID = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        var getLocation = $('[name="p_location_in"]')
            .map(function () { return $(this).val(); }).get();

        var getStatus = $('[name="p_condition_code"]')
            .map(function () { return $(this).val(); }).get();

        while (j < getID.length) {

            while (j < getLocation.length) {

                while (j < getStatus.length) {

                    if (getID[j] == this.idDetailList) {
                        if (getLocation[j] === '') {
                            getLocation[j] = undefined;
                        }
                        if (getStatus[j] === '') {
                            getStatus[j] = undefined;
                        }

                        this.listdataDetail = [{
                            p_id: getID[j],
                            p_location_in: getLocation[j],
                            p_condition_code: getStatus[j]
                        }];

                        //#region web service
                        this.dalservice.Update(this.listdataDetail, this.APIControllerDetail, this.APIRouteForUpdate)
                            .subscribe(
                                res => {
                                    const parse = JSON.parse(res);
                                    if (parse.result === 1) {
                                        $('#datatables').DataTable().ajax.reload();
                                    } else {
                                    }
                                },
                                error => {
                                    const parse = JSON.parse(error);
                                });
                        //#endregion web service
                    }
                    j++
                }
                j++;
            }
            j++;
        }
    }
    // #endregion Change Status

    // #region LocatedIn
    LocatedIn(status: any, id: any) {

        this.idDetailList = id;

        this.readOnlyListDetail = status.target.value;

        this.listdataDetail = [];

        var j = 0;

        var getID = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        var getLocation = $('[name="p_location_in"]')
            .map(function () { return $(this).val(); }).get();

        var getStatus = $('[name="p_condition_code"]')
            .map(function () { return $(this).val(); }).get();


        while (j < getID.length) {

            while (j < getLocation.length) {

                while (j < getStatus.length) {

                    if (getID[j] == this.idDetailList) {
                        if (getLocation[j] === '') {
                            getLocation[j] = undefined;
                        }
                        if (getStatus[j] === '') {
                            getStatus[j] = undefined;
                        }

                        this.listdataDetail = [{
                            p_id: getID[j],
                            p_location_in: getLocation[j],
                            p_condition_code: getStatus[j]
                        }];
                        //#region web service

                        this.dalservice.Update(this.listdataDetail, this.APIControllerDetail, this.APIRouteForUpdate)
                            .subscribe(
                                res => {
                                    const parse = JSON.parse(res);
                                    if (parse.result === 1) {
                                        // $('#datatables').DataTable().ajax.reload();
                                    } else {
                                    }
                                },
                                error => {
                                    const parse = JSON.parse(error);
                                });
                        //#endregion web service
                    }
                    j++
                }
                j++;
            }
            j++;
        }
    }
    // #endregion LocatedIn

    //#region button save in list
    btnSaveList() {
        this.showSpinner = true;
        this.datauploadlist = [];
        let j = 0;

        const getID = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        const getKM = $('[name="p_km"]')
            .map(function () { return $(this).val(); }).get();

        const getdate = $('[name="p_date"]')
            .map(function () { return $(this).val(); }).get();

        const getStatus = $('[name="p_condition_code"]')
            .map(function () { return $(this).val(); }).get();

        while (j < getID.length) {
            while (j < getStatus.length) {
                while (j < getKM.length) {
                    while (j < getdate.length) {
                        let date = null
                        if (getdate[j] !== "") {
                            date = this.dateFomatList(getdate[j]);
                        }
                        this.datauploadlist.push(
                            {
                                p_id: getID[j],
                                p_condition_code: getStatus[j],
                                p_km: getKM[j],
                                p_date: date,
                            }
                        );
                        j++
                    }
                    j++;
                }
                j++;
            }
            j++;
        }

        this.dataphotolist.p_file = []

        // tslint:disable-next-line: no-shadowed-variable
        for (let i = 0; i < this.tamps.length; i++) {
            this.dataphotolist.p_file.push({
                p_module: 'IFINAMS',
                p_header: 'PHOTO',
                p_child: this.param,
                p_id: this.tampDocumentCode,
                p_file_paths: this.param,
                p_file_name: this.tempFile,
                p_base64: this.base64textString
            });
        }
        //#region web service
        this.dalservice.Update(this.datauploadlist, this.APIControllerDetail, this.APIRouteForUpdateOpname)
            .subscribe(
                res => {
                    this.showSpinner = false;
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        // this.callGetrow();
                        // $('#datatables').DataTable().ajax.reload();
                        if (this.dataphotolist.p_file.length <= 0) {
                            this.showSpinner = false;
                            this.showNotification('bottom', 'right', 'success');
                            $('#datatables').DataTable().ajax.reload();
                        } else {
                            this.dalservice.UploadFile(this.dataphotolist.p_file, this.APIControllerDetail, this.APIRouteForUploadFile)
                                .subscribe(
                                    res => {
                                        const parse = JSON.parse(res);
                                        if (parse.result === 1) {
                                            this.showSpinner = false;
                                            this.showNotification('bottom', 'right', 'success');
                                            $('#datatables').DataTable().ajax.reload();
                                        } else {
                                            this.swalPopUpMsg(parse.data);
                                        }
                                    },
                                    error => {
                                        this.showSpinner = false;
                                        const parse = JSON.parse(error);
                                        this.swalPopUpMsg(parse.data);
                                    });
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
    //#endregion button save in list

    //#region button select image
    onUpload(event, code: String) {
        const files = event.target.files;
        const file = files[0];

        if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
            this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
            // $('#datatableReceiveDetail').DataTable().ajax.reload();
        } else {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();

                reader.readAsDataURL(event.target.files[0]); // read file as data url

                reader.onload = (event) => {
                    reader.onload = this.handleFile.bind(this);
                    reader.readAsBinaryString(file);
                }
            }
        }
        this.tempFile = files[0].name;
        this.tampDocumentCode = code;
    }
    //#endregion button select image

    //#region button priview image
    previewFile(row1, row2) {
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
                        if (fileType === 'DOC') {
                            const newTab = window.open();
                            newTab.document.body.innerHTML = this.docFile(parse.value.data);
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

    //#region button previewFileList
    previewFileList(row1, row2) {
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
                            this.pngFileList(parse.value.data);
                        }
                        if (fileType === 'JPEG' || fileType === 'JPG') {
                            this.jpgFileList(parse.value.data);
                        }
                    }
                }
            );
    }
    //#endregion button previewFileList

    //#region button delete image
    deleteImage(code: String, file_name: any, paths: any) {
        const usersJson: any[] = Array.of();
        usersJson.push({
            'p_id': code,
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
            if (result.value) {

                this.dalservice.DeleteFile(usersJson, this.APIControllerDetail, this.APIRouteForDeleteFile)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                $('#datatables').DataTable().ajax.reload();
                                this.tamps = [];
                            } else {
                                this.swalPopUpMsg(parse.data);
                            }
                        },
                        error => {
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data);
                        });
            }
        });
    }
    //#endregion button delete image

    //#region convert to base64
    handleFile(event) {
        const binaryString = event.target.result;
        this.base64textString = btoa(binaryString);

        this.tamps.push({
            p_module: 'IFINAMS',
            p_header: 'PHOTO',
            p_child: this.param,
            p_id: this.tampDocumentCode,
            p_file_paths: this.param,
            p_file_name: this.tempFile,
            p_base64: this.base64textString
        });

        // this.dalservice.UploadFile(this.tamps, this.APIControllerDetail, this.APIRouteForUploadFile)
        //     .subscribe(
        //         // tslint:disable-next-line:no-shadowed-variable
        //         res => {
        //             this.tamps = new Array();
        //             // tslint:disable-next-line:no-shadowed-variable
        //             const parses = JSON.parse(res);
        //             if (parses.result === 1) {
        //                 this.showSpinner = false;
        //             } else {
        //                 this.showSpinner = false;
        //                 this.swalPopUpMsg(parses.message);
        //             }
        //             $('#datatables').DataTable().ajax.reload();
        //             this.showNotification('bottom', 'right', 'success');
        //         },
        //         error => {
        //             this.showSpinner = false;
        //             this.tamps = new Array();
        //             // tslint:disable-next-line:no-shadowed-variable
        //             const parses = JSON.parse(error);
        //             this.swalPopUpMsg(parses.message);
        //             $('#datatables').DataTable().ajax.reload();
        //         });
    }
    //#endregion convert to base64    

    //#region button print
    btnPrintGeneralCheck() {
        this.showSpinner = true;

        const dataParam = {
            TableName: 'rpt_form_general_check',
            SpName: 'xsp_rpt_form_general_check',
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

    //#region lookup Opname Asset
    btnLookupOpnameDetail() {
        $('#datatableOpnameDetail').DataTable().clear().destroy();
        $('#datatableOpnameDetail').DataTable({
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
                    'p_code': this.param,
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerAsset, this.APIRouteLookupForOpname).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupOpnameDetail = parse.data;
                    if (parse.data != null) {
                        this.lookupOpnameDetail.numberIndex = dtParameters.start;
                    }
                    // if use checkAll use this
                    $('#checkallLookup').prop('checked', false);
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
        });
    }
    //#endregion lookup Opname Asset

    //#region lookup close
    btnLookupClose() {
        this.loadData();
    }
    //#endregion lookup close

    //#region checkbox all lookup
    btnSelectAllLookup() {
        this.checkedLookup = [];
        for (let i = 0; i < this.lookupOpnameDetail.length; i++) {
            if (this.lookupOpnameDetail[i].selectedLookup) {
                // this.checkedLookup.push(this.lookupDisposalAsset[i].code);
                this.checkedLookup.push({
                    assetCode: this.lookupOpnameDetail[i].code,
                    locationCode: this.lookupOpnameDetail[i].last_location_code,
                    locationName: this.lookupOpnameDetail[i].last_location_name,
                });
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
            // const codeData = this.checkedLookup[J];
            this.dataTamp = [{
                'p_opname_code': this.param,
                'p_asset_code': this.checkedLookup[J].assetCode,
                'p_branch_code': this.model.branch_code,
                'p_branch_name': this.model.branch_name,
                'p_location_code': this.checkedLookup[J].locationCode,
                'p_location_in': this.checkedLookup[J].locationName,
                'p_condition_code': '',
            }];
            // end param tambahan untuk getrow dynamic
            this.dalservice.Insert(this.dataTamp, this.APIControllerDetail, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            if (this.checkedLookup.length == J + 1) {
                                $('#datatables').DataTable().ajax.reload();
                                $('#datatableOpnameDetail').DataTable().ajax.reload();
                                $('#reloadHeader').click();
                                this.showNotification('bottom', 'right', 'success');
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
                    }
                );
        }
    }

    selectAllLookup() {
        for (let i = 0; i < this.lookupOpnameDetail.length; i++) {
            this.lookupOpnameDetail[i].selectedLookup = this.selectedAllLookup;
        }
    }

    checkIfAllLookupSelected() {
        this.selectedAllLookup = this.lookupOpnameDetail.every(function (item: any) {
            return item.selectedLookup === true;
        })
    }
    //#endregion checkbox all table
}

