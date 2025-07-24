import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';
// import { log } from 'console';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './mutationreceivedetail.component.html'
})

export class MutationReceiveDetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public disposalData: any = [];
    public orderdetaillist: any = [];
    public isReadOnly: Boolean = false;
    private dataTamp: any = [];
    public setStyle: any = [];
    public lookupbranchrequest: any = [];
    public lookupbranchfrom: any = [];
    public lookuplocation: any = [];
    public lookupreason: any = [];
    public lookuprequestor: any = [];
    public lookupdivision: any = [];
    public lookupdepartment: any = [];
    public lookupsubdepartment: any = [];
    public lookupunits: any = [];
    public lookuppic: any = [];
    public lookupbranchto: any = [];
    public lookupdivisionto: any = [];
    public lookupdepartmentto: any = [];
    public lookupsubdepartmentto: any = [];
    public lookupunitsto: any = [];
    public lookuplocationto: any = [];
    public lookuppicto: any = [];
    public listmutationreceivedetail: any = [];

    //controller
    private APIController: String = 'Mutation';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerLocation: String = 'MasterLocation';
    private APIControllerRequest: String = 'SysCompanyUserMain';
    private APIControllerDivision: String = 'SysDivision';
    private APIControllerDepartment: String = 'SysDepartment';
    private APIControllerSubDepartment: String = 'MasterSubDepartment';
    private APIControllerUnits: String = 'MasterUnit';
    private APIControllerDetail: String = 'MutationDetail';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForGetRows: String = 'GetRows';
    private RoleAccessCode = 'R00021630002164A';

    // form 2 way binding
    model: any = {};

    // checklist
    public selectedAll: any;

    // spinner
    showSpinner: Boolean = true;
    // end

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private datePipe: DatePipe,
        private _elementRef: ElementRef,
        private parserFormatter: NgbDateParserFormatter
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.Delimiter(this._elementRef);
        if (this.param != null) {
            this.isReadOnly = true;
            // call web service
            this.callGetrow();
            this.loadData();
        } else {
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.status = 'NEW';
        }
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
                    'p_mutation_code': this.param
                });
                // end param tambahan untuk getrows dynamic
                
                
                this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.listmutationreceivedetail = parse.data;

                    if (parse.data != null) {
                        this.listmutationreceivedetail.numberIndex = dtParameters.start;
                    }
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

    //#region getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param
        }];
        // end param tambahan untuk getrow dynamic

        // this._widgetdetailService.WidgetDetailGetrow(this.dataTamp)
        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    //   const parsedata = parse.data[0];
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
    //#endregion getrow data

    //#region button back
    btnBack() {
        this.route.navigate(['/transaction/submutationreceive']);
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion button back

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

    //#region Branch Request Lookup
    btnLookupBranchRequest() {
        $('#datatableLookupBranchRequest').DataTable().clear().destroy();
        $('#datatableLookupBranchRequest').DataTable({
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

                    this.lookupbranchrequest = parse.data;
                    if (parse.data != null) {
                        this.lookupbranchrequest.numberIndex = dtParameters.start;
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

    btnSelectRowBranchRequest(code: string, description: string) {
        this.model.branch_request_code = code;
        this.model.branch_request_name = description;
        $('#lookupModalBranchRequest').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearBranchRequest() {
        this.model.code = '';
        this.model.description = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Branch Request lookup

    //#region From Branch From Lookup
    btnLookupBranchFrom() {
        $('#datatableLookupBranchFrom').DataTable().clear().destroy();
        $('#datatableLookupBranchFrom').DataTable({
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
                    this.lookupbranchfrom = parse.data;
                    if (parse.data != null) {
                        this.lookupbranchfrom.numberIndex = dtParameters.start;
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

    btnSelectRowBranchFrom(code: string, description: string) {
        this.model.from_branch_code = code;
        this.model.from_branch_name = description;
        $('#lookupModalBranchFrom').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearBranchFrom() {
        this.model.code = '';
        this.model.description = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Branch From lookup

    //#region From Division Lookup
    btnLookupDivision() {
        $('#datatableLookupDivision').DataTable().clear().destroy();
        $('#datatableLookupDivision').DataTable({
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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerDivision, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupdivision = parse.data;
                    if (parse.data != null) {
                        this.lookupdivision.numberIndex = dtParameters.start;
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

    btnSelectRowDivision(code: string, description: string) {
        // this.model.company_code = company_code;
        this.model.from_division_code = code;
        this.model.from_division_name = description;
        this.model.from_department_code = '';
        this.model.from_department_name = '';
        this.model.from_sub_department_code = '';
        this.model.from_sub_department_name = '';
        this.model.from_units_code = '';
        this.model.from_units_name = '';
        $('#lookupModalDivision').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearDivision() {
        this.model.code = '';
        this.model.description = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Division lookup

    //#region From Department Lookup
    btnLookupDepartment() {
        $('#datatableLookupDepartment').DataTable().clear().destroy();
        $('#datatableLookupDepartment').DataTable({
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
                    'p_division_code': this.model.from_division_code
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerDepartment, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupdepartment = parse.data;
                    if (parse.data != null) {
                        this.lookupdepartment.numberIndex = dtParameters.start;
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

    btnSelectRowDepartment(code: string, description: string) {
        this.model.from_department_code = code;
        this.model.from_department_name = description;
        this.model.from_sub_department_code = '';
        this.model.from_sub_department_name = '';
        $('#lookupModalDepartment').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearDepartment() {
        this.model.code = '';
        this.model.description = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Department lookup

    //#region From SubDepartment Lookup
    btnLookupSubDepartment() {
        $('#datatableLookupSubDepartment').DataTable().clear().destroy();
        $('#datatableLookupSubDepartment').DataTable({
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
                    'p_division_code': this.model.from_division_code,
                    'p_department_code': this.model.from_department_code
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerSubDepartment, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupsubdepartment = parse.data;
                    if (parse.data != null) {
                        this.lookupsubdepartment.numberIndex = dtParameters.start;
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

    btnSelectRowSubDepartment(code: string, description: string) {
        this.model.from_sub_department_code = code;
        this.model.from_sub_department_name = description;
        $('#lookupModalSubDepartment').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearSubDepartment() {
        this.model.code = '';
        this.model.description = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion SubDepartment lookup

    //#region From Units Lookup
    btnLookupUnits() {
        $('#datatableLookupUnits').DataTable().clear().destroy();
        $('#datatableLookupUnits').DataTable({
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
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerUnits, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupunits = parse.data;
                    if (parse.data != null) {
                        this.lookupunits.numberIndex = dtParameters.start;
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

    btnSelectRowUnits(code: string, description: string) {
        this.model.from_units_code = code;
        this.model.from_units_name = description;
        $('#lookupModalUnits').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearUnits() {
        this.model.code = '';
        this.model.description = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Units lookup

    //#region From Location Lookup
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
                    'p_branch_code': this.model.from_branch_code,
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerLocation, this.APIRouteLookup).subscribe(resp => {
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
        this.model.from_location_code = code;
        this.model.from_description_location = description_location;
        $('#lookupModalLocation').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearLocation() {
        this.model.code = '';
        this.model.description_location = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Location lookup

    //#region From PIC Lookup
    btnLookupPic() {
        $('#datatableLookupPic').DataTable().clear().destroy();
        $('#datatableLookupPic').DataTable({
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
                    'p_module': 'ALL',
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerRequest, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookuppic = parse.data;
                    if (parse.data != null) {
                        this.lookuppic.numberIndex = dtParameters.start;
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

    btnSelectRowPic(code: string, name: string) {
        // this.model.company_code = company_code;
        this.model.from_pic_code = code;
        this.model.from_pic_name = name;
        $('#lookupModalPic').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearPic() {
        this.model.code = '';
        this.model.name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion PIC lookup

    //#region Requestor Lookup
    btnLookupRequestor() {
        $('#datatableLookupRequestor').DataTable().clear().destroy();
        $('#datatableLookupRequestor').DataTable({
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
                    'p_module': 'ALL',
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerRequest, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookuprequestor = parse.data;
                    if (parse.data != null) {
                        this.lookuprequestor.numberIndex = dtParameters.start;
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

    btnSelectRowRequestor(code: string, name: string) {
        // this.model.company_code = company_code;
        this.model.requestor_code = code;
        this.model.requestor_name = name;
        $('#lookupModalRequestor').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearRequestor() {
        this.model.code = '';
        this.model.name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Requestor lookup

    //#region Branch To Lookup
    btnLookupBranchTo() {
        $('#datatableLookupBranchTo').DataTable().clear().destroy();
        $('#datatableLookupBranchTo').DataTable({
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
                    this.lookupbranchto = parse.data;
                    if (parse.data != null) {
                        this.lookupbranchto.numberIndex = dtParameters.start;
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

    btnSelectRowBranchTo(code: string, description: string) {
        this.model.to_branch_code = code;
        this.model.to_branch_name = description;
        $('#lookupModalBranchTo').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearBranchTo() {
        this.model.code = '';
        this.model.description = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Branch To lookup

    //#region Division To Lookup
    btnLookupDivisionTo() {
        $('#datatableLookupDivisionTo').DataTable().clear().destroy();
        $('#datatableLookupDivisionTo').DataTable({
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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerDivision, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupdivisionto = parse.data;
                    if (parse.data != null) {
                        this.lookupdivisionto.numberIndex = dtParameters.start;
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

    btnSelectRowDivisionTo(code: string, description: string) {
        this.model.to_division_code = code;
        this.model.to_division_name = description;
        this.model.to_department_code = '';
        this.model.to_department_name = '';
        this.model.to_sub_department_code = '';
        this.model.to_sub_department_name = '';
        this.model.to_units_code = '';
        this.model.to_units_name = '';
        $('#lookupModalDivisionTo').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearDivisionTo() {
        this.model.code = '';
        this.model.description = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Division To lookup

    //#region Department To Lookup
    btnLookupDepartmentTo() {
        $('#datatableLookupDepartmentTo').DataTable().clear().destroy();
        $('#datatableLookupDepartmentTo').DataTable({
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
                    'p_division_code': this.model.to_division_code
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerDepartment, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupdepartmentto = parse.data;
                    if (parse.data != null) {
                        this.lookupdepartmentto.numberIndex = dtParameters.start;
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

    btnSelectRowDepartmentTo(code: string, description: string) {
        this.model.to_department_code = code;
        this.model.to_department_name = description;
        this.model.to_sub_department_code = '';
        this.model.to_sub_department_name = '';
        $('#lookupModalDepartmentTo').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearDepartmentTo() {
        this.model.code = '';
        this.model.description = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Department To lookup

    //#region SubDepartment To Lookup
    btnLookupSubDepartmentTo() {
        $('#datatableLookupSubDepartmentTo').DataTable().clear().destroy();
        $('#datatableLookupSubDepartmentTo').DataTable({
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
                    'p_division_code': this.model.to_division_code,
                    'p_department_code': this.model.to_department_code
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerSubDepartment, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupsubdepartmentto = parse.data;
                    if (parse.data != null) {
                        this.lookupsubdepartmentto.numberIndex = dtParameters.start;
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

    btnSelectRowSubDepartmentTo(code: string, description: string) {
        this.model.to_sub_department_code = code;
        this.model.to_sub_department_name = description;
        $('#lookupModalSubDepartmentTo').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearSubDepartmentTo() {
        this.model.code = '';
        this.model.description = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion SubDepartment To lookup

    //#region Units To Lookup
    btnLookupUnitsTo() {
        $('#datatableLookupUnitsTo').DataTable().clear().destroy();
        $('#datatableLookupUnitsTo').DataTable({
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
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerUnits, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupunitsto = parse.data;
                    if (parse.data != null) {
                        this.lookupunitsto.numberIndex = dtParameters.start;
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

    btnSelectRowUnitsTo(code: string, description: string) {
        this.model.to_units_code = code;
        this.model.to_units_name = description;
        $('#lookupModalUnitsTo').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearUnitsTo() {
        this.model.code = '';
        this.model.description = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Units To lookup

    //#region Location To Lookup
    btnLookupLocationTo() {
        $('#datatableLookupLocationTo').DataTable().clear().destroy();
        $('#datatableLookupLocationTo').DataTable({
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
                    'p_branch_code': this.model.to_branch_code,
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerLocation, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookuplocationto = parse.data;
                    if (parse.data != null) {
                        this.lookuplocationto.numberIndex = dtParameters.start;
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

    btnSelectRowLocationTo(code: string, description_location: string) {
        this.model.to_location_code = code;
        this.model.to_description_location = description_location;
        $('#lookupModalLocationTo').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearLocationTo() {
        this.model.code = '';
        this.model.description_location = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Location To lookup

    //#region PIC To Lookup
    btnLookupPicTo() {
        $('#datatableLookupPicTo').DataTable().clear().destroy();
        $('#datatableLookupPicTo').DataTable({
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
                    'p_module': 'ALL',
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerRequest, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookuppicto = parse.data;
                    if (parse.data != null) {
                        this.lookuppicto.numberIndex = dtParameters.start;
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

    btnSelectRowPicTo(code: string, name: string) {
        this.model.to_pic_code = code;
        this.model.to_pic_name = name;
        $('#lookupModalPicTo').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearPicTo() {
        this.model.code = '';
        this.model.name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion PIC lookup
}

