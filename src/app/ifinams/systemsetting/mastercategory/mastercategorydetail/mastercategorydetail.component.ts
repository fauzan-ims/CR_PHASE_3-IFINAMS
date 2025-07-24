import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../DALservice.service';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './mastercategorydetail.component.html'
})

export class MastercategorydetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public mastercategoryData: any = [];
    public generalsubcodelist: any = [];
    public isReadOnly: Boolean = false;
    public lookuptypecode: any = [];
    public lookupdeprecommercial: any = [];
    public lookupdeprefiscal: any = [];
    public lookupcoadepreciation: any = [];
    public lookupcoaaccumdepreciation: any = [];
    public lookupcoaprofitsell: any = [];
    public lookupcoalosssell: any = [];
    public setStyle: any = [];
    private dataTamp: any = [];
    private dataRoleTamp: any = [];

    //controller
    private APIController: String = 'MasterCategory';
    private APIControllerTypeCode: String = 'SysGeneralSubcode';
    private APIControllerDepreCommercial: String = 'MasterDepreCategoryCommercial';
    private APIControllerDepreFiscal: String = 'MasterDepreCategoryFiscal';
    private APIControllerMasterGlLink: String = 'JournalGlLink';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForUpdateSatus: String = 'ExecSpForUpdateStatus';
    private RoleAccessCode = 'R00022520000010A';

    // form 2 way binding
    model: any = {};

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
        private _elementRef: ElementRef
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.Delimiter(this._elementRef);
        if (this.param != null) {
            this.isReadOnly = true;

            // call web service
            this.callGetrow();
        } else {
            this.model.is_active = true;
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.asset_amount_threshold = 0;
            this.model.depre_amount_threshold = 0;
            this.model.total_net_book_value_amount = 0;
            this.model.total_accum_depre_amount = 0;
            this.model.total_asset_value = 0;
            this.model.nde = 0;
            this.model.value_type = 'HIGH VALUE';

        }
    }

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

    //#region btnActive
    btnActive(code: string) {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': code,
            'p_company_code': this.company_code,
            'action': 'default'
        }];
        // param tambahan untuk getrole dynamic

        // call web service
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForUpdateSatus)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);

                            if (parse.result === 1) {
                                this.showSpinner = false;
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                            } else {
                                this.showSpinner = false;
                                this.swalPopUpMsg(parse.data);
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data);
                        });
            } else {
                this.showSpinner = false;
            }
        })
    }
    //#endregion btnActive

    //#region getrow data
    callGetrow() {
        this.dataTamp = [{
            'p_code': this.param
        }];

        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);

                    const parsedata = parse.data[0];

                    // checkbox
                    if (parsedata.is_active === '1') {
                        parsedata.is_active = true;
                    } else {
                        parsedata.is_active = false;
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
    //#endregion getrow data

    //#region  form submit
    onFormSubmit(MasterCategoryForm: NgForm, isValid: boolean) {
        // validation form submit
        if (!isValid) {
            swal({
                title: 'Warning',
                text: 'Please Fill a Mandatory Field OR Format Is Invalid',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger',
                type: 'warning'
            }).catch(swal.noop)
            return;
        } else {
            this.showSpinner = true;
        }

        this.mastercategoryData = MasterCategoryForm;
        if (this.mastercategoryData.p_is_active == null) {
            this.mastercategoryData.p_is_active = true
        }
        this.mastercategoryData.p_company_code = this.company_code;
        const usersJson: any[] = Array.of(this.mastercategoryData);
        if (this.param != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showSpinner = false;
                            this.showNotification('bottom', 'right', 'success');
                            this.callGetrow()
                        } else {
                            this.showSpinner = false;
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                    });
        } else {
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showSpinner = false;
                            this.showNotification('bottom', 'right', 'success');
                            this.route.navigate(['/systemsetting/submastercategory/mastercategorydetail', this.mastercategoryData.p_code]);
                        } else {
                            this.showSpinner = false;
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                    });
        }
    }
    //#endregion form submit

    //#region button back
    btnBack() {
        $('#datatable').DataTable().ajax.reload();
        this.route.navigate(['/systemsetting/submastercategory']);
    }
    //#endregion button back

    //#region Asset Type Code Lookup
    btnLookupTypeCode() {
        $('#datatableLookupTypeCode').DataTable().clear().destroy();
        $('#datatableLookupTypeCode').DataTable({
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
                    'p_general_code': 'ASTYPE',
                    'action': 'getResponse'
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerTypeCode, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookuptypecode = parse.data;
                    this.lookuptypecode.numberIndex = dtParameters.start;
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

    btnSelectRowTypeCode(company_code: String, code: string, general_subcode_desc: string) {
        this.model.company_code = company_code;
        this.model.asset_type_code = code;
        this.model.general_subcode_desc = general_subcode_desc;
        $('#lookupModalTypeCode').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Asset Type Code lookup

    //#region Depre commercial Code Lookup
    btnLookupDepreCommercial() {
        $('#datatableLookupDepreCommercial').DataTable().clear().destroy();
        $('#datatableLookupDepreCommercial').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerDepreCommercial, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupdeprecommercial = parse.data;
                    this.lookupdeprecommercial.numberIndex = dtParameters.start;
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

    btnSelectRowDepreCommercial(code: string, description_commercial: string) {
        this.model.depre_cat_commercial_code = code;
        this.model.depre_cat_commercial_name = description_commercial;
        $('#lookupModalDepreCommercial').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Depre commercial Code lookup

    //#region Depre fiscal Code Lookup
    btnLookupDeprefiscal() {
        $('#datatableLookupDeprefiscal').DataTable().clear().destroy();
        $('#datatableLookupDeprefiscal').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerDepreFiscal, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupdeprefiscal = parse.data;
                    this.lookupdeprefiscal.numberIndex = dtParameters.start;
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

    btnSelectRowDeprefiscal(code: string, description_fiscal: string) {
        this.model.depre_cat_fiscal_code = code;
        this.model.depre_cat_fiscal_name = description_fiscal;
        $('#lookupModalDeprefiscal').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Depre fiscal Code lookup

    //#region Coa Depreciation Lookup
    btnLookupCoaDepreciation() {
        $('#datatableLookupCoaDepreciation').DataTable().clear().destroy();
        $('#datatableLookupCoaDepreciation').DataTable({
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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerMasterGlLink, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupcoadepreciation = parse.data;
                    this.lookupcoadepreciation.numberIndex = dtParameters.start;
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

    btnSelectRowCoadepreciation(code: string, name: string) {
        this.model.transaction_depre_code = code;
        this.model.transaction_depre_name = name;
        $('#lookupModalCoaDepreciation').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Coa Depreciation No lookup

    //#region Coa Accum Depreciation Lookup
    btnLookupCoaAccumDepreciation() {
        $('#datatableLookupCoaAccumDepreciation').DataTable().clear().destroy();
        $('#datatableLookupCoaAccumDepreciation').DataTable({
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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerMasterGlLink, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupcoaaccumdepreciation = parse.data;
                    this.lookupcoaaccumdepreciation.numberIndex = dtParameters.start;
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

    btnSelectRowCoaAccumDepreciation(code: string, name: string) {
        this.model.transaction_accum_depre_code = code;
        this.model.transaction_accum_depre_name = name;
        $('#lookupModalCoaAccumDepreciation').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Coa Accum Depreciation lookup

    //#region Coa Profit Sell Lookup
    btnLookupCoaProfitSell() {
        $('#datatableLookupCoaProfitSell').DataTable().clear().destroy();
        $('#datatableLookupCoaProfitSell').DataTable({
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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerMasterGlLink, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupcoaprofitsell = parse.data;
                    this.lookupcoaprofitsell.numberIndex = dtParameters.start;
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

    btnSelectRowcoaprofitsell(code: string, name: string) {
        this.model.transaction_profit_sell_code = code;
        this.model.transaction_profit_sell_name = name;
        $('#lookupModalCoaProfitSell').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Coa Profit Sell lookup

    //#region Coa Loss Sell Lookup
    btnLookupCoaLossSell() {
        $('#datatableLookupCoaLossSell').DataTable().clear().destroy();
        $('#datatableLookupCoaLossSell').DataTable({
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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerMasterGlLink, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupcoalosssell = parse.data;
                    this.lookupcoalosssell.numberIndex = dtParameters.start;
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

    btnSelectRowcoalosssell(code: string, name: string) {
        this.model.transaction_loss_sell_code = code;
        this.model.transaction_loss_sell_name = name;
        $('#lookupModalCoaLossSell').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Coa Loss Sell lookup

}
