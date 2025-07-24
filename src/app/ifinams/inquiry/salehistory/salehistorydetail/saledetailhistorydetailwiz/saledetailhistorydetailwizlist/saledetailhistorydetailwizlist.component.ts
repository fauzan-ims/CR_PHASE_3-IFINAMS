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
    templateUrl: './saledetailHistorydetailwizlist.component.html'
})

export class SaleDetailHistoryDetailwizlistComponent extends BaseComponent implements OnInit {

    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public listsaledetail: any = [];
    public listsalesdetail: any = [];
    public dataTamp: any = [];
    public AssetMaintenanceData: any = [];
    public lookupAsset: any = [];
    public lookupCostCenter: any = [];
    public listlegalprocessdetailData: any = [];
    public listsaledetailData: any = [];
    private idDetailForSale: any;

    //controller
    private APIController: String = 'SaleDetailHistory';
    private APIControllerHeader: String = 'SaleHistory';
    private APIControllerAsset: String = 'Asset';
    private APIControllerCostCenter: String = 'CostCenter';

    //routing
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForGetDelete: String = 'Delete';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForUpdateForCostCenter: String = 'UpdateForCostCenter';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteLookupForSale: String = 'GetRowsForLookupSale';
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private RoleAccessCode = 'R00022040000000A';

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
                    'p_sale_code': this.param,
                })
                // end param tambahan untuk getrows dynamic

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    this.listsaledetail = parse.data;

                    if (parse.data != null) {
                        this.listsaledetail.numberIndex = dtParameters.start;
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

    //#region button add
    btnAdd() {
        this.route.navigate(['/transaction/subsale/saledetail/' + this.param + '/saledetaillist/' + this.param + '/saledetaildetail', this.param], { skipLocationChange: true });
    }
    //#endregion button add

    //#region button edit
    btnEdit(codeEdit: string) {
        this.route.navigate(['/transaction/subsale/saledetail/' + this.param + '/saledetaillist/' + this.param + '/saledetaildetail', this.param, codeEdit], { skipLocationChange: true });
    }
    //#endregion button edit

    //#region Delete
    btnDeleteAll() {
        this.checkedList = [];
        for (let i = 0; i < this.listsaledetail.length; i++) {
            if (this.listsaledetail[i].selected) {
                this.checkedList.push(this.listsaledetail[i].id);
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
                                this.showSpinner = false;
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    this.showNotification('bottom', 'right', 'success');
                                    $('#datatableSaleDetail').DataTable().ajax.reload();
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
                this.showSpinner = false;
            }
        });
    }

    selectAllTable() {
        for (let i = 0; i < this.listsaledetail.length; i++) {
            this.listsaledetail[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listsaledetail.every(function (item: any) {
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
                    // const parsedata = parse.data[0];
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

    //#region button reload
    btnReloadOutstanding() {
        this.callGetrowHeader();
        $('#datatableSaleDetail').DataTable().ajax.reload();
    }
    //#endregion button reload

    //#region checkbox all lookup
    btnSelectAllLookup() {
        this.checkedLookup = [];
        for (let i = 0; i < this.lookupAsset.length; i++) {
            if (this.lookupAsset[i].selectedLookup) {
                // this.checkedLookup.push(this.lookupAsset[i].code);
                this.checkedLookup.push({
                    assetCode: this.lookupAsset[i].code,
                    netbookvaluecomm: this.lookupAsset[i].net_book_value_comm,
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
                'p_sale_code': this.param,
                'p_asset_code': this.checkedLookup[J].assetCode,
                // 'p_sale_value': this.checkedLookup[J].netbookvaluecomm,
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
                                $('#datatableLookupAsset').DataTable().ajax.reload();
                                $('#datatableSaleDetail').DataTable().ajax.reload();
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
        for (let i = 0; i < this.lookupAsset.length; i++) {
            this.lookupAsset[i].selectedLookup = this.selectedAllLookup;
        }
    }

    checkIfAllLookupSelected() {
        this.selectedAllLookup = this.lookupAsset.every(function (item: any) {
            return item.selectedLookup === true;
        })
    }
    //#endregion checkbox all table

    //#region lookup Asset
    btnLookupAsset() {
        $('#datatableLookupAsset').DataTable().clear().destroy();
        $('#datatableLookupAsset').DataTable({
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
                    'p_location_code': this.model.location_code,
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerAsset, this.APIRouteLookupForSale).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupAsset = parse.data;
                    if (parse.data != null) {
                        this.lookupAsset.numberIndex = dtParameters.start;
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
    //#endregion lookup Asset

    //#region lookup close
    btnLookupClose() {
        this.loadData();
    }
    //#endregion lookup close

    //#region button save list
    btnSaveList() {

        this.listlegalprocessdetailData = [];

        var i = 0;

        var getID = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        var getDpAmount = $('[name="p_sale_value"]')
            .map(function () { return $(this).val(); }).get();

        var getDescription = $('[name="p_description_detail"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {

            while (i < getDpAmount.length) {

                this.listlegalprocessdetailData.push(
                    this.JSToNumberFloats({
                        p_id: getID[i],
                        p_sale_code: this.param,
                        p_sale_value: getDpAmount[i],
                        p_description_detail: getDescription[i],
                    })
                );
                i++;
            }
            i++;
        }

        //#region web service
        this.dalservice.Update(this.listlegalprocessdetailData, this.APIController, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatableSaleDetail').DataTable().ajax.reload();
                        $('#datatablesalebiddingdetail').DataTable().ajax.reload();
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
            $('#sale_value' + i)
                .map(function () { return $(this).val(event); }).get();
        } else {
            $('#sale_value' + i)
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
            $('#sale_value' + i)
                .map(function () { return $(this).val(event); }).get();
        } else {
            $('#sale_value' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onFocus

    //#endregion button save list

    //#region Cost Center Lookup
    btnLookupCostCenter(id: any) {
        $('#datatableLookupCostCenter').DataTable().clear().destroy();
        $('#datatableLookupCostCenter').DataTable({
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
                });
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerCostCenter, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupCostCenter = parse.data;
                    if (parse.data != null) {
                        this.lookupCostCenter.numberIndex = dtParameters.start;
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

        this.idDetailForSale = id;

    }

    btnSelectRowCostCenter(code: String, description: String) {

        this.listsaledetailData = [];

        var i = 0;

        var getID = $('[name="p_id_detail"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {

            if (getID[i] == this.idDetailForSale) {

                this.listsaledetailData.push({
                    p_id: getID[i],
                    p_cost_center_code: code,
                    p_cost_center_name: description
                });
            }

            i++;
        }
        //#region web service
        this.dalservice.Update(this.listsaledetailData, this.APIController, this.APIRouteForUpdateForCostCenter)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        $('#datatableSaleDetail').DataTable().ajax.reload();
                        $('#datatablesalebiddingdetail').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service
        $('#lookupModalCostCenter').modal('hide');
    }
    //#endregion CostCenter Lookup
}


