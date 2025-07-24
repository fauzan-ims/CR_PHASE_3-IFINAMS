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
    templateUrl: './monitoringgpsdetail.component.html'
})

export class MonitoringGpsDetailComponent extends BaseComponent implements OnInit {
    // get param from url

    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public maintenanceData: any = [];
    public listAssetGpsSchedule: any = [];
    public listDataAssetGps: any = [];
    public isReadOnly: Boolean = false;
    public setStyle: any = [];
    public lookupReasonUnsubsribe: any = [];
    public tempFile: any;
    private dataTamp: any = [];
    public lookupcategory: any = [];
    public lookupvendor: any = [];
    public lookupbank: any = [];
    public maintenanceby: any = [];
    public isDate: Boolean = false;
    public isButton: Boolean = false;
    public lookupSpafAsset: any = [];

    //controller
    private APIController: String = 'MonitoringGps';
    private APIControllerType: String = 'SysGeneralSubcode';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForGetRowsAssetGpsSchedule: String = 'GetRowsAssetGpsSchedule';
    private APIRouteForUnsubscribe: String = 'Insert';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private RoleAccessCode = 'R00024710000001A';

    // form 2 way binding
    model: any = {};

    // checklist
    public selectedAll: any;
    private checkedList: any = [];
    private checkedLookup: any = [];
    public selectedAllLookup: any;

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
            this.callGetrow();
            this.loadData();
        } else {
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.gps_status = 'ALL';
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

                    if (parsedata.gps_status !== 'SUBSCRIBE') {
                        this.isButton = true;
                    } else {
                        this.isButton = false;
                    }

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

    //#region button back
    btnBack() {
        this.route.navigate(['/transaction/submonitoringgpslist']);
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region getStyles
    getStyles(isTrue: Boolean) {
        if (isTrue) {
            this.setStyle = {
                'pointer-events': 'auto',
            }
        } else {
            this.setStyle = {
                'pointer-events': 'none',
            }
        }

        return this.setStyle;
    }
    //#endregion getStyles

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
                    'p_fa_code': this.param,
                    'default': ''
                })
                // end param tambahan untuk getrows dynamic

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRowsAssetGpsSchedule).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.listAssetGpsSchedule = parse.data;
                    if (parse.data != null) {
                        this.listAssetGpsSchedule.numberIndex = dtParameters.start;
                    }
                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 0, 7] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    onFormSubmit(MonitoringGpsForm: NgForm, isValid: boolean) {
        // validation form submit
        // if (!isValid) {
        //     swal({
        //         title: 'Warning',
        //         text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        //         buttonsStyling: false,
        //         confirmButtonClass: 'btn btn-danger',
        //         type: 'warning'
        //     }).catch(swal.noop)
        //     return;
        // } else {
        //     this.showSpinner = true;
        // }

        this.listDataAssetGps = this.JSToNumberFloats(MonitoringGpsForm);

        const usersJson: any[] = Array.of(this.listDataAssetGps);
        console.log(usersJson)
        // call web service
        this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForUnsubscribe)
        .subscribe(
            res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                    this.showNotification('bottom', 'right', 'success');
                    this.route.navigate(['/transaction/submonitoringgpslist/monitoringgpsdetail', this.param]);
                    this.showSpinner = false;
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
    }

    //#region Lookup Process Status
    btnLookupReasonUnsubscribe() {
        $('#datatableLookupReasonUnsubsribe').DataTable().clear().destroy();
        $('#datatableLookupReasonUnsubsribe').DataTable({
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
                    'p_general_code': 'RSUNSB'
                });

                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerType, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupReasonUnsubsribe = parse.data;
                    if (parse.data != null) {
                        this.lookupReasonUnsubsribe.numberIndex = dtParameters.start;
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

    btnSelectRowReasonUnsubsribe(code:string, general_subcode_desc: string) {
        this.model.reason_code = code
        this.model.reason_unsubscribe = general_subcode_desc;
        $('#lookupModalReasonUnsubsribe').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearReasonUnsubsribe() {
        this.model.reason_unsubscribe = undefined;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Lookup Process Status

    //#region lookup close
    btnLookupClose() {
        this.loadData();
    }
    //#endregion lookup close

    //#region btnUnsubscribe
    // btnUnsubscribe(remark: string) {
    //     // param tambahan untuk getrole dynamic
    //     this.dataTamp = [{
    //         'p_fa_code': this.param,
    //         'p_source_reff_no': this.param,
    //         'p_remark': remark
    //     }];
    //     // param tambahan untuk getrole dynamic

    //     // call web service
    //     swal({
    //         title: 'Are you sure?',
    //         type: 'warning',
    //         showCancelButton: true,
    //         confirmButtonClass: 'btn btn-success',
    //         cancelButtonClass: 'btn btn-danger',
    //         confirmButtonText: this._deleteconf,
    //         buttonsStyling: false
    //     }).then((result) => {
    //         if (result.value) {
    //             this.dalservice.Insert(this.dataTamp, this.APIController, this.APIRouteForUnsubscribe)
    //                 .subscribe(
    //                     res => {
    //                         this.showSpinner = false;
    //                         const parse = JSON.parse(res);
    //                         if (parse.result === 1) {
    //                             this.showNotification('bottom', 'right', 'success');
    //                             this.ngOnInit();
    //                             this.callGetrow();
    //                             // this.route.navigate(['transaction/submonitoringgpslist']);
    //                         } else {
    //                             this.swalPopUpMsg(parse.data);
    //                         }
    //                     },
    //                     error => {
    //                         this.showSpinner = false;
    //                         const parse = JSON.parse(error);
    //                         this.swalPopUpMsg(parse.data);
    //                     });
    //         } else {
    //             this.showSpinner = false;
    //         }
    //     })
    // }
    //#endregion btnUnsubscribe
}

