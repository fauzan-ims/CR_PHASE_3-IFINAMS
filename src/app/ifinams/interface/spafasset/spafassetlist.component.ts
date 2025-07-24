import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../base.component';
import { DALService } from '../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './spafassetlist.component.html'
})

export class SpafassetlistinterfaceComponent extends BaseComponent implements OnInit {
    // variable
    public listspafassetinterface: any = [];

    public tampStatus: String;

    private dataTampPush: any = [];

    //controller
    private APIController: String = 'IfinamsInterfaceSpafAsset';
    //router

        // API Function
    private APIRouteForGetRows: String = 'GetRows';
    //private APIRouteForProceed: String = 'ExecSpForGetProceedPaymentRequest';
    private RoleAccessCode = 'R00024010000001A';

    // checklist
    public selectedAll: any;
    public checkedList: any = [];

    // form 2 way binding
    model: any = {};

    // spinner
    showSpinner: Boolean = false;
    // end

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide(this._location, this._elementRef, this.route);
        this.tampStatus = 'HOLD';
        this.loadData();
    }

    //#region ddl PageStatus
    PageStatus(event: any) {
        this.tampStatus = event.target.value;
        $('#datatablespafassetlistinterface').DataTable().ajax.reload();
    }
    //#endregion ddl PageStatus

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
                    'p_validation_status': this.tampStatus
                });
                
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)
                    this.listspafassetinterface = parse.data;
                    if (parse.data != null) {
                        this.listspafassetinterface.numberIndex = dtParameters.start;
                    }
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

    selectAllTable() {
        for (let i = 0; i < this.listspafassetinterface.length; i++) {
        this.listspafassetinterface[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listspafassetinterface.every(function (item: any) {
        return item.selected === true;
        })
    }
    //#endregion Proceed


}
