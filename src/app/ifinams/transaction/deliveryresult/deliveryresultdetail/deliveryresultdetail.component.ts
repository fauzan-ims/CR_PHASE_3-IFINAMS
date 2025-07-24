
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
    templateUrl: './deliveryresultdetail.component.html'
})

export class DeliveryresultdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public deliveryresultData: any = [];
    public listdeliveryresultdetail: any = [];
    public lookupBranchName: any = [];
    public isReadOnly: Boolean = false;
    public isButton: Boolean = false;
    
    private dataRoleTamp: any = [];
    private dataTamp: any = [];
    private setStyle: any = [];
    private RoleAccessCode = 'R00021960000000A';

    // API Controller
    private APIController: String = 'RegisterMain';

    // API Function
    private APIRouteForGetRow: String = 'GETROW';
    private APIRouteForUpdateDeliveryResult: String = 'UpdateDeliveryResult';
    private APIRouteForGetCancel: String = 'ExecSpForDeliveryCancel';
    private APIRouteForGetPost: String = 'ExecSpForDeliveryPost';
    

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

        if (this.param != null) {
            this.isReadOnly = true;

            // call web service
            this.callGetrow();
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

                    if (parsedata.register_status !== 'DELIVERY') {
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
    //#endregion  set datepicker

    //#region  form submit
    onFormSubmit(deliveryresultForm: NgForm, isValid: boolean) {
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

        this.deliveryresultData = this.JSToNumberFloats(deliveryresultForm);
        const usersJson: any[] = Array.of(this.deliveryresultData);
        // call web service
        this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdateDeliveryResult)
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
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
    }
    //#endregion form submit

    //#region button back
    btnBack() {
        this.route.navigate(['/transaction/subdeliveryresultlist']);
    }
    //#endregion button back

    //#region button Post
    btnPost(deliveryresultForm: NgForm, isValid: boolean) {
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
        }
        this.deliveryresultData = this.JSToNumberFloats(deliveryresultForm);
        const usersJson: any[] = Array.of(this.deliveryresultData);
        // call web service
        this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdateDeliveryResult)
            .subscribe(
                res => {
                    this.showSpinner = false;
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        // param tambahan untuk button Post dynamic
                        this.dataRoleTamp = [{
                            'p_code': this.param,
                            'action': ''
                        }];
                        // param tambahan untuk button Post dynamic

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
                                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForGetPost)
                                    .subscribe(
                                        res => {
                                            this.showSpinner = false;
                                            const parses = JSON.parse(res);
                                            if (parses.result === 1) {
                                                this.showNotification('bottom', 'right', 'success');
                                                this.callGetrow();
                                            } else {
                                                this.swalPopUpMsg(parses.data);
                                            }
                                        },
                                        error => {
                                            this.showSpinner = false;
                                            const parses = JSON.parse(error);
                                            this.swalPopUpMsg(parses.data);
                                        });
                            } else {
                                this.showSpinner = false;
                            }
                        });
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                    console.log('There was an error while Updating Data(API) !!!' + error);
                });
    }
    //#endregion button Post

    //#region button Cancel
    btnCancel() {
        // param tambahan untuk button Cancel dynamic
        this.dataRoleTamp = [{
            'p_code': this.param,
            'action': ''
        }];
        // param tambahan untuk button Cancel dynamic

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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForGetCancel)
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
        });
    }
    //#endregion button Cancel
}






