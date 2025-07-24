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
    templateUrl: './assetinterfacedetail.component.html'
})

export class AssetInterfacedetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public assetData: any = [];
    public orderdetaillist: any = [];
    public isReadOnly: Boolean = false;
    private dataTamp: any = [];
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
    public lookupdeprecomm: any = [];
    public lookupdeprefiscal: any = [];
    public lookupbarcode: any = [];
    public is_maintenance: String;
    public maintenance_type: any;

    private APIController: String = 'EfamInterfaceAssetController';
    private APIControllerItem: String = 'MasterItem';
    private APIControllerVendor: String = 'MasterVendor';
    private APIControllerRequest: String = 'SysCompanyUserMain';
    private APIControllerBarcode: String = 'MasterBarcodeRegisterDetail';
    private APIControllerType: String = 'SysGeneralSubcode';
    private APIControllerCategory: String = 'MasterCategory';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerLocation: String = 'MasterLocation';
    private APIControllerDivision: String = 'MasterDivision';
    private APIControllerDepartment: String = 'MasterDepartment';
    private APIControllerSubDepartment: String = 'MasterSubDepartment';
    private APIControllerUnits: String = 'MasterUnit';

    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private RoleAccessCode = 'R00011480000000A';

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
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.Delimiter(this._elementRef);
        if (this.param != null) {
            this.isReadOnly = true;
            // call web service
            this.callGetrow();
            setTimeout(() => this.callWizard(this.model.type_code, this.model.is_maintenance), 1000);
        } else {
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.status = 'NEW';
            this.model.purchase_price = 0;
            this.model.original_price = 0;
            this.model.sale_amount = 0;
            this.model.residual_value = 0;
            this.model.total_depre_comm = 0;
            this.model.net_book_value_comm = 0;
            this.model.total_depre_fiscal = 0;
            this.model.net_book_value_fiscal = 0;
            this.maintenance_type = 'DAY';
        }
    }

    callWizard(type_code, is_maintenance) {
        if (type_code === 'ELCT') {
            if (is_maintenance != true || is_maintenance != '1') {
                $('#tabassetinterfacemaintenance').remove();
            }
            $('#tabassetinterfacevehicle').remove();
            $('#tabassetinterfaceother').remove();
            $('#tabassetinterfacefurniture').remove();
            $('#tabassetinterfacemachine').remove();
            $('#tabassetinterfaceproperty').remove();
            this.assetinterfaceelectronicwiz();
        } else if (type_code === 'FNTR') {
            if (is_maintenance != true || is_maintenance != '1') {
                $('#tabassetinterfacemaintenance').remove();
            }
            $('#tabassetinterfacevehicle').remove();
            $('#tabassetinterfaceother').remove();
            $('#tabassetinterfaceelectronic').remove();
            $('#tabassetinterfacemachine').remove();
            $('#tabassetinterfaceproperty').remove();
            this.assetinterfacefurniturewiz();
        } else if (type_code === 'MCHN') {
            if (is_maintenance != true || is_maintenance != '1') {
                $('#tabassetinterfacemaintenance').remove();
            }
            $('#tabassetinterfacevehicle').remove();
            $('#tabassetinterfaceother').remove();
            $('#tabassetinterfaceelectronic').remove();
            $('#tabassetinterfacefurniture').remove();
            $('#tabassetinterfaceproperty').remove();
            this.assetinterfacemachinewiz();
        } else if (type_code === 'OTHR') {
            if (is_maintenance != true || is_maintenance != '1') {
                $('#tabassetinterfacemaintenance').remove();
            }
            $('#tabassetinterfacevehicle').remove();
            $('#tabassetinterfacemachine').remove();
            $('#tabassetinterfaceelectronic').remove();
            $('#tabassetinterfacefurniture').remove();
            $('#tabassetinterfaceproperty').remove();
            this.assetinterfaceotherwiz();
        } else if (type_code === 'PRTY') {
            if (is_maintenance != true || is_maintenance != '1') {
                $('#tabassetinterfacemaintenance').remove();
            }
            $('#tabassetinterfacevehicle').remove();
            $('#tabassetinterfacemachine').remove();
            $('#tabassetinterfaceelectronic').remove();
            $('#tabassetinterfacefurniture').remove();
            $('#tabassetinterfaceother').remove();
            this.assetinterfacepropertywiz();
        } else if (type_code === 'VHCL') {
            if (is_maintenance != true || is_maintenance != '1') {
                $('#tabassetinterfacemaintenance').remove();
            }
            $('#tabassetinterfaceproperty').remove();
            $('#tabassetinterfacemachine').remove();
            $('#tabassetinterfaceelectronic').remove();
            $('#tabassetinterfacefurniture').remove();
            $('#tabassetinterfaceother').remove();
            this.assetinterfacevehiclewiz();
        }
        this.wizard();
        // this.assetdocumentwiz();
    }

    //#region Maintenance
    Maintenance(event: any) {
        this.is_maintenance = event.target.value;
        $('#timeMaintenance').val('');
        $('#typeMaintenance').val('');
        $('#cycleMaintenance').val('');
        $('#dateMaintenance').val('');
    }
    //#endregion Maintenance

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

                    // checkbox
                    if (parsedata.is_maintenance === '1') {
                        parsedata.is_maintenance = true;
                    } else {
                        parsedata.is_maintenance = false;
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

        if (this.assetData.p_is_maintenance == null) {
            this.assetData.p_is_maintenance = false;
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
        if (this.assetData.p_warranty_start_date == null || this.assetData.p_warranty_start_date === '') {
            this.assetData.p_warranty_start_date = undefined;
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

        const usersJson: any[] = Array.of(this.assetData);

        if (this.param != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                            this.callGetrow()
                        } else {
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
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
                            this.route.navigate(['/transaction/subasset/assetdetail', parse.code]);
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

    //#region button back
    btnBack() {
        this.route.navigate(['/interface/subassetinterface']);
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region Asset list tabs
    assetinterfacevehiclewiz() {
        this.route.navigate(['/interface/subassetinterface/assetinterfacedetail/' + this.param + '/assetinterfacevehicledetail', this.param], { skipLocationChange: true });
    }
    assetinterfaceotherwiz() {
        this.route.navigate(['/interface/subassetinterface/assetinterfacedetail/' + this.param + '/assetinterfaceotherdetail', this.param], { skipLocationChange: true });
    }
    assetinterfaceelectronicwiz() {
        this.route.navigate(['/interface/subassetinterface/assetinterfacedetail/' + this.param + '/assetinterfaceelectronicdetail', this.param], { skipLocationChange: true });
    }
    assetinterfacefurniturewiz() {
        this.route.navigate(['/interface/subassetinterface/assetinterfacedetail/' + this.param + '/assetinterfacefurnituredetail', this.param], { skipLocationChange: true });
    }
    assetinterfacemachinewiz() {
        this.route.navigate(['/interface/subassetinterface/assetinterfacedetail/' + this.param + '/assetinterfacemachinedetail', this.param], { skipLocationChange: true });
    }
    assetinterfacepropertywiz() {
        this.route.navigate(['/interface/subassetinterface/assetinterfacedetail/' + this.param + '/assetinterfacepropertydetail', this.param], { skipLocationChange: true });
    }
    assetinterfacedocumentwiz() {
        this.route.navigate(['/interface/subassetinterface/assetinterfacedetail/' + this.param + '/assetinterfacedocumentlist', this.param], { skipLocationChange: true });
    }
    assetinterfacemaintenancewiz() {
        this.route.navigate(['/interface/subassetinterface/assetinterfacedetail/' + this.param + '/assetinterfacemaintenancelist', this.param], { skipLocationChange: true });
    }
    assetinterfacebarcodehistorywiz() {
        this.route.navigate(['/interface/subassetinterface/assetinterfacedetail/' + this.param + '/assetinterfacebarcodehistorylist', this.param], { skipLocationChange: true });
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
                    'p_transaction_type': 'FXDAST'
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerItem, this.APIRouteLookup).subscribe(resp => {
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

    btnSelectRowItem(code: string, description: string) {
        // this.model.company_code = company_code;
        this.model.item_code = code;
        this.model.item_name = description;
        $('#lookupModalItem').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearItem() {
        this.model.code = '';
        this.model.description = '';
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
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerBarcode, this.APIRouteLookup).subscribe(resp => {
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
        this.model.barcode_no = '';
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

    //#region Vendor Lookup
    btnLookupVendor() {
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
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsBam(dtParameters, this.APIControllerVendor, this.APIRouteLookup).subscribe(resp => {
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
        // this.model.company_code = company_code;
        this.model.vendor_code = code;
        this.model.vendor_name = name;
        $('#lookupModalVendor').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearVendor() {
        this.model.code = '';
        this.model.name = '';
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
        // this.model.company_code = company_code;
        this.model.type_code = code;
        this.model.general_subcode_desc = general_subcode_desc;
        $('#lookupModalType').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearType() {
        this.model.code = '';
        this.model.general_subcode_desc = '';
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

    btnSelectRowCategory(code: string, description_category: string, depre_commercial_code: string, depre_fiscal_code: string, depre_category_comm_name: string, depre_category_fiscal_name: string) {
        this.model.category_code = code;
        this.model.description_category = description_category;
        this.model.depre_category_comm_code = depre_commercial_code;
        this.model.depre_category_fiscal_code = depre_fiscal_code;
        this.model.depre_category_comm_name = depre_category_comm_name;
        this.model.depre_category_fiscal_name = depre_category_fiscal_name;
        $('#lookupModalCategory').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearCategory() {
        this.model.code = '';
        this.model.description_category = '';
        this.model.depre_commercial_code = '';
        this.model.depre_fiscal_code = '';
        $('#datatable').DataTable().ajax.reload();
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
        // this.model.company_code = company_code;
        this.model.branch_code = code;
        this.model.branch_name = description;
        this.model.location_code = '';
        this.model.description_location = '';
        $('#lookupModalBranch').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearBranch() {
        this.model.code = '';
        this.model.description = '';
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
        // this.model.company_code = company_code;
        this.model.location_code = code;
        this.model.description_location = description_location;
        $('#lookupModalLocation').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearLocation() {
        this.model.code = '';
        this.model.description_location = '';
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
        $('#lookupModalDivision').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearDivision() {
        this.model.code = '';
        this.model.description = '';
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
        // this.model.company_code = company_code;
        this.model.department_code = code;
        this.model.department_name = description;
        this.model.sub_department_code = '';
        this.model.sub_department_name = '';
        $('#lookupModalDepartment').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearDepartment() {
        this.model.code = '';
        this.model.description = '';
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
        // this.model.company_code = company_code;
        this.model.sub_department_code = code;
        this.model.sub_department_name = description;
        $('#lookupModalSubDepartment').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearSubDepartment() {
        this.model.code = '';
        this.model.description = '';
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
        // this.model.company_code = company_code;
        this.model.units_code = code;
        this.model.units_name = description;
        $('#lookupModalUnits').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearUnits() {
        this.model.code = '';
        this.model.description = '';
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
        this.model.pic_code = code;
        this.model.name = name;
        $('#lookupModalPic').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearPic() {
        this.model.code = '';
        this.model.name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion PIC lookup

    //#region ddl maintenance_type
    MaintenanceType(event: any) {
        this.model.maintenance_type = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl maintenance_type
}

