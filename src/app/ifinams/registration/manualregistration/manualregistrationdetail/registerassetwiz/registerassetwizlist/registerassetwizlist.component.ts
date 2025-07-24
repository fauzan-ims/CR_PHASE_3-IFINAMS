import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './registerassetwizlist.component.html'
})

export class RegisterassetlistComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public listinsuranceasset: any = [];
    private dataTamp: any = [];
    private dataTampPush: any = [];
    public lookupInsuranceAsset: any = [];
    public lookupassettype: any = [];
    public lookupcollateralcategory: any = [];
    public lookupregion: any = [];
    public lookupdepreciation: any = [];
    public lookupoccupation: any = [];
    public InsuranceAssetData: any = [];
    private dataTampProceed: any = [];
    public tampStatus: String;

    private APIController: String = 'InsuranceRegisterAsset';
    private APIControllerHeader: String = 'InsuranceRegister';
    private APIControllerAsset: String = 'Asset';
    private APIControllerCollateralType: String = 'SysGeneralSubcode';
    private APIControllerCollateralCategory: String = 'MasterCollateralCategory';
    private APIControllerMasterRegion: String = 'MasterRegion';
    private APIControllerMasterDepreciation: String = 'MasterDepreciation';
    private APIControllerMasterOccupation: String = 'MasterOccupation';

    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForDelete: String = 'Delete';
    private APIRouteLookupForInsuranceAsset: String = 'GetRowsForLookupInsuranceRegister';
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForInsert: String = 'Insert';

    private RoleAccessCode = 'R00022030000000A';

    // checklist
    public selectedAll: any;
    public checkedList: any = [];
    private checkedLookup: any = [];
    public selectedAllLookup: any;

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
        public route: Router,
        private _location: Location,
        public getRouteparam: ActivatedRoute,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide('', this._elementRef, this.route);
        this.loadData();
        this.callGetrowHeader();
        this.tampStatus = 'ALL';
    }

    //#region getrow data
    callGetrowHeader() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param
        }];
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIControllerHeader, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = parse.data[0];

                    this.model.register_status = parsedata.register_status;

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
                    'p_register_code': this.param,
                    'p_insert_type': this.tampStatus
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    const parse = JSON.parse(resp);
                    this.listinsuranceasset = parse.data;
                    this.listinsuranceasset.numberIndex = dtParameters.start;

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                    this.showSpinner = false;
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            order: [[1, 'asc']],
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 10] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region button add
    btnAdd() {
        this.route.navigate(['/registration/submanualregistrationlist/manualregistrationdetail/' + this.param + '/subregisterperiodlist/' + this.param + '/registerperioddetail', this.param], { skipLocationChange: true });
    }
    //#endregion button add

    //#region button edit
    btnEdit(codeEdit: string) {
        this.route.navigate(['/registration/submanualregistrationlist/manualregistrationdetail/' + this.param + '/subregisterassetlist/' + this.param + '/registerassetdetail', this.param, codeEdit], { skipLocationChange: true });
    }
    //#endregion button edit

    //#region checkbox all table
    btnDeleteAll() {
        this.checkedList = [];
        for (let i = 0; i < this.listinsuranceasset.length; i++) {
            if (this.listinsuranceasset[i].selected) {
                this.checkedList.push(this.listinsuranceasset[i].code);
            }
        }

        // jika tidak di checklist
        if (this.checkedList.length === 0) {
            swal({
                title: this._listdialogconf,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger'
            }).catch(swal.noop)
            return
        }

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
                for (let J = 0; J < this.checkedList.length; J++) {
                    const code = this.checkedList[J];
                    // param tambahan untuk getrow dynamic
                    this.dataTampPush = [{
                        'p_code': code
                    }];
                    // end param tambahan untuk getrow dynamic
                    this.dalservice.Delete(this.dataTampPush, this.APIController, this.APIRouteForDelete)
                        .subscribe(
                            res => {
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    if (this.checkedList.length == J + 1) {
                                        this.showSpinner = false;
                                        $('#datatablesasset').DataTable().ajax.reload();
                                        $('#reloadregisterdetail').click();
                                        this.showNotification('bottom', 'right', 'success');
                                    }
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
            } else {
                this.showSpinner = false;
            }
        });
    }

    selectAllTable() {
        for (let i = 0; i < this.listinsuranceasset.length; i++) {
            this.listinsuranceasset[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listinsuranceasset.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion checkbox all table

    //#region lookup Asset
    btnLookupInsuranceAsset() {
        $('#datatableInsuranceAsset').DataTable().clear().destroy();
        $('#datatableInsuranceAsset').DataTable({
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
                    'p_register_code': this.param,
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerAsset, this.APIRouteLookupForInsuranceAsset).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupInsuranceAsset = parse.data;
                    if (parse.data != null) {
                        this.lookupInsuranceAsset.numberIndex = dtParameters.start;
                    }
                    // if use checkAll use this
                    $('#checkallLookup').prop('checked', false);
                    // end checkall

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
        });
    }
    //#endregion lookup Asset

    //#region lookup Asset Type
    btnLookupAssetType() {
        $('#datatableLookupAssetType').DataTable().clear().destroy();
        $('#datatableLookupAssetType').DataTable({
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
                    'p_general_code': 'ASTYPE',
                    'p_company_code': this.company_code
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerCollateralType, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupassettype = parse.data;
                    if (parse.data != null) {
                        this.lookupassettype.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }],
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowAssetType(code: String, description: String) {
        this.model.collateral_type = code;
        this.model.collateral_type_description = description;
        $('#lookupModalAssetType').modal('hide');
    }
    //#endregion lookup Asset Type

    //#region lookup Collateral category
    btnLookupCollateralCategory() {
        $('#datatableLookupCollateralCategory').DataTable().clear().destroy();
        $('#datatableLookupCollateralCategory').DataTable({
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
                    'p_collateral_type_code': this.model.collateral_type
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerCollateralCategory, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupcollateralcategory = parse.data;
                    if (parse.data != null) {
                        this.lookupcollateralcategory.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }],
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowCollateralCategory(code: String, category_name: string) {
        this.model.collateral_category_code = code;
        this.model.category_name = category_name;
        $('#lookupModalCollateralCategory').modal('hide');
    }
    //#endregion lookup Collateral category

    //#region region lookup
    btnLookupRegion() {
        $('#datatableLookupRegion').DataTable().clear().destroy();
        $('#datatableLookupRegion').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerMasterRegion, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupregion = parse.data;
                    if (parse.data != null) {
                        this.lookupregion.numberIndex = dtParameters.start;
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

    btnSelectRowRegion(code: String, region_name: string) {
        this.model.region_code = code;
        this.model.region_name = region_name;
        $('#lookupModalRegion').modal('hide');
    }
    //#endregion region lookup

    //#region Lookup Depreciation
    btnLookupDepreciation() {
        $('#datatableLookupDepreciation').DataTable().clear().destroy();
        $('#datatableLookupDepreciation').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerMasterDepreciation, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupdepreciation = parse.data;
                    if (parse.data != null) {
                        this.lookupdepreciation.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }],
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowDepreciation(code: String, depreciation_name: string) {
        this.model.depreciation_code = code;
        this.model.depreciation_name = depreciation_name;
        $('#lookupModalDepreciation').modal('hide');
    }
    //#endregion Lookup Depreciation

    //#region lookup occupation
    btnLookupOccupation() {
        $('#datatableLookupOccupation').DataTable().clear().destroy();
        $('#datatableLookupOccupation').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerMasterOccupation, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupoccupation = parse.data;
                    if (parse.data != null) {
                        this.lookupoccupation.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }],
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowOccupation(occupation_code: String, occupation_name: string) {
        this.model.occupation_code = occupation_code;
        this.model.occupation_name = occupation_name;
        $('#lookupModalOccupation').modal('hide');
    }
    //#endregion lookup occupation

    //#region checkbox all lookup
    btnSelectAllLookup(InsuranceAssetForm: NgForm, isValid: boolean) {

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

        this.InsuranceAssetData = InsuranceAssetForm;

        if (this.InsuranceAssetData.p_is_authorized_workshop == null) {
            this.InsuranceAssetData.p_is_authorized_workshop = false;
        }
        if (this.InsuranceAssetData.p_is_commercial == null) {
            this.InsuranceAssetData.p_is_commercial = false;
        }

        this.checkedLookup = [];
        for (let i = 0; i < this.lookupInsuranceAsset.length; i++) {
            if (this.lookupInsuranceAsset[i].selectedLookup) {
                this.checkedLookup.push({
                    assetCode: this.lookupInsuranceAsset[i].code,
                    PurchasePrice: this.lookupInsuranceAsset[i].purchase_price,
                    CollatelarYear: this.lookupInsuranceAsset[i].built_year
                });
            }
        }

        // jika tidak di checklist
        if (this.checkedLookup.length === 0) {
            swal({
                title: this._listdialogconf,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger'
            }).catch(swal.noop)
            return
        }


        // for (let J = 0; J < this.checkedLookup.length; J++) {
        //     this.dataTamp = [{
        //         'p_register_code': this.param,
        //         'p_fa_code': this.checkedLookup[J].assetCode,
        //         'p_collateral_type': this.InsuranceAssetData.p_collateral_type,
        //         'p_collateral_category_code': this.InsuranceAssetData.p_collateral_category_code,
        //         'p_occupation_code': this.InsuranceAssetData.p_occupation_code,
        //         'p_region_code': this.InsuranceAssetData.p_region_code,
        //         'p_is_authorized_workshop': this.InsuranceAssetData.p_is_authorized_workshop,
        //         'p_is_commercial': this.InsuranceAssetData.p_is_commercial,
        //         'p_depreciation_code': this.InsuranceAssetData.p_depreciation_code,
        //         'p_sum_insured_amount': this.checkedLookup[J].PurchasePrice,
        //         'p_collateral_year': this.checkedLookup[J].CollatelarYear
        //     }];
        //     // end param tambahan untuk getrow dynamic
        //     this.dalservice.Insert(this.dataTamp, this.APIController, this.APIRouteForInsert)
        //         .subscribe(
        //             res => {
        //                 this.showSpinner = false;
        //                 const parse = JSON.parse(res);
        //                 if (parse.result === 1) {
        //                     if (this.checkedLookup.length == J + 1) {
        //                         if (this.checkedLookup.length == J + 1) {
        //                             this.callGetrowHeader();
        //                             $('#datatableInsuranceAsset').DataTable().ajax.reload();
        //                             $('#datatablesasset').DataTable().ajax.reload();
        //                             $('#reloadHeader').click();
        //                             this.showNotification('bottom', 'right', 'success');
        //                         }
        //                     }
        //                 } else {
        //                     this.swalPopUpMsg(parse.data);
        //                     this.showSpinner = false;
        //                 }
        //             },
        //             error => {
        //                 const parse = JSON.parse(error);
        //                 this.swalPopUpMsg(parse.data);
        //                 this.showSpinner = false;
        //             }
        //         );
        // }

        setTimeout(() => {
            let th = this;
            var i = 0;
            (function loopInsuranceManualPAdd() {
                if (i < th.checkedLookup.length) {
                    th.dataTampProceed = [{
                        'p_register_code': th.param,
                        'p_fa_code': th.checkedLookup[i].assetCode,
                        'p_collateral_type': th.InsuranceAssetData.p_collateral_type,
                        'p_collateral_category_code': th.InsuranceAssetData.p_collateral_category_code,
                        'p_occupation_code': th.InsuranceAssetData.p_occupation_code,
                        'p_region_code': th.InsuranceAssetData.p_region_code,
                        'p_is_authorized_workshop': th.InsuranceAssetData.p_is_authorized_workshop,
                        'p_is_commercial': th.InsuranceAssetData.p_is_commercial,
                        'p_depreciation_code': th.InsuranceAssetData.p_depreciation_code,
                        'p_sum_insured_amount': th.checkedLookup[i].PurchasePrice,
                        'p_collateral_year': th.checkedLookup[i].CollatelarYear,
                        'p_insert_type': 'NEW'
                    }];
                    th.dalservice.Insert(th.dataTampProceed, th.APIController, th.APIRouteForInsert)
                        .subscribe(
                            res => {
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    if (th.checkedLookup.length == i + 1) {
                                        th.callGetrowHeader();
                                        $('#datatableInsuranceAsset').DataTable().ajax.reload();
                                        $('#datatablesasset').DataTable().ajax.reload();
                                        $('#reloadHeader').click();
                                        th.showNotification('bottom', 'right', 'success');
                                        $('#lookupModalInsuranceAsset').modal('hide');
                                        th.showSpinner = false;
                                    } else {
                                        i++;
                                        loopInsuranceManualPAdd();
                                    }
                                } else {
                                    th.swalPopUpMsg(parse.data);
                                    th.showSpinner = false;
                                }
                            },
                            error => {
                                const parse = JSON.parse(error);
                                th.swalPopUpMsg(parse.data);
                                th.showSpinner = false;
                            });
                }
            })();
        }, 500);
    }

    selectAllLookup() {
        for (let i = 0; i < this.lookupInsuranceAsset.length; i++) {
            this.lookupInsuranceAsset[i].selectedLookup = this.selectedAllLookup;
        }
    }

    checkIfAllLookupSelected() {
        this.selectedAllLookup = this.lookupInsuranceAsset.every(function (item: any) {
            return item.selectedLookup === true;
        })
    }
    //#endregion checkbox all table

    //#region lookup close
    btnLookupClose() {
        this.loadData();
        this.model.collateral_type = '';
        this.model.collateral_type_description = '';
        this.model.collateral_category_code = '';
        this.model.category_name = '';
        this.model.region_code = '';
        this.model.region_name = '';
        this.model.depreciation_code = '';
        this.model.depreciation_name = '';
        this.model.occupation_code = '';
        this.model.occupation_name = '';
    }
    //#endregion lookup close

    //#region ddl PageStatus
    PageStatus(event: any) {
        this.tampStatus = event.target.value;
        $('#datatablesasset').DataTable().ajax.reload();
    }
    //#endregion ddl PageStatus
}
