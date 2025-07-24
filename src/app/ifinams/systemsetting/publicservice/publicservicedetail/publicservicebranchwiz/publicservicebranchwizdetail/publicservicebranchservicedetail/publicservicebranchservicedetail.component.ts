import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../base.component';
import { DALService } from '../../../../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './publicservicebranchservicedetail.component.html'
})


export class PublicservicebranchservicedetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');
    paramss = this.getRouteparam.snapshot.paramMap.get('id3');

    // variable
    public publicserviceBranchServiceData: any = [];
    public NumberOnlyPattern = this._numberonlyformat;
    public lookupbranch: any = [];
    public lookupGeneralsubcode: any = [];
    public isReadOnly: Boolean = false;
    
    private dataRoleTamp: any = [];
    private dataTamp: any = [];
    private RoleAccessCode = 'R00021430000000A';

    // API COntroller
    private APIController: String = 'MasterPublicServiceBranchService';
    private APIControllerGeneralsubcode: String = 'SysGeneralSubcode';
    private APIControllerSysBranch: String = 'SysBranch';

    // API Function
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForInsert: String = 'Insert';
    

    // form 2 way binding
    model: any = {};

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
        private _elementRef: ElementRef, private datePipe: DatePipe
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

        this.Delimiter(this._elementRef)
        if (this.paramss != null) {
            this.isReadOnly = true;
            this.wizard();

            // call web service
            this.callGetrow();
        } else {
            this.model.id = this.param;
            this.showSpinner = false;
        }
    }

    //#region publicservicebranchserviceDetail getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_id': this.paramss,
        }];
        // end param tambahan untuk getrow dynamics
        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = parse.data[0];

                    // checkbox
                    if (parsedata.is_default === '1') {
                        parsedata.is_default = true;
                    } else {
                        parsedata.is_default = false;
                    }
                    // end checkbox

                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui

                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion publicservicebranchserviceDetail getrow data

    //#region publicservicebranchserviceDetail form submit
    onFormSubmit(publicservicebranchserviceForm: NgForm, isValid: boolean) {
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
            this.showSpinner = true;
        }

        this.publicserviceBranchServiceData = this.JSToNumberFloats(publicservicebranchserviceForm);

        if (this.publicserviceBranchServiceData.p_is_default == null) {
            this.publicserviceBranchServiceData.p_is_default = false;
        }

        this.publicserviceBranchServiceData.p_public_service_branch_code = this.params;
        const usersJson: any[] = Array.of(this.publicserviceBranchServiceData);

        if (this.param != null && this.params != null && this.paramss != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                        } else {
                            this.swalPopUpMsg(parse.data)
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data)
                        // console.log('There was an error while Updating Data(API) !!!' + error);
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
                            this.route.navigate(['/publicservicebranchwiz/publicservicebranchdetail', this.param, this.params]);
                        } else {
                            this.swalPopUpMsg(parse.data)
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data)
                        // console.log('There was an error while Updating Data(API) !!!' + error);
                    });
        }
    }
    //#endregion publicservicebranchserviceDetail form submit

    //#region publicservicebranchserviceDetail button back
    btnBack() {
        this.route.navigate(['/publicservicebranchwiz/publicservicebranchdetail', this.param, this.params]);
    }
    //#endregion publicservicebranchserviceDetail button back

    //#region branch Province Lookup
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
                    'default': ''
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupbranch = parse.data;
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            'lengthMenu': [
                [5, 25, 50, 100],
                [5, 25, 50, 100]
            ],
            columnDefs: [{ orderable: false, width: '5%', targets: [3] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowBranch(branch_code: String, branch_desc: string) {
        this.model.branch_code = branch_code;
        this.model.branch_name = branch_desc;
        $('#lookupModalBranch').modal('hide');
    }
    //#endregion AddressDetail Provinc lookup

    //#region Public Service Lookup
    btnLookupGeneralsubcode() {
        $('#datatableLookupGeneralsubcode').DataTable().clear().destroy();
        $('#datatableLookupGeneralsubcode').DataTable({
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
                    'p_general_code': 'PBSSVC'
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerGeneralsubcode, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupGeneralsubcode = parse.data;
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            'lengthMenu': [
                [5, 25, 50, 100],
                [5, 25, 50, 100]
            ],
            columnDefs: [{ orderable: false, width: '5%', targets: [3] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowGeneralsubcode(service_code: String, description: string) {
        this.model.service_code = service_code;
        this.model.description = description;
        $('#lookupModalGeneralsubcode').modal('hide');
    }
    //#endregion Public Service lookup
}



