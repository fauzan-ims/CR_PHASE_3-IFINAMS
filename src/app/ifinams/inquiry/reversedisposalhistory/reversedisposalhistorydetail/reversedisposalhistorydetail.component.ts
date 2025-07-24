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
    templateUrl: './reversedisposalhistorydetail.component.html'
})

export class ReverseDisposalHistorydetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public ReverseDisposalData: any = [];
    public orderdetaillist: any = [];
    public isReadOnly: Boolean = false;
    private dataTamp: any = [];
    public dataTampGetrow: any = [];
    private dataRoleTamp: any = [];
    public setStyle: any = [];
    public lookupdisposalno: any = [];
    public lookuplocation: any = [];
    public lookupreason: any = [];
    private valDate: any;
    public disposal_code: any = [];

    //controller
    private APIController: String = 'ReverseDisposalHistory';
    private APIControllerDisposalNo: String = 'Disposal';
    private APIControllerReasonReverse: String = 'SysGeneralSubcode';
    private APIControllerType: String = 'SysGeneralSubcode';
    private APIControllerGlobalParam: String = 'GlobalParam';
    private APIControllerJournalDetail: String = 'JournalDetail';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteLookupForReverse: String = 'GetRowsForLookupReverse';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForReturn: String = 'ExecSpForReturn';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForReject: String = 'ExecSpForReject';
    private APIRouteForGetRowForThirdParty: String = 'GetRowForThirdParty';
    private APIRouteForCallThirdParty: String = 'CallThirdParty';
    private RoleAccessCode = 'R00022020000000A';

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
            this.disposaldetailwiz();
        } else {
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.status = 'NEW';
        }
    }

    //#region Sale list tabs
    disposaldetailwiz() {
        this.route.navigate(['/inquiry/subreversedisposalhistorylist/reversedisposalhistorydetail/' + this.param + '/reversedisposaldetailhistorylist', this.param], { skipLocationChange: true });
    }

    disposaldocumentwiz() {
        this.route.navigate(['/inquiry/subreversedisposalhistorylist/reversedisposalhistorydetail/' + this.param + '/reversedisposaldocumenthistorylist/' + this.param + '/' + this.disposal_code + '/disposaldocumenthistorylist', this.param, this.disposal_code], { skipLocationChange: true });
    }
    //#endregion Sale list tabs

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
                    this.valDate = parsedata.disposal_date;
                    this.disposal_code = parsedata.disposal_code;

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
    onFormSubmit(ReverseDisposalForm: NgForm, isValid: boolean) {

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

        this.ReverseDisposalData = this.JSToNumberFloats(ReverseDisposalForm);

        const usersJson: any[] = Array.of(this.ReverseDisposalData);

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
                            this.route.navigate(['/transaction/subreversedisposal/reversedisposaldetail', parse.code]);
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
        this.route.navigate(['/inquiry/subreversedisposalhistorylist']);
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

    //#region Disposal No Lookup
    btnLookupDisposalNo() {
        $('#datatableLookupDisposalNo').DataTable().clear().destroy();
        $('#datatableLookupDisposalNo').DataTable({
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
                this.dalservice.Getrows(dtParameters, this.APIControllerDisposalNo, this.APIRouteLookupForReverse).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupdisposalno = parse.data;
                    if (parse.data != null) {
                        this.lookupdisposalno.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 5] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowDisposalNo(disposal_code: string, disposal_date_lookup: string, description: string, branch_code: string, branch_name: string,
        location_code: string, location_name: string) {
        this.model.disposal_code = disposal_code;
        this.valDate = disposal_date_lookup;
        this.model.description = description;
        this.model.branch_code = branch_code;
        this.model.branch_name = branch_name;
        this.model.location_code = location_code;
        this.model.location_name = location_name;

        this.model.disposal_date = this.dateFormater(disposal_date_lookup);

        $('#lookupModalDisposalNo').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Disposal No lookup

    //#region Reason Reverse lookup
    btnLookupReasonReverse() {
        $('#datatableLookupReasonReverse').DataTable().clear().destroy();
        $('#datatableLookupReasonReverse').DataTable({
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
                    'p_general_code': 'RVRSN',
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerReasonReverse, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupreason = parse.data;
                    if (parse.data != null) {
                        this.lookupreason.numberIndex = dtParameters.start;
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

    btnSelectRowReasonReverse(code: string, general_subcode_desc: string) {
        this.model.reason_reverse_code = code;
        this.model.description_reason = general_subcode_desc;
        $('#lookupModalReasonReverse').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Reason Reverse lookup

    //#region valueDate
    valueDate(event: any) {
        this.model.sale_date = event;
        this.valDate = event.singleDate.formatted;
    }
    //#endregion valueDate

    //#region Reason Lookup
    btnLookupReason() {
        $('#datatableLookupReason').DataTable().clear().destroy();
        $('#datatableLookupReason').DataTable({
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
                    'p_general_code': 'RVRSN'
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerType, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupreason = parse.data;
                    if (parse.data != null) {
                        this.lookupreason.numberIndex = dtParameters.start;
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

    btnSelectRowReason(code: string, general_subcode_desc: string) {
        this.model.reason_type = code;
        this.model.general_subcode_desc = general_subcode_desc;
        $('#lookupModalReason').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Reason lookup
}

