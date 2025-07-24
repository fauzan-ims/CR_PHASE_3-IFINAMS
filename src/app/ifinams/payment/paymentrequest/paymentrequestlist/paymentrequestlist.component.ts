import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe, Location } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './paymentrequestlist.component.html'
})

export class PaymentrequstlistComponent extends BaseComponent implements OnInit {
    // variable
    public listpaymentrequest: any = [];
    public lookupSysBranch: any = [];
    public tampStatus: String;
    public branchCode: String;
    public branchName: String;
    private dataTampPush: any = [];
    private dataTampProceed: any = [];
    private dataTamp: any = [];
    datePipe: DatePipe = new DatePipe('en-US');

    //controller
    private APIController: String = 'PaymentRequest';
    private APIControllerSysBranch: String = 'SysBranch';
    //router


    // API Function
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private RoleAccessCode = 'R00023970000001A';

    // checklist
    public selectedAll: any;
    public checkedList: any = [];

    // form 2 way binding
    model: any = {};

    // spinner
    showSpinner: Boolean = false;
    // end

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _location: Location,
        public datepipe: DatePipe,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide(this._location, this._elementRef, this.route);
        this.tampStatus = 'HOLD';
        this.loadData();
    }

    //#region ddl PageStatus
    PageStatus(event: any) {
        this.tampStatus = event.target.value;
        $('#datatablepaymentrequestlist').DataTable().ajax.reload();
    }
    //#endregion ddl PageStatus

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

                    'p_branch_code': this.branchCode,
                    'p_payment_status': this.tampStatus
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)

                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    this.listpaymentrequest = parse.data;
                    if (parse.data != null) {
                        this.listpaymentrequest.numberIndex = dtParameters.start;
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

    //#region Proceed
    btnProceed() {
        var FlagDate = new Date();
        let latest_date = this.datepipe.transform(FlagDate, 'yyyy-MM-dd HH:mm:ss');

        this.dataTampProceed = [];
        this.checkedList = [];
        for (let i = 0; i < this.listpaymentrequest.length; i++) {
            if (this.listpaymentrequest[i].selected) {
                this.checkedList.push({
                    'Code': this.listpaymentrequest[i].code,
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
            setTimeout(() => {

                if (result.value) {

                    let th = this;
                    var i = 0;
                    (function loopProcurementProceed() {
                        if (i < th.checkedList.length) {
                            th.dataTampProceed = [{
                                'p_code': th.checkedList[i].Code,
                                'p_date_flag': latest_date,
                                'action': ''
                            }];
                            //Proceed data dan insert into quotation / supplier selection
                            th.dalservice.ExecSp(th.dataTampProceed, th.APIController, th.APIRouteForProceed)
                                .subscribe(
                                    res => {
                                        const parse = JSON.parse(res);
                                        if (parse.result === 1) {
                                            if (th.checkedList.length == i + 1) {
                                                th.showNotification('bottom', 'right', 'success');
                                                $('#datatablepaymentrequestlist').DataTable().ajax.reload();
                                                th.showSpinner = false;
                                            } else {
                                                i++;
                                                loopProcurementProceed();
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
            }, 500);
        });
    }

    selectAllTable() {
        for (let i = 0; i < this.listpaymentrequest.length; i++) {
            this.listpaymentrequest[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listpaymentrequest.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion Proceed

    //#region Branch Name
    btnLookupSysBranch() {
        $('#datatableLookupSysBranch').DataTable().clear().destroy();
        $('#datatableLookupSysBranch').DataTable({
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
                    'default': ''
                });
                this.dalservice.GetrowsBase(dtParameters, this.APIControllerSysBranch, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupSysBranch = parse.data;
                    this.lookupSysBranch.numberIndex = dtParameters.start;
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    })
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

    btnSelectRowSysBranch(code: String, name: String) {
        this.branchCode = code;
        this.branchName = name;
        $('#lookupModalSysBranch').modal('hide');
        $('#datatablepaymentrequestlist').DataTable().ajax.reload();
    }

    btnClearBranch() {
        this.branchCode = '';
        this.branchName = '';
        $('#datatablepaymentrequestlist').DataTable().ajax.reload();
    }
    //#endregion Branch Name
}
