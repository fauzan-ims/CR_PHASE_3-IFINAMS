import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../base.component';
import { DALService } from '../../../../../../../../DALservice.service';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './salebiddingdetail.component.html'
})

export class SaleBiddingDetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');
    paramss = this.getRouteparam.snapshot.paramMap.get('id3');
    
    // variable
    public plafond_status: String;
    public NumberOnlyPattern = this._numberonlyformat;
    public SaleBiddingDetailData: any = [];
    public lookupAsset: any = [];
    public isReadOnly: Boolean = false;
    private dataTamp: any = [];

    //controller
    private APIController: String = 'SaleBiddingDetail';
    private APIControllerAsset: String = 'SaleDetail';
    private APIControllerHeader: String = 'Sale';

    //routing
    private APIRouteForGetRow: String = 'GETROW';
    private APIRouteForInsert: String = 'INSERT';
    private APIRouteForUpdate: String = 'UPDATE';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private RoleAccessCode = 'R00021720000000A';

    // form 2 way binding
    model: any = {};

    // spinner
    showSpinner: Boolean = false;
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
        this.Delimiter(this._elementRef);
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

        if (this.paramss != null) {
            this.isReadOnly = true;
            // call web service
            this.callGetrow();
        } else {
            this.model.showSpinner = false;
            this.model.sale_amount_bidding_detail = 0;
        } this.callGetrowHeader();
    }

    //#region getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_id': this.paramss
        }];
        // end param tambahan untuk getrow dynamic
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
    //#endregion getrow data

    //#region form submit
    onFormSubmit(SaleBiddingDetailForm: NgForm, isValid: boolean) {
        // validation form submit
        if (!isValid) {
            swal({
                allowOutsideClick: false,
                title: 'Warning!',
                text: 'Please Fill a Mandatory Field OR Format Is Invalid',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-warning',
                type: 'warning'
            }).catch(swal.noop)
            return;
        } else {
            this.showSpinner = false;
        }

        this.SaleBiddingDetailData = this.JSToNumberFloats(SaleBiddingDetailForm);

        const usersJson: any[] = Array.of(this.SaleBiddingDetailData);
        if (this.paramss != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            $('#clientDetail', parent.document).click();
                            this.callGetrow();
                            this.showNotification('bottom', 'right', 'success');
                        } else {
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data)
                    });
        } else {
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);

                        if (parse.result === 1) {
                            $('#clientDetail', parent.document).click();
                            this.showNotification('bottom', 'right', 'success');
                            this.route.navigate(['/transaction/subsale/saledetail/' + this.param + '/salebiddinglist/' + this.param + '/salebiddingdetaildetail', this.param, this.params, parse.id], { skipLocationChange: true });
                        } else {
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data)
                    });
        }
    }
    //#endregion form submit

    //#region button back
    btnBack() {
        this.route.navigate(['/transaction/subsale/saledetail/' + this.param + '/salebiddinglist/' + this.param + '/salebiddingdetail', this.param, this.params], { skipLocationChange: true });
        $('#datatablesalebiddingdetail').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region Asset Lookup
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
                    'p_sale_code': this.param,
                    'p_bidding_code': this.params
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerAsset, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupAsset = parse.data;
                    if (parse.data != null) {
                        this.lookupAsset.numberIndex = dtParameters.start;
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

    btnSelectRowAsset(asset_code: string, item_name: string, description_detail_lookup: string, sale_value: string) {
        this.model.asset_code = asset_code;
        this.model.asset_name = item_name;
        this.model.sale_amount_bidding_detail = sale_value;
        this.model.description_bidding_detail = description_detail_lookup;
        $('#lookupModalAsset').modal('hide');
    }

    btnClearAsset() {
        this.model.asset_code = '';
        this.model.asset_name = '';
        this.model.sale_amount = '';
        this.model.description_bidding_detail = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Asset lookup

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
}
