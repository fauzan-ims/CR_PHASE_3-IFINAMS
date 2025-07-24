import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

@Component({
    selector: 'app-reportberitaacarastockopname',
    templateUrl: './reportberitaacarastockopname.component.html'
})
export class ReportBeritaAcaraStockOpname extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    pageType = this.getRouteparam.snapshot.paramMap.get('page');

    // variable
    public reportData: any = [];
    public lookupsysbranch: any = [];
    public dataTamp: any = [];
    public lookupnik: any = [];
    public lookupregioncode: any = [];
    public lookupareacode: any = [];
    public lookupitemgroupcode: any = [];
    public setStyle: any = [];
    private currentDate = new Date();
    public from_date: any = [];
    public to_date: any = [];
    public DataType: any = [];
    public isButton: Boolean = false;
    public date_type: any = [];
    public lookupbranch: any = [];
    public lookuplocation: any = [];
    public lookupcategory: any = [];

    // report
    private APIControllerReport: String = 'Report';
    private APIRouteForDownload: String = 'getReport';

    private APIController: String = 'SysReport';
    private APIRouteForGetRow: String = 'GETROW';
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForGetPrint: String = 'PrintFileStockOpname';
    private APIControllerSysRegionCode: String = 'MasterRegion';
    private RoleAccessCode = 'R00022200000000A';
    // form 2 way binding
    model: any = {};

    // spinner
    showSpinner: Boolean = true;
    // end

    // datatable
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    // showNotification: any;

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _elementRef: ElementRef
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.model.print_option = 'ExcelRecord';
        this.callGetrow();
    }

    //#region getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param
        }];
        // end param tambahan untuk getrow dynamic
        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
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

    //#region onFormSubmit
    onFormSubmit(rptForm: NgForm, isValid: boolean) {
        if (!isValid) {
            swal({
                allowOutsideClick: false,
                title: 'Warning!',
                text: 'Please Fill a Mandatory Field OR Format Is Invalid',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger',
                type: 'warning'
            }).catch(swal.noop)
            return;
        } else {
            this.showSpinner = true;
        }

        this.reportData = this.JSToNumberFloats(rptForm);


        const rptParam = {
            p_user_id: this.userId,
            p_year: this.reportData.p_year,
            p_region_code: this.reportData.p_region_code,
            p_print_option: 'PDF'
        }        
        const dataParam = {
            TableName: this.model.table_name,
            SpName: this.model.sp_name,
            reportparameters: rptParam
        };
        this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
            this.showSpinner = false;
            this.printRptNonCore(res);
        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    //#endregion onFormSubmit

    //#region button Print
    btnPrint() {
        const rptParam = {
            p_user_id: this.userId,
            p_year: this.reportData.p_year,
            p_region_code: this.model.region_code,
            p_print_option: 'PDF'
        }
        const dataParam = {
            TableName: this.model.table_name,
            SpName: this.model.sp_name,
            reportparameters: rptParam
        };
        this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForGetPrint).subscribe(res => {
            this.showSpinner = false;
            this.printRptNonCore(res);
        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    //#endregion button Print

    //#region button back
    btnBack() {
        this.route.navigate(['/report/' + this.pageType]);
    }
    //#endregion button back

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

    //#region Radio Buttn
    Datetype(event: any) {
        this.DataType = event.target.value;
        if (this.DataType === 'ALL') {
            this.isButton = true;
            // this.model.from_date = Date();
        }
        else {
            this.isButton = false;
        }
    }
    //#endregion Radio Button

    //#region RegionCode Lookup
    btnLookupRegionCode() {
        $('#datatableLookupRegionCode').DataTable().clear().destroy();
        $('#datatableLookupRegionCode').DataTable({
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
                    'action': ''
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowBam(dtParameters, this.APIControllerSysRegionCode, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupregioncode = parse.data;

                    if (parse.data != null) {
                        this.lookupregioncode.numberIndex = dtParameters.start;
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

    btnSelectRowRegionCode(code: String, description: String) {
        this.model.region_code = code;
        this.model.region_description = description;
        $('#lookupModalRegionCode').modal('hide');
    }

    btnClearLookupRegion() {
        this.model.region_code = '';
        this.model.region_description = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion RegionCode lookup
}

