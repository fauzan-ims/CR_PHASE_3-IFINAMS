import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { TU } from 'angular-mydatepicker';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './ordertopublicserviceapproval.component.html'
})
export class OrdertopublicserviceapprovalComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public parameterData: any = [];
    public lookupbranch: any = [];
    public lookuppublicservice: any = [];
    public NumberOnlyPattern = this._numberonlyformat;
    public listorderdetail: any = [];
    public lookupBranchName: any = [];
    public listdateOrder: any = [];
    public lookupregistermain: any = [];
    public isReadOnly: Boolean = false;
    public isButton: Boolean = false;
    public isBreak: Boolean = false;
    private branchcode: any = [];
    public reimburse: String;

    private dataTamp: any = [];
    private dataTampPush: any = [];
    private dataRoleTamp: any = [];
    private RoleAccessCode = 'R00022330000000A';

    // API Controller
    private APIController: String = 'OrderMain';
    private APIControllerOrderDetail: String = 'OrderDetail';
    private APIControllerRegisterMain: String = 'RegisterMain';
    private APIControllerSysBranch: String = 'SysBranch';
    private APIControllerPublicService: String = 'MasterPublicService';
    private APIRouteForUpdateIsValid: String = 'ExecSpForUpdateIsValid';

    // API Function
    public readOnlyListDetail: string;
    public idDetailList: string;
    private APIRouteLookupRegisterMain: String = 'GetRowsLookupForOrderDetail';
    private APIRouteForGetRowsForOrderDetail: String = 'GetRows';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForGetRow: String = 'GETROW';
    private APIRouteForInsert: String = 'INSERT';
    private APIRouteForUpdate: String = 'UPDATE';
    private APIRouteForGetDelete: String = 'DELETE';
    private APIRouteForProceed: String = 'ExecSpForProceed';
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForCancelPaymentCancel: String = 'ExecSpForCancelPaymentCancel';
    private APIRouteForCancelPaymentProceed: String = 'ExecSpForCancelPaymentProceed';

    // report
    private APIControllerReport: String = 'Report';
    private APIRouteForDownload: String = 'getReport';

    private setStyle: any = [];

    // checklist
    public selectedAllLookup: any;
    public selectedAll: any;
    private checkedList: any = [];
    private checkedLookup: any = [];

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
        private _elementRef: ElementRef,
        private parserFormatter: NgbDateParserFormatter
    ) { super(); }

    ngOnInit() {
        this.Delimiter(this._elementRef);
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

        if (this.param != null) {
            this.isReadOnly = true;
            // call web service
            this.callGetrow();
            this.loadData();
        } else {
            this.model.order_status = 'HOLD';
        }
    }

    //#region load all data
    loadData() {
        this.dtOptions = {
            'pagingType': 'first_last_numbers',
            'pageLength': 10,
            'processing': true,
            'serverSide': true,
            responsive: true,
            lengthChange: false, // hide lengthmenu
            searching: false, // jika ingin hilangin search box nya maka false
            'lengthMenu': [
                [10, 25, 50, 100],
                [10, 25, 50, 100]
            ],
            ajax: (dtParameters: any, callback) => {
                // param tambahan untuk getrow dynamic
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_order_code': this.param
                });
                // end param tambahan untuk getrow dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerOrderDetail, this.APIRouteForGetRowsForOrderDetail).subscribe(resp => {
                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    const parse = JSON.parse(resp)

                    this.listorderdetail = parse.data;
                    this.listorderdetail.numberIndex = dtParameters.start;

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
        }
    }
    //#endregion load all data

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
    //#endregion set datepicker

    //#region getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param
        }]
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    this.branchcode = parsedata.branch_code;

                    if (parsedata.order_status !== 'HOLD') {
                        this.isButton = true;
                    } else {
                        this.isButton = false;
                    }

                    // checkbox
                    if (parsedata.is_editable === '1') {
                        parsedata.is_editable = true;
                    } else {
                        parsedata.is_editable = false;
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
    onFormSubmit(ordertopublicserviceForm: NgForm, isValid: boolean) {
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

        this.parameterData = this.JSToNumberFloats(ordertopublicserviceForm);

        if (this.parameterData.p_editable == null) {
            this.parameterData.p_editable = false;
        }
        const usersJson: any[] = Array.of(this.parameterData);
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
                            this.showNotification('bottom', 'right', 'success')
                            this.route.navigate(['/birojasa/ordertobirojasalist/ordertopublicservicedetail', parse.code]);
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

    //#region changePct
    changePct(event, id: any, from: String, index: any) {

        this.idDetailList = id;
        this.listdateOrder = [];

        var i = 0;
        var getID = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        var getPCT = $('[name="p_dp_to_public_service"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getPCT.length) {
            if (getID[i] == this.idDetailList) {
                getPCT[i] = parseFloat(getPCT[i]);
                this.listdateOrder.push(
                    this.JSToNumberFloats({
                        p_id: getID[i],
                        p_dp_to_public_service: getPCT[i]
                    })
                );
            }
            i++;
        }
        i++;

        //#region web service
        this.dalservice.Update(this.listdateOrder, this.APIControllerOrderDetail, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        // this.showNotification('bottom', 'right', 'success');
                        this.callGetrow();
                        $('#datatables').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);

                });
        // #endregion web service
    }
    //#endregion changePct

    isValid(event: any, id: any) {
        this.showSpinner = true;

        if (event.target.checked === true) {
            this.reimburse = 'T'
        } else {
            this.reimburse = 'F'
        }

        this.dataTamp = [{
            'p_id': id,
            'p_order_code': this.param,
            'p_is_reimburse': this.reimburse,
            'action': 'default'
        }];

        this.dalservice.ExecSp(this.dataTamp, this.APIControllerOrderDetail, this.APIRouteForUpdateIsValid)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.showSpinner = false;
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatables').DataTable().ajax.reload();
                    } else {
                        this.showSpinner = false;
                        this.swalPopUpMsg(parse.data);
                        $('#datatables').DataTable().ajax.reload();
                    }
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data)
                });
    }

}

