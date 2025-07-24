import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../DALservice.service';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './mastercategorycommercialdetail.component.html'
})

export class MastercategorycommercialdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern: string = this._numberonlyformat;
    public generalcodeData: any = [];
    public generalsubcodelist: any = [];
    public isReadOnly: Boolean = false;
    public setStyle: any = [];
    private dataTamp: any = [];
    private dataRoleTamp: any = [];
    public method_type: any;
    public usefull: any;
    public rate: any;

    //controller
    private APIController: String = 'MasterDepreCategoryCommercial';

    //routing
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForUpdateSatus: String = 'ExecSpForUpdateStatus';
    private RoleAccessCode = 'R00021270000000A';

    // form 2 way binding
    model: any = {};

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
        private _elementRef: ElementRef
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.Delimiter(this._elementRef);
        if (this.param != null) {
            this.isReadOnly = true;

            // call web service
            this.callGetrow();
        } else {
            this.model.is_active = true;
            this.showSpinner = false;
            this.model.company_code = this.company_code;
            this.model.rate = 0;
            this.model.method_type = 'SL';
        }
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

    //#region btnActive
    btnActive(code: string) {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_code': code,
            'p_company_code': this.company_code,
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
                            const parse = JSON.parse(res);

                            if (parse.result === 1) {
                                this.showSpinner = false;
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                            } else {
                                this.showSpinner = false;
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

                    // checkbox
                    if (parsedata.is_active === '1') {
                        parsedata.is_active = true;
                    } else {
                        parsedata.is_active = false;
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

    //#region  form submit
    onFormSubmit(generalcodeForm: NgForm, isValid: boolean) {
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

        this.generalcodeData = this.JSToNumberFloats(generalcodeForm);

        if (this.generalcodeData.p_is_active == null) {
            this.generalcodeData.p_is_active = true
        }
        this.generalcodeData.p_company_code = this.company_code;
        const usersJson: any[] = Array.of(this.generalcodeData);
        if (this.param != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showSpinner = false;
                            this.showNotification('bottom', 'right', 'success');
                            this.callGetrow()
                        } else {
                            this.showSpinner = false;
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                    });
        } else {
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showSpinner = false;
                            this.showNotification('bottom', 'right', 'success');
                            this.route.navigate(['/systemsetting/submasterdeprecategorycommercial/mastercategorycommercial', parse.code]);
                        } else {
                            this.showSpinner = false;
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                    });
        }
    }
    //#endregion form submit

    //#region button back
    btnBack() {
        $('#datatable').DataTable().ajax.reload();
        this.route.navigate(['/systemsetting/submasterdeprecategorycommercial']);
    }
    //#endregion button back

    // #region changeMethodType
    changeMethodType(event: any) {
        this.method_type = event.target.value;
        this.model.method_type = this.method_type;
        this.model.usefull = 0;
        this.model.rate = 0;
    }
    // #endregion changeMethodType

    // #region changeUsefull
    changeUsefull(event: any) {
        this.usefull = event.target.value * 1;
        this.model.usefull = this.usefull;

        if (this.model.method_type === 'SL') {
            // Straight Line = (Rate = 100/usefull)
            if (this.usefull === 0) {
                this.rate = 0;
            }
            else {
                this.rate = (100 / this.usefull);
            }
            this.model.rate = this.rate;
        }
        else if (this.model.method_type === 'RB') {
            // Double Declining = (Rate = (100/usefull)*2)
            this.model.rate = this.rate;
            if (this.usefull === 0) {
                this.rate = 0;
            }
            else {
                this.rate = (100 / this.usefull) * 2;
            }
            this.model.rate = this.rate;
        }

    }
    // #endregion changeUsefull

}
