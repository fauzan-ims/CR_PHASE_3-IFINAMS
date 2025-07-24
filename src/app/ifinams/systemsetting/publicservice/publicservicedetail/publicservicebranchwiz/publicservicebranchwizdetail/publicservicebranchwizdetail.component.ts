
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import { DatePipe } from '@angular/common';



@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './publicservicebranchwizdetail.component.html'
})


export class PublicservicebranchdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public publicserviceBranchData: any = [];
    public lookupbranch: any = [];
    public listpublicservicebranchservice: any = [];
    public listdataBranchDetail: any = [];
    public isReadOnly: Boolean = false;
    public isBreak: Boolean = false;

    private dataRoleTamp: any = [];
    private dataTamp: any = [];
    private dataTampPush: any = [];
    public lookupsysgeneralsubcode: any = [];
    private RoleAccessCode = 'R00021430000000A';

    // API Controller
    private APIController: String = 'MasterPublicServiceBranch';
    private APIControllerMasterPublicServiceBranchService: String = 'MasterPublicServiceBranchService';
    private APIControllerSysBranch: String = 'SysBranch';

    // API Function
    private APIRouteForGetRowsForMasterPublicServiceBranchService: String = 'GetRows';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForDelete: String = 'DELETE';

    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIControllerSubCode: String = 'SysGeneralSubCode';
    private APIRouteLookupSubCode: String = 'GetRowsForLookupServiceDetailBranch';

    // checklist
    public selectedAll: any;
    private checkedList: any = [];

    // checklist Lookup
    public selectedAllLookup: any;
    public checkedLookup: any = [];

    // form 2 way binding
    model: any = {};

    // spinner
    showSpinner: Boolean = true;
    // end

    // datatable
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _elementRef: ElementRef, private datePipe: DatePipe
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

        if (this.params != null) {
            this.isReadOnly = true;
            this.wizard();

            // call web service
            this.callGetrow();
            this.loadData();
        } else {
            this.model.id = this.param;
            this.showSpinner = false;
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
                // param tambahan untuk getrow dynamic
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_public_service_branch_code': this.params
                });
                // end param tambahan untuk getrow dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerMasterPublicServiceBranchService, this.APIRouteForGetRowsForMasterPublicServiceBranchService).subscribe(resp => {
                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    const parse = JSON.parse(resp)
                    this.listpublicservicebranchservice = parse.data;
                    this.listpublicservicebranchservice.numberIndex = dtParameters.start;

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

    //#region lookup btnLookupSysGeneralSubcode
    btnLookupSysGeneralSubcode() {
        $('#datatablelookupSysGeneralSubcode').DataTable().clear().destroy();
        $('#datatablelookupSysGeneralSubcode').DataTable({
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
                    'p_public_service_branch_code': this.params,
                });
                // end param tambahan untuk getrows dynamic
                // tslint:disable-next-line:max-line-length
                this.dalservice.Getrows(dtParameters, this.APIControllerSubCode, this.APIRouteLookupSubCode).subscribe(resp => {
                    // if use checkAll use this
                    $('#checkallLookup').prop('checked', false);
                    // end checkall

                    const parse = JSON.parse(resp);
                    this.lookupsysgeneralsubcode = parse.data;
                    this.lookupsysgeneralsubcode.numberIndex = dtParameters.start;

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
    //#endregion lookup btnLookupSysGeneralSubcode

    //#region checkbox all lookup
    btnSelectAllLookup() {
        this.isBreak = false;
        this.checkedLookup = [];
        for (let i = 0; i < this.lookupsysgeneralsubcode.length; i++) {
            if (this.lookupsysgeneralsubcode[i].selectedLookup) {
                this.checkedLookup.push(this.lookupsysgeneralsubcode[i].code);
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
        } else {
            this.showSpinner = true;
        }

        this.dataTampPush = [];
        for (let J = 0; J < this.checkedLookup.length; J++) {
            this.dataTampPush = [{
                'p_service_code': this.checkedLookup[J],
                'p_public_service_branch_code': this.params,
                'p_estimate_finish_day': 0,
            }];
            // end param tambahan untuk getrow dynamic            
            this.dalservice.Insert(this.dataTampPush, this.APIControllerMasterPublicServiceBranchService, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            if (J + 1 === this.checkedLookup.length) {
                                this.showSpinner = false;
                                this.showNotification('bottom', 'right', 'success');
                                $('#datatablessss').DataTable().ajax.reload();
                                $('#datatablelookupSysGeneralSubcode').DataTable().ajax.reload();
                            }
                        } else {
                            this.isBreak = true;
                            $('#datatablelookupSysGeneralSubcode').DataTable().ajax.reload();
                            $('#datatablessss').DataTable().ajax.reload();
                            this.showSpinner = false;
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        this.isBreak = true;
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                    })
            if (this.isBreak) {
                break;
            }
        }
    }

    selectAllLookup() {
        for (let i = 0; i < this.lookupsysgeneralsubcode.length; i++) {
            this.lookupsysgeneralsubcode[i].selectedLookup = this.lookupsysgeneralsubcode;
        }
    }

    checkIfAllLookupSelected() {
        this.selectedAllLookup = this.lookupsysgeneralsubcode.every(function (item: any) {
            return item.selectedLookup === true;
        })
    }
    //#endregion checkbox all table

    //#region publicserviceBranchDetail getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.params,
        }];
        // end param tambahan untuk getrow dynamics
        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = parse.data[0];

                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui

                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion publicserviceBranchDetail getrow data

    //#region publicserviceBranchDetail form submit
    onFormSubmit(publicservicebranchForm: NgForm, isValid: boolean) {
        // validation form submit
        if (!isValid) {
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

        this.publicserviceBranchData = publicservicebranchForm;
        if (this.publicserviceBranchData.p_is_default == null) {
            this.publicserviceBranchData.p_is_default = false;
        }

        this.publicserviceBranchData.p_public_service_code = this.param;
        const usersJson: any[] = Array.of(this.publicserviceBranchData);

        if (this.params != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('datatablessss', 'right', 'success');
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
                            this.showNotification('datatablessss', 'right', 'success');
                            this.route.navigate(['/systemsetting/subpublicservice/publicservicedetail/' + this.param + '/publicservicebranchlist/' + this.param + '/publicservicebranchdetail', this.param, parse.code], { skipLocationChange: true });
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
    //#endregion publicserviceBranchDetail form submit

    //#region button save in list
    saveList() {

        this.listdataBranchDetail = [];

        var i = 0;

        // let i = 0;

        var getID = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        var getFeeAmount = $('[name="p_service_fee_amount"]')
            .map(function () { return $(this).val(); }).get();

        const getEstimateDays = $('[name="p_estimate_finish_day"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {
            while (i < getEstimateDays.length) {
                while (i < getFeeAmount.length) {
                    this.listdataBranchDetail.push(
                        this.JSToNumberFloats({
                            p_id: getID[i],
                            p_service_fee_amount: getFeeAmount[i],
                            p_estimate_finish_day: getEstimateDays[i],
                        })
                    );
                    i++;
                }
                i++;
            }
            i++;
        }

        // this.listdataBranchDetail = this.JSToNumberFloats(this.listdataBranchDetail);

        //#region web service
        this.dalservice.Update(this.listdataBranchDetail, this.APIControllerMasterPublicServiceBranchService, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatablessss').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service
    }

    //#region onBlur
    onBlur(event, i, type) {
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

        if (type === 'amount') {
            $('#service_fee_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        } else {
            $('#service_fee_pct' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onBlur

    //#region onFocus
    onFocus(event, i, type) {
        event = '' + event.target.value;

        if (event != null) {
            event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
        }

        if (type === 'amount') {
            $('#service_fee_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        } else {
            $('#service_fee_pct' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onFocus

    //#endregion button save in list

    //#region publicserviceBranchDetail button back
    btnBack() {
        $('#datatablesss ').DataTable().ajax.reload();
        this.route.navigate(['/systemsetting/subpublicservice/publicservicedetail/' + this.param + '/publicservicebranchlist', this.param], { skipLocationChange: true });
    }
    //#endregion publicserviceBranchDetail button back

    //#region checkbox all table
    btnDeleteAll() {
        this.isBreak = false;
        this.checkedList = [];
        for (let i = 0; i < this.listpublicservicebranchservice.length; i++) {
            if (this.listpublicservicebranchservice[i].selected) {
                this.checkedList.push(this.listpublicservicebranchservice[i].id);
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
                this.dataTamp = [];
                for (let J = 0; J < this.checkedList.length; J++) {
                    const datacode = this.checkedList[J];
                    // param tambahan untuk getrow dynamic
                    this.dataTamp = [{
                        'p_id': datacode
                    }];

                    // end param tambahan untuk getrow dynamic
                    this.dalservice.Delete(this.dataTamp, this.APIControllerMasterPublicServiceBranchService, this.APIRouteForDelete)
                        .subscribe(
                            res => {
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    if (J + 1 === this.checkedList.length) {
                                        this.showSpinner = false;
                                        this.showNotification('bottom', 'right', 'success');
                                        $('#datatablessss').DataTable().ajax.reload();
                                    }
                                } else {
                                    this.isBreak = true;
                                    $('#datatablessss').DataTable().ajax.reload();
                                    this.showSpinner = false;
                                    this.swalPopUpMsg(parse.data);
                                }
                            },
                            error => {
                                this.isBreak = true;
                                this.showSpinner = false;
                                const parse = JSON.parse(error);
                                this.swalPopUpMsg(parse.data);
                            });
                    if (this.isBreak) {
                        break;
                    }
                }
            }
            else {
                this.showSpinner = false;
            }
        });
    }

    selectAllTable() {
        for (let i = 0; i < this.listpublicservicebranchservice.length; i++) {
            this.listpublicservicebranchservice[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listpublicservicebranchservice.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion checkbox all table

    //#region PublicserviceProvinceDetail Province Lookup
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
                    'default': ''
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBase(dtParameters, this.APIControllerSysBranch, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupbranch = parse.data;
                    this.lookupbranch.numberIndex = dtParameters.start;

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

    btnSelectRowBranch(branch_code: String, branch_desc: string) {
        this.model.branch_code = branch_code;
        this.model.branch_name = branch_desc;
        $('#lookupModalBranch').modal('hide');
    }
    //#endregion AddressDetail Provinc lookup

}



