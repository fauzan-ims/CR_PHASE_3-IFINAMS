import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './monitoringmaintenancelist.component.html'
})

export class MonitoringMaintenancelistComponent extends BaseComponent implements OnInit {
    // variable
    public listmonitoring: any = [];
    public tampStatus: String;
    private dataTampPush: any = [];
    public lookupbranch: any = [];
    public branch_code: any;
    private dataTampProceed: any = [];
    private dataTamp: any = [];
    public system_date = new Date();
    public to_date: any = [];
    public from_date: any = [];
    private SystemDate: any;
    private SystemDate2: any;


    //controller
    private APIController: String = 'Asset';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerSysGlobalparam: String = 'SysGlobalparam';

    //router
    private APIRouteForMonitoringGetRows: String = 'GetRowsMonitoringMaintenance';
    private APIRouteForProceed: String = 'ExecSpForGetProceedMonitoringMaintenance';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForGetRow: String = 'GetRow';
    private RoleAccessCode = 'R00023830000001A';

    // checklist
    public selectedAll: any;
    public checkedList: any = [];

    // form 2 way binding
    model: any = {};

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
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide(this._location, this._elementRef, this.route);
        this.loadData();
        this.model.from_date = '';
        this.model.to_date = '';
        // this.Date();
        this.callGetrowDoc();
    }

    //#region getrow data
    callGetrowDoc() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': 'SYSDATE'
        }];
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIControllerSysGlobalparam, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    this.SystemDate = parsedata.value
                    this.SystemDate2 = parsedata.star_month

                    this.model.from_date = this.SystemDate2
                    this.model.to_date = this.SystemDate

                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion getrow data

    //#region ddl PageStatus
    PageStatus(event: any) {
        this.tampStatus = event.target.value;
        $('#datatablemonitoringlist').DataTable().ajax.reload();
    }
    //#endregion ddl PageStatus

    //#region ddl from date
    FromDate(event: any) {
        this.model.from_date = event;
        var fromDate = event.singleDate.formatted;
        if (fromDate == '') {
            this.model.from_date = undefined;
        } else {
            this.model.from_date = event;
        }
        $('#datatablemonitoringlist').DataTable().ajax.reload();
    }
    //#endregion ddl from date

    //#region ddl to date
    // ToDate(event: any) {
    //     this.model.to_date = event;
    //     var toDate = event.singleDate.formatted;
    //     // console.log(fromDate)
    //     if (toDate == '') {
    //         this.model.to_date = undefined;
    //     } else {
    //         this.model.to_date = event;
    //     }
    //     $('#datatablemonitoringlist').DataTable().ajax.reload();
    // }
    //#endregion ddl to date

    //#region ddl from date
    // FromDate(event: any) {
    //     this.model.from_date = event;
    //     $('#datatablemonitoringlist').DataTable().ajax.reload();
    // }
    //#endregion ddl from date

    //#region ddl to date
    ToDate(event: any) {
        this.model.to_date = event;
        $('#datatablemonitoringlist').DataTable().ajax.reload();
    }
    //#endregion ddl to date

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
                let paramTamps = {};
                paramTamps = {
                    'p_branch_code': this.model.branch_code,
                    'p_from_date': this.model.from_date,
                    'p_to_date': this.model.to_date,
                };
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForMonitoringGetRows).subscribe(resp => {
                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    const parse = JSON.parse(resp);
                    this.listmonitoring = parse.data;
                    if (parse.data != null) {
                        this.listmonitoring.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                    this.showSpinner = false;
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

    //#region Proceed
    // btnProceed() {
    //     this.checkedList = [];
    //     for (let i = 0; i < this.listmonitoring.length; i++) {
    //         if (this.listmonitoring[i].selected) {
    //             this.checkedList.push(this.listmonitoring[i].code);
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

    //     this.dataTampPush = [];
    //     for (let J = 0; J < this.checkedList.length; J++) {
    //         const code = this.checkedList[J];
    //         // param tambahan untuk getrow dynamic
    //         this.dataTampPush.push({
    //             'p_code': code,
    //             'p_document_type': this.tampStatus

    //         });
    //         // end param tambahan untuk getrow dynamic
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
    //             this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteForProceed)
    //                 .subscribe(
    //                     res => {
    //                         const parse = JSON.parse(res);
    //                         if (parse.result === 1) {
    //                             this.showSpinner = false;
    //                             this.showNotification('bottom', 'right', 'success');
    //                             $('#datatablemonitoringlist').DataTable().ajax.reload();
    //                         } else {
    //                             this.showSpinner = false;
    //                             this.swalPopUpMsg(parse.data);
    //                         }
    //                     },
    //                     error => {
    //                         this.showSpinner = false;
    //                         const parse = JSON.parse(error);
    //                         this.swalPopUpMsg(parse.data);
    //                     })
    //         }
    //         else {
    //             this.showSpinner = false;
    //         }
    //     });
    // }

    //#region btn proceed
    btnProceed() {
        this.dataTampProceed = [];
        this.checkedList = [];
        for (let i = 0; i < this.listmonitoring.length; i++) {
            if (this.listmonitoring[i].selected) {
                this.checkedList.push({
                    'ID': this.listmonitoring[i].code,
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
        this.dataTamp = [];
        swal({
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

                let th = this;
                var i = 0;
                (function loopPoProceesProceed() {
                    if (i < th.checkedList.length) {
                        th.dataTampProceed = [{
                            'p_code': th.checkedList[i].ID,
                            'action': '',
                        }];
                        th.dalservice.ExecSp(th.dataTampProceed, th.APIController, th.APIRouteForProceed)
                            .subscribe(
                                res => {
                                    const parse = JSON.parse(res);
                                    if (parse.result === 1) {
                                        if (th.checkedList.length == i + 1) {
                                            th.showNotification('bottom', 'right', 'success');
                                            $('#datatablemonitoringlist').DataTable().ajax.reload();
                                            th.showSpinner = false;
                                        } else {
                                            i++;
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
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion btn proceed

    selectAllTable() {
        for (let i = 0; i < this.listmonitoring.length; i++) {
            this.listmonitoring[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listmonitoring.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion Proceed

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
        $('#datatablemonitoringlist').DataTable().ajax.reload();
    }

    btnClearBranch() {
        this.model.branch_code = undefined;
        this.model.branch_name = undefined;
        $('#datatablemonitoringlist').DataTable().ajax.reload();
    }
    //#endregion Branch lookup

    //#region currentDate
    Date() {
        let day: any = this.system_date.getDate();
        let today: any = 1;
        let from_month: any = this.system_date.getMonth() + 1;
        let to_month: any = this.system_date.getMonth() + 2;
        let year: any = this.system_date.getFullYear();

        if (day < 10) {
            day = '0' + day.toString();
        }
        if (from_month < 10) {
            from_month = '0' + from_month.toString();
        }
        if (to_month < 10) {
            to_month = '0' + to_month.toString();
        }

        this.from_date = { 'year': ~~year, 'month': ~~from_month, 'day': ~~today.toString() };
        const obj = {
            dateRange: null,
            isRange: false,
            singleDate: {
                date: this.from_date,
                // epoc: 1600102800,
                formatted: today.toString() + '/' + from_month + '/' + year,
                // jsDate: new Date(dob[key])
            }
        }

        this.to_date = { 'year': ~~year, 'month': ~~from_month, 'day': ~~day.toString() };
        const obj2 = {
            dateRange: null,
            isRange: false,
            singleDate: {
                date: this.to_date,
                // epoc: 1600102800,
                formatted: day.toString() + '/' + from_month + '/' + year,
                // jsDate: new Date(dob[key])
            }
        }

        this.model.from_date = obj
        this.model.to_date = obj2
    }
    //#endregion currentDate
}
