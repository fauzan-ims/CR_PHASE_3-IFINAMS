import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './documentrequestlist.component.html'
})

export class DocumentRequestlistComponent extends BaseComponent implements OnInit {
    // variable
    public listdocumentrequest: any = [];
    public lookupBranch: any = [];
    public branchName: String;
    private branchCode: String;
    public request_status: String = '';
    private APIController: String = 'AmsInterfaceDocumentRequest';
    private APIControllerSysBranch: String = 'SysBranch';

    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForGetrows: String = 'GETROWS';
    private RoleAccessCode = 'R00022660000001A';

    // checklist
    public selectedAll: any;

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    showSpinner: boolean;

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide(this._location, this._elementRef, this.route);
        this.request_status = 'HOLD';
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
                //tambahan param untuk getrows dynamic
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_branch_code': this.branchCode,
                    'p_request_status': this.request_status,
                });
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetrows).subscribe(resp => {
                    const parse = JSON.parse(resp)
                    this.listdocumentrequest = parse.data;

                    if (parse.data != null) {
                        this.listdocumentrequest.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });

                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, searchable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !'
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region ddl Status
    PageStatus(event: any) {
        this.request_status = event.target.value;
        $('#datatableDocRequest').DataTable().ajax.reload();
    }
    //#endregion ddl Status

    //#region Lookup Branch
    btnLookupbranch() {
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
                    'default': ''
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupBranch = parse.data;
                    this.lookupBranch.numberIndex = dtParameters.start;
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [1, 4] }],
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowLookupBranch(branch_code: String, branch_name: String) {
        this.branchCode = branch_code;
        this.branchName = branch_name;
        $('#lookupModalbranch').modal('hide');
        $('#datatableDocRequest').DataTable().ajax.reload();
    }

    btnClearBranch() {
        this.branchCode = undefined;
        this.branchName = undefined;
        $('#datatableDocRequest').DataTable().ajax.reload();
    }
    //#endregion Lookup Branch
}