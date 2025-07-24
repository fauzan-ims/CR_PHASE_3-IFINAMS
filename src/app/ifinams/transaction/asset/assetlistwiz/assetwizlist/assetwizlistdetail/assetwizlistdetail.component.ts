import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './assetwizlistdetail.component.html'
})

export class AssetwizlistdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    bcwidth = 1;
    bcheight = 30;

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public isCount: Boolean = false;
    public assetData: any = [];
    public orderdetaillist: any = [];
    private dataTamp: any = [];
    private dataRoleTamp: any = [];
    private dataUpdateTamp: any = [];
    public setStyle: any = [];
    public lookupitem: any = [];
    public lookuprequestor: any = [];
    public lookupvendor: any = [];
    public lookuptype: any = [];
    public lookupcategory: any = [];
    public lookupbranch: any = [];
    public lookuplocation: any = [];
    public lookupdivision: any = [];
    public lookupdepartment: any = [];
    public lookupsubdepartment: any = [];
    public lookupunits: any = [];
    public lookuppic: any = [];
    public lookupCostCenter: any = [];
    public lookupdeprecomm: any = [];
    public lookupdeprefiscal: any = [];
    public lookupbarcode: any = [];
    public lookuplastlocation: any = [];
    public lookupParkingLocation: any = [];
    public is_maintenance: String;
    public is_rental: String;
    public maintenance_type: any;
    public isReadOnly: Boolean = false;
    public lookupprovincecode: any = [];
    public lookupcitycode: any = [];
    public lookupprocessstatus: any = [];
    public is_re_rent: Boolean = false;
    public is_re_rent2: Boolean = false;
    public is_re_rent3: Boolean = false;
    public isEditingLocation: boolean = false;


    //controller
    private APIController: String = 'Asset';
    private APIControllerCostCenter: String = 'CostCenter';
    private APIControllerItem: String = 'MasterItem';
    private APIControllerVendor: String = 'MasterVendor';
    private APIControllerSysEmployeeMain: String = 'SysEmployeeMain';
    private APIControllerBarcode: String = 'MasterBarcodeRegisterDetail';
    private APIControllerType: String = 'SysGeneralSubcode';
    private APIControllerCategory: String = 'MasterCategory';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerLocation: String = 'MasterLocation';
    private APIControllerDivision: String = 'SysDivision';
    private APIControllerDepartment: String = 'SysDepartment';
    private APIControllerSubDepartment: String = 'MasterSubDepartment';
    private APIControllerMasterDepreComm: String = 'MasterDepreCategoryCommercial';
    private APIControllerMasterDepreFiscal: String = 'MasterDepreCategoryFiscal';
    private APIControllerUnits: String = 'MasterUnit';
    private APIControllerSysCityCode: String = 'SysCity';
    private APIControllerSysProvinceCode: String = 'SysProvince';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteLookupForItem: String = 'GetRowsForLookupAsset';
    private APIRouteLookupFixedAsset: String = 'GetRowsForLookupFixedAssetItemGroup';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForReturn: String = 'ExecSpForReturn';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForReject: String = 'ExecSpForReject';
    private APIRouteForGenerateBarcode: String = 'ExecSpForGenerateBarcode';
    private APIRouteForGenerateQRCode: String = 'ExecSpForGenerateQRCode';
    private APIRouteForLockUnlock: String = 'ExecSpForLockUnlock';
    private APIGetRowsLookupByProvinceCode: String = 'GetRowsLookupByProvinceCode';
    private APIRouteForAssetAsStock: String = 'ExecSpForAssetAsStock';
    private APIRouteForAssetAsReplacement: String = 'ExecSpForAssetAsReplacement';
    private APIRouteForProcessStatus: String = 'GetRowsForLookupProcessStatus';
    private APIRouteForRentReturn: String = 'ExecSpForAssetRentReturn';
    private APIRouteForUpdateLocation: String = 'AssetLocationHistoryInsert';

    private RoleAccessCode = 'R00021450000000A';

    //
    public values: string = null;
    public name: string = null;
    public level: "L" | "M" | "Q" | "H";
    public width: number;

    // form 2 way binding
    model: any = {};

    // checklist
    public selectedAll: any;
    private checkedList: any = [];

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
    ) {
        super();
        this.level = "L";
        this.values = "";
        this.name = "";
        this.width = 60;
    }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.Delimiter(this._elementRef);
        if (this.param != null) {
            this.callGetrow();
        } else {
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.status = 'HOLD';
            this.model.purchase_price = 0;
            this.model.original_price = 0;
            this.model.sale_amount = 0;
            this.model.residual_value = 0;
            this.model.total_depre_comm = 0;
            this.model.net_book_value_comm = 0;
            this.model.total_depre_fiscal = 0;
            this.model.net_book_value_fiscal = 0;
            this.model.pph = 0;
            this.model.ppn = 0;
            this.maintenance_type = 'DAY';
            this.model.condition = 'NEW';
            this.model.asset_from = 'RENT';
            this.model.asset_purpose = 'LEASE';
            this.model.spaf_amount = 0;
            this.model.subvention_amount = 0;
        }
    }
    redirectTo(uri: string) {
        this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.route.navigate([uri]));
    }


    //#region button back
    btnBack() {
        // this.redirectTo('/transaction/subasset/');
        // this.route.navigate(['/transaction/subasset/'], { skipLocationChange: true });
        // $('#datatable').DataTable().ajax.reload();

        this.route.navigate(['/transaction/subasset']);
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region qrLevel
    qrLevel(val: "L" | "M" | "Q" | "H") {
        this.level = val;
    }
    //#endregion qrLevel

    //#region qrData
    qrData(val: string) {
        this.values = val;
    }
    //#endregion qrData

    //#region qrName
    qrName(val: string) {
        this.name = val;
    }
    //#endregion qrName

    //#region qrWidth
    qrWidth(val: number) {
        this.width = val;
    }
    //#endregion qrWidth

    //#region Maintenance
    // Maintenance(event: any) {
    //     this.is_maintenance = event.target.value;
    //     $('#timeMaintenance').val('');
    //     $('#typeMaintenance').val('');
    //     $('#cycleMaintenance').val('');
    //     $('#dateMaintenance').val('');
    // }
    //#endregion Maintenance

    //#region getrow data
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

                    if (parsedata.status != 'HOLD') {
                        this.isReadOnly = true;
                    } else {
                        this.isReadOnly = false;
                    }

                    if (parsedata.rental_status != 'IN USE') {
                        this.is_re_rent = true;
                        this.is_re_rent2 = true;
                        this.is_re_rent3 = true;
                    } else {
                        this.is_re_rent = false;
                        this.is_re_rent2 = false;
                        this.is_re_rent3 = false;
                    }

                    // checkbox
                    if (parsedata.is_maintenance === '1') {
                        parsedata.is_maintenance = true;
                    } else {
                        parsedata.is_maintenance = false;
                    }
                    // end checkbox

                    // checkbox
                    if (parsedata.is_depre === '1') {
                        parsedata.is_depre = true;
                    } else {
                        parsedata.is_depre = false;
                    }
                    // end checkbox

                    // checkbox
                    if (parsedata.is_rental === '1') {
                        parsedata.is_rental = true;
                    } else {
                        parsedata.is_rental = false;
                    }
                    // end checkbox

                    // checkbox
                    if (parsedata.is_lock === '1') {
                        parsedata.is_lock = true;
                    } else {
                        parsedata.is_lock = false;
                    }
                    // end checkbox

                    setTimeout(() => {
                        if (parsedata.type_code === 'ELCT') {
                            if (parsedata.is_maintenance != true || parsedata.is_maintenance != '1') {
                                $('#tabassetmaintenance').remove();
                            }
                            $('#tabassetvehicle').remove();
                            $('#tabassetother').remove();
                            $('#tabassetfurniture').remove();
                            $('#tabassetmachine').remove();
                            $('#tabassetproperty').remove();
                            $('#tabassethe').remove();
                            this.assetelectronicwiz();
                        } else if (parsedata.type_code === 'FNTR') {
                            if (parsedata.is_maintenance != true || parsedata.is_maintenance != '1') {
                                $('#tabassetmaintenance').remove();
                            }
                            $('#tabassetvehicle').remove();
                            $('#tabassetother').remove();
                            $('#tabassetelectronic').remove();
                            $('#tabassetmachine').remove();
                            $('#tabassetproperty').remove();
                            $('#tabassethe').remove();
                            this.assetfurniturewiz();
                        } else if (parsedata.type_code === 'MCHN') {
                            if (parsedata.is_maintenance != true || parsedata.is_maintenance != '1') {
                                $('#tabassetmaintenance').remove();
                            }
                            $('#tabassetvehicle').remove();
                            $('#tabassetother').remove();
                            $('#tabassetelectronic').remove();
                            $('#tabassetfurniture').remove();
                            $('#tabassetproperty').remove();
                            $('#tabassethe').remove();
                            this.assetmachinewiz();
                        } else if (parsedata.type_code === 'OTHR') {
                            if (parsedata.is_maintenance != true || parsedata.is_maintenance != '1') {
                                $('#tabassetmaintenance').remove();
                            }
                            $('#tabassetvehicle').remove();
                            $('#tabassetmachine').remove();
                            $('#tabassetelectronic').remove();
                            $('#tabassetfurniture').remove();
                            $('#tabassetproperty').remove();
                            $('#tabassethe').remove();
                            this.assetotherwiz();
                        } else if (parsedata.type_code === 'PRTY') {
                            if (parsedata.is_maintenance != true || parsedata.is_maintenance != '1') {
                                $('#tabassetmaintenance').remove();
                            }
                            $('#tabassetvehicle').remove();
                            $('#tabassetmachine').remove();
                            $('#tabassetelectronic').remove();
                            $('#tabassetfurniture').remove();
                            $('#tabassetother').remove();
                            $('#tabassethe').remove();
                            this.assetpropertywiz();
                        } else if (parsedata.type_code === 'VHCL') {
                            if (parsedata.is_maintenance != true || parsedata.is_maintenance != '1') {
                                $('#tabassetmaintenance').remove();
                            }
                            $('#tabassetproperty').remove();
                            $('#tabassetmachine').remove();
                            $('#tabassetelectronic').remove();
                            $('#tabassetfurniture').remove();
                            $('#tabassetother').remove();
                            $('#tabassethe').remove();
                            this.assetvehiclewiz();
                        } else if (parsedata.type_code === 'HE') {
                            if (parsedata.is_maintenance != true || parsedata.is_maintenance != '1') {
                                $('#tabassetmaintenance').remove();
                            }
                            $('#tabassetproperty').remove();
                            $('#tabassetmachine').remove();
                            $('#tabassetelectronic').remove();
                            $('#tabassetfurniture').remove();
                            $('#tabassetother').remove();
                            $('#tabassetvehicle').remove();
                            this.assethewiz();
                        }
                        this.wizard();
                    }, 500);

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

    //#region form submit
    onFormSubmit(AssetForm: NgForm, isValid: boolean) {

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

        this.assetData = this.JSToNumberFloats(AssetForm);

        if (this.assetData.p_reserved_date == null || this.assetData.p_reserved_date === '') {
            this.assetData.p_reserved_date = undefined;
        }

        if (this.assetData.p_is_maintenance == null || this.assetData.p_is_maintenance === '') {
            this.assetData.p_is_maintenance = false;
        }
        if (this.assetData.p_is_rental == null) {
            this.assetData.p_is_rental = false;
        }
        if (this.assetData.p_invoice_date == null || this.assetData.p_invoice_date === '') {
            this.assetData.p_invoice_date = undefined;
        }
        if (this.assetData.p_sale_date == null || this.assetData.p_sale_date === '') {
            this.assetData.p_sale_date = undefined;
        }
        if (this.assetData.p_disposal_date == null || this.assetData.p_disposal_date === '') {
            this.assetData.p_disposal_date = undefined;
        }
        if (this.assetData.p_contractor_start_date == null || this.assetData.p_contractor_start_date === '') {
            this.assetData.p_contractor_start_date = undefined;
        }
        if (this.assetData.p_contractor_end_date == null || this.assetData.p_contractor_end_date === '') {
            this.assetData.p_contractor_end_date = undefined;
        }
        if (this.assetData.p_rental_date == null || this.assetData.p_rental_date === '') {
            this.assetData.p_rental_date = undefined;
        }
        if (this.assetData.p_purchase_date == null || this.assetData.p_purchase_date === '') {
            this.assetData.p_purchase_date = undefined;
        }
        if (this.assetData.p_warranty_start_date == null || this.assetData.p_warranty_start_date === '') {
            this.assetData.p_warranty_start_date = undefined;
        }
        if (this.assetData.p_po_date == null || this.assetData.p_po_date === '') {
            this.assetData.p_po_date = undefined;
        }
        if (this.assetData.p_warranty_end_date == null || this.assetData.p_warranty_end_date === '') {
            this.assetData.p_warranty_end_date = undefined;
        }
        if (this.assetData.p_maintenance_start_date == null || this.assetData.p_maintenance_start_date === '') {
            this.assetData.p_maintenance_start_date = undefined;
        }
        if (this.assetData.p_maintenance_cycle_time == null || this.assetData.p_maintenance_cycle_time === '') {
            this.assetData.p_maintenance_cycle_time = '0';
        }
        if (this.assetData.p_maintenance_time == null || this.assetData.p_maintenance_time === '') {
            this.assetData.p_maintenance_time = '0';
        }
        if (this.assetData.p_warranty == null || this.assetData.p_warranty === '') {
            this.assetData.p_warranty = '0';
        }
        if (this.assetData.p_last_service_date == null || this.assetData.p_last_service_date === '') {
            this.assetData.p_last_service_date = undefined;
        }
        if (this.assetData.p_last_service_date == null || this.assetData.p_last_service_date === '') {
            this.assetData.p_last_service_date = undefined;
        }
        if (this.assetData.p_last_so_date == null || this.assetData.p_last_so_date === '') {
            this.assetData.p_last_so_date = undefined;
        }
        if (this.assetData.p_is_depre == null) {
            this.assetData.p_is_depre = false;
        }
        if (this.assetData.p_reserved_date == null || this.assetData.p_reserved_date === '') {
            this.assetData.p_reserved_date = undefined;
        }
        const usersJson: any[] = Array.of(this.assetData);

        if (this.param != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            if (this.model.is_maintenance != this.assetData.p_is_maintenance) {
                                this.redirectTo('/transaction/subasset/assetwizlistdetail/' + this.param);
                            } else {
                                this.showNotification('bottom', 'right', 'success');
                                this.redirectTo('/transaction/subasset/assetwizlistdetail/' + this.param);
                                this.showSpinner = false;
                            }
                        } else {
                            this.swalPopUpMsg(parse.data);
                            this.showSpinner = false;
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                        this.showSpinner = false;
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
                            this.route.navigate(['/transaction/subasset/assetwizlistdetail', parse.code]);
                        } else {
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                    });
        }
    }
    //#endregion form submit

    //#region Asset list tabs
    assetvehiclewiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetailvehicledetail', this.param]); // , { skipLocationChange: true } 
    }
    assetotherwiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetailothersdetail', this.param]); // , { skipLocationChange: true }
    }
    assetelectronicwiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetailelectronicdetail', this.param]); // , { skipLocationChange: true }
    }
    assetfurniturewiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetailfurnituredetail', this.param]); // , { skipLocationChange: true }
    }
    assethewiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetailhedetail', this.param]); // , { skipLocationChange: true }
    }
    assetmachinewiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetailmachinedetail', this.param]); // , { skipLocationChange: true }
    }
    assetpropertywiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetailpropertydetail', this.param]); // , { skipLocationChange: true }
    }
    assetdocumentwiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetaildocumentdetail', this.param]); // , { skipLocationChange: true }
    }
    assetmaintenancewiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetailmaintenancedetail', this.param]); // , { skipLocationChange: true }
    }
    assetdepreciationwiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdepreciationwizlist', this.param]); // , { skipLocationChange: true }
    }
    assetbarcodehistorywiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetailbarcodehistorydetail', this.param]); // , { skipLocationChange: true }
    }
    assethistorymovementwiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetailmutationhistorydetail', this.param]); // , { skipLocationChange: true }
    }
    assethistoryadjustmentwiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetailadjustmenthistory', this.param]); // , { skipLocationChange: true }
    }
    assethistoryhandoverwiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetailhandoverhistory', this.param]); // , { skipLocationChange: true }
    }
    assetincomeexpensewiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetincomeexpenselist', this.param]); // , { skipLocationChange: true }
    }
    assetpulibservicewiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetpublicservicelist', this.param]); // , { skipLocationChange: true }
    }
    assetinsurancewiz() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetinsurance', this.param]); // , { skipLocationChange: true }
    }
    assethistoryinsurnace() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assethistoryinsurance', this.param]); // , { skipLocationChange: true }
    }
    assetdetaillocationhistory() {
        this.route.navigate(['/transaction/subasset/assetwizlistdetail/' + this.param + '/assetdetaillocationhistory', this.param]); // , { skipLocationChange: true }
    }
    //#endregion Asset list tabs

    //#region getStyles
    getStyles(isTrue: Boolean) {
        if (isTrue) {
            this.setStyle = {
                'pointer-events': 'none',
            }
        } else {
            this.setStyle = {
                'pointer-events': 'unset',
            }
        }

        return this.setStyle;
    }
    //#endregion getStyles

    //#region btnProceed
    btnProceed() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForProceed)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.ngOnInit();
                                this.callGetrow();
                                $('#assetdetaildocwiz').click();
                                $('#assetdetailelctwiz').click();
                                $('#assetdetailfntrwiz').click();
                                $('#assetdetailmchnwiz').click();
                                $('#assetdetailmaintenancewiz').click();
                                $('#assetdetailotherswiz').click();
                                $('#assetdetailprtywiz').click();
                                $('#assetdetailvhclwiz').click();

                                // $('#reloadtabdetail', parent.parent.document).click();
                                // $('#reloadtabvehicle', parent.parent.document).click();
                                // $('#reloadtabproperty', parent.parent.document).click();
                                // $('#reloadtabother', parent.parent.document).click();
                                // $('#reloadtabmaintenance', parent.parent.document).click();
                                // $('#reloadtabmachine', parent.parent.document).click();
                                // $('#reloadtabfurniture', parent.parent.document).click();
                                // $('#reloadtabelectronic', parent.parent.document).click();
                                // $('#reloadtabdoc', parent.parent.document).click();
                            } else {
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
    //#endregion btnProceed

    //#region btnReturn
    btnReturn() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForReturn)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.ngOnInit();
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#assetdetaildocwiz').click();
                                $('#assetdetailelctwiz').click();
                                $('#assetdetailfntrwiz').click();
                                $('#assetdetailmchnwiz').click();
                                $('#assetdetailmaintenancewiz').click();
                                $('#assetdetailotherswiz').click();
                                $('#assetdetailprtywiz').click();
                                $('#assetdetailvhclwiz').click();
                            } else {
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
    //#endregion btnReturn

    //#region btnCancel
    btnCancel() {
        // param tambahan untuk button Done dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
            'action': 'default'
        }];
        // param tambahan untuk button Done dynamic

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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancel)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#assetdetaildocwiz').click();
                                $('#assetdetailelctwiz').click();
                                $('#assetdetailfntrwiz').click();
                                $('#assetdetailmchnwiz').click();
                                $('#assetdetailmaintenancewiz').click();
                                $('#assetdetailotherswiz').click();
                                $('#assetdetailprtywiz').click();
                                $('#assetdetailvhclwiz').click();
                            } else {
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
    //#endregion btnCancel

    //#region btnPost
    btnPost() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPost)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);

                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#assetdetaildocwiz').click();
                                $('#assetdetailelctwiz').click();
                                $('#assetdetailfntrwiz').click();
                                $('#assetdetailmchnwiz').click();
                                $('#assetdetailmaintenancewiz').click();
                                $('#assetdetailotherswiz').click();
                                $('#assetdetailprtywiz').click();
                                $('#assetdetailvhclwiz').click();
                            } else {
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
    //#endregion btnPost

    //#region btnReject
    btnReject() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForReject)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#assetdetaildocwiz').click();
                                $('#assetdetailelctwiz').click();
                                $('#assetdetailfntrwiz').click();
                                $('#assetdetailmchnwiz').click();
                                $('#assetdetailmaintenancewiz').click();
                                $('#assetdetailotherswiz').click();
                                $('#assetdetailprtywiz').click();
                                $('#assetdetailvhclwiz').click();
                            } else {
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
    //#endregion btnReject

    //#region btnAsStock
    btnAsStock() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForAssetAsStock)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#assetdetaildocwiz').click();
                                $('#assetdetailelctwiz').click();
                                $('#assetdetailfntrwiz').click();
                                $('#assetdetailmchnwiz').click();
                                $('#assetdetailmaintenancewiz').click();
                                $('#assetdetailotherswiz').click();
                                $('#assetdetailprtywiz').click();
                                $('#assetdetailvhclwiz').click();
                            } else {
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
    //#endregion btnAsStock

    //#region btnAsReplacement
    btnAsReplacement() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForAssetAsReplacement)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#assetdetaildocwiz').click();
                                $('#assetdetailelctwiz').click();
                                $('#assetdetailfntrwiz').click();
                                $('#assetdetailmchnwiz').click();
                                $('#assetdetailmaintenancewiz').click();
                                $('#assetdetailotherswiz').click();
                                $('#assetdetailprtywiz').click();
                                $('#assetdetailvhclwiz').click();
                            } else {
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
    //#endregion btnAsReplacement

    //#region btnRentReturn
    btnRentReturn() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForRentReturn)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#assetdetaildocwiz').click();
                                $('#assetdetailelctwiz').click();
                                $('#assetdetailfntrwiz').click();
                                $('#assetdetailmchnwiz').click();
                                $('#assetdetailmaintenancewiz').click();
                                $('#assetdetailotherswiz').click();
                                $('#assetdetailprtywiz').click();
                                $('#assetdetailvhclwiz').click();
                            } else {
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
    //#endregion btnRentReturn

    //#region Item Lookup
    btnLookupItem() {
        $('#datatableLookupItem').DataTable().clear().destroy();
        $('#datatableLookupItem').DataTable({
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
                    'p_transaction_type': 'FXDAST' //FXDAST
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerItem, this.APIRouteLookupForItem).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupitem = parse.data;
                    if (parse.data != null) {
                        this.lookupitem.numberIndex = dtParameters.start;
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

    btnSelectRowItem(code: string, merk_code: string, type_code: string,
        description: string,
        type_asset_code: string,
        type_asset_description: string,
        fa_category_code: string,
        fa_category_name: string,
        code_commercial: string,
        description_commercial: string,
        usefull: string, code_fiscal: string,
        description_fiscal: string,
        item_group_code: string,
        model_code: string, merk_name: string, type_name: string, model_name: string
    ) {

        this.model.item_code = code;
        this.model.item_name = description;
        this.model.type_code = type_asset_code;
        this.model.type_asset_description = type_asset_description;
        this.model.category_code = fa_category_code;
        this.model.category_name = fa_category_name;
        this.model.depre_category_comm_code = code_commercial;
        this.model.description_commercial = description_commercial;
        this.model.use_life = usefull;
        this.model.depre_category_fiscal_code = code_fiscal;
        this.model.description_fiscal = description_fiscal;
        this.model.item_group_code = item_group_code;
        this.model.model_code = model_code;
        this.model.model_name = model_name;
        this.model.merk_code = merk_code;
        this.model.merk_name = merk_name;
        this.model.type_code_asset = type_code;
        this.model.type_name_asset = type_name;
        $('#lookupModalItem').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Item lookup

    //#region Barcode Lookup
    btnLookupBarcode() {
        $('#datatableLookupBarcode').DataTable().clear().destroy();
        $('#datatableLookupBarcode').DataTable({
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
                    'action': ''
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerBarcode, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupbarcode = parse.data;
                    if (parse.data != null) {
                        this.lookupbarcode.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowBarcode(barcode_no: string) {
        this.model.barcode = barcode_no;
        $('#lookupModalBarcode').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearBarcode() {
        this.model.barcode = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Barcode lookup

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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysEmployeeMain, this.APIRouteLookup).subscribe(resp => {
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
        this.model.requestor_code = code;
        this.model.requestor_name = name;
        $('#lookupModalRequestor').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearRequestor() {
        this.model.requestor_code = '';
        this.model.requestor_name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Requestor lookup

    //#region Vendor Lookup
    btnLookupVendor(item_group_code: any) {
        $('#datatableLookupVendor').DataTable().clear().destroy();
        $('#datatableLookupVendor').DataTable({
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
                    'p_item_group_code': item_group_code
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerVendor, this.APIRouteLookupFixedAsset).subscribe(resp => {

                    const parse = JSON.parse(resp);
                    this.lookupvendor = parse.data;

                    if (parse.data != null) {
                        this.lookupvendor.numberIndex = dtParameters.start;
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

    btnSelectRowVendor(code: string, name: string) {
        this.model.vendor_code = code;
        this.model.vendor_name = name;
        $('#lookupModalVendor').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Vendor lookup

    //#region Type Lookup
    btnLookupType() {
        $('#datatableLookupType').DataTable().clear().destroy();
        $('#datatableLookupType').DataTable({
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
                    'p_general_code': 'ASTYPE'
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerType, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookuptype = parse.data;
                    if (parse.data != null) {
                        this.lookuptype.numberIndex = dtParameters.start;
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

    btnSelectRowType(code: string, general_subcode_desc: string) {
        this.model.type_code = code;
        this.model.general_subcode_desc = general_subcode_desc;
        $('#lookupModalType').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Type lookup

    //#region Category Lookup
    btnLookupCategory() {
        $('#datatableLookupCategory').DataTable().clear().destroy();
        $('#datatableLookupCategory').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerCategory, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupcategory = parse.data;
                    if (parse.data != null) {
                        this.lookupcategory.numberIndex = dtParameters.start;
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

    btnSelectRowCategory(code: string, description_category: string, asset_type_code: string) {
        this.model.category_code = code;
        this.model.category_name = description_category;
        this.model.type_code = asset_type_code;
        $('#lookupModalCategory').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearCategory() {
        this.model.category_code = '';
        this.model.category_name = '';
        this.model.type_code = '';
    }
    //#endregion Category lookup

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
                    'p_company_code': this.company_code
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
        // this.model.company_code = company_code;
        this.model.branch_code = code;
        this.model.branch_name = description;
        this.model.location_code = '';
        this.model.description_location = '';
        $('#lookupModalBranch').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Branch lookup

    //#region Cost Center Lookup
    btnLookupCostCenter() {
        $('#datatableLookupCostCenter').DataTable().clear().destroy();
        $('#datatableLookupCostCenter').DataTable({
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
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerCostCenter, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupCostCenter = parse.data;
                    if (parse.data != null) {
                        this.lookupCostCenter.numberIndex = dtParameters.start;
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

    btnSelectRowCostCenter(code: string, description: string) {
        this.model.cost_center_code = code;
        this.model.cost_center_name = description;
        $('#lookupModalCostCenter').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Cost Center lookup

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
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerLocation, this.APIRouteLookup).subscribe(resp => {
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
        // this.model.company_code = company_code;
        this.model.location_code = code;
        this.model.location_name = description_location;
        $('#lookupModalLocation').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Location lookup

    //#region Division Lookup
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
        this.model.division_code = code;
        this.model.division_name = description;
        this.model.department_code = '';
        this.model.department_name = '';
        this.model.sub_department_code = '';
        this.model.sub_department_name = '';
        this.model.units_code = '';
        this.model.units_name = '';
        this.model.pic_code = '';
        this.model.pic_name = '';
        $('#lookupModalDivision').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearDivision() {
        this.model.division_code = '';
        this.model.division_name = '';
        this.model.department_code = '';
        this.model.department_name = '';
        this.model.sub_department_code = '';
        this.model.sub_department_name = '';
        this.model.units_code = '';
        this.model.units_name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Division lookup

    //#region Department Lookup
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
                    'p_division_code': this.model.division_code
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
        this.model.department_code = code;
        this.model.department_name = description;
        this.model.sub_department_code = '';
        this.model.sub_department_name = '';
        this.model.units_code = '';
        this.model.units_name = '';
        this.model.pic_code = '';
        this.model.pic_name = '';
        $('#lookupModalDepartment').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearDepartment() {
        this.model.department_code = '';
        this.model.department_name = '';
        this.model.sub_department_code = '';
        this.model.sub_department_name = '';
        this.model.units_code = '';
        this.model.units_name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Department lookup

    //#region SubDepartment Lookup
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
                    'p_division_code': this.model.division_code,
                    'p_department_code': this.model.department_code
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerSubDepartment, this.APIRouteLookup).subscribe(resp => {
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
        this.model.sub_department_code = code;
        this.model.sub_department_name = description;
        this.model.units_code = '';
        this.model.units_name = '';
        $('#lookupModalSubDepartment').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearSubDepartment() {
        this.model.sub_department_code = '';
        this.model.sub_department_name = '';
        this.model.units_code = '';
        this.model.units_name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion SubDepartment lookup

    //#region Units Lookup
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
                    'p_division_code': this.model.division_code,
                    'p_department_code': this.model.department_code,
                    'p_sub_department_code': this.model.sub_department_code
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
        this.model.units_code = code;
        this.model.units_name = description;
        $('#lookupModalUnits').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearUnits() {
        this.model.units_code = '';
        this.model.units_name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Units lookup

    //#region PIC Lookup
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
                    'p_division_code': this.model.division_code,
                    'p_department_code': this.model.department_code,
                    'p_company_code': this.company_code,
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysEmployeeMain, this.APIRouteLookup).subscribe(resp => {
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
        this.model.pic_code = code;
        this.model.pic_name = name;
        $('#lookupModalPic').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearPic() {
        this.model.pic_code = '';
        this.model.pic_name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion PIC lookup

    //#region Depre Comm Lookup
    btnLookupDepreComm() {
        $('#datatableLookupDepreComm').DataTable().clear().destroy();
        $('#datatableLookupDepreComm').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerMasterDepreComm, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupdeprecomm = parse.data;
                    if (parse.data != null) {
                        this.lookupdeprecomm.numberIndex = dtParameters.start;
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

    btnSelectRowDepreComm(code: string, description_commercial: string, usefull: string) {
        this.model.depre_category_comm_code = code;
        this.model.description_commercial = description_commercial;
        this.model.use_life = usefull;
        $('#lookupModalDepreComm').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearDepreComm() {
        this.model.depre_category_comm_code = '';
        this.model.description_commercial = '';
        this.model.usefull = '';
    }
    //#endregion Depre Comm lookup

    //#region Depre Fiscal Lookup
    btnLookupDepreFiscal() {
        $('#datatableLookupDepreFiscal').DataTable().clear().destroy();
        $('#datatableLookupDepreFiscal').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerMasterDepreFiscal, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupdeprefiscal = parse.data;
                    if (parse.data != null) {
                        this.lookupdeprefiscal.numberIndex = dtParameters.start;
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

    btnSelectRowDepreFiscal(code: string, description_fiscal: string) {
        this.model.depre_category_fiscal_code = code;
        this.model.description_fiscal = description_fiscal;
        $('#lookupModalDepreFiscal').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearDepreFiscal() {
        this.model.depre_category_fiscal_code = '';
        this.model.description_fiscal = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Depre Fiscal lookup

    //#region ddl maintenance_type
    MaintenanceType(event: any) {
        this.model.maintenance_type = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl maintenance_type

    //#region Last Location Lookup
    btnLookupLastLocation() {
        $('#datatableLookupLastLocation').DataTable().clear().destroy();
        $('#datatableLookupLastLocation').DataTable({
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
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerLocation, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookuplastlocation = parse.data;
                    if (parse.data != null) {
                        this.lookuplastlocation.numberIndex = dtParameters.start;
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

    btnSelectRowLastLocation(code: string, description_last_location: string) {
        this.model.last_location_code = code;
        this.model.last_location_name = description_last_location;
        $('#lookupLastLocation').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearLastLoct() {
        this.model.last_location_code = '';
        this.model.last_location_name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Last Location lookup

    //#region Print
    async btnPrints() {
        await this.model.barcode.exportAsBase64Image('JPG');

        let filename = 'Export';
        this.model.barcode.exportImage(filename, 'JPG');
    };

    btnPrint() {
        this.showSpinner = true;
        let filename = 'Export';
        this.model.barcode.exportImage(filename, 'JPG');


        // const rptParam = {
        //     p_user_id: this.userId,
        //     p_code: this.param,
        //     p_print_option: 'PDF'
        // };

        // const dataParam = {
        //     TableName: this.model.table_name,
        //     SpName: this.model.sp_name,
        //     reportparameters: rptParam
        // };

        // this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
        //     this.showSpinner = false;

        //     this.printRptNonCore(res);
        // }, err => {
        //     this.showSpinner = false;

        //     const parse = JSON.parse(err);
        //     this.swalPopUpMsg(parse.data);
        // });

    }
    //#endregion Print

    //#region btnGenerateBarcode
    btnGenerateBarcode() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForGenerateBarcode)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                            } else {
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
    //#endregion btnGenerateBarcode

    //#region btnGenerateQRCode
    btnGenerateQRCode() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForGenerateQRCode)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                            } else {
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
    //#endregion btnGenerateQRCode

    //#region Cost Center Lookup
    // btnLookupCostCenter() {
    //     $('#datatableLookupCostCenter').DataTable().clear().destroy();
    //     $('#datatableLookupCostCenter').DataTable({
    //         'pagingType': 'first_last_numbers',
    //         'pageLength': 5,
    //         'processing': true,
    //         'serverSide': true,
    //         responsive: true,
    //         lengthChange: false, // hide lengthmenu
    //         searching: true, // jika ingin hilangin search box nya maka false
    //         ajax: (dtParameters: any, callback) => {
    //             // param tambahan untuk getrows dynamic
    //             dtParameters.paramTamp = [];
    //             dtParameters.paramTamp.push({
    //                 'default': '',
    //             });

    //             // end param tambahan untuk getrows dynamic
    //             this.dalservice.Getrows(dtParameters, this.APIControllerCostCenter, this.APIRouteLookup).subscribe(resp => {
    //                 const parse = JSON.parse(resp);

    //                 this.lookupCostCenter = parse.data;
    //                 if (parse.data != null) {
    //                     this.lookupCostCenter.numberIndex = dtParameters.start;
    //                 }

    //                 callback({
    //                     draw: parse.draw,
    //                     recordsTotal: parse.recordsTotal,
    //                     recordsFiltered: parse.recordsFiltered,
    //                     data: []
    //                 });
    //             }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
    //         },
    //         columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
    //         language: {
    //             search: '_INPUT_',
    //             searchPlaceholder: 'Search records',
    //             infoEmpty: '<p style="color:red;" > No Data Available !</p> '
    //         },
    //         searchDelay: 800 // pake ini supaya gak bug search
    //     });
    // }

    // btnSelectRowCostCenter(code: string, description: string) {
    //     this.model.cost_center_code = code;
    //     this.model.cost_center_name = description;
    //     $('#lookupModalCostCenter').modal('hide');
    //     $('#datatable').DataTable().ajax.reload();
    // }

    // btnClearCostCenter() {
    //     this.model.cost_center_code = '';
    //     this.model.cost_center_name = '';
    //     $('#datatable').DataTable().ajax.reload();
    // }
    //#endregion PIC lookup

    //#region lock unlock
    btnLock(code: string) {
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForLockUnlock)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);

                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                                $('#assetdetailvhclwiz').click();
                                $('#assetdetailmchnwiz').click();
                                $('#assetdetailelctwiz').click();
                                $('#assetdetailfntrwiz').click();
                                $('#assetdetailotherswiz').click();
                                $('#assetdetailprtywiz').click();
                            } else {
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
    //#endregion lock unlock

    //#region CityCode Lookup
    btnLookupCityCode() {
        $('#datatableLookupCityCode').DataTable().clear().destroy();
        $('#datatableLookupCityCode').DataTable({
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
                    'p_province_code': this.model.unit_province_code,
                    'action': 'getResponse'
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysCityCode, this.APIGetRowsLookupByProvinceCode).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupcitycode = parse.data;

                    if (parse.data != null) {
                        this.lookupcitycode.numberIndex = dtParameters.start;
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

    btnSelectRowCityCode(code: String, description: String) {
        this.model.unit_city_code = code;
        this.model.unit_city_name = description;
        $('#lookupModalCityCode').modal('hide');
    }

    btnClearUnitCity() {
        this.model.unit_city_code = undefined;
        this.model.unit_city_name = undefined;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion CityCode lookup

    //#region ProvinceCode Lookup
    btnLookupProvinceCode() {
        $('#datatableLookupProvinceCode').DataTable().clear().destroy();
        $('#datatableLookupProvinceCode').DataTable({
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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysProvinceCode, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupprovincecode = parse.data;
                    if (parse.data != null) {
                        this.lookupprovincecode.numberIndex = dtParameters.start;
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

    btnSelectRowProvinceCode(code: String, description: String) {
        this.model.unit_province_code = code;
        this.model.unit_province_name = description;
        this.model.unit_city_code = '';
        this.model.unit_city_name = '';
        $('#lookupModalProvinceCode').modal('hide');
    }

    btnClearUnitProvince() {
        this.model.unit_province_code = undefined;
        this.model.unit_province_name = undefined;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ProvinceCode lookup

    //#region getStyles2
    getStyles2(isTrue: Boolean) {

        if (isTrue) {
            this.setStyle = {
                'pointer-events': 'none',
            }
        } else {
            this.setStyle = {
                'cursor': 'auto',
            }
        }

        return this.setStyle;
    }
    //#endregion

    //#region Lookup Process Status
    btnLookupProcessStatus() {
        $('#datatableLookupProcessStatus').DataTable().clear().destroy();
        $('#datatableLookupProcessStatus').DataTable({
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
                    'p_general_code': 'PRSTS'
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerType, this.APIRouteForProcessStatus).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupprocessstatus = parse.data;
                    if (parse.data != null) {
                        this.lookupprocessstatus.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 3] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowProcessStatus(general_subcode_desc: string) {
        this.model.process_status = general_subcode_desc;
        $('#lookupModalProcessStatus').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearProcessStatus() {
        this.model.process_status = undefined;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Lookup Process Status

    //#region Radio Buttn
    Changetype(event: any) {
        this.model.pic_code = '';
        this.model.pic_name = '';
    }
    //#endregion Radio Button
    
    //#region Lookup Parking Location
    btnLookupParkingLocation() {
        $('#datatableLookupParkingLocation').DataTable().clear().destroy();
        $('#datatableLookupParkingLocation').DataTable({
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
                    'p_general_code': 'PRKLOC'
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerType, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupParkingLocation = parse.data;
                    if (parse.data != null) {
                        this.lookupParkingLocation.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 3] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowParkingLocation(general_subcode_desc: string) {
        this.model.parking_location = general_subcode_desc;
        $('#lookupModalParkingLocation').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearParkingLocation() {
        this.model.parking_location = undefined;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Lookup Parking Location

    btnUpdateLocation() {
        this.isEditingLocation = true;
    }

    btnPostUpdateLocation() {
        // Buat payload sesuai dengan kebutuhan SP Anda
        let rawData = {
            'p_asset_code': this.param,
            'p_unit_province_code': this.model.unit_province_code,
            'p_unit_province_name': this.model.unit_province_name,
            'p_unit_city_code': this.model.unit_city_code,
            'p_unit_city_name': this.model.unit_city_name,
            'p_parking_location': this.model.parking_location,
            'p_remark_update_location': this.model.remark_update_location,
            'p_update_location_date': this.model.update_location_date,
            'action': 'default'
        };

        // Konversi date/angka otomatis
        const convertedData = this.JSToNumberFloats(rawData);

        // Bungkus ke dalam array, karena Insert butuh array of object
        this.dataRoleTamp = [convertedData];
        swal({
            title: 'Are you sure?',
            text: 'Do you want to update the asset location?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: 'Yes, Update it!',
            cancelButtonText: 'No',
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
            this.showSpinner = true;

            this.dalservice.Insert(this.dataRoleTamp, this.APIController, this.APIRouteForUpdateLocation)
                .subscribe(
                res => {
                    this.showSpinner = false;
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                    this.showNotification('bottom', 'right', 'success');
                    this.isEditingLocation = false; // Kembalikan ke mode non-edit
                    this.callGetrow(); // Refresh data
                    } else {
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
        });
    }

}

