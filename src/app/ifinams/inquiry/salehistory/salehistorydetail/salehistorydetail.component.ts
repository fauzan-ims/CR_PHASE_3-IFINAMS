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
    templateUrl: './salehistorydetail.component.html'
})

export class SaleHistoryDetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public saleData: any = [];
    public orderdetaillist: any = [];
    public isReadOnly: Boolean = false;
    private dataTamp: any = [];
    public dataTampGetrow: any = [];
    private dataRoleTamp: any = [];
    public setStyle: any = [];
    public lookupbranch: any = [];
    public lookuplocation: any = [];
    public lookupreason: any = [];

    //controller
    private APIController: String = 'SaleHistory';
    private APIControllerBranch: String = 'SysBranch';
    private APIControllerLocation: String = 'MasterLocation';
    private APIControllerGlobalParam: String = 'GlobalParam';
    private APIControllerJournalDetail: String = 'JournalDetail';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForReturn: String = 'ExecSpForReturn';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForReject: String = 'ExecSpForReject';
    private APIRouteForGetRowForThirdParty: String = 'GetRowForThirdParty';
    private APIRouteForCallThirdParty: String = 'CallThirdParty';
    private RoleAccessCode = 'R00022040000000A';

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
        this.wizard();
        if (this.param != null) {
            this.isReadOnly = true;
            this.callGetrow();
            this.saledetailwiz();
        } else {
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.status = 'NEW';
            this.model.sale_amount_header = 0;
        }
    }

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

    //#region form submit
    onFormSubmit(SaleForm: NgForm, isValid: boolean) {

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

        this.saleData = this.JSToNumberFloats(SaleForm);

        const usersJson: any[] = Array.of(this.saleData);

        if (this.param != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                            this.callGetrow();
                            $('#datatableSaleDetail').DataTable().ajax.reload();
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
                            this.route.navigate(['/transaction/subsale/saledetail', parse.code]);
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
        this.route.navigate(['/inquiry/subsalehistorylist']);
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region Sale list tabs
    saledetailwiz() {
        this.route.navigate(['/inquiry/subsalehistorylist/salehistorydetail/' + this.param + '/salehistorydetaillist', this.param], { skipLocationChange: true });
    }
    salebiddingwiz() {
        this.route.navigate(['/inquiry/subsalehistorylist/salehistorydetail/' + this.param + '/salebiddinghistorylist', this.param], { skipLocationChange: true });
    }
    saledocumentwiz() {
        this.route.navigate(['/inquiry/subsalehistorylist/salehistorydetail/' + this.param + '/saledocumenthistorylist', this.param], { skipLocationChange: true });
    }
    //#endregion Sale list tabs

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
        this.model.location_code = code;
        this.model.description_location = description_location;
        $('#lookupModalLocation').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Location lookup
}

