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
    templateUrl: './spafclaimdetail.component.html'
})

export class SpafClaimDetailComponent extends BaseComponent implements OnInit {
    // get param from url

    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public maintenanceData: any = [];
    public orderdetaillist: any = [];
    public isReadOnly: Boolean = false;
    public setStyle: any = [];
    public lookupbranchrequest: any = [];
    public lookupbranch: any = [];
    public lookuplocation: any = [];
    public lookupreason: any = [];
    public lookuprequestor: any = [];
    public lookupdivision: any = [];
    public lookupdepartment: any = [];
    public lookupBarcode: any = [];
    public lookupsubdepartment: any = [];
    public lookupunits: any = [];
    public lookupAsset: any = [];
    public lookupAssetDetail: any = [];
    public lsitspafclaimdetaillist: any = [];
    public uploadFile: any = [];
    public datauploadlist: any = [];
    public listdataDetail: any = [];
    public tempFile: any;
    private dataTampPush: any = [];
    private tamps = new Array();
    private dataTamp: any = [];
    private dataRoleTamp: any = [];
    private tampDocumentCode: String;
    private base64textString: string;
    private idDetailForReason: any;
    public lookupcategory: any = [];
    public lookupvendor: any = [];
    public lookupbank: any = [];
    public maintenanceby: any = [];
    public isDate: Boolean = false;
    public lookupSpafAsset: any = [];

    //controller
    private APIController: String = 'SpafClaim';
    private APIControllerDetail: String = 'SpafClaimDetail';
    private APIControllerSpafAsset: String = 'SpafAsset';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForDelete: String = 'DELETE';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForUploadFile: String = 'Upload';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForReturn: String = 'ExecSpForReturn';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForPost: String = 'ExecSpForPost';
    private RoleAccessCode = 'R00013270000000A';

    // report
    private APIControllerReport: String = 'Report';
    private APIRouteForDownload: String = 'getReport';

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
            this.model.status = 'HOLD';
            this.model.maintenance_by = 'INT';
            this.model.total_claim_amount = 0;
            this.model.service_type = 'ROUTIN';
            this.model.claim_type = 'SPAF';
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

                    if (parsedata.status !== 'HOLD') {
                        this.isDate = true;
                    } else {
                        this.isDate = false;
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

    //#region form submit
    onFormSubmit(SpafClaimForm: NgForm, isValid: boolean) {
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

        this.maintenanceData = this.JSToNumberFloats(SpafClaimForm);

        const usersJson: any[] = Array.of(this.maintenanceData);

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
                            $('#datatablespafclaimdetail').DataTable().ajax.reload();
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
                            this.route.navigate(['/transaction/subspafclaimlist/spafclaimdetail', parse.code]);
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
        this.route.navigate(['/transaction/subspafclaimlist']);
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
                                this.callGetrow();
                                this.showNotification('bottom', 'right', 'success');
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
                    'p_spaf_claim_code': this.param
                })
                // end param tambahan untuk getrows dynamic

                this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    this.lsitspafclaimdetaillist = parse.data;

                    if (parse.data != null) {
                        this.lsitspafclaimdetaillist.numberIndex = dtParameters.start;
                    }

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

    //#region button add
    btnAdd() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [this.JSToNumberFloats({
            'p_maintenance_code': this.param,
            'p_asset_code': '',
            'p_file_name': '',
            'p_path': '',
            'p_quantity': 0,
            'p_service_type': '',
        })];
        // param tambahan untuk getrole dynamic
        this.dalservice.Insert(this.dataRoleTamp, this.APIControllerDetail, this.APIRouteForInsert)
            .subscribe(
                res => {
                    this.showSpinner = false;
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {
                        $('#datatablemaintenancedetail').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
    }
    //#endregion button add

    //#region checkbox all table
    btnDeleteAll() {
        this.checkedList = [];
        for (let i = 0; i < this.lsitspafclaimdetaillist.length; i++) {
            if (this.lsitspafclaimdetaillist[i].selected) {
                this.checkedList.push(this.lsitspafclaimdetaillist[i].id);
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
            if (result.value) {
                this.dataTampPush = [];
                for (let J = 0; J < this.checkedList.length; J++) {
                    const id = this.checkedList[J];
                    // param tambahan untuk getrow dynamic
                    this.dataTampPush = [{
                        'p_id': id
                    }];
                    // end param tambahan untuk getrow dynamic
                    this.dalservice.Delete(this.dataTampPush, this.APIControllerDetail, this.APIRouteForDelete)
                        .subscribe(
                            res => {
                                this.showSpinner = false;
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    if (this.checkedList.length == J + 1) {
                                        this.showNotification('bottom', 'right', 'success');
                                        $('#datatablespafclaimdetail').DataTable().ajax.reload();
                                        this.callGetrow();
                                    }
                                } else {
                                    this.swalPopUpMsg(parse.data);
                                }
                            },
                            error => {
                                const parse = JSON.parse(error);
                                this.swalPopUpMsg(parse.data);
                            });
                }
            } else {
                this.showSpinner = false;
            }
        });
    }

    selectAll() {
        for (let i = 0; i < this.lsitspafclaimdetaillist.length; i++) {
            this.lsitspafclaimdetaillist[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.lsitspafclaimdetaillist.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion checkbox all table

    //#region ddl Maintennace
    Maintenance(event: any) {
        this.model.maintenance_by = event.target.value;
        // this.callGetrow();        
    }
    //#endregion ddl Maintennace

    //#region lookup Asset
    btnLookupSpafAsset() {
        $('#datatableSpafAsset').DataTable().clear().destroy();
        $('#datatableSpafAsset').DataTable({
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
                    'p_code': this.param,
                    'p_claim_type': this.model.claim_type
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIControllerSpafAsset, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.lookupSpafAsset = parse.data;
                    if (parse.data != null) {
                        this.lookupSpafAsset.numberIndex = dtParameters.start;
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

    //#region lookup close
    btnLookupClose() {
        this.loadData();
    }
    //#endregion lookup close

    //#region checkbox all lookup
    btnSelectAllLookup() {
        this.checkedLookup = [];
        for (let i = 0; i < this.lookupSpafAsset.length; i++) {
            if (this.lookupSpafAsset[i].selectedLookup) {
                this.checkedLookup.push({
                    spafAsset: this.lookupSpafAsset[i].code,
                    spafPct: this.lookupSpafAsset[i].spaf_pct,
                    spafAmount: this.lookupSpafAsset[i].spaf_amount,
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
        for (let J = 0; J < this.checkedLookup.length; J++) {
            this.dataTamp = [{
                'p_spaf_claim_code': this.param,
                'p_spaf_asset_code': this.checkedLookup[J].spafAsset,
                'p_spaf_pct': this.checkedLookup[J].spafPct,
                'p_claim_amount': this.checkedLookup[J].spafAmount
            }];
            // end param tambahan untuk getrow dynamic
            this.dalservice.Insert(this.dataTamp, this.APIControllerDetail, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            if (this.checkedLookup.length == J + 1) {
                                if (this.checkedLookup.length == J + 1) {
                                    $('#datatablespafclaimdetail').DataTable().ajax.reload();
                                    $('#datatableSpafAsset').DataTable().ajax.reload();
                                    $('#reloadHeader').click();
                                    this.showNotification('bottom', 'right', 'success');
                                    this.callGetrow();
                                }
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
                    }
                );

        }
    }

    selectAllLookup() {
        for (let i = 0; i < this.lookupSpafAsset.length; i++) {
            this.lookupSpafAsset[i].selectedLookup = this.selectedAllLookup;
        }
    }

    checkIfAllLookupSelected() {
        this.selectedAllLookup = this.lookupSpafAsset.every(function (item: any) {
            return item.selectedLookup === true;
        })
    }
    //#endregion checkbox all table

    //#region button print kwitansi
    btnPrintKwitansi() {
        this.showSpinner = true;
        const dataParam = {
            TableName: 'RPT_KWITANSI_SPAF',
            SpName: 'xsp_rpt_kwitansi_spaf',
            reportparameters: {
                p_user_id: this.userId,
                p_code: this.param,
                p_spaf_code: this.model.code,
                p_print_option: 'PDF'
            }
        };

        this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
            this.printRptNonCore(res);
            this.showSpinner = false;
        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    //#endregion button print kwitansi

    //#region button save in list
    btnSaveList() {

        this.showSpinner = true;
        this.datauploadlist = [];
        let j = 0;

        const getID = $('[name="p_id_doc"]')
            .map(function () { return $(this).val(); }).get();        

        const getClaimAmount = $('[name="p_claim_amount_detail"]')
            .map(function () { return $(this).val(); }).get();

        const getPPN = $('[name="p_ppn_amount_detail"]')
            .map(function () { return $(this).val(); }).get();

        const getPPH = $('[name="p_pph_amount_detail"]')
            .map(function () { return $(this).val(); }).get();


        while (j < getID.length) {

            while (j < getClaimAmount.length) {
                while (j < getPPN.length) {
                    while (j < getPPH.length) {
                        this.datauploadlist.push(
                            {
                                p_id: getID[j],
                                p_claim_amount: getClaimAmount[j],
                                p_ppn_amount: getPPN[j],
                                p_pph_amount: getPPH[j]
                            }); j++
                    } j++
                } j++
            } j++;
        }        
        //#region web service
        this.dalservice.Update(this.datauploadlist, this.APIControllerDetail, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    this.showSpinner = false;

                    const parse = JSON.parse(res);
                    this.callGetrow();
                    if (parse.result === 1) {
                        this.showSpinner = false;
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatablespafclaimdetail').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service

    }
    //#region onBlur
    onBlur(event, i, type) {
        if (type === 'claim_amount') {
            if (event.target.value.match('[0-9]+(,[0-9]+)')) {
                if (event.target.value.match('(\.\d+)')) {

                    event = '' + event.target.value;
                    event = event.trim();
                    event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                } else {
                    event = '' + event.target.value;
                    event = event.trim();
                    event = parseFloat(event.replace(/,/g, '')).toFixed(2); // ganti jadi 6 kalo mau pct
                    event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                }
            } else {
                event = '' + event.target.value;
                event = event.trim();
                event = parseFloat(event).toFixed(2); // ganti jadi 6 kalo mau pct
                event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            }
        } else if (type === 'ppn_amount_detail') {
            if (event.target.value.match('[0-9]+(,[0-9]+)')) {
                if (event.target.value.match('(\.\d+)')) {

                    event = '' + event.target.value;
                    event = event.trim();
                    event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                } else {
                    event = '' + event.target.value;
                    event = event.trim();
                    event = parseFloat(event.replace(/,/g, '')).toFixed(2); // ganti jadi 6 kalo mau pct
                    event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                }
            } else {
                event = '' + event.target.value;
                event = event.trim();
                event = parseFloat(event).toFixed(2); // ganti jadi 6 kalo mau pct
                event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            }
        } else if (type === 'pph_amount_detail') {
            if (event.target.value.match('[0-9]+(,[0-9]+)')) {
                if (event.target.value.match('(\.\d+)')) {

                    event = '' + event.target.value;
                    event = event.trim();
                    event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                } else {
                    event = '' + event.target.value;
                    event = event.trim();
                    event = parseFloat(event.replace(/,/g, '')).toFixed(2); // ganti jadi 6 kalo mau pct
                    event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                }
            } else {
                event = '' + event.target.value;
                event = event.trim();
                event = parseFloat(event).toFixed(2); // ganti jadi 6 kalo mau pct
                event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            }
        }
        else {
            event = '' + event.target.value;
            event = event.trim();
            event = parseFloat(event).toFixed(6);
        }

        if (event === 'NaN') {
            event = 0;
            event = parseFloat(event).toFixed(2);
        }

        if (type === 'claim_amount') {
            $('#claim_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        } else if (type === 'ppn_amount_detail') {
            $('#ppn_amount_detail' + i)
                .map(function () { return $(this).val(event); }).get();
        } else if (type === 'pph_amount_detail') {
            $('#pph_amount_detail' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onBlur

    //#region onFocus
    onFocus(event, i, type) {
        event = '' + event.target.value;

        if (event != null) {
            event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
        }

        if (type === 'claim_amount') {
            $('#claim_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onFocus
    //#endregion button save in list
}

