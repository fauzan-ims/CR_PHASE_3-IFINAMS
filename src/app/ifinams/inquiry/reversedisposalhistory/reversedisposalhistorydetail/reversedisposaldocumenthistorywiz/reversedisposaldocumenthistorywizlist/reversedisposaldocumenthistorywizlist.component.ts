
import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './reversedisposaldocumenthistorywizlist.component.html'
})

export class ReverseDisposalDocumentHistoryWizListComponent extends BaseComponent implements OnInit {
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // #variable
    private RoleAccessCode = 'R00002870000288A';
    public dataTamp: any = [];

    //controller
    private APIControllerOrder: String = 'ReverseSaleHistory';

    //router
    
    private APIRouteForGetRow: String = 'GETROW';

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
        // this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.wizard();
        this.callWizard();
        this.callGetrowHeader();
    }

    callWizard() {
        $('#DisposalDoct .nav-link').addClass('active');
        this.DisposalDoctWiz();
    }

    //#region upload asset tabs
    DisposalDoctWiz() {
        this.route.navigate(['/inquiry/subreversedisposalhistorylist/reversedisposalhistorydetail/' + this.param + '/reversedisposaldocumenthistorylist/' + this.param + '/' + this.params + '/disposaldocumenthistorylist', this.param, this.params], { skipLocationChange: true });
    }
    //#endregion upload asset tabs

    //#region asset tabs
    ReverseDoctWiz() {
        this.route.navigate(['/inquiry/subreversedisposalhistorylist/reversedisposalhistorydetail/' + this.param + '/reversedisposaldocumenthistorylist/' + this.param + '/' + this.params + '/reversedisposaldocumenthistorylist', this.param], { skipLocationChange: true });
    }
    //#endregion asset tabs

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
}

