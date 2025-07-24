import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './publicservicebankwizdetail.component.html'
})


export class PublicservicebankdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public publicserviceBankData: any = [];
    public isReadOnly: Boolean = false;
    public NumberOnlyPattern = this._numberonlyformat;
    public lookupbank: any = [];
    public lookupcurrency: any = [];

    private dataRoleTamp: any = [];
    private dataTamp: any = [];
    private RoleAccessCode = 'R00021430000000A';

    // API Controller
    private APIController: String = 'MasterPublicserviceBank';
    private APIControllerSysBank: String = 'SysBank';
    private APIControllerSysCurrency: String = 'SysCurrency';

    // API Function
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForInsert: String = 'Insert';


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
        private _elementRef: ElementRef, private datePipe: DatePipe
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

        if (this.params != null) {
            this.isReadOnly = true;
            this.wizard();

            // call web service
            this.callGetrow();
        } else {
            this.model.id = this.param;
            this.showSpinner = false;
        }
    }

    //#region publicserviceBankDetail getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_id': this.params,
        }];
        // end param tambahan untuk getrow dynamics
        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = parse.data[0];

                    // checkbox
                    if (parsedata.is_default === '1') {
                        parsedata.is_default = true;
                    } else {
                        parsedata.is_default = false;
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
    //#endregion publicserviceBankDetail getrow data

    //#region publicserviceBankDetail form submit
    onFormSubmit(publicservicebankForm: NgForm, isValid: boolean) {
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

        this.publicserviceBankData = publicservicebankForm;
        if (this.publicserviceBankData.p_is_default == null) {
            this.publicserviceBankData.p_is_default = false;
        }

        this.publicserviceBankData.p_public_service_code = this.param;
        const usersJson: any[] = Array.of(this.publicserviceBankData);

        if (this.params != null) {
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
                            this.swalPopUpMsg(parse.data)
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.showSpinner = false;
                        this.swalPopUpMsg(parse.data);
                        // console.log('There was an error while Updating Data(API) !!!' + error);
                    });
        } else {
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.route.navigate(['/systemsetting/subpublicservice/publicservicedetail/' + this.param + '/publicservicebanklist/' + this.param + '/publicservicebankdetail', this.param, parse.id], { skipLocationChange: true });
                            this.showNotification('bottom', 'right', 'success');
                        } else {
                            this.swalPopUpMsg(parse.data)
                        }
                    },
                    error => {
                        const parse = JSON.parse(error);
                        this.showSpinner = false;
                        this.swalPopUpMsg(parse.data);
                        // console.log('There was an error while Updating Data(API) !!!' + error);
                    });
        }
    }
    //#endregion publicserviceBankDetail form submit

    //#region publicserviceBankDetail button back
    btnBack() {
        $('#datatabless ').DataTable().ajax.reload();
        this.route.navigate(['/systemsetting/subpublicservice/publicservicedetail/' + this.param + '/publicservicebanklist', this.param], { skipLocationChange: true });
    }
    //#endregion publicserviceBankDetail button back

    //#region PublicserviceBankDetail Bank Lookup
    btnLookupBank() {
        $('#datatableLookupBank').DataTable().clear().destroy();
        $('#datatableLookupBank').DataTable({
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
                this.dalservice.GetrowsBase(dtParameters, this.APIControllerSysBank, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupbank = parse.data;
                    this.lookupbank.numberIndex = dtParameters.start;

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            'lengthMenu': [
                [5, 25, 50, 100],
                [5, 25, 50, 100]
            ],
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowBank(bank_code: String, bank_name: string) {
        this.model.bank_code = bank_code;
        this.model.bank_name = bank_name;
        $('#lookupModalBank').modal('hide');
    }
    //#endregion NotaryDetail Bank lookup

    //#region NotaryBankDetail Bank Lookup
    btnLookupCurrency() {
        $('#datatableLookupCurrency').DataTable().clear().destroy();
        $('#datatableLookupCurrency').DataTable({
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
                this.dalservice.GetrowsBase(dtParameters, this.APIControllerSysCurrency, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupcurrency = parse.data;
                    this.lookupcurrency.numberIndex = dtParameters.start;

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            'lengthMenu': [
                [5, 25, 50, 100],
                [5, 25, 50, 100]
            ],
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowCurrency(currency_code: String, currency_desc: string) {
        this.model.currency_code = currency_code;
        this.model.currency_desc = currency_desc;
        $('#lookupModalCurrency').modal('hide');
    }
    //#endregion NotaryDetail Bank lookup

}


