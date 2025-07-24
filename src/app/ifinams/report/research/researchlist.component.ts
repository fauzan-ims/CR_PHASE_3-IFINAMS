import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../base.component';
import { DALService } from '../../../../DALservice.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './researchlist.component.html'
})

export class ResearchList extends BaseComponent implements OnInit {

    // variable
    public listgeneralcode: any = [];
    public dataTamp: any = [];
    private dataTampPush: any = [];
    private dataRoleTamp: any = [];

    //controller
    private APIController: String = 'AssetMaintenanceSchedule';

    //routing
    private APIRouteForDelete: String = 'DELETE';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForGenerate: String = 'ExecSpForGenerateService';
    private RoleAccessCode = 'R00011680000000A';

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    // checklist
    public selectedAll: any;
    private checkedList: any = [];

    // spinner
    showSpinner: Boolean = false;
    getRouteparam: any;
    // end

    constructor(private dalservice: DALService,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        // this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide(this._location, this._elementRef, this.route);
        this.loadData();
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
                    'p_asset_code': 'MSN.AST.2203.00010'
                })
                // end param tambahan untuk getrows dynamic

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    this.listgeneralcode = parse.data;

                    if (parse.data != null) {
                        this.listgeneralcode.numberIndex = dtParameters.start;
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
            columnDefs: [{ orderable: false, width: '5%', targets: [0] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region button Generate
    btnGenerate() {
        // param tambahan untuk button Proceed dynamic
        this.dataRoleTamp = [{
            'p_asset_code': 'MSN.AST.2203.00010',
            'p_model_code': 'INV',
            'p_company_code' : 'MSN',
            'action': ''
        }];
        // param tambahan untuk button Proceed dynamic

        // call web service
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForGenerate)
            .subscribe(
                ress => {
                    const parses = JSON.parse(ress);
                    if (parses.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatable').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parses.data);
                    }
                },
                error => {
                    const parses = JSON.parse(error);
                    this.swalPopUpMsg(parses.data);
                });
    }
    //#endregion button Generate
}


