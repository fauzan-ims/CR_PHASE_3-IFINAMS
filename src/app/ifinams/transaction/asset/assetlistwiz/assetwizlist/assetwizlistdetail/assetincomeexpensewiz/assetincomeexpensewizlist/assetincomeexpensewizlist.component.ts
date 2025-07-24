
import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './assetincomeexpensewizlist.component.html'
})

export class AssetIncomeExpenseWizListComponent extends BaseComponent implements OnInit {
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // #variable
    private RoleAccessCode = 'R00021450000000A';
    public dataTamp: any = [];

    //controller
    private APIControllerOrder: String = 'AssetIncomeLedger';

    //router

    private APIRouteForGetData: String = 'ExecSpGetData';
    private APIRouteForGetRow: String = 'GetRow';

    // form 2 way binding
    model: any = {};

    // spinner
    showSpinner: Boolean = false;
    // end

    // #ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    checkedList: any;
    selectedAll: any;
    selectedAllTable: any;

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.wizard();
        this.callWizard();
        this.callGetrowHeader();
        this.callGetData();
    }

    callWizard() {
        $('#assetexpenseledgerwiz .nav-link').addClass('active');
        this.AssetExpenseLedgerWiz();
    }

    //#region upload asset tabs
    AssetExpenseLedgerWiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetincomeexpenselist/' + this.param + '/assetexpenseledgerlsit', this.param], { skipLocationChange: true });
    }
    //#endregion upload asset tabs

    //#region upload asset tabs
    AssetIncomeLedgerWiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetincomeexpenselist/' + this.param + '/assetincomeledgerlsit', this.param], { skipLocationChange: true });
    }
    //#endregion upload asset tabs

    //#region Header getrow data
    callGetrowHeader() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param,
        }]
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIControllerOrder, this.APIRouteForGetRow)
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

    //#region Header getrow data
    callGetData() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_asset_code': this.param,
            'action': 'getResponse'
        }]
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIControllerOrder, this.APIRouteForGetData)
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
}

