import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { TU } from 'angular-mydatepicker';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './ordertopublicservicedetail.component.html'
})
export class OrdertopublicservicedetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public parameterData: any = [];
    public lookupbranch: any = [];
    public lookuppublicservice: any = [];
    public NumberOnlyPattern = this._numberonlyformat;
    public listorderdetail: any = [];
    public lookupBranchName: any = [];
    public listdateOrder: any = [];
    public lookupregistermain: any = [];
    public isReadOnly: Boolean = false;
    public isButton: Boolean = false;
    public isBreak: Boolean = false;
    private branchcode: any = [];
    
    private dataTamp: any = [];
    private dataRoleTamp: any = [];
    private RoleAccessCode = 'R00021940000000A';

    // API Controller
    private APIController: String = 'OrderMain';
    private APIControllerOrderDetail: String = 'OrderDetail';
    private APIControllerRegisterMain: String = 'RegisterMain';
    private APIControllerSysBranch: String = 'SysBranch';
    private APIControllerPublicService: String = 'MasterPublicService';

    // API Function
    public readOnlyListDetail: string;
    public idDetailList: string;
    private APIRouteLookupRegisterMain: String = 'GetRowsLookupForOrderDetail';
    private APIRouteForGetRowsForOrderDetail: String = 'GetRows';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForGetRow: String = 'GETROW';
    private APIRouteForInsert: String = 'INSERT';
    private APIRouteForUpdate: String = 'UPDATE';
    private APIRouteForGetDelete: String = 'DELETE';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForCancelPaymentCancel: String = 'ExecSpForCancelPaymentCancel';
    private APIRouteForCancelPaymentProceed: String = 'ExecSpForCancelPaymentProceed';
    
    private setStyle: any = [];

    // checklist
    public selectedAllLookup: any;
    public selectedAll: any;
    private checkedList: any = [];
    private checkedLookup: any = [];

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
        private _elementRef: ElementRef,
        private parserFormatter: NgbDateParserFormatter
    ) { super(); }

    ngOnInit() {
        this.Delimiter(this._elementRef);
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

        if (this.param != null) {
            this.isReadOnly = true;
            // call web service
            this.callGetrow();
            this.loadData();
        } else {
            this.model.order_status = 'HOLD';
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
                    'p_order_code': this.param
                });
                // end param tambahan untuk getrow dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerOrderDetail, this.APIRouteForGetRowsForOrderDetail).subscribe(resp => {
                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    const parse = JSON.parse(resp)
                    this.listorderdetail = parse.data;
                    this.listorderdetail.numberIndex = dtParameters.start;

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

    //#region  set datepicker
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
    //#endregion  set datepicker

    //#region getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param
        }]
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    this.branchcode = parsedata.branch_code;

                    if (parsedata.order_status !== 'HOLD') {
                        this.isButton = true;
                    } else {
                        this.isButton = false;
                    }

                    // checkbox
                    if (parsedata.is_editable === '1') {
                        parsedata.is_editable = true;
                    } else {
                        parsedata.is_editable = false;
                    }
                    // end checkbox

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
    onFormSubmit(ordertopublicserviceForm: NgForm, isValid: boolean) {
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

        this.parameterData = this.JSToNumberFloats(ordertopublicserviceForm);

        if (this.parameterData.p_editable == null) {
            this.parameterData.p_editable = false;
        }
        const usersJson: any[] = Array.of(this.parameterData);
        if (this.param != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
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
                            this.showNotification('bottom', 'right', 'success')
                            this.route.navigate(['/transaction/subordertobirojasalist/ordertopublicservicedetail', parse.code]);
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

    //#region checkbox all table
    btnDeleteAll() {
        this.isBreak = false;
        this.checkedList = [];
        for (let i = 0; i < this.listorderdetail.length; i++) {
            if (this.listorderdetail[i].selected) {
                this.checkedList.push(this.listorderdetail[i].id);
            }
        }

        // jika tidak di checklist
        if (this.checkedList.length === 0) {
            swal({
                title: 'No one selected!',
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
                this.dataTamp = [];
                for (let J = 0; J < this.checkedList.length; J++) {
                    const code = this.checkedList[J];
                    // param tambahan untuk getrow dynamic
                    this.dataTamp = [{
                        'p_id': code,
                        'p_order_code': this.param
                    }];
                    // end param tambahan untuk getrow dynamic
                    this.dalservice.Delete(this.dataTamp, this.APIControllerOrderDetail, this.APIRouteForGetDelete)
                        .subscribe(
                            res => {
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    if (J + 1 === this.checkedList.length) {
                                        this.showSpinner = false;
                                        this.showNotification('bottom', 'right', 'success');
                                        $('#datatables').DataTable().ajax.reload();
                                    }
                                } else {
                                    this.isBreak = true;
                                    this.showSpinner = false;
                                    $('#datatables').DataTable().ajax.reload();
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
            } else {
                this.showSpinner = false;
            }
        });
    }

    selectAllTable() {
        for (let i = 0; i < this.listorderdetail.length; i++) {
            this.listorderdetail[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listorderdetail.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion checkbox all table

    //#region button back
    btnBack() {
        $('#datatable').DataTable().ajax.reload();
        this.route.navigate(['/transaction/subordertobirojasalist/']);
    }
    //#endregion button back

    //#region button post
    btnPost() {
        // this.route.navigate(['/transaction/orderdetail', this.param, codeEdit]);
    }
    //#endregion button post

    //#region checkbox all lookup
    btnSelectAllLookup() {
        this.isBreak = false;
        this.checkedLookup = [];
        for (let i = 0; i < this.lookupregistermain.length; i++) {
            if (this.lookupregistermain[i].selectedLookup) {
                this.checkedLookup.push(this.lookupregistermain[i].code);
            }
        }

        // jika tidak di checklist
        if (this.checkedLookup.length === 0) {
            swal({
                title: 'No one selected!',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger'
            }).catch(swal.noop)
            return
        } else {
            this.showSpinner = true;
        }

        this.dataTamp = [];
        for (let J = 0; J < this.checkedLookup.length; J++) {
            const codeData = this.checkedLookup[J];
            // param tambahan untuk getrow dynamic
            this.dataTamp = [{
                'p_register_code': codeData,
                'p_order_code': this.param
            }];
            // end param tambahan untuk getrow dynamic

            this.dalservice.Insert(this.dataTamp, this.APIControllerOrderDetail, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            if (J + 1 === this.checkedLookup.length) {
                                this.showSpinner = false;
                                this.showNotification('bottom', 'right', 'success');
                                $('#datatables').DataTable().ajax.reload(null, false);
                                $('#datatableLookupRegisterMain').DataTable().ajax.reload(null, false);
                                this.callGetrow();
                            }
                        } else {
                            this.isBreak = true;
                            this.showSpinner = false;
                            $('#datatableLookupRegisterMain').DataTable().ajax.reload(null, false);
                            $('#datatables').DataTable().ajax.reload(null, false);
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
        for (let i = 0; i < this.lookupregistermain.length; i++) {
            this.lookupregistermain[i].selectedLookup = this.selectedAllLookup;
        }
    }

    checkIfAllLookupSelected() {
        this.selectedAllLookup = this.lookupregistermain.every(function (item: any) {
            return item.selectedLookup === true;
        })
    }
    //#endregion checkbox all table

    //#region lookup register main
    btnLookupRegisterMain() {
        $('#datatableLookupRegisterMain').DataTable().clear().destroy();
        $('#datatableLookupRegisterMain').DataTable({
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
                    'p_order_code': this.param,
                    'p_branch_code': this.branchcode
                });                
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerRegisterMain, this.APIRouteLookupRegisterMain).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupregistermain = parse.data;

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
            columnDefs: [{ orderable: false, width: '5%', targets: [0] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }
    //#endregion lookup register main

    //#region branch Province Lookup
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
            columnDefs: [{ orderable: false, width: '5%', targets: [3] }], // for disabled coloumn
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

    //#region Public Service Lookup
    btnLookupPublicService() {
        $('#datatableLookupPublicService').DataTable().clear().destroy();
        $('#datatableLookupPublicService').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerPublicService, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookuppublicservice = parse.data;
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
            columnDefs: [{ orderable: false, width: '5%', targets: [2] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowPublicService(public_service_code: String, public_service_name: string) {
        this.model.public_service_code = public_service_code;
        this.model.public_service_name = public_service_name;
        $('#lookupModalPublicService').modal('hide');
    }
    //#endregion Public Service lookup

    //#region button save list
    btnSaveList() {

        this.listdateOrder = [];

        var i = 0;

        var getID = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        var getPCT = $('[name="p_dp_to_public_service_pct"]')
            .map(function () { return $(this).val(); }).get();

        var getAmount = $('[name="p_dp_to_public_service_amount"]')
            .map(function () { return $(this).val(); }).get();

        // const amounn = parseFloat(getAmount[i])
        // getAmount = parseFloat(getAmount).toFixed(2); // ganti jadi 6 kalo mau pct
        // getAmount = getAmount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');

        while (i < getID.length) {

            while (i < getPCT.length) {

                while (i < getAmount.length) {

                    // getAmount[i] = parseFloat(getAmount[i]).toFixed(2);
                    getAmount[i] = getAmount[i].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                    getPCT[i] = parseFloat(getPCT[i]);

                    this.listdateOrder.push(
                        this.JSToNumberFloats({
                            p_id: getID[i],
                            p_dp_to_public_service_pct: getPCT[i],
                            p_dp_to_public_service_amount: getAmount[i]
                        })
                    );

                    i++;
                }

                i++;
            }

            i++;
        }


        //#region web service
        this.dalservice.Update(this.listdateOrder, this.APIControllerOrderDetail, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatables').DataTable().ajax.reload();
                        this.callGetrow();
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
        // if (event.target.value.match('[A-Za-z]')) {
        //   event.target.value = 0;
        // }

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
            $('#dp_to_public_service_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        } else {
            $('#dp_to_public_service_pct' + i)
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
            $('#dp_to_public_service_amount' + i)
                .map(function () { return $(this).val(event); }).get();

        } else {
            $('#dp_to_public_service_pct' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onFocus
    //#endregion button save list

    //#region button Proceed
    btnProceed() {
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
                // param tambahan untuk getrole dynamic
                this.dataRoleTamp = [{
                    'p_code': this.param,
                    'action': ''
                }];
                // param tambahan untuk getrole dynamic
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForProceed)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success')
                                this.callGetrow();
                            } else {
                                this.swalPopUpMsg(parse.data)
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data)
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button Proceed

    //#region button Cancel
    btnCancel() {
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
                // param tambahan untuk getrole dynamic
                this.dataRoleTamp = [{
                    'p_code': this.param,
                    'action': ''
                }];
                // param tambahan untuk getrole dynamic
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancel)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success')
                                this.callGetrow();
                            } else {
                                this.swalPopUpMsg(parse.data)
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data)
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button Cancel

    //#region button CancelPaymentProceed
    // btnCancelPaymentProceed() {
    //   swal({
    //     title: 'Are you sure?',
    //     type: 'warning',
    //     showCancelButton: true,
    //     confirmButtonClass: 'btn btn-success',
    //     cancelButtonClass: 'btn btn-danger',
    //     confirmButtonText: this._deleteconf,
    //     buttonsStyling: false
    //   }).then((result) => {
    //     this.showSpinner = true;
    //     if (result.value) {
    //       // param tambahan untuk getrole dynamic
    //       this.dataRoleTamp = [{
    //         'p_code': this.param,
    //         'action': ''
    //       }];
    //       // param tambahan untuk getrole dynamic
    //       this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancelPaymentProceed)
    //         .subscribe(
    //           res => {
    //             this.showSpinner = false;
    //             const parse = JSON.parse(res);
    //             if (parse.result === 1) {
    //               this.showNotification('bottom', 'right', 'success')
    //               this.callGetrow();
    //             } else {
    //               this.swalPopUpMsg(parse.data)
    //             }
    //           },
    //           error => {
    //             this.showSpinner = false;
    //             const parse = JSON.parse(error);
    //             this.swalPopUpMsg(parse.data)
    //           });
    //     } else {
    //       this.showSpinner = false;
    //     }
    //   });
    // }
    //#endregion button CancelPaymentProceed

    //#region button CancelPaymentCancel
    btnCancelPaymentCancel() {
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
                // param tambahan untuk getrole dynamic
                this.dataRoleTamp = [{
                    'p_code': this.param,
                    'action': ''
                }];
                // param tambahan untuk getrole dynamic
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancelPaymentCancel)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success')
                                this.callGetrow();
                            } else {
                                this.swalPopUpMsg(parse.data)
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data)
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button CancelPaymentCancel

    //#region changePct
    changePct(event, id: any, from: String, index: any) {

        this.idDetailList = id;
        this.listdateOrder = [];

        var i = 0;
        var getID = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        var getPCT = $('[name="p_dp_to_public_service"]')
            .map(function () { return $(this).val(); }).get();

                while (i < getPCT.length) {
                if (getID[i] == this.idDetailList) {
                  getPCT[i] = parseFloat(getPCT[i]);
                  this.listdateOrder.push(
                    this.JSToNumberFloats({
                      p_id: getID[i],
                      p_dp_to_public_service: getPCT[i]
                    })
                  );
                }
              i++;
            }
            i++;

        //#region web service
        this.dalservice.Update(this.listdateOrder, this.APIControllerOrderDetail, this.APIRouteForUpdate)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                // this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                $('#datatables').DataTable().ajax.reload();
              } else {
                this.swalPopUpMsg(parse.data);
              }
            },
            error => {
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);

            });
       // #endregion web service
    }
    //#endregion changePct
}

