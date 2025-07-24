import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';


// call function from js shared
declare function headerPage(controller, route): any;
declare function hideButtonLink(idbutton): any;
declare function hideTabWizard(): any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './claimdetail.component.html'
})

export class ClaimdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public claimData: any = [];
  public isReadOnly: Boolean = false;
  public isStatus: Boolean;
  public isReject: Boolean = false;
  public isCancel: Boolean = false;
  public isButton: Boolean = false;
  public isProcess: Boolean = true;
  public lookupagreement: any = [];
  public lookuplosstype: any = [];
  public lookupReason: any = [];
  public lookuppolicy: any = [];
  public lookupcurrency: any = [];
  public lookupbranch: any = [];
  public valDate: any;
  public valDate2: any;
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private setStyle: any = [];
  private tempFileSize: any;
  public tempFile: any;
  private tampDocumentCode: String;
  private base64textString: string;
  private tamps = new Array();
  public tampHidden: Boolean = false;
  public tampHiddenforView: Boolean = false;

  //controller
  private APIController: String = 'ClaimMain';
  private APIControllerPolicy: String = 'InsurancePolicyMain';
  private APIControllerSubcode: String = 'SysGeneralSubcode';
  private APIControllerSys: String = 'sysbranch';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';

  //router
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForLookupPolicy: String = 'GetRowsForLookup';
  private APIRouteForLookupSubcode: String = 'GetRowsForLookup';
  private APIRouteForSys: String = 'GetRowsForLookup';
  private APIRouteForPost: String = 'ExecSpForGetPost';
  private APIRouteForProceed: String = 'ExecSpForGetProceed';
  private APIRouteForApprove: String = 'ExecSpForGetApprove';
  private APIRouteForPaid: String = 'ExecSpForGetPaid';
  private APIRouteForCancel: String = 'ExecSpForGetCancel';
  private APIRouteForReject: String = 'ExecSpForGetReject';
  private APIRouteForPriviewFile: String = 'Priview';
  private APIRouteForUploadFile: String = 'Upload';
  private APIRouteForDeleteFile: String = 'Deletefile';

  private RoleAccessCode = 'R00021970000000A';

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
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.Delimiter(this._elementRef);

    if (this.param != null) {
      this.isReadOnly = true;
      this.callGetrow();
    } else {
      this.showSpinner = false;
      this.model.claim_progress_status = 'ENTRY'
      this.model.claim_status = 'HOLD';

    }
  }

  onRouterOutletActivate(event: any) {
  }

  //#region getrow data
  callGetrowDoc() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': 'FUPS'
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIControllerSysGlobalparam, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.tempFileSize = parsedata.value

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

  //#region button Paid
  btnPaid(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk getrole dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPaid)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                $('#reloadWiz').click();
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
    });
  }
  //#endregion button Paid

  //#region button Approve
  btnApprove(claimForm: NgForm, isValid: boolean) {
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

    this.claimData = this.JSToNumberFloats(claimForm);

    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_code': this.claimData.p_code,
      'p_claim_amount': this.claimData.p_claim_amount,
      'p_is_policy_terminate': this.claimData.p_is_policy_terminate,
      'p_is_ex_gratia': this.claimData.p_is_ex_gratia,
      'p_result_report_date': this.claimData.p_result_report_date,
      'action': ''
    }];
    // param tambahan untuk getrole dynamic

    if (this.claimData.p_is_policy_terminate == null) {
      this.claimData.p_is_policy_terminate = false;
    }
    if (this.claimData.p_is_ex_gratia == null) {
      this.claimData.p_is_ex_gratia = false;
    }

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForApprove)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                $('#reloadWiz').click();
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
  //#endregion button Approve

  //#region button Proceed
  btnProceed(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk getrole dynamic

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
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                $('#datatables').DataTable().ajax.reload();
                $('#reloadWiz').click();
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
    });
  }
  //#endregion button Proceed

  //#region button Post
  btnPost(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk getrole dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPost)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                $('#reloadWiz').click();
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
    });
  }
  //#endregion button Post

  //#region button Cancel
  btnCancel(code: string) {
    // this.isReadOnly = false;
    // param tambahan untuk button Done dynamic
    this.dataRoleTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk button Done dynamic

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
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                $('#reloadWiz').click();
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
    });
  }
  //#endregion button Cancel

  //#region button Reject
  btnReject(code: string) {
    // this.isReadOnly = false;
    // param tambahan untuk button Done dynamic
    this.dataRoleTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk button Done dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForReject)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                $('#reloadWiz').click();
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
    });
  }
  //#endregion button Reject

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

          // this.valDate = parsedata.policy_eff_date;
          // this.valDate2 = parsedata.policy_exp_date;

          if (parsedata.claim_status !== 'ON PROCESS') {
            this.isStatus = true;
          } else {
            this.isStatus = false;
          }

          this.wizard();
          this.claimassetwiz();

          // checkbox claim_status
          if (parsedata.claim_status !== 'HOLD') {
            this.isButton = true;
          } else {
            this.isButton = false;
          }
          // end checkbox claim_status 

          // checkbox batch_status
          if (parsedata.claim_status !== 'ON PROCESS') {
            this.isProcess = true;
          } else {
            this.isProcess = false;
          }

          // end checkbox batch_status
          // checkbox
          if (parsedata.is_policy_terminate === '1') {
            parsedata.is_policy_terminate = true;
          } else {
            parsedata.is_policy_terminate = false;
          }

          if (parsedata.is_ex_gratia === '1') {
            parsedata.is_ex_gratia = true;
          } else {
            parsedata.is_ex_gratia = false;
          }
          // end checkbox

          // if button
          if (parsedata.claim_status === 'HOLD') {
            this.isCancel = true;
          } else {
            this.isCancel = false;
          }

          if (parsedata.claim_status === 'ON PROCESS') {
            this.isReject = true;
          } else {
            this.isReject = false;
          }
          //

          if (parsedata.file_name === '' || parsedata.file_name == null) {
            this.tampHidden = false;
          } else {
            this.tampHidden = true;

          }

          if (parsedata.claim_status !== 'HOLD') {
            this.tampHiddenforView = true;
          } else {
            this.tampHiddenforView = false;
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

  //#region  form submit
  onFormSubmit(claimForm: NgForm, isValid: boolean) {
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

    this.claimData = this.JSToNumberFloats(claimForm);
    if (this.claimData.p_finance_report_date == '') {
      this.claimData.p_finance_report_date = undefined;
    }
    if (this.claimData.p_result_report_date == '') {
      this.claimData.p_result_report_date = undefined;
    }
    if (this.claimData.p_received_voucher_date == '') {
      this.claimData.p_received_voucher_date = undefined;
    }
    if (this.claimData.p_claim_request_code == '') {
      this.claimData.p_claim_request_code = undefined;
    }
    if (this.claimData.p_is_policy_terminate == null) {
      this.claimData.p_is_policy_terminate = false;
    }
    if (this.claimData.p_is_ex_gratia == null) {
      this.claimData.p_is_ex_gratia = false;
    }

    const usersJson: any[] = Array.of(this.claimData);
    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
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
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/registration/subclaimlist/claimdetail', parse.code]);
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
    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/registration/subclaimlist']);
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region lookup branch
  btnLookupBranch() {
    $('#datatableLookupBranch').DataTable().clear().destroy();
    $('#datatableLookupBranch').DataTable({
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
        this.dalservice.GetrowsBase(dtParameters, this.APIControllerSys, this.APIRouteForSys).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbranch = parse.data;
          if (parse.data != null) {
            this.lookupbranch.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowBranch(branch_code: String, branch_name: String) {
    this.model.branch_code = branch_code;
    this.model.branch_name = branch_name;
    this.model.agreement_no = ''
    this.model.agreement_external_no = ''
    this.model.client_name = ''
    this.model.policy_no = ''
    this.model.collateral_external_no = ''
    this.model.collateral_name = ''
    this.model.insurance_name = ''
    $('#lookupModalBranch').modal('hide');
  }
  //#endregion lookup branch

  //#region Policy Lookup
  btnLookupPolicy() {
    $('#datatableLookupPolicy').DataTable().clear().destroy();
    $('#datatableLookupPolicy').DataTable({
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
          'p_branch_code': this.model.branch_code,
          'p_is_existing': ''
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerPolicy, this.APIRouteForLookupPolicy).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookuppolicy = parse.data;
          if (parse.data != null) {
            this.lookuppolicy.numberIndex = dtParameters.start;
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

  btnSelectRowPolicy(policy_code: String, policy_no: String, client_no: string, client_name: string, insurance_name: string, insurance_type: string, policy_eff_date: string, policy_exp_date: string) {
    this.model.policy_code = policy_code;
    this.model.policy_no = policy_no;
    this.model.client_no = client_no;
    this.model.client_name = client_name;
    this.model.insurance_name = insurance_name;
    this.model.insurance_type = insurance_type;
    this.model.policy_eff_date = policy_eff_date;
    this.model.policy_exp_date = policy_exp_date;

    this.valDate = policy_eff_date;
    this.valDate2 = policy_exp_date;

    // set policy_eff_date
    let setdate = { 'year': ~~policy_eff_date.split('/')[2], 'month': ~~policy_eff_date.split('/')[1], 'day': ~~policy_eff_date.split('/')[0] };
    const obj = {
      dateRange: null,
      isRange: false,
      singleDate: {
        date: setdate,
        // epoc: 1600102800,
        formatted: policy_eff_date.split('/')[0] + '/' + policy_eff_date.split('/')[1] + '/' + policy_eff_date.split('/')[2],
        // jsDate: new Date(dob[key])
      }
    }
    this.model.policy_eff_date = obj;

    // set policy_exp_date
    let setdate2 = { 'year': ~~policy_exp_date.split('/')[2], 'month': ~~policy_exp_date.split('/')[1], 'day': ~~policy_exp_date.split('/')[0] };
    const obj2 = {
      dateRange: null,
      isRange: false,
      singleDate: {
        date: setdate2,
        // epoc: 1600102800,
        formatted: policy_exp_date.split('/')[0] + '/' + policy_exp_date.split('/')[1] + '/' + policy_exp_date.split('/')[2],
        // jsDate: new Date(dob[key])
      }
    }
    this.model.policy_exp_date = obj2;
    $('#lookupModalPolicy').modal('hide');
  }
  //#endregion Policy lookup

  //#region LossType Lookup
  btnLookupLossType() {
    $('#datatableLookupLossType').DataTable().clear().destroy();
    $('#datatableLookupLossType').DataTable({
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
          'p_general_code': 'CLCTG',
          'p_company_code': this.company_code,
          'p_is_active': '1'
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerSubcode, this.APIRouteForLookupSubcode).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookuplosstype = parse.data;
          if (parse.data != null) {
            this.lookuplosstype.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowLossType(code: String, description: string) {
    this.model.claim_loss_type = code;
    this.model.claim_loss_type_desc = description;
    $('#lookupModalLossType').modal('hide');
  }
  //#endregion LossType lookup

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
          'p_general_code': 'CREA',
          'p_company_code': this.company_code,
          'p_is_active': '1'
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerSubcode, this.APIRouteForLookupSubcode).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupReason = parse.data;
          if (parse.data != null) {
            this.lookupReason.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowReason(code: String, description: string) {
    this.model.claim_reason_code = code;
    this.model.claim_reason_desc = description;
    $('#lookupModalReason').modal('hide');
  }
  //#endregion Reason lookup

  //#region List tabs
  claimassetwiz() {
    this.route.navigate(['/registration/subclaimlist/claimdetail/' + this.param + '/claimassetdetail', this.param], { skipLocationChange: true });
  }

  claimdocwiz() {
    this.route.navigate(['/registration/subclaimlist/claimdetail/' + this.param + '/claimdoclist', this.param], { skipLocationChange: true });
  }

  claimprogresswiz() {
    this.route.navigate(['/registration/subclaimlist/claimdetail/' + this.param + '/claimprogresslist', this.param], { skipLocationChange: true });
  }
  //#endregion publicserviceAddress and NotaryBank List tabs

  //#region button select image
  onUpload(event, code: String) {
    const files = event.target.files;
    const file = files[0];

    if (this.CheckFileSize(files[0].size, this.model.value)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.model.value + ' MB');
      this.callGetrow();
    } else {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event) => {
          reader.onload = this.handleFile.bind(this);
          reader.readAsBinaryString(file);
        }
      }
      this.tempFile = files[0].name;
      this.tampDocumentCode = code;

    }
  }
  //#endregion button select image

  //#region convert to base64
  handleFile(event) {
    this.showSpinner = true;
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);

    this.tamps.push({
      p_header: 'CLAIM_MAIN',
      p_module: 'IFINAMS',
      p_child: this.param,
      p_code: this.tampDocumentCode,
      p_file_paths: this.param,
      p_file_name: this.tempFile,
      p_base64: this.base64textString
    });

    this.dalservice.UploadFile(this.tamps, this.APIController, this.APIRouteForUploadFile)
      .subscribe(
        res => {
          this.tamps = new Array();

          const parses = JSON.parse(res);
          if (parses.result === 1) {
            this.showSpinner = false;
            $('#fileControl').val('');
            this.tempFile = undefined
            this.callGetrow
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parses.message);
            $('#fileControl').val('');
            this.tempFile = undefined
          }
          this.callGetrow();
        },
        error => {
          this.showSpinner = false;
          this.tamps = new Array();
          const parses = JSON.parse(error);
          this.swalPopUpMsg(parses.message);
          this.callGetrow();
        });
  }
  //#endregion convert to base64

  //#region button priview image
  previewFile(row1, row2) {
    this.showSpinner = true;
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_file_name: row1,
      p_file_paths: row2
    });
    this.dalservice.PriviewFile(usersJson, this.APIController, this.APIRouteForPriviewFile)
      .subscribe(
        (res) => {
          const parse = JSON.parse(res);
          if (parse.value.filename !== '') {
            const fileType = parse.value.filename.split('.').pop();
            if (fileType === 'PNG') {
              this.downloadFile(parse.value.data, parse.value.filename, fileType);
              // const newTab = window.open();
              // newTab.document.body.innerHTML = this.pngFile(parse.value.data);
              // this.showSpinner = false;
            }
            if (fileType === 'JPEG' || fileType === 'JPG') {
              this.downloadFile(parse.value.data, parse.value.filename, fileType);
              // const newTab = window.open();
              // newTab.document.body.innerHTML = this.jpgFile(parse.value.data);
              // this.showSpinner = false;
            }
            if (fileType === 'PDF') {
              this.downloadFile(parse.value.data, parse.value.filename, 'pdf');
              // const newTab = window.open();
              // newTab.document.body.innerHTML = this.pdfFile(parse.value.data);
              // this.showSpinner = false;
            }
            if (fileType === 'DOCX' || fileType === 'DOC') {
              this.downloadFile(parse.value.data, parse.value.filename, 'msword');
            }
            if (fileType === 'XLSX') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.ms-excel');
            }
            if (fileType === 'PPTX') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.ms-powerpoint');
            }
            if (fileType === 'TXT') {
              this.downloadFile(parse.value.data, parse.value.filename, 'txt');
            }
            if (fileType === 'ODT' || fileType === 'ODS' || fileType === 'ODP') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.oasis.opendocument');
            }
            if (fileType === 'ZIP') {
              this.downloadFile(parse.value.data, parse.value.filename, 'zip');
            }
            if (fileType === '7Z') {
              this.downloadFile(parse.value.data, parse.value.filename, 'x-7z-compressed');
            }
            if (fileType === 'RAR') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.rar');
            }
          }
        }
      );
  }

  downloadFile(base64: string, fileName: string, extention: string) {
    var temp = 'data:application/' + extention + ';base64,'
      + encodeURIComponent(base64);
    var download = document.createElement('a');
    download.href = temp;
    download.download = fileName;
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
    this.showSpinner = false;
  }
  //#end region button priview image

  //#region button delete image
  deleteImage(file_name: any, row2) {
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_code: this.model.code,
      p_file_name: file_name,
      p_file_paths: row2
    });
    swal({
      allowOutsideClick: false,
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        this.dalservice.DeleteFile(usersJson, this.APIController, this.APIRouteForDeleteFile)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.callGetrow();
                this.tempFile = undefined;
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.message);
              }
              this.callGetrow();
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.message);
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion button delete image
}
