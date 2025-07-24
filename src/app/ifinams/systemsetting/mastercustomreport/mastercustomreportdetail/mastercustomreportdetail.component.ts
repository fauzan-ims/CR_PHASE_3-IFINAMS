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
    templateUrl: './mastercustomreportdetail.component.html'
})

export class MasterCustomReportDetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public MasterCustorReportData: any = [];
    public orderdetaillist: any = [];
    public isReadOnly: Boolean = false;
    public isHidden: Boolean = false;
    public setStyle: any = [];
    private dataTamp: any = [];
    private dataRoleTamp: any = [];
    public lookuptypecode: any = [];
    public lookuptransactiontype: any = [];
    public transaction_type: any;
    public asset_type: any;

    private APIController: String = 'MasterCustomReport';
    private APIControllerTypeCode: String = 'SysGeneralSubcode';
    private APIControllerSysTransactionType: String = 'SysGeneralSubCode';

    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForUpdateSatus: String = 'ExecSpForUpdateStatus';

    private RoleAccessCode = 'R00021280000000A';

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
            this.columnwiz();
        } else {
            this.model.is_active = true;
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.status = 'NEW';
            this.model.transaction_type = 'ASSET';
            this.model.asset_type = 'ELCT';
        }
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

                    // checkbox is active
                    if (parsedata.is_active === '1') {
                        parsedata.is_active = true;
                    } else {
                        parsedata.is_active = false;
                    }
                    // end checkbox is active

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
    onFormSubmit(MasterCustomReportForm: NgForm, isValid: boolean) {
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

        this.MasterCustorReportData = this.JSToNumberFloats(MasterCustomReportForm);
        if (this.MasterCustorReportData.p_is_active == null) {
            this.MasterCustorReportData.p_is_active = true;
        }

        const usersJson: any[] = Array.of(this.MasterCustorReportData);

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
                            this.route.navigate(['/systemsetting/submastercustomreportlist/mastercustomreportdetail', parse.code]);
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
        this.route.navigate(['/systemsetting/submastercustomreportlist']);
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region master custom list tabs
    columnwiz() {
        this.route.navigate(['/systemsetting/submastercustomreportlist/mastercustomreportdetail/' + this.param + '/masterreportcustomcolumn', this.param], { skipLocationChange: true });
    }
    conditionwiz() {
        this.route.navigate(['/systemsetting/submastercustomreportlist/mastercustomreportdetail/' + this.param + '/masterreportcustomcondition', this.param], { skipLocationChange: true });
    }
    //#endregion master custom list tabs

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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerTypeCode, this.APIRouteLookup).subscribe(resp => {
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

    btnSelectRowTypeCode(code: string, general_subcode_desc: string) {
        this.model.asset_type = code;
        this.model.general_subcode_desc = general_subcode_desc;
        $('#lookupModalTypeCode').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Asset Type Code lookup

    //#region TransactionType Lookup
    btnLookupTransactionType() {
        $('#datatableLookupTransactionType').DataTable().clear().destroy();
        $('#datatableLookupTransactionType').DataTable({
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
                    'p_general_code': 'TRANS',
                    'action': 'getResponse'
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysTransactionType, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookuptransactiontype = parse.data;

                    if (parse.data != null) {
                        this.lookuptransactiontype.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            order: [['4', 'asc']],
            columnDefs: [{ orderable: false, width: '5%', targets: [5] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowTransactionType(code: String, description: String) {
        this.model.transaction_type = code;
        this.model.transaction_description = description;
        $('#lookupModalTransactionType').modal('hide');
    }
    //#endregion TransactionType lookup

    //#region btnActive
    btnActive(code: string) {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': code,
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
    //#endregion btnActive

    //#region ddl transaction_type
    TransactionType(event: any) {
        this.transaction_type = event.target.value;
        // this.model.asset_type = '';
        if (this.transaction_type === 'ASSET') {
            this.isHidden = false;
        }
        else {
            this.isHidden = true;
            this.model.asset_type = '';
        }

        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl transaction_type

    //#region ddl transaction_type
    AssetType(event: any) {
        this.asset_type = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl transaction_type

}

