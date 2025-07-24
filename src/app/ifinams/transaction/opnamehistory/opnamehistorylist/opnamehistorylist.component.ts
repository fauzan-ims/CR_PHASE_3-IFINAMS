import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './opnamehistorylist.component.html'
})

export class OpnameHistoryListComponent extends BaseComponent implements OnInit {
    // variable
    public listopnamehistory: any = [];
    public dataTamp: any = [];
    public lookupbranch: any = [];
    public lookuplocation: any = [];
    public system_date = new Date();
    public from_date: any = [];
    public to_date: any = [];
    public status: any;
    public branch_code: any;
    private currentDate = new Date();

    //controller
    private APIController: String = 'OpnameDetail';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerLocation: String = 'MasterLocation';

    //routing
    private APIRouteForGetRows: String = 'GetRowsHistory';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteLookupLocation: String = 'GetRowsForLookupList';
    private RoleAccessCode = 'R00021860000000A';

    // form 2 way binding
    model: any = {};

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    // checklist
    public selectedAll: any;

    // spinner
    showSpinner: Boolean = false;
    // end

    constructor(private dalservice: DALService,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide(this._location, this._elementRef, this.route);
        this.loadData();
        this.Date();
    }

    //#region currentDate
    Date() {
        let day: any = this.currentDate.getDate();
        let from_month: any = this.currentDate.getMonth() + 1;
        let to_month: any = this.currentDate.getMonth() + 2;
        let year: any = this.currentDate.getFullYear();

        if (day < 10) {
            day = '0' + day.toString();
        }
        if (from_month < 10) {
            from_month = '0' + from_month.toString();
        }
        if (to_month < 10) {
            to_month = '0' + to_month.toString();
        }

        this.from_date = { 'year': ~~year, 'month': ~~from_month, 'day': ~~day.toString() };
        const obj = {
            dateRange: null,
            isRange: false,
            singleDate: {
                date: this.from_date,
                // epoc: 1600102800,
                formatted: day.toString() + '/' + from_month + '/' + year,
                // jsDate: new Date(dob[key])
            }
        }

        this.model.from_date = obj
        this.model.to_date = obj
    }
    //#endregion currentDate

    //#region ddl from date
    FromDate(event: any) {
        this.model.from_date = event;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl from date

    //#region ddl to date
    ToDate(event: any) {
        this.model.to_date = event;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl to date

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

                let paramTamps = {};


                paramTamps = {
                    'p_branch_code': this.model.branch_code,
                   // 'p_location_code': this.model.location_code,
                    // 'p_from_date': this.model.from_date,
                    // 'p_to_date': this.model.to_date,
                    'p_company_code': this.company_code
                };

                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall
                    this.listopnamehistory = parse.data;

                    if (parse.data != null) {
                        this.listopnamehistory.numberIndex = dtParameters.start;
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

    //#region Branch Lookup
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
                    'p_company_code': this.company_code,
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerBranch, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupbranch = parse.data;
                    if (parse.data != null) {
                        this.lookupbranch.numberIndex = dtParameters.start;
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

    btnSelectRowBranch(code: string, description: string) {
        this.model.branch_code = code;
        this.model.branch_name = description;
        this.model.location_code = '';
        this.model.description_location = '';
        $('#lookupModalBranch').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearLookupBranch() {
        this.model.branch_code = '';
        this.model.branch_name = '';
        this.model.location_code = '';
        this.model.description_location = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Branch lookup

    //#region Location Lookup
    btnLookupLocation() {
        $('#datatableLookupLocation').DataTable().clear().destroy();
        $('#datatableLookupLocation').DataTable({
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
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerLocation, this.APIRouteLookupLocation).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookuplocation = parse.data;
                    if (parse.data != null) {
                        this.lookuplocation.numberIndex = dtParameters.start;
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

    btnSelectRowLocation(code: string, description_location: string) {
        this.model.location_code = code;
        this.model.description_location = description_location;
        $('#lookupModalLocation').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearLookupLocation() {
        this.model.location_code = '';
        this.model.description_location = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Location lookup


}


