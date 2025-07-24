import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../DALservice.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './assetdetailmaintenancewizlist.component.html'
})

export class AssetDetailMaintenanceWizlistComponent extends BaseComponent implements OnInit {

    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public listassetmaintenance: any = [];
    public listassetmaintenancetemp: any = [];
    public lookupService: any = [];
    public lookupGenerate: any = [];
    public lookupModele: any = [];
    public dataTamp: any = [];
    public dataTamps: any = [];
    public model_code: any = [];
    public merk_code: any = [];
    public AssetMaintenanceData: any = [];
    private dataRoleTamp: any = [];
    private dataTampPush: any = [];
    public isBreak: Boolean = false;
    public listserviceduedate: any = [];
    private dataTampProceed: any = [];

    //controller
    private APIController: String = 'AssetMaintenanceSchedule';
    private APIControllerMasterModelDetail: String = 'MasterModelDetail';
    private APIControllerHeader: String = 'Asset';
    private APIControllerTemp: String = 'AssetMaintenanceTemp';


    //routing
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForDelete: String = 'DELETE';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdateDate: String = 'ExecSpForUpdateDate';
    private APIRouteForGetRowGenerate: String = 'GetRowForGenerate';
    private APIRouteForGenerate: String = 'ExecSpForGenerate';
    private APIRouteForGenerateMaster: String = 'ExecSpForGenerateMaster';
    private APIRouterLookupForGroupRoleDetail = 'GetRowsForLookupAssetMaintenance';
    private APIRouteForDeleteAssetMaintenance: String = 'ExecSpForDelete';
    private RoleAccessCode = 'R00021450000000A';

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    // form 2 way binding
    model: any = {};
    modeldetail: any = {};

    // checklist
    public selectedAll: any;
    private checkedList: any = [];
    private checkedLookup: any = [];
    public selectedAllLookup: any;

    // spinner
    showSpinner: Boolean = false;
    // end

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide('', this._elementRef, this.route);
        this.loadData();
        this.callGetrowHeader();
        this.loadDataGenerate()
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
                    'p_asset_code': this.param
                })
                // end param tambahan untuk getrows dynamic

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    this.listassetmaintenance = parse.data;

                    if (parse.data != null) {
                        this.listassetmaintenance.numberIndex = dtParameters.start;
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
            columnDefs: [{ orderable: false, width: '5%', targets: [0] }], // for disabled coloumn
            // order: [['2', 'asc']],
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region button save list
    btnSaveList() {
        this.listserviceduedate = [];
        let i = 0;

        const getID = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        const getDate = $('[name="p_maintenance_date"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {

            while (i < getDate.length) {
                let maintenancedate = null

                if (getDate[i] !== "") {
                    maintenancedate = this.dateFormatList(getDate[i]);
                }

                this.listserviceduedate.push({
                    p_id: getID[i],
                    p_maintenance_date: maintenancedate,
                });

                i++;
            }
            i++;
        }
        // this.dataTampProceed = [];
        // this.checkedList = [];
        // for (let i = 0; i < this.listassetmaintenance.length; i++) {
        //     if (this.listassetmaintenance[i].selected) {
        //         this.checkedList.push({
        //             'ID': this.listassetmaintenance[i].id,
        //             'Date': this.listassetmaintenance[i].maintenance_date
        //         })
        //     }
        // }

        let th = this;
        var j = 0;

        (function loopPoProceesProceed() {
            if (j < th.listserviceduedate.length) {
                th.dataTampProceed = [{
                    'p_id': th.listserviceduedate[j].p_id,
                    'p_maintenance_date': th.listserviceduedate[j].p_maintenance_date,
                    'action': '',
                }];
                th.dalservice.Update(th.dataTampProceed, th.APIController, th.APIRouteForUpdateDate)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                if (th.listserviceduedate.length == j + 1) {
                                    th.showNotification('bottom', 'right', 'success');
                                    $('#datatableMaintenance').DataTable().ajax.reload();
                                    th.showSpinner = false;
                                } else {
                                    j++;
                                    loopPoProceesProceed();
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
        //#region web service
        // this.dalservice.Update(this.listserviceduedate, this.APIController, this.APIRouteForUpdateDate)
        //     .subscribe(
        //         res => {
        //             const parse = JSON.parse(res);

        //             if (parse.result === 1) {
        //                 this.showNotification('bottom', 'right', 'success');

        //                 this.callGetrowHeader();
        //                 $('#datatableMaintenance').DataTable().ajax.reload();
        //             } else {
        //                 this.swalPopUpMsg(parse.data);
        //             }
        //         },
        //         error => {
        //             const parse = JSON.parse(error);
        //             this.swalPopUpMsg(parse.data);

        //         });
        //#endregion web service
    }

    //#region button Generate
    btnGenerate() {
        // param tambahan untuk button Proceed dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
            'p_model_code': this.modeldetail.model_code,
            'action': ''
        }];
        // param tambahan untuk button Proceed dynamic

        // call web service
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForGenerateMaster)
            .subscribe(
                ress => {
                    const parses = JSON.parse(ress);
                    if (parses.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatableMaintenance').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parses.data);
                    }
                },
                error => {
                    const parses = JSON.parse(error);
                    this.swalPopUpMsg(parses.data);
                });
    }
    //#endregion button Generate

    //#region button Generate Master
    btnGenerateMaster() {
        this.isBreak = false;
        this.checkedList = [];
        for (let i = 0; i < this.lookupGenerate.length; i++) {
            if (this.lookupGenerate[i].selected) {
                this.checkedList.push({
                    IdGenerate: this.lookupGenerate[i].id_generate,
                    ServiceCode: this.lookupGenerate[i].service_code,
                    ModelCode: this.lookupGenerate[i].model_code,
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
                this.dataTampPush = [];
                this.btnDelete();
                for (let J = 0; J < this.checkedList.length; J++) {
                    // param tambahan untuk getrow dynamic
                    this.dataTampPush = [{
                        'p_code': this.param,
                        'p_service_code': this.checkedList[J].ServiceCode,
                        'p_model_code': this.checkedList[J].ModelCode,
                    }];
                    // end param tambahan untuk getrow dynamic
                    this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteForGenerateMaster)
                        .subscribe(
                            ress => {
                                const parses = JSON.parse(ress);
                                if (parses.result === 1) {
                                    if (J + 1 === this.checkedList.length) {
                                        this.showSpinner = false;
                                        this.showNotification('bottom', 'right', 'success');
                                        $('#datatableMaintenance').DataTable().ajax.reload();
                                    }
                                } else {
                                    this.isBreak = true;
                                    this.showSpinner = false;
                                    $('#datatableMaintenance').DataTable().ajax.reload();
                                    this.swalPopUpMsg(parses.data);
                                }
                            },
                            error => {
                                this.isBreak = true;
                                this.showSpinner = false;
                                const parses = JSON.parse(error);
                                this.swalPopUpMsg(parses.data);
                            });
                }
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button Generate Master

    //#region header getrow data
    callGetrowHeader() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param,
        }]
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIControllerHeader, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    // const parsedata = parse.data[0];
                    const parsedata = this.getrowNgb(parse.data[0]);

                    // mapper dbtoui
                    Object.assign(this.modeldetail, parsedata);
                    // end mapper dbtoui
                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion getrow data Header

    //#region button reload
    btnReloadOutstanding() {
        this.callGetrowHeader();
    }
    //#endregion button reload

    //#region lookup Service
    btnLookupGenerateSchedule() {
        $('#datatableLookupService').DataTable().clear().destroy();
        $('#datatableLookupService').DataTable({
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
                    'p_model_code': this.model.model_code,
                    'p_asset_code': this.param,
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerMasterModelDetail, this.APIRouterLookupForGroupRoleDetail).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupService = parse.data;

                    if (parse.data != null) {
                        this.lookupService.numberIndex = dtParameters.start;
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
    //#endregion lookup Service

    //#region lookup close
    btnLookupClose() {
        this.loadData();
        this.btnLookupGenerateSchedule();
        this.loadDataGenerate();
    }
    //#endregion lookup close

    //#region checkbox all lookup
    btnSelectAllLookup() {
        this.checkedLookup = [];
        for (let i = 0; i < this.lookupService.length; i++) {
            if (this.lookupService[i].selectedLookup) {
                this.checkedLookup.push({
                    Id: this.lookupService[i].id,
                    serviceCode: this.lookupService[i].service_code,
                    modelCode: this.lookupService[i].model_code,
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
            const codeData = this.checkedLookup[J];
            this.dataTamp = [{
                'p_asset_code': this.param,
                'p_service_code': this.checkedLookup[J].serviceCode,
                'p_model_code': this.checkedLookup[J].modelCode
            }];
            // end param tambahan untuk getrow dynamic
            this.dalservice.Insert(this.dataTamp, this.APIControllerTemp, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            if (this.checkedLookup.length == J + 1) {
                                this.showNotification('bottom', 'right', 'success');
                                $('#datatableLookupService').DataTable().ajax.reload();
                                $('#datatableLookupGenerate').DataTable().ajax.reload();
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

    selectAllLookup() {
        for (let i = 0; i < this.lookupService.length; i++) {
            this.lookupService[i].selectedLookup = this.selectedAllLookup;
        }
    }

    checkIfAllLookupSelected() {
        this.selectedAllLookup = this.lookupService.every(function (item: any) {
            return item.selectedLookup === true;
        })
    }
    //#endregion checkbox all table

    //#region loaddata service generate
    loadDataGenerate() {
        $('#datatableLookupGenerate').DataTable().clear().destroy();
        $('#datatableLookupGenerate').DataTable({
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
                    'p_asset_code': this.param,
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerTemp, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupGenerate = parse.data;
                    if (parse.data != null) {
                        this.lookupGenerate.numberIndex = dtParameters.start;
                    }
                    // if use checkAll use this
                    $('#checkallGenerate').prop('checked', false);
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
    //#endregion loaddata service generate

    //#region checkbox Delete All
    btnDeleteAll() {
        this.checkedList = [];
        for (let i = 0; i < this.lookupGenerate.length; i++) {
            if (this.lookupGenerate[i].selected) {
                this.checkedList.push(this.lookupGenerate[i].id_generate);
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
                this.dataTampPush = [];
                for (let J = 0; J < this.checkedList.length; J++) {
                    const id = this.checkedList[J];
                    // param tambahan untuk getrow dynamic
                    this.dataTampPush = [{
                        'p_id': id
                    }];
                    // end param tambahan untuk getrow dynamic
                    this.dalservice.Delete(this.dataTampPush, this.APIControllerTemp, this.APIRouteForDelete)
                        .subscribe(
                            res => {
                                this.showSpinner = false;
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    if (this.checkedList.length == J + 1) {
                                        this.showNotification('bottom', 'right', 'success');
                                        $('#datatableLookupGenerate').DataTable().ajax.reload();
                                        this.btnLookupGenerateSchedule();
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
        for (let i = 0; i < this.lookupGenerate.length; i++) {
            this.lookupGenerate[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.lookupGenerate.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion checkbox Delete All

    //#region Delete Asset Maintenance
    btnDelete() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
            'action': 'default'
        }];
        // param tambahan untuk getrole dynamic

        // call web service
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForDeleteAssetMaintenance)
            .subscribe(
                res => {
                    this.showSpinner = false;
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        window.location.reload()
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
    //#endregion Delete Asset Maintenance
}


