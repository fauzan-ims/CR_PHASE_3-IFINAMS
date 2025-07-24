import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../base.component';
import { DALService } from '../../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './pricingrequestdetaildetail.component.html'
})

export class PricingrequestdetaildetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public pricingrequestdetaildetailData: any = [];
  public isReadOnly: Boolean = false;
  public value: String;
  public status: String;
  public PageClient: any = [];
  private rolecode: any = [];
  private dataTamp: any = [];
  private dataRoleTamp: any = [];
  private APIController: String = 'AssetManagementPricingDetail';
  private APIControllerPricing: String = 'AssetManagementPricing';
  private APIControllerSysGlobalParam: String = 'SysGlobalParam';
  private APIRouteForRequest: String = 'ExecSpForRequest';
  private APIRouteForCheck: String = 'ExecSpForMrp';
  private APIRouteForProceed: String = 'ExecSpForProceed';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForGetRole: String = 'ExecSpForGetRole';
  private RoleAccessCode = 'R00022290000000A';

  // checklist
  public selectedAll: any;
  public checkedList: any = [];

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
    this.Delimiter(this._elementRef);
    if (this.params != null) {
      // this.model.appraisal_request_status = 'NEW';
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.callGetrowHeader();
      this.callGetrowGlobalParam();
    } else {
      this.showSpinner = false;
    }
  }

  //#region getrow data
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_id': this.params
    }]
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          // checkbox
          if (parsedata.is_active === '1') {
            parsedata.is_active = true;
          } else {
            parsedata.is_active = false;
          }

          if (parsedata.appraisal_request_status == 'NEW' || parsedata.appraisal_request_status == 'REQUEST' || parsedata.appraisal_request_status == 'CANCEL') {
            parsedata.isStatus = false;
          }
          else {
            parsedata.isStatus = true;
          }
          // end checkbox

          // parsedata.appraisal_request_status = 'NEW';

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

  //#region getrow data global param
  callGetrowGlobalParam() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': 'SETMRP',
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIControllerSysGlobalParam, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.value = parsedata.value

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui
          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data global param

  //#region getrow data header
  callGetrowHeader() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': this.param
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIControllerPricing, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.status = parsedata.transaction_status

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui
          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data header

  //#region form submit
  onFormSubmit(pricingrequestdetailForm: NgForm, isValid: boolean) {
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

    this.pricingrequestdetaildetailData = this.JSToNumberFloats(pricingrequestdetailForm);

    if (this.pricingrequestdetaildetailData.p_contact_person_name === '' || this.pricingrequestdetaildetailData.p_contact_person_name == null) {
      this.pricingrequestdetaildetailData.p_contact_person_name = undefined;
    }

    if (this.pricingrequestdetaildetailData.p_contact_person_area_phone_no === '' || this.pricingrequestdetaildetailData.p_contact_person_area_phone_no == null) {
      this.pricingrequestdetaildetailData.p_contact_person_area_phone_no = undefined;
    }

    if (this.pricingrequestdetaildetailData.p_contact_person_phone_no === '' || this.pricingrequestdetaildetailData.p_contact_person_phone_no == null) {
      this.pricingrequestdetaildetailData.p_contact_person_phone_no = undefined;
    }

    if (this.pricingrequestdetaildetailData.p_collateral_location === '' || this.pricingrequestdetaildetailData.p_collateral_location == null) {
      this.pricingrequestdetaildetailData.p_collateral_location = undefined;
    }

    if (this.pricingrequestdetaildetailData.p_collateral_description === '' || this.pricingrequestdetaildetailData.p_collateral_description == null) {
      this.pricingrequestdetaildetailData.p_collateral_description = undefined;
    }

    if (this.pricingrequestdetaildetailData.p_approve_amount === '' || this.pricingrequestdetaildetailData.p_approve_amount == null) {
      this.pricingrequestdetaildetailData.p_approve_amount = 0;
    }

    const usersJson: any[] = Array.of(this.pricingrequestdetaildetailData);
    // console.log(usersJson);

    if (this.param != null && this.params != null) {
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
            this.showSpinner = false;
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
              this.route.navigate(['/sellanddisposal/subpricingrequestlist/pricingrequestdetaildetail', this.param, this.pricingrequestdetaildetailData.p_id]);
            } else {
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

  //#region button Request Appraisal
  btnRequest(id: string) {
    // param tambahan untuk button Request Appraisal dynamic
    this.dataRoleTamp = [{
      'p_id': id,
      'action': ''
    }];
    // param tambahan untuk button Request Appraisal dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForRequest)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.callGetrow();
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.swalPopUpMsg(parse.data)
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
  //#endregion button Request Appraisal

  //#region button Check Pricelist
  btnCheck(id: string, pricing_code: string, repossession_code: string) {
    // param tambahan untuk button Check Pricelist dynamic
    this.dataRoleTamp = [{
      'p_id': id,
      'p_pricing_code': pricing_code,
      'p_repossession_code': repossession_code,
      'action': ''
    }];
    // param tambahan untuk button Check Pricelist dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCheck)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.callGetrow();
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.swalPopUpMsg(parse.data)
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
  //#endregion button Check Pricelist

  //#region button Request Proceed
  btnProceed(id: string) {
    // param tambahan untuk button Request Proceed dynamic
    this.dataRoleTamp = [{
      'p_id': id,
      'action': ''
    }];
    // param tambahan untuk button Request Proceed dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForProceed)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.callGetrow();
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.swalPopUpMsg(parse.data)
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
  //#endregion button Request Proceed

  //#region button Request Cancel
  btnCancel(id: string) {
    // param tambahan untuk button Request Cancel dynamic
    this.dataRoleTamp = [{
      'p_id': id,
      'action': ''
    }];
    // param tambahan untuk button Request Cancel dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancel)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.callGetrow();
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.swalPopUpMsg(parse.data)
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
  //#endregion button Request Cancel

  //#region button back
  btnBack() {
    this.route.navigate(['/sellanddisposal/subpricingrequestlist/pricingrequestdetail', this.param]);
    $('#datatableSellPermitDetail').DataTable().ajax.reload();
  }
  //#endregion button back

}