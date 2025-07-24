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
    templateUrl: './mutationreceivelist.component.html'
})

export class MutationReceiveListComponent extends BaseComponent implements OnInit {

    // variable
    public listmutationreceive: any = [];
    public dataTamp: any = [];
    public dataTampGetrow: any = [];
    public lookupbranch: any = [];
    public lookuplocation: any = [];
    public system_date = new Date();
    public from_date: any = [];
    public to_date: any = [];
    public listdataList: any = [];
    public uploadFile: any = [];
    public tempFile: any;
    public status: any;
    public type: any;
    private tampDocumentCode: String;
    private tampMtCode: String;
    private base64textString: string;
    private tamps = new Array();
    private dataTampPush: any = [];
    private datauploadlist: any = [];
    private isFileName: Boolean = true;
    public isBreak: Boolean = false;
    public rptParam: any = [];
    public dataParam: any = [];
    private tempFileSize: any;

    //controller
    private APIController: String = 'Mutation';
    private APIControllerDetail: String = 'MutationDetail';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerLocation: String = 'MasterLocation';
    private APIControllerGlobalParam: String = 'GlobalParam';
    private APIControllerJournalDetail: String = 'JournalDetail';

    // report
    private APIControllerReport: String = 'Report';
    private APIRouteForDownloadReport: String = 'getReport';

    //routing
    private APIRouteForUploadFile: String = 'Upload';
    private APIRouteForGetRows: String = 'GetRowsReceive';
    private APIRouteForUnpost: String = 'ExecSpForUnpost';
    private APIRouteForPriviewFile: String = 'Priview';
    private APIRouteForGetDelete: String = 'Delete';
    private APIRouteForDeleteFile: String = 'Deletefile';
    private APIRouteForReceive: String = 'ExecSpForReceived';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteLookupLocation: String = 'GetRowsForLookupList';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForGetRowForThirdParty: String = 'GetRowForThirdParty';
    private APIRouteForCallThirdParty: String = 'CallThirdParty';
    private APIRouteForJournalDetail: String = 'GetRowsForThirdParty';
    private APIRouteForReturnJournal: String = 'ExecSpForReturnJournal';

    private RoleAccessCode = 'R00021630002164A';

    // form 2 way binding
    model: any = {};

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    // checklist
    public selectedAll: any;
    private checkedList: any = [];

    // spinner
    showSpinner: Boolean = false;
    getRouteparam: any;
    // end

    constructor(private dalservice: DALService,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        // this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide(this._location, this._elementRef, this.route);
        this.loadData();
        this.callGetrowDoc();
        this.status = 'ALL';
        this.type = 'FROM'
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
                    'p_branch_code': this.model.from_branch_code,
                    'p_location_code': this.model.from_location_code,
                    'p_filter_type': this.type,
                    'p_status_received': this.status,
                })
                // end param tambahan untuk getrows dynamic

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall
                    this.listmutationreceive = parse.data;

                    // if (parse.data.file_name == '' || parse.data.file_name == null) {
                    //     this.isFileName = true
                    // }
                    // else {
                    //     this.isFileName = false
                    // }


                    if (parse.data != null) {
                        this.listmutationreceive.numberIndex = dtParameters.start;
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
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 8, 11] }], // for disabled coloumn
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

        this.dalservice.Getrow(this.dataTamp, this.APIControllerGlobalParam, this.APIRouteForGetRow)
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
        this.model.from_branch_code = code;
        this.model.branch_name = description;
        this.model.from_location_code = '';
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
                    'p_branch_code': this.model.from_branch_code,
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
        this.model.from_location_code = code;
        this.model.description_location = description_location;
        $('#lookupModalLocation').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Location lookup

    //#region checkbox all table
    // btnDeleteAll() {
    //     this.checkedList = [];
    //     for (let i = 0; i < this.listmutationreceive.length; i++) {
    //         if (this.listmutationreceive[i].selected) {
    //             this.checkedList.push(this.listmutationreceive[i].id);
    //         }
    //     }

    //     // jika tidak di checklist
    //     if (this.checkedList.length === 0) {
    //         swal({
    //             title: this._listdialogconf,
    //             buttonsStyling: false,
    //             confirmButtonClass: 'btn btn-danger'
    //         }).catch(swal.noop)
    //         return
    //     }

    //     swal({
    //         title: 'Are you sure?',
    //         type: 'warning',
    //         showCancelButton: true,
    //         confirmButtonClass: 'btn btn-success',
    //         cancelButtonClass: 'btn btn-danger',
    //         confirmButtonText: this._deleteconf,

    //         buttonsStyling: false
    //     }).then((result) => {
    //         this.showSpinner = true;
    //         if (result.value) {
    //             this.dataTamp = [];
    //             for (let J = 0; J < this.checkedList.length; J++) {
    //                 const code = this.checkedList[J];
    //                 // param tambahan untuk getrow dynamic
    //                 this.dataTamp = [{
    //                     'p_id': code
    //                 }];
    //                 // end param tambahan untuk getrow dynamic

    //                 this.dalservice.Delete(this.dataTamp, this.APIController, this.APIRouteForGetDelete)
    //                     .subscribe(
    //                         res => {
    //                             const parse = JSON.parse(res);
    //                             if (parse.result === 1) {
    //                                 this.showNotification('bottom', 'right', 'success');
    //                                 $('#datatableaddress').DataTable().ajax.reload();
    //                                 window.parent.location.reload();
    //                                 this.showSpinner = false;
    //                             } else {
    //                                 this.swalPopUpMsg(parse.data);
    //                                 this.showSpinner = false;
    //                             }
    //                         },
    //                         error => {
    //                             const parse = JSON.parse(error);
    //                             this.swalPopUpMsg(parse.data);
    //                             this.showSpinner = false;
    //                         });
    //             }
    //         } else {
    //             this.showSpinner = false;
    //         }
    //     });
    // }

    // selectAllTable() {
    //     for (let i = 0; i < this.listmutationreceive.length; i++) {
    //         this.listmutationreceive[i].selected = this.selectedAll;
    //     }
    // }

    // checkIfAllTableSelected() {
    //     this.selectedAll = this.listmutationreceive.every(function (item: any) {
    //         return item.selected === true;
    //     })
    // }
    //#endregion checkbox all table

    //#region button Print Bast
    btnPrint() {
        this.isBreak = false;
        this.checkedList = [];
        for (let i = 0; i < this.listmutationreceive.length; i++) {
            if (this.listmutationreceive[i].selected) {
                this.checkedList.push({
                    'Code': this.listmutationreceive[i].code,
                    'AssetCode': this.listmutationreceive[i].asset_code
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
            this.showSpinner = true;
            if (result.value) {
                this.rptParam = [];
                this.dataParam = [];
                for (let J = 0; J < this.checkedList.length; J++) {
                    // param tambahan untuk getrow dynamic
                    this.rptParam = {
                        p_user_id: this.userId,
                        p_type: 'MUTATION',
                        p_agreement_no: this.checkedList[J].Code,
                        p_asset_code: this.checkedList[J].AssetCode,
                        p_print_option: 'PDF'
                    }
                    this.dataParam = {
                        TableName: 'RPT_CETAKAN_BAST',
                        SpName: 'xsp_rpt_cetakan_bast',
                        reportparameters: this.rptParam
                    };

                    this.dalservice.ReportFile(this.dataParam, this.APIControllerReport, this.APIRouteForDownloadReport).subscribe(res => {
                        this.printRptNonCore(res);
                        this.showSpinner = false;
                    }, err => {
                        const parse = JSON.parse(err);
                        this.swalPopUpMsg(parse.data);
                        this.showSpinner = false;
                    });
                    if (this.isBreak) {
                        break;
                    }
                }

            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button Print Bast

    //#region button Print Bast
    btnPrints() {
        this.isBreak = false;
        this.checkedList = [];
        for (let i = 0; i < this.listmutationreceive.length; i++) {
            if (this.listmutationreceive[i].selected) {
                this.checkedList.push(this.listmutationreceive[i].code);
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
            this.showSpinner = true;
            if (result.value) {
                this.rptParam = [];
                this.dataParam = [];
                for (let J = 0; J < this.checkedList.length; J++) {
                    // param tambahan untuk getrow dynamic
                    this.rptParam = {
                        p_user_id: this.userId,
                        p_type: 'MUTATION',
                        p_agreement_no: this.checkedList[J],
                        p_print_option: 'Excel'
                    }

                    this.dataParam = {
                        TableName: 'RPT_CETAKAN_BAST',
                        SpName: 'xsp_rpt_cetakan_bast',
                        reportparameters: this.rptParam
                    };

                    this.dalservice.ReportFile(this.dataParam, this.APIControllerReport, this.APIRouteForDownloadReport).subscribe(res => {
                        this.printRptNonCore(res);
                        this.showSpinner = false;
                    }, err => {
                        const parse = JSON.parse(err);
                        this.swalPopUpMsg(parse.data);
                        this.showSpinner = false;
                    });
                    if (this.isBreak) {
                        break;
                    }
                }

            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button Print Bast

    //#region btnReturn
    btnReturn() {
        this.checkedList = [];
        this.dataTampPush = [];
        this.datauploadlist = [];
        let j = 0;

        const getID = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        const getReturn = $('[name="p_remark"]')
            .map(function () { return $(this).val(); }).get();


        while (j < getID.length) {

            while (j < getReturn.length) {

                this.datauploadlist.push(
                    this.JSToNumberFloats({
                        p_id: getID[j],
                        p_remark_return: getReturn[j],
                    }));

                j++;
            }
            j++;
        }

        for (let i = 0; i < this.listmutationreceive.length; i++) {
            if (this.listmutationreceive[i].selected) {
                this.checkedList.push({
                    id: this.listmutationreceive[i].id,
                    remark_return: this.datauploadlist[i].p_remark_return,
                    remark_unpost: ''
                });
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
                for (let J = 0; J < this.checkedList.length; J++) {
                    this.dataTampPush = [this.JSToNumberFloats({
                        'p_id': this.checkedList[J].id,
                        'p_remark_return': this.checkedList[J].remark_return,
                        'p_remark_unpost': this.checkedList[J].remark_unpost
                    })];

                    // end param tambahan untuk getrow dynamic
                    this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteForUnpost)
                        .subscribe(
                            res => {
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    this.showNotification('bottom', 'right', 'success');
                                    $('#datatable').DataTable().ajax.reload();
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
                this.showSpinner = false;
            }
        });
    }
    //#endregion btnReturn

    //#region btnUnpost
    btnUnpost() {
        this.checkedList = [];
        this.dataTampPush = [];
        this.datauploadlist = [];
        let j = 0;

        const getID = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        const getUnpost = $('[name="p_remark"]')
            .map(function () { return $(this).val(); }).get();

        while (j < getID.length) {

            while (j < getUnpost.length) {

                this.datauploadlist.push(
                    this.JSToNumberFloats({
                        p_id: getID[j],
                        p_remark_unpost: getUnpost[j],
                    }));

                j++;
            }
            j++;
        }

        for (let i = 0; i < this.listmutationreceive.length; i++) {
            if (this.listmutationreceive[i].selected) {
                this.checkedList.push({
                    id: this.listmutationreceive[i].id,
                    remark_return: '',
                    remark_unpost: this.datauploadlist[i].p_remark_unpost
                });
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
                for (let J = 0; J < this.checkedList.length; J++) {
                    this.dataTampPush = [this.JSToNumberFloats({
                        'p_id': this.checkedList[J].id,
                        'p_remark_return': this.checkedList[J].remark_return,
                        'p_remark_unpost': this.checkedList[J].remark_unpost
                    })];

                    // end param tambahan untuk getrow dynamic
                    this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteForUnpost)
                        .subscribe(
                            res => {
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    this.showNotification('bottom', 'right', 'success');
                                    $('#datatable').DataTable().ajax.reload();
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
                this.showSpinner = false;
            }
        });
    }
    //#endregion btnUnpost

    //#region ddl Status
    PageStatus(event: any) {
        this.status = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl Status    

    //#region ddl Status
    PageType(event: any) {
        this.type = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl Status   

    //#region load all data Journal Detail
    loadDataJournalDetail() {
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
                    'p_branch_code': this.model.from_branch_code,
                    'p_location_code': this.model.from_location_code,
                    'p_status': this.status,
                })
                // end param tambahan untuk getrows dynamic                
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parseJournal = JSON.parse(resp);

                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall
                    callback({
                        draw: parseJournal.draw,
                        recordsTotal: parseJournal.recordsTotal,
                        recordsFiltered: parseJournal.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 7] }], // for disabled coloumn
            order: [['5', 'desc']],
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data Journal Detail

    //#region btnReceive
    btnReceive() {
        this.checkedList = [];
        this.dataTampPush = [];
        this.datauploadlist = [];
        let j = 0;
        this.showSpinner = true;

        const getFile = $('[name="p_file_name"]')
            .map(function () { return $(this).val(); }).get();


        // while (j < getFile.length) {

        // this.datauploadlist.push(
        //     this.JSToNumberFloats({
        //         // p_id: getID[j],
        //         p_file_name: this.tempFile //getFile[j],
        //         // p_file_paths: getPath[j],
        //     }));

        //     j++;

        // }
        for (let i = 0; i < this.listmutationreceive.length; i++) {
            if (this.listmutationreceive[i].selected) {
                this.checkedList.push({
                    id: this.listmutationreceive[i].id,
                    asset_code: this.listmutationreceive[i].asset_code,
                    // receiveDate: this.listmutationreceive[i].mutation_date,
                    // fileName: this.datauploadlist[i].p_file_name,
                    fileName: this.listmutationreceive[i].file_name,
                    code: this.listmutationreceive[i].code
                });
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
                this.showSpinner = true;
                this.dataTampPush = [];
                // for (let J = 0; J < this.checkedList.length; J++) {
                //     this.dataTampPush = [this.JSToNumberFloats({
                //         'p_id': this.checkedList[J].id,
                //         // 'p_receive_date': this.checkedList[J].receiveDate,
                //         'p_file_name': this.checkedList[J].fileName,
                //         'p_code': this.checkedList[J].code,
                //         'action': 'default'
                //     })];

                //     // for (let i = 0; i < this.tamps.length; i++) {
                //     //     this.uploadFile.push({
                //     //         p_header: 'PHOTO',
                //     //         p_child: this.checkedList[J].code,
                //     //         p_company_code: this.company_code,
                //     //         p_id: this.tampDocumentCode,
                //     //         p_file_paths: this.checkedList[J].code,
                //     //         p_file_name: this.tempFile,
                //     //         p_base64: this.base64textString
                //     //     });
                //     // }


                //     this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteForReceive)
                //         .subscribe(
                //             resDataMutationReceive => {
                //                 const parseDataMutationReceive = JSON.parse(resDataMutationReceive);

                //                 if (parseDataMutationReceive.result === 1) {
                //                     this.dataTamp = [{
                //                         'p_code': "AJT"
                //                     }];

                //                     this.dalservice.GetrowBam(this.dataTamp, this.APIControllerGlobalParam, this.APIRouteForGetRow)
                //                         .subscribe(
                //                             resGlobalParam => {
                //                                 const parseGlobalParam = JSON.parse(resGlobalParam);
                //                                 const parsedataGlobalParam = parseGlobalParam.data[0];

                //                                 this.dataTampGetrow = [{
                //                                     'p_code': this.checkedList[J].asset_code,
                //                                     'p_company_code': this.company_code
                //                                 }];

                //                                 this.dalservice.Getrow(this.dataTampGetrow, this.APIControllerJournalDetail, this.APIRouteForGetRowForThirdParty)
                //                                     .subscribe(
                //                                         resJournal => {
                //                                             const parseJournal = JSON.parse(resJournal);

                //                                             if (parseJournal.data !== 'This low value data cannot be processed') {
                //                                                 if (parseJournal.data.length > 0) {
                //                                                     const dataTampJournal = [{
                //                                                         'p_gl_link_transaction_code': parseJournal.data[0].code,
                //                                                         'p_company_code': this.company_code,
                //                                                         'action': 'getResponse'
                //                                                     }];
                //                                                     this.dalservice.ExecSp(dataTampJournal, this.APIControllerJournalDetail, this.APIRouteForJournalDetail)
                //                                                         .subscribe(
                //                                                             resJournalDetail => {
                //                                                                 const parseJournalDetail = JSON.parse(resJournalDetail);

                //                                                                 const JournalTrx = [];

                //                                                                 for (let i = 0; i < parseJournalDetail.data.length; i++) {
                //                                                                     JournalTrx.push({
                //                                                                         "LineDescr": parseJournalDetail.data[i].remarks,
                //                                                                         "DC": parseJournalDetail.data[i].d_c,
                //                                                                         "Amount": parseJournalDetail.data[i].base_amount_db,
                //                                                                         "COA": parseJournalDetail.data[i].gl_link_code,
                //                                                                         "COABranch": parseJournalDetail.data[i].branch_code,
                //                                                                         "CostCenter": parseJournalDetail.data[i].cost_center_code
                //                                                                     });
                //                                                                 }
                //                                                                 const dataJournal = {
                //                                                                     "body_req":
                //                                                                     {
                //                                                                         "OfficeCode": parseJournal.data[0].branch_code,
                //                                                                         "JrNo": parseJournal.data[0].code,
                //                                                                         "TrxCode": 'FAMMTT',
                //                                                                         "PeriodYear": parseJournal.data[0].period_year,
                //                                                                         "PeriodMonth": parseJournal.data[0].month_year,
                //                                                                         "ValueDate": parseJournal.data[0].transaction_value_date,
                //                                                                         "PostingDate": parseJournal.data[0].transaction_date,
                //                                                                         "RefNo": parseJournal.data[0].transaction_code,
                //                                                                         "JrAmt": parseJournal.data[0].base_amount_db,
                //                                                                         "JournalDetail": JournalTrx
                //                                                                     }, "url": parsedataGlobalParam.value
                //                                                                 };

                //                                                                 this.dalservice.CallThirdPartyAPI(dataJournal, this.APIController, this.APIRouteForCallThirdParty)
                //                                                                     .subscribe(
                //                                                                         resAPI => {
                //                                                                             const parseAPI = JSON.parse(resAPI);
                //                                                                             var resultCode;

                //                                                                             if (parseAPI.data.Code !== undefined) {
                //                                                                                 resultCode = parseAPI.data.Code;
                //                                                                             } else if (parseAPI.data.StatusCode !== undefined) {
                //                                                                                 resultCode = parseAPI.data.StatusCode;
                //                                                                             }

                //                                                                             if (resultCode === '1') {
                //                                                                                 this.showNotification('bottom', 'right', 'success');
                //                                                                                 $('#datatable').DataTable().ajax.reload();
                //                                                                                 this.showSpinner = false;
                //                                                                             } else {
                //                                                                                 this.returnJournal(this.dataTampGetrow);
                //                                                                                 var errorMsg;

                //                                                                                 if (parseAPI.data.ErrMsg !== undefined) {
                //                                                                                     errorMsg = parseAPI.data.ErrMsg;
                //                                                                                 } else if (parseAPI.data.ErrorMessage !== undefined) {
                //                                                                                     errorMsg = parseAPI.data.ErrorMessage;
                //                                                                                 }
                //                                                                                 this.swalPopUpMsg('V;' + errorMsg);
                //                                                                             }
                //                                                                         },
                //                                                                         error => {
                //                                                                             this.returnJournal(this.dataTampGetrow);
                //                                                                             const parseAPI = JSON.parse(error);
                //                                                                             this.swalPopUpMsg(parseAPI.data);
                //                                                                             this.showSpinner = false;
                //                                                                         });

                //                                                             },
                //                                                             error => {
                //                                                                 this.returnJournal(this.dataTampGetrow);
                //                                                                 const parses = JSON.parse(error);
                //                                                                 this.swalPopUpMsg(parses.data);
                //                                                                 this.showSpinner = false;
                //                                                             });
                //                                                 } else {
                //                                                     this.swalPopUpMsg('V; Jurnal Tidak Dapat Terbentuk. Silahkan Cek Kembali Setting Jurnal Anda ');
                //                                                     this.returnJournal(this.dataTampGetrow);
                //                                                     this.showSpinner = false;
                //                                                 }
                //                                             }
                //                                             else {
                //                                                 this.showSpinner = false;
                //                                             }
                //                                         },
                //                                         error => {
                //                                             this.returnJournal(this.dataTampGetrow);
                //                                             const parse = JSON.parse(error);
                //                                             this.swalPopUpMsg(parse.data);
                //                                             this.showSpinner = false;
                //                                         });
                //                             },
                //                             error => {
                //                                 const parse = JSON.parse(error);
                //                                 this.swalPopUpMsg(parse.data);
                //                                 this.showSpinner = false;
                //                             });

                //                     // if (this.tamps.length > 0) {

                //                     //     this.dalservice.UploadFile(this.uploadFile, this.APIControllerDetail, this.APIRouteForUploadFile)
                //                     //         .subscribe(
                //                     //             res => {
                //                     //                 const parse = JSON.parse(res);

                //                     //                 if (parse.result === 1) {
                //                     //                     this.showNotification('bottom', 'right', 'success');
                //                     //                     $('#datatable').DataTable().ajax.reload();
                //                     //                     this.showSpinner = false;
                //                     //                 } else {
                //                     //                     this.returnJournal(this.dataTampGetrow);
                //                     //                     this.swalPopUpMsg(parse.data);
                //                     //                     this.showSpinner = false;
                //                     //                 }
                //                     //             },
                //                     //             error => {
                //                     //                 this.returnJournal(this.dataTampGetrow);
                //                     //                 const parse = JSON.parse(error);
                //                     //                 this.swalPopUpMsg(parse.data);
                //                     //                 this.showSpinner = false;
                //                     //             });
                //                     // } else {
                //                     //     this.showNotification('bottom', 'right', 'success');
                //                     //     $('#datatable').DataTable().ajax.reload();
                //                     //     this.showSpinner = false;
                //                     // }
                //                 } else {
                //                     this.swalPopUpMsg(parseDataMutationReceive.data);
                //                     this.showSpinner = false;
                //                 }
                //             },
                //             error => {
                //                 this.showSpinner = false;
                //                 const parse = JSON.parse(error);
                //                 this.swalPopUpMsg(parse.data);
                //             });
                // }

                let vm = this;
                var J = 0;
                (function loopcheckedLookup() {
                    if (J < vm.checkedList.length) {
                        vm.dataTampPush = [vm.JSToNumberFloats({
                            'p_id': vm.checkedList[J].id,
                            // 'p_receive_date': vm.checkedList[J].receiveDate,
                            'p_file_name': vm.checkedList[J].fileName,
                            'p_code': vm.checkedList[J].code,
                            'action': 'default'
                        })];

                        vm.dalservice.ExecSp(vm.dataTampPush, vm.APIController, vm.APIRouteForReceive)
                            .subscribe(
                                resDataMutationReceive => {
                                    const parseDataMutationReceive = JSON.parse(resDataMutationReceive);


                                    if (parseDataMutationReceive.result === 1) {
                                        vm.dataTamp = [{
                                            'p_code': "AJT"
                                        }];

                                        vm.dalservice.GetrowBam(vm.dataTamp, vm.APIControllerGlobalParam, vm.APIRouteForGetRow)
                                            .subscribe(
                                                resGlobalParam => {
                                                    const parseGlobalParam = JSON.parse(resGlobalParam);
                                                    const parsedataGlobalParam = parseGlobalParam.data[0];

                                                    vm.dataTampGetrow = [{
                                                        'p_code': vm.checkedList[J].asset_code,
                                                        'p_company_code': vm.company_code
                                                    }];

                                                    vm.dalservice.Getrow(vm.dataTampGetrow, vm.APIControllerJournalDetail, vm.APIRouteForGetRowForThirdParty)
                                                        .subscribe(
                                                            resJournal => {
                                                                const parseJournal = JSON.parse(resJournal);

                                                                if (parseJournal.data !== 'This low value data cannot be processed') {
                                                                    if (parseJournal.data.length > 0) {
                                                                        const dataTampJournal = [{
                                                                            'p_gl_link_transaction_code': parseJournal.data[0].code,
                                                                            'p_company_code': vm.company_code,
                                                                            'action': 'getResponse'
                                                                        }];
                                                                        vm.dalservice.ExecSp(dataTampJournal, vm.APIControllerJournalDetail, vm.APIRouteForJournalDetail)
                                                                            .subscribe(
                                                                                resJournalDetail => {
                                                                                    const parseJournalDetail = JSON.parse(resJournalDetail);

                                                                                    const JournalTrx = [];

                                                                                    for (let i = 0; i < parseJournalDetail.data.length; i++) {
                                                                                        JournalTrx.push({
                                                                                            "LineDescr": parseJournalDetail.data[i].remarks,
                                                                                            "DC": parseJournalDetail.data[i].d_c,
                                                                                            "Amount": parseJournalDetail.data[i].base_amount_db,
                                                                                            "COA": parseJournalDetail.data[i].gl_link_code,
                                                                                            "COABranch": parseJournalDetail.data[i].branch_code,
                                                                                            "CostCenter": parseJournalDetail.data[i].cost_center_code
                                                                                        });
                                                                                    }
                                                                                    const dataJournal = {
                                                                                        "body_req":
                                                                                        {
                                                                                            "OfficeCode": parseJournal.data[0].branch_code,
                                                                                            "JrNo": parseJournal.data[0].code,
                                                                                            "TrxCode": 'FAMMTT',
                                                                                            "PeriodYear": parseJournal.data[0].period_year,
                                                                                            "PeriodMonth": parseJournal.data[0].month_year,
                                                                                            "ValueDate": parseJournal.data[0].transaction_value_date,
                                                                                            "PostingDate": parseJournal.data[0].transaction_date,
                                                                                            "RefNo": parseJournal.data[0].transaction_code,
                                                                                            "JrAmt": parseJournal.data[0].base_amount_db,
                                                                                            "JournalDetail": JournalTrx
                                                                                        }, "url": parsedataGlobalParam.value
                                                                                    };

                                                                                    vm.dalservice.CallThirdPartyAPI(dataJournal, vm.APIController, vm.APIRouteForCallThirdParty)
                                                                                        .subscribe(
                                                                                            resAPI => {
                                                                                                const parseAPI = JSON.parse(resAPI);
                                                                                                var resultCode;

                                                                                                if (parseAPI.data.Code !== undefined) {
                                                                                                    resultCode = parseAPI.data.Code;
                                                                                                } else if (parseAPI.data.StatusCode !== undefined) {
                                                                                                    resultCode = parseAPI.data.StatusCode;
                                                                                                }

                                                                                                if (resultCode === '1') {
                                                                                                    vm.showNotification('bottom', 'right', 'success');
                                                                                                    $('#datatable').DataTable().ajax.reload();
                                                                                                    vm.showSpinner = false;

                                                                                                    if (J + 1 === vm.checkedList.length) {
                                                                                                        vm.showNotification('bottom', 'right', 'success');
                                                                                                        $('#datatable').DataTable().ajax.reload();
                                                                                                        vm.showSpinner = false;
                                                                                                    } else {
                                                                                                        J++;
                                                                                                        loopcheckedLookup();
                                                                                                    }
                                                                                                } else {
                                                                                                    vm.returnJournal(vm.dataTampGetrow);
                                                                                                    var errorMsg;

                                                                                                    if (parseAPI.data.ErrMsg !== undefined) {
                                                                                                        errorMsg = parseAPI.data.ErrMsg;
                                                                                                    } else if (parseAPI.data.ErrorMessage !== undefined) {
                                                                                                        errorMsg = parseAPI.data.ErrorMessage;
                                                                                                    }
                                                                                                    vm.swalPopUpMsg('V;' + errorMsg);
                                                                                                }
                                                                                            },
                                                                                            error => {
                                                                                                vm.returnJournal(vm.dataTampGetrow);
                                                                                                const parseAPI = JSON.parse(error);
                                                                                                vm.swalPopUpMsg(parseAPI.data);
                                                                                                vm.showSpinner = false;
                                                                                            });

                                                                                },
                                                                                error => {
                                                                                    vm.returnJournal(vm.dataTampGetrow);
                                                                                    const parses = JSON.parse(error);
                                                                                    vm.swalPopUpMsg(parses.data);
                                                                                    vm.showSpinner = false;
                                                                                });
                                                                    } else {
                                                                        vm.swalPopUpMsg('V; Jurnal Tidak Dapat Terbentuk. Silahkan Cek Kembali Setting Jurnal Anda ');
                                                                        vm.returnJournal(vm.dataTampGetrow);
                                                                        vm.showSpinner = false;
                                                                    }
                                                                }
                                                                else {
                                                                    vm.showSpinner = false;
                                                                    vm.showNotification('bottom', 'right', 'success');
                                                                    $('#datatable').DataTable().ajax.reload();
                                                                }
                                                            },
                                                            error => {
                                                                vm.returnJournal(vm.dataTampGetrow);
                                                                const parse = JSON.parse(error);
                                                                vm.swalPopUpMsg(parse.data);
                                                                vm.showSpinner = false;
                                                            });
                                                },
                                                error => {
                                                    const parse = JSON.parse(error);
                                                    vm.swalPopUpMsg(parse.data);
                                                    vm.showSpinner = false;
                                                });
                                    } else {
                                        vm.swalPopUpMsg(parseDataMutationReceive.data);
                                        vm.showSpinner = false;
                                    }
                                },
                                error => {
                                    vm.showSpinner = false;
                                    const parse = JSON.parse(error);
                                    vm.swalPopUpMsg(parse.data);
                                });
                    }
                })();

            } else {
                this.showSpinner = false;
            }
        });
    }
    selectAllTable() {
        for (let i = 0; i < this.listmutationreceive.length; i++) {
            this.listmutationreceive[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listmutationreceive.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion btnReceive

    //#region returnJournal
    returnJournal(dataTampMutationReceiveData: any) {
        this.dalservice.ExecSp(dataTampMutationReceiveData, this.APIController, this.APIRouteForReturnJournal)
            .subscribe(
                resReturn => {
                    const parseReturn = JSON.parse(resReturn);
                    if (parseReturn.result === 1) {
                        $('#datatable').DataTable().ajax.reload();
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

    //#region button select image
    onUpload(event, code: String, mt_code: String) {
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
            this.tempFile = files[0].name;
            this.tampDocumentCode = code;
            this.tampMtCode = mt_code;
        }
    }
    //#endregion button select image

    //#region convert to base64
    handleFile(event) {
        this.showSpinner = true;
        const binaryString = event.target.result;
        this.base64textString = btoa(binaryString);

        this.tamps.push({
            p_module: 'IFINAMS',
            p_header: 'MUTATION',
            p_child: this.tampMtCode,
            p_id: this.tampDocumentCode,
            p_file_paths: this.tampDocumentCode,
            p_file_name: this.tempFile,
            p_base64: this.base64textString
        });

        this.dalservice.UploadFile(this.tamps, this.APIControllerDetail, this.APIRouteForUploadFile)
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
                    $('#datatable').DataTable().ajax.reload();
                    this.showNotification('bottom', 'right', 'success');
                },
                error => {
                    this.showSpinner = false;
                    this.tamps = new Array();
                    // tslint:disable-next-line:no-shadowed-variable
                    const parses = JSON.parse(error);
                    this.swalPopUpMsg(parses.message);
                    $('#datatable').DataTable().ajax.reload();
                });
    }
    //#endregion convert to base64

    //#region button priview image
    previewFile(row1, row2) {
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
                            const newTab = window.open();
                            newTab.document.body.innerHTML = this.pngFile(parse.value.data);
                        }
                        if (fileType === 'JPEG' || fileType === 'JPG') {
                            const newTab = window.open();
                            newTab.document.body.innerHTML = this.jpgFile(parse.value.data);
                        }
                        if (fileType === 'PDF') {
                            const newTab = window.open();
                            newTab.document.body.innerHTML = this.pdfFile(parse.value.data);
                        }
                        if (fileType === 'DOC') {
                            const newTab = window.open();
                            newTab.document.body.innerHTML = this.docFile(parse.value.data);
                        }
                    }
                }
            );
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
                                $('#datatable').DataTable().ajax.reload();
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

    //#region button edit
    btnEdit(codeEdit: string) {
        this.route.navigate(['/transaction/submutationreceive/opnamedetail', codeEdit]);
    }
    //#endregion button edit
}


