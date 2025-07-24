
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './registerdetail.component.html'
})

export class RegisterdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public registerData: any = [];
    public lookupbranch: any = [];
    public NumberOnlyPattern = this._numberonlyformat;
    public lookupcollateral: any = [];
    public lookupfacode: any = [];
    public isReadOnly: Boolean = false;
    public isStatus: Boolean = false;

    private dataRoleTamp: any = [];
    private dataTamp: any = [];
    private setStyle: any = [];
    private RoleAccessCode = 'R00022320000000A';

    // API Controller
    private APIController: String = 'RegisterMain';
    private APIControllerFACode: String = 'Asset';
    private APIControllerSysBranch: String = 'SysBranch';

    // API Function
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForLookupAsset: String = 'GetRowsForLookupBiroJasa';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForCancelReceived: String = 'ExecSpForCancelReceived';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForReturn: String = 'ExecSpForReturn';


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
        this.Delimiter(this._elementRef);
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.wizard();

        if (this.param != null) {
            this.isReadOnly = true;

            // call web service
            this.callGetrow();
            this.registerdetailwiz();
        } else {
            this.model.register_process_by = 'INTERNAL'
            this.model.register_status = 'HOLD';
            this.showSpinner = false;
        }
    }

    onRouterOutletActivate(event: any) {
    }

    //#region  set datepicker
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
    //#endregion  set datepicker

    //#region publicserviceDetail getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param,
        }];
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    if (parsedata.register_status !== 'HOLD' && parsedata.register_status !== 'RETURN') {
                        this.isStatus = true;
                    } else {
                        this.isStatus = false;
                    }

                    // checkbox
                    if (parsedata.is_reimburse === '1') {
                        parsedata.is_reimburse = true;
                    } else {
                        parsedata.is_reimburse = false;
                    }
                    if (parsedata.is_reimburse_to_customer === '1') {
                        parsedata.is_reimburse_to_customer = true;
                    } else {
                        parsedata.is_reimburse_to_customer = false;
                    }
                    // end checkbox

                    this.registerdocumentwiz();
                    this.registerdetailwiz();

                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui

                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion publicserviceDetail getrow data

    //#region publicserviceyDetail  form submit
    onFormSubmit(registerForm: NgForm, isValid: boolean) {
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

        this.registerData = this.JSToNumberFloats(registerForm);

        if (this.registerData.p_is_reimburse == null || this.registerData.p_is_reimburse === '') {
            this.registerData.p_is_reimburse = false;
        }

        const usersJson: any[] = Array.of(this.registerData);

        if (this.param != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success')
                        } else {
                            this.swalPopUpMsg(parse.data)
                        }
                    },
                    error => {
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
                            this.showNotification('bottom', 'right', 'success')
                            this.route.navigate(['/birojasa/registerbirojasalist/registerdetail', parse.code]);
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
    //#endregion publicserviceDetail form submit

    //#region publicserviceDetail button back
    btnBack() {
        $('#datatable').DataTable().ajax.reload();
        this.route.navigate(['/birojasa/registerbirojasalist']);
    }
    //#endregion publicserviceDetail button back

    //#region ddl master module
    PageStatus(event: any) {
        this.model.register_process_by = event.target.value;
    }
    //#endregion ddl master module

    //#region public Detail List tabs
    registerdetailwiz() {
        this.route.navigate(['/birojasa/registerbirojasalist/registerdetail/' + this.param + '/registerdetaillist', this.param], { skipLocationChange: true });
    }
    //#endregion public Detail List tabs

    //#region public document list tabs
    registerdocumentwiz() {
        this.route.navigate(['/birojasa/registerbirojasalist/registerdetail/' + this.param + '/registerdocumentlist', this.param], { skipLocationChange: true });
    }
    //#endregion public document list tabs

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
                    'default': ''
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBase(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupbranch = parse.data;
                    this.lookupbranch.numberIndex = dtParameters.start;

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
        this.model.agreement_no = '';
        this.model.agreement_external_no = '';
        this.model.client_name = '';
        this.model.collateral_no = '';
        this.model.collateral_external_no = '';
        this.model.collateral_name = '';
        $('#lookupModalBranch').modal('hide');
    }
    //#endregion Branch lookup

    //#region FA Code Lookup
    btnLookupFACode() {
        $('#datatableLookupFACode').DataTable().clear().destroy();
        $('#datatableLookupFACode').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerFACode, this.APIRouteForLookupAsset).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupfacode = parse.data;
                    if (parse.data != null) {
                        this.lookupfacode.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [4] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowFACode(code: String, description: String, plat_no: String) {
        this.model.fa_code = code;
        this.model.item_name = description;
        this.model.plat_no = plat_no;
        $('#lookupModalFACode').modal('hide');
    }
    //#endregion FA Code lookup

    //#region button Proceed
    btnProceed() {
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            this.showSpinner = true;
            if (result.value) {
                // param tambahan untuk getrole dynamic
                this.dataRoleTamp = [{
                    'p_code': this.param,
                    'action': ''
                }];
                // param tambahan untuk getrole dynamic
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForProceed)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success')
                                this.callGetrow();
                                $('#Servicelist').click();
                                $('#Documentlist').click();
                            } else {
                                this.swalPopUpMsg(parse.data)
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data)
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button Proceed

    //#region button Cancel
    btnCancel() {
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            this.showSpinner = true;
            if (result.value) {
                // param tambahan untuk getrole dynamic
                this.dataRoleTamp = [{
                    'p_code': this.param,
                    'action': ''
                }];
                // param tambahan untuk getrole dynamic
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancel)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success')
                                this.callGetrow();
                                $('#Servicelist').click();
                                $('#Documentlist').click();
                            } else {
                                this.swalPopUpMsg(parse.data)
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data)
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button Cancel

    //#region button Cancel
    btnReturn() {
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            this.showSpinner = true;
            if (result.value) {
                // param tambahan untuk getrole dynamic
                this.dataRoleTamp = [{
                    'p_code': this.param,
                    'action': ''
                }];
                // param tambahan untuk getrole dynamic
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForReturn)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success')
                                this.callGetrow();
                                $('#Servicelist').click();
                                $('#Documentlist').click();
                            } else {
                                this.swalPopUpMsg(parse.data)
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data)
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button Cancel

    //#region button Cancel
    btnCancelReceived() {
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            this.showSpinner = true;
            if (result.value) {
                // param tambahan untuk getrole dynamic
                this.dataRoleTamp = [{
                    'p_code': this.param,
                    'action': ''
                }];
                // param tambahan untuk getrole dynamic
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancelReceived)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success')
                                this.callGetrow();
                            } else {
                                this.swalPopUpMsg(parse.data)
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data)
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button Cancel
}

