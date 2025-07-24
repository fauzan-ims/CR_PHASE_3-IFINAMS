import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './salebiddingwizdetail.component.html'
})

export class SaleBiddingWizDetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public SaleBiddingData: any = [];
    public NumberOnlyPattern = this._numberonlyformat;
    public isReadOnly: Boolean = false;
    private dataTamp: any = [];
    public lookupAsset: any = [];
    public isStatus: Boolean = false;
    public setStyle: any = [];
    public listsalebiddingdetail: any = [];
    private dataTampPush: any = [];
    public buy_type: any = [];

    // API Controller
    private APIController: String = 'SaleBidding';
    private APIControllerHeader: String = 'Sale';
    private APIControllerDetail: String = 'SaleBiddingDetail';

    // API Function
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForGetDelete: String = 'Delete';
    private APIRouteForGetRows: String = 'GetRows';
    private RoleAccessCode = 'R00021720000000A';

    // form 2 way binding
    model: any = {};

    // checklist
    public selectedAll: any;
    private checkedList: any = [];

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
        private _elementRef: ElementRef
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.Delimiter(this._elementRef);
        if (this.params != null) {
            this.isReadOnly = true;
            this.wizard();
            this.callGetrow();
            this.loadData();
            setTimeout(() => this.RemoveList(this.model.buy_type), 1000);
            this.callGetrowHeader();
        } else {
            this.showSpinner = false;
            this.model.is_winner = false;
            this.isStatus = false;
            this.model.sale_amount_detail = 0;
            this.model.buy_type = 'By Batch';
            this.model.sale_amount = 0;
            this.callGetrowHeader();
        }
    }

    RemoveList(buy_type) {
        if (buy_type === 'By Batch') {
            $('#ListBiddingDetail').remove();
        } else {
            $('#ListBiddingDetail').show();
        }
    }

    //#region load all data
    loadData() {
        this.dtOptions = {
            'pagingType': 'first_last_numbers',
            'pageLength': 10,
            'processing': true,
            'serverSide': true,
            responsive: true,
            lengthChange: false, // hide lengthmenu
            searching: true, // jika ingin hilangin search box nya maka false
            ajax: (dtParameters: any, callback) => {
                // param tambahan untuk getrows dynamic
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_bidding_code': this.params
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.listsalebiddingdetail = parse.data;

                    if (parse.data != null) {
                        this.listsalebiddingdetail.numberIndex = dtParameters.start;
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
            order: [[1, 'desc']],
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
        }
    }
    //#endregion load all data

    //#region getStyles
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
    //#endregion getStyles

    //#region getrow data
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
                    const parsedata = this.getrowNgb(parse.data[0]);

                    // checkbox
                    if (parsedata.is_winner === '1') {
                        parsedata.is_winner = true;
                    } else {
                        parsedata.is_winner = false;
                    }
                    // checkbox

                    // this.RemoveList(parsedata.buy_type);

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
    onFormSubmit(SaleBiddingForm: NgForm, isValid: boolean) {
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
            this.showSpinner = false;
        }

        this.SaleBiddingData = this.JSToNumberFloats(SaleBiddingForm);

        if (this.SaleBiddingData.p_is_winner == null) {
            this.SaleBiddingData.p_is_winner = false;
        }

        if (this.SaleBiddingData.p_sale_to == null || this.SaleBiddingData.p_sale_to === '') {
            this.SaleBiddingData.p_sale_to = undefined;
        }

        if (this.SaleBiddingData.p_buy_type == null || this.SaleBiddingData.p_buy_type === '') {
            this.SaleBiddingData.p_buy_type = undefined;
        }

        this.RemoveList(this.SaleBiddingData.p_buy_type)

        const usersJson: any[] = Array.of(this.SaleBiddingData);
        if (this.params != null) {
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
                        this.showSpinner = false;
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
                            this.route.navigate(['/transaction/subsale/saledetail/' + this.param + '/salebiddinglist/' + this.param + '/salebiddingdetail', this.param, parse.code], { skipLocationChange: true });
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
    }
    //#endregion form submit

    //#region button back
    btnBack() {
        $('#datatableSaleBidding').DataTable().ajax.reload();
        this.route.navigate(['/transaction/subsale/saledetail/' + this.param + '/salebiddinglist', this.param], { skipLocationChange: true });
    }
    //#endregion button back

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
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui
                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion BatchDetail getrow data

    //#region checkbox all table
    btnDeleteAll() {
        this.checkedList = [];
        for (let i = 0; i < this.listsalebiddingdetail.length; i++) {
            if (this.listsalebiddingdetail[i].selected) {
                this.checkedList.push(this.listsalebiddingdetail[i].id);
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
            allowOutsideClick: false,
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
                for (let J = 0; J < this.checkedList.length; J++) {
                    const id = this.checkedList[J];
                    // param tambahan untuk getrow dynamic
                    this.dataTampPush.push({
                        'p_id': id
                    });
                    // end param tambahan untuk getrow dynamic
                    this.dalservice.Delete(this.dataTampPush, this.APIControllerDetail, this.APIRouteForGetDelete)
                        .subscribe(
                            res => {
                                this.showSpinner = false;
                                $('#salebiddingdetail').click();
                                this.callGetrow();
                                this.showNotification('bottom', 'right', 'success');
                                $('#datatablesalebiddingdetail').DataTable().ajax.reload();
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

    selectAllTable() {
        for (let i = 0; i < this.listsalebiddingdetail.length; i++) {
            this.listsalebiddingdetail[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listsalebiddingdetail.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion checkbox all table

    //#region button add
    btnAdd() {
        this.route.navigate(['/transaction/subsale/saledetail/' + this.param + '/salebiddinglist/' + this.param + '/salebiddingdetaildetail', this.param, this.params]);
    }
    //#endregion button add

    //#region button edit
    btnEdit(codeEdit: string) {
        this.route.navigate(['/transaction/subsale/saledetail/' + this.param + '/salebiddinglist/' + this.param + '/salebiddingdetaildetail', this.param, this.params, codeEdit], { skipLocationChange: true });
    }
    //#endregion button edit

    // //#region Radio Buttn
    // BuyType(event: any) {
    //     this.buy_type = event.target.value;
    //     console.log(this.buy_type);

    //     if (this.buy_type === 'By Batch') {
    //         $('#ListBiddingDetail').remove();
    //     }
    // }
    // //#endregion Radio Button
}

