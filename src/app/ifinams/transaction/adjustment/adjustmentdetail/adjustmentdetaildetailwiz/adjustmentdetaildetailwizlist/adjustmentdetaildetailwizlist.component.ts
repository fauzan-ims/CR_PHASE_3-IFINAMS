import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './adjustmentdetaildetailwizlist.component.html'
})

export class AdjustmentdetaildetailwizlistComponent extends BaseComponent implements OnInit {

    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public listadjustmentdetail: any = [];
    public listadjustmentdetailData: any = [];
    public dataTamp: any = [];
    public AssetMaintenanceData: any = [];
    public lookupAsset: any = [];
    public lookupAdjustment: any = [];
    public listlegalprocessdetailData: any = [];
    public changeStatus: any;
    public idDetailList: string;
    public listdataDetail: any = [];
    public lookupCurrencyName: any = [];
    public lookupAssetDetail: any = [];
    private idDetailForReason: any;
    public readOnlyListDetail: string;

    //controller
    private APIController: String = 'AdjustmentDetail';
    private APIControllerHeader: String = 'Adjustment';

    //routing
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForGetDelete: String = 'Delete';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteLookupForAdjustment: String = 'GetRowsForLookupAdjustment';
    private APIRouteForLookupCurrency: String = 'GetRowsForLookupCurrency';
    private APIRouteForUpdateCurrency: String = 'UpdateCurrency';
    private RoleAccessCode = 'R00021900000000A';

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    // form 2 way binding
    model: any = {};

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
                    'p_adjustment_code': this.param,
                })
                // end param tambahan untuk getrows dynamic

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    this.listadjustmentdetail = parse.data;

                    if (parse.data != null) {
                        this.listadjustmentdetail.numberIndex = dtParameters.start;
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

    //#region Delete
    btnDeleteAll() {
        this.checkedList = [];
        for (let i = 0; i < this.listadjustmentdetail.length; i++) {
            if (this.listadjustmentdetail[i].selected) {
                this.checkedList.push(this.listadjustmentdetail[i].id);
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
                this.dataTamp = [];
                for (let J = 0; J < this.checkedList.length; J++) {
                    const code = this.checkedList[J];
                    // param tambahan untuk getrow dynamic
                    this.dataTamp = [{
                        'p_id': code
                    }];
                    // end param tambahan untuk getrow dynamic

                    this.dalservice.Delete(this.dataTamp, this.APIController, this.APIRouteForGetDelete)
                        .subscribe(
                            res => {
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    if (this.checkedList.length == J + 1) {
                                        this.showNotification('bottom', 'right', 'success');
                                        $('#datatableAdjustmentDetail').DataTable().ajax.reload();
                                        $('#reloadbatchdetail').click();
                                        this.showSpinner = false;
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
                            });
                }
            } else {
                this.showSpinner = false;
            }
        });
    }

    selectAllTable() {
        for (let i = 0; i < this.listadjustmentdetail.length; i++) {
            this.listadjustmentdetail[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listadjustmentdetail.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion Delete

    //#region Header getrow data
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
                    const parsedata = this.getrowNgb(parse.data[0]);

                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui
                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion BatchDetail getrow data

    //#region checkbox all lookup
    btnSelectAllLookup() {
        this.checkedLookup = [];
        for (let i = 0; i < this.lookupAdjustment.length; i++) {
            if (this.lookupAdjustment[i].selectedLookup) {
                this.checkedLookup.push(this.lookupAdjustment[i].code);
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
            const p_description_detail = this.checkedLookup[J];
            this.dataTamp = [{
                'p_adjustment_code': this.param,
                'p_adjusment_transaction_code': p_description_detail
            }];

            // end param tambahan untuk getrow dynamic
            this.dalservice.Insert(this.dataTamp, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            if (this.checkedLookup.length == J + 1) {
                                this.showNotification('bottom', 'right', 'success');
                                $('#datatableAdjustment').DataTable().ajax.reload();
                                $('#datatableAdjustmentDetail').DataTable().ajax.reload();
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
        for (let i = 0; i < this.lookupAdjustment.length; i++) {
            this.lookupAdjustment[i].selectedLookup = this.selectedAllLookup;
        }
    }

    checkIfAllLookupSelected() {
        this.selectedAllLookup = this.lookupAdjustment.every(function (item: any) {
            return item.selectedLookup === true;
        })
    }
    //#endregion checkbox all table

    //#region lookup Adjustment
    btnLookupAdjustment() {
        $('#datatableAdjustment').DataTable().clear().destroy();
        $('#datatableAdjustment').DataTable({
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
                    'p_adjustment_code': this.param,
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteLookupForAdjustment).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupAdjustment = parse.data;
                    if (parse.data != null) {
                        this.lookupAdjustment.numberIndex = dtParameters.start;
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
    //#endregion lookup Adjustment 

    //#region lookup close
    btnLookupClose() {
        this.loadData();
    }
    //#endregion lookup close

    //#region button save list
    btnSaveList() {

        this.listlegalprocessdetailData = [];

        var i = 0;

        var getID = $('[name="p_id_detail"]')
            .map(function () { return $(this).val(); }).get();

        // var getDescriptionCurrency = $('[name="p_currency_code"]')
        //     .map(function () { return $(this).val(); }).get();

        var getDescriptionAmount = $('[name="p_amount"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {
            // while (i < getDescriptionCurrency.length) {
            while (i < getDescriptionAmount.length) {
                this.listlegalprocessdetailData.push(
                    this.JSToNumberFloats({
                        p_id: getID[i],
                        p_adjustment_code: this.param,
                        // p_currency_code: getDescriptionCurrency[i],
                        p_amount: getDescriptionAmount[i],
                    })
                );
                i++;
            }
            i++;
            // }
            i++;
        }

        //#region web service
        this.dalservice.Update(this.listlegalprocessdetailData, this.APIController, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatableAdjustmentDetail').DataTable().ajax.reload();
                        $('#reloadbatchdetail').click();
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
            $('#amount' + i)
                .map(function () { return $(this).val(event); }).get();
        } else {
            $('#amount' + i)
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
            $('#amount' + i)
                .map(function () { return $(this).val(event); }).get();
        } else {
            $('#amount' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onFocus

    //#endregion button save list

    //#region CurrencyName Lookup
    btnLookupCurrencyName(id: any) {
        $('#datatableLookupCurrencyName').DataTable().clear().destroy();
        $('#datatableLookupCurrencyName').DataTable({
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
                    'p_currency_code': this.param,
                });
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForLookupCurrency).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupCurrencyName = parse.data;
                    if (parse.data != null) {
                        this.lookupCurrencyName.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    })
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });

        this.idDetailForReason = id;

    }

    btnSelectRowCurrencyName(code: String) {

        this.listadjustmentdetailData = [];

        var i = 0;

        var getID = $('[name="p_id_detail"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {

            if (getID[i] == this.idDetailForReason) {

                this.listadjustmentdetailData.push({
                    p_id: getID[i],
                    p_adjustment_code: this.param,
                    p_currency_code: code
                });
            }

            i++;
        }
        //#region web service
        this.dalservice.Update(this.listadjustmentdetailData, this.APIController, this.APIRouteForUpdateCurrency)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        $('#datatableAdjustmentDetail').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service
        $('#lookupModalCurrencyName').modal('hide');
    }
    //#endregion CurrencyName Lookup
}


