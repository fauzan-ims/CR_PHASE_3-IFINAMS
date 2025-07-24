
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './publicservicedetail.component.html'
})

export class PublicservicedetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public EmailPattern = this._emailformat;
    public WebsitePattern = this._websiteformat;
    public NpwpPattern = this._npwpformat;

    public publicserviceData: any = [];
    public isReadOnly: Boolean = false;
    
    private dataRoleTamp: any = [];
    private dataTamp: any = [];
    private RoleAccessCode = 'R00021430000000A';

    // API Controller
    private APIController: String = 'MasterPublicService';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForInsert: String = 'Insert';
    
    private APIRouteForValidate: String = 'ExecSpForValidate';
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
        this.Delimiter(this._elementRef);
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.wizard();

        if (this.param != null) {
            this.isReadOnly = true;
            this.publicserviceaddresswiz();

            // call web service
            this.callGetrow();
        } else {
            this.model.tax_file_type = 'N21';
            this.model.is_validate = true;
            this.showSpinner = false;
        }
    }

    //#region publicservice Detail getrow data
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
                    const parsedata = parse.data[0];

                    // checkbox is_editable
                    if (parsedata.is_validate === '1') {
                        parsedata.is_validate = true;
                    } else {
                        parsedata.is_validate = false;
                    }
                    // end checkbox is_editable

                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui

                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion publicservice Detail getrow data

    //#region publicserviceyDetail  form submit
    onFormSubmit(publicserviceForm: NgForm, isValid: boolean) {
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

        this.publicserviceData = publicserviceForm;

        if (this.publicserviceData.p_is_validate == null) {
            this.publicserviceData.p_is_validate = false;
        }

        const usersJson: any[] = Array.of(this.publicserviceData);

        if (this.param != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success')
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
                            this.showNotification('bottom', 'right', 'success')
                            this.route.navigate(['/systemsetting/subpublicservice/publicservicedetail', parse.code]);
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
    //#endregion publicservice Detail form submit

    //#region publicservice Detail button back
    btnBack() {
        $('#datatable').DataTable().ajax.reload();
        this.route.navigate(['/systemsetting/subpublicservice']);
    }
    //#endregion publicservice Detail button back

    //#region btnEditable
    btnValidate() {
        // param tambahan untuk update dynamic
        this.dataTamp = [{
            'p_code': this.param
        }];
        // end param tambahan untuk update dynamic
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            this.showSpinner = true;
            if (result.value) {
                // call web service
                this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForValidate)
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
    //#endregion btnEditable

    onRouterOutletActivate(event: any) {
    }

    //#region public service Address List tabs
    publicserviceaddresswiz() {
        this.route.navigate(['/systemsetting/subpublicservice/publicservicedetail/' + this.param + '/publicserviceaddresslist', this.param], { skipLocationChange: true });
    }
    //#endregion public service Address List tabs

    //#region public service bank list tabs
    publicservicebankwiz() {
        this.route.navigate(['/systemsetting/subpublicservice/publicservicedetail/' + this.param + '/publicservicebanklist', this.param], { skipLocationChange: true });
    }
    //#endregion public service bank list tabs

    //#region public service brach list tabs
    publicservicebrachwiz() {
        this.route.navigate(['/systemsetting/subpublicservice/publicservicedetail/' + this.param + '/publicservicebranchlist', this.param], { skipLocationChange: true });
    }
    //#endregion public service brach list tabs

    //#region public service document list tabs
    publicservicedocumentwiz() {
        this.route.navigate(['/systemsetting/subpublicservice/publicservicedetail/' + this.param + '/publicservicedocumentlist', this.param], { skipLocationChange: true });
    }
    //#endregion public service document list tabs

    //#region npwp
    onKeydownNpwp(event: any) {

        let ctrlDown = false;

        if (event.keyCode == 17 || event.keyCode == 91) {
            ctrlDown = true;
        }

        if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)
            || (ctrlDown && (event.keyCode == 86 || event.keyCode == 67 || event.keyCode == 65 || event.keyCode == 90))
            || event.keyCode == 8 || event.keyCode == 9
            || (event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 38 || event.keyCode == 40)
        )) {

            return false;
        }

    }

    onPasteNpwp(event: any) {

        if (!event.originalEvent.clipboardData.getData('Text').match(/^[0-9,.-]*$/)) {
            event.preventDefault();
        }

    }

    onFokusNpwp(event: any) {
        let valEvent: any;
        valEvent = '' + event.target.value;

        if (valEvent != null) {
            this.model.tax_file_no = valEvent.replace(/[^0-9]/g, '');
        }

    }

    onChangeNpwp(event: any) {

        let valEvent: any;

        valEvent = '' + event.target.value;
        var x = valEvent.split('');

        if (x.length == 15) {
            var tt = x[0] + x[1] + '.';
            var dd = tt + x[2] + x[3] + x[4] + '.';
            var ee = dd + x[5] + x[6] + x[7] + '.';
            var ff = ee + x[8] + '-';
            var gg = ff + x[9] + x[10] + x[11] + '.';
            var hh = gg + x[12] + x[13] + x[14];

            this.model.tax_file_no = hh;
        }

    }
    //#endregion npwp
}

