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
    templateUrl: './soldrequestwizlist.component.html'
})

export class SoldRequestDetailwizlistComponent extends BaseComponent implements OnInit {

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
    public isClaim: Boolean = false;
    private dataTampProceed: any = [];

    //controller
    private APIController: String = 'SaleDetail';
    private APIControllerHeader: String = 'Sale';
    private APIControllerAsset: String = 'Asset';

    //routing
    private APIRouteForGetRows: String = 'GetRowsForSoldRequest';
    private APIRouteForGetDelete: String = 'DeleteForSoldRequest';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteLookupForSoldRequest: String = 'GetRowsForLookupSoldRequest';
    private RoleAccessCode = 'R00022580000001A';

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    // form 2 way binding
    model: any = {};

    // checklist
    public selectedAll: any;
    private checkedList: any = [];
    private assetcode: any = [];
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

    //btnPrint(){
    //     this.showSpinner = true;
    // this.dataTamp = [{
    //   'p_branch_code': this.model.branch_code
    // }];
    // this.dalservice.GetrowSys(this.dataTamp, this.APIControllerSys, this.APIRouteForGetRowBankDefault)
    //   .subscribe(
    //     res => {
    //       const parse = JSON.parse(res);
    //       const parseData = this.getrowNgb(parse.data[0]);

    //       const dataParam = {
    //         TableName: 'rpt_invoice_faktur',
    //         SpName: 'xsp_rpt_invoice_faktur',
    //         reportparameters: {
    //           p_user_id: this.userId,
    //           p_code: code,
    //           p_bank_name: parseData.bank_name,
    //           p_bank_account_name: parseData.bank_account_name,
    //           p_bank_account_no: parseData.bank_account_no,
    //           p_print_option: 'PDF'
    //         }
    //       };

    //       this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
    //         this.printRptNonCore(res);
    //         this.showSpinner = false;
    //       }, err => {
    //         this.showSpinner = false;
    //         const parse = JSON.parse(err);
    //         this.swalPopUpMsg(parse.data);
    //       });

    //     },
    //     error => {
    //       this.showSpinner = false;
    //       const parse = JSON.parse(error);
    //       this.swalPopUpMsg(parse.data);
    //     });

    //}
    //#region button add
    btnAdd() {
        this.route.navigate(['/sellanddisposal/subsale/saledetail/' + this.param + '/saledetaillist/' + this.param + '/saledetaildetail', this.param], { skipLocationChange: true });
    }
    //#endregion button add

    //#region button edit
    btnEdit(codeEdit: string) {
        // this.route.navigate(['/sellanddisposal/subsoldrequestlist/soldrequestdetail/' + this.param], { skipLocationChange: true });
        console.log(codeEdit);

        this.route.navigate(['/sellanddisposal/subsoldrequestlist/soldrequestdetail/' + this.param + '/soldrequestassetlist/' + this.param + '/soldrequestassetdetail/', this.param, codeEdit], { skipLocationChange: true });
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

        this.assetcode = [];
        for (let i = 0; i < this.listsaledetail.length; i++) {
            if (this.listsaledetail[i].selected) {
                this.assetcode.push(this.listsaledetail[i].asset_code);
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
            // if (result.value) {
            //     this.dataTamp = [];
            //     for (let J = 0; J < this.checkedList.length; J++) {
            //         const code = this.checkedList[J];
            //         // param tambahan untuk getrow dynamic
            //         this.dataTamp = [{
            //             'p_id': code
            //         }];
            //         // end param tambahan untuk getrow dynamic                    
            //         this.dalservice.Delete(this.dataTamp, this.APIController, this.APIRouteForGetDelete)
            //             .subscribe(
            //                 res => {
            //                     this.showSpinner = false;
            //                     const parse = JSON.parse(res);
            //                     if (parse.result === 1) {
            //                         if (J + 1 === this.checkedList.length) {
            //                             this.showNotification('bottom', 'right', 'success');
            //                             $('#datatableSoldRequestAsset').DataTable().ajax.reload();
            //                         }
            //                     } else {
            //                         this.swalPopUpMsg(parse.data);
            //                     }
            //                 },
            //                 error => {
            //                     this.showSpinner = false;
            //                     const parse = JSON.parse(error);
            //                     this.swalPopUpMsg(parse.data);
            //                 });
            //     }
            // } else {
            //     this.showSpinner = false;
            // }

            if (result.value) {
                let th = this;
                var j = 0;
                (function loopAgreementMaturity() {
                    if (j < th.checkedList.length) {
                        const code = th.checkedList[j];
                        const assetcode = th.assetcode[j];
                        th.dataTamp = [{
                            'p_id': code,
                            'p_asset_code': assetcode,
                            'p_sale_code': th.param
                        }];

                        th.dalservice.Delete(th.dataTamp, th.APIController, th.APIRouteForGetDelete)
                            .subscribe(
                                res => {
                                    const parse = JSON.parse(res);
                                    if (parse.result === 1) {
                                        if (th.checkedList.length == j + 1) {
                                            th.showNotification('bottom', 'right', 'success');
                                            $('#datatableSoldRequestAsset').DataTable().ajax.reload();
                                            $('#datatableSoldRequestAssetAuction').DataTable().ajax.reload();
                                            $('#datatableSoldRequestAssetMocil').DataTable().ajax.reload();
                                            $('#datatableSoldRequestAssetCOP').DataTable().ajax.reload();
                                            $('#datatableSoldRequestAssetClaim').DataTable().ajax.reload();
                                            th.showSpinner = false;
                                        } else {
                                            j++;
                                            loopAgreementMaturity();
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
                    const parsedata = this.getrowNgb(parse.data[0]);

                    if (parsedata.sell_type == 'CLAIM') {
                        this.isClaim = true;
                    } else {
                        this.isClaim = false;
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
    //#endregion BatchDetail getrow data

    //#region button reload
    btnReloadOutstanding() {
        this.callGetrowHeader();
        $('#datatableSoldRequestAsset').DataTable().ajax.reload();
    }
    //#endregion button reload

    //#region checkbox all lookup
    // btnSelectAllLookup() {
    //     this.checkedLookup = [];
    //     for (let i = 0; i < this.lookupAsset.length; i++) {
    //         if (this.lookupAsset[i].selectedLookup) {
    //             // this.checkedLookup.push(this.lookupAsset[i].code);
    //             this.checkedLookup.push({
    //                 assetCode: this.lookupAsset[i].code,
    //                 netbookvaluecomm: this.lookupAsset[i].sell_request_amount,
    //             });
    //         }
    //     }

    //     // jika tidak di checklist
    //     if (this.checkedLookup.length === 0) {
    //         swal({
    //             title: this._listdialogconf,
    //             buttonsStyling: false,
    //             confirmButtonClass: 'btn btn-danger'
    //         }).catch(swal.noop)
    //         return
    //     }
    //     for (let J = 0; J < this.checkedLookup.length; J++) {
    //         const codeData = this.checkedLookup[J];
    //         this.dataTamp = [{
    //             'p_sale_code': this.param,
    //             'p_asset_code': this.checkedLookup[J].assetCode,
    //             'p_sale_value': this.checkedLookup[J].netbookvaluecomm,
    //         }];
    //         // end param tambahan untuk getrow dynamic
    //         this.dalservice.Insert(this.dataTamp, this.APIController, this.APIRouteForInsert)
    //             .subscribe(
    //                 res => {
    //                     this.showSpinner = false;
    //                     const parse = JSON.parse(res);
    //                     if (parse.result === 1) {
    //                         if (this.checkedLookup.length == J + 1) {
    //                             this.showNotification('bottom', 'right', 'success');
    //                             $('#datatableLookupAsset').DataTable().ajax.reload();
    //                             $('#datatableSoldRequestAsset').DataTable().ajax.reload();
    //                         }
    //                     } else {
    //                         this.swalPopUpMsg(parse.data);
    //                     }
    //                 },
    //                 error => {
    //                     const parse = JSON.parse(error);
    //                     this.swalPopUpMsg(parse.data);
    //                 })
    //     }
    // }


    btnSelectAllLookup() {
        this.dataTampProceed = [];
        this.checkedList = [];
        for (let i = 0; i < this.lookupAsset.length; i++) {
            if (this.lookupAsset[i].selectedLookup) {
                this.checkedList.push({
                    'assetCode': this.lookupAsset[i].code,
                    'netbookvaluecomm': this.lookupAsset[i].sell_request_amount,
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
                            'p_sale_code': th.param,
                            'p_asset_code': th.checkedList[i].assetCode,
                            'p_sale_value': th.checkedList[i].netbookvaluecommm,
                            'action': '',
                        }];
                        th.dalservice.Insert(th.dataTampProceed, th.APIController, th.APIRouteForInsert)
                            .subscribe(
                                res => {
                                    const parse = JSON.parse(res);
                                    if (parse.result === 1) {
                                        if (th.checkedList.length == i + 1) {
                                            th.showNotification('bottom', 'right', 'success');
                                            $('#datatableLookupAsset').DataTable().ajax.reload();
                                            $('#datatableSoldRequestAsset').DataTable().ajax.reload();
                                            $('#datatableSoldRequestAssetAuction').DataTable().ajax.reload();
                                            $('#datatableSoldRequestAssetMocil').DataTable().ajax.reload();
                                            $('#datatableSoldRequestAssetCOP').DataTable().ajax.reload();
                                            $('#datatableSoldRequestAssetClaim').DataTable().ajax.reload();
                                            $('#reloadHeader').click();

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
                    'p_branch_code': this.model.branch_code,
                    'p_sell_type': this.model.sell_type
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerAsset, this.APIRouteLookupForSoldRequest).subscribe(resp => {
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

        var getID = $('[name="p_id_detail"]')
            .map(function () { return $(this).val(); }).get();

        var getSellReqAmount = $('[name="p_sell_request_amount_detail"]')
            .map(function () { return $(this).val(); }).get();

        // var getDescription = $('[name="p_description_detail"]')
        //     .map(function () { return $(this).val(); }).get();

        var getCondition = $('[name="p_condition"]')
            .map(function () { return $(this).val(); }).get();

        var getAuctionLocation = $('[name="p_auction_location"]')
            .map(function () { return $(this).val(); }).get();

        var getAuctionBasePrice = $('[name="p_auction_base_price_auction"]')
            .map(function () { return $(this).val(); }).get();

        var getAssetSellingPrice = $('[name="p_asset_selling_price_auction"]')
            .map(function () { return $(this).val(); }).get();

        var getAssetSellingPriceMocil = $('[name="p_asset_selling_price_mocil"]')
            .map(function () { return $(this).val(); }).get();

        var getAssetSellingPriceCOP = $('[name="p_asset_selling_price_cop"]')
            .map(function () { return $(this).val(); }).get();

        var getClaimAmount = $('[name="p_claim_amount"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {

            // while (i < getSellReqAmount.length) {

            while (i < getCondition.length) {

                while (i < getAuctionLocation.length) {

                    while (i < getAuctionBasePrice.length) {

                        while (i < getAssetSellingPrice.length) {

                            while (i < getAssetSellingPriceMocil.length) {

                                while (i < getAssetSellingPriceCOP.length) {

                                    while (i < getClaimAmount.length) {

                                        this.listlegalprocessdetailData.push(
                                            this.JSToNumberFloats({
                                                p_id: getID[i],
                                                p_sale_code: this.param,
                                                p_sell_request_amount: getSellReqAmount[i],
                                                p_condition: getCondition[i],
                                                p_auction_location: getAuctionLocation[i],
                                                p_auction_base_price: getAuctionBasePrice[i],
                                                p_asset_selling_price: getAssetSellingPrice[i],
                                                p_asset_selling_price_mocil: getAssetSellingPriceMocil[i],
                                                p_asset_selling_price_cop: getAssetSellingPriceCOP[i],
                                                p_claim_amount: getClaimAmount[i]
                                            })
                                        );
                                        i++;
                                    }
                                    i++;
                                }
                                i++;
                            }
                            i++;
                        }
                        i++;
                    }
                    i++;
                }
                i++;
            }
            i++;
            // }
            // i++;
        }

        //#region web service
        this.dalservice.Update(this.listlegalprocessdetailData, this.APIController, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatableSoldRequestAsset').DataTable().ajax.reload();
                        $('#datatablesalebiddingdetail').DataTable().ajax.reload();
                        $('#datatableSoldRequestAssetAuction').DataTable().ajax.reload();
                        $('#datatableSoldRequestAssetMocil').DataTable().ajax.reload();
                        $('#datatableSoldRequestAssetCOP').DataTable().ajax.reload();
                        $('#datatableSoldRequestAssetClaim').DataTable().ajax.reload();
                        $('#reloadHeader').click();
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
        } else if (type === 'auction_base_price') {
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
        }
        else if (type === 'asset_selling_price') {
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
        } else if (type === 'claim_amount') {
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
        }
        else {
            event = '' + event.target.value;
            event = event.trim();
            event = parseFloat(event).toFixed(6);
        }

        if (event === 'NaN') {
            event = 0;
            event = parseFloat(event).toFixed(2);
        }

        if (type === 'amount') {
            $('#sell_request_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        } else if (type === 'auction_base_price') {
            $('#auction_base_price' + i)
                .map(function () { return $(this).val(event); }).get();
        } else if (type === 'asset_selling_price') {
            $('#asset_selling_price' + i)
                .map(function () { return $(this).val(event); }).get();
        } else if (type === 'claim_amount') {
            $('#claim_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        }
        else {
            $('#sell_request_amount' + i)
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
            $('#sell_request_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        } else if (type === 'auction_base_price') {
            $('#auction_base_price' + i)
                .map(function () { return $(this).val(event); }).get();
        } else if (type === 'asset_selling_price') {
            $('#asset_selling_price' + i)
                .map(function () { return $(this).val(event); }).get();
        }
        else {
            $('#sell_request_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onFocus

    //#endregion button save list


}


