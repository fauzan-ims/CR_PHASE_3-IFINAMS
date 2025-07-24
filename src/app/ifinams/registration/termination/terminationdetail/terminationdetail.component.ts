import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './terminationdetail.component.html'
})
export class TerminationdetailComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public TerminationData: any = [];
  public isReadOnly: Boolean = false;
  public isOnProgress: Boolean;
  public isStatusHold: Boolean;
  public isButton: Boolean = false;
  public isReject: Boolean = false;
  public isCancel: Boolean = false;
  public TerminationStatus: Boolean;
  public valDate: any;
  public valDate2: any;
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private setStyle: any = [];
  public listterminationasset: any = [];
  public listterminationdetailData: any = [];
  private RoleAccessCode = 'R00021980000000A';

  //lookup
  public lookupagremeent: any = [];
  public lookuppolicy: any = [];
  public lookupSysBranch: any = [];
  public lookupReason: any = [];
  public lookupTerminationAsset: any = [];

  //controller
  private APIController: String = 'TerminationMain';
  private APIControllerDetailAsset: String = 'TerminationDetailAsset';
  private APIControllerPolicy: String = 'InsurancePolicyMain';
  private APIControllerSubcode: String = 'SysGeneralSubcode';
  private APIControllerSys: String = 'sysbranch';
  private APIControllerAsset: String = 'InsurancePolicyAsset';

  //router
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForSys: String = 'GetRowsForLookup';
  private APIRouteForPaid: String = 'ExecSpForGetPaid';
  private APIRouteForReject: String = 'ExecSpForGetReject';
  private APIRouteForApproved: String = 'ExecSpForGetApproved';
  private APIRouteForProceed: String = 'ExecSpForGetProceed';
  private APIRouteForCancel: String = 'ExecSpForGetCancel';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteLookupForTerminate: String = 'GetRowsForLookupTerminate';
  private APIRouteForGetDelete: String = 'Delete';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // checklist
  public selectedAll: any;
  private checkedList: any = [];
  private checkedLookup: any = [];
  public selectedAllLookup: any;


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
    if (this.param != null) {
      this.isReadOnly = true;
      this.callGetrow();
      this.loadData();
    } else {
      this.showSpinner = false;
      this.isOnProgress = true;
      this.model.termination_status = 'HOLD';
    }
  }

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
          'p_general_code': 'TREA',
          'p_company_code': this.company_code,
          'p_is_active': '1'
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerSubcode, this.APIRouteForLookup).subscribe(resp => {
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
    this.model.termination_reason_code = code;
    this.model.termination_reason_desc = description;
    $('#lookupModalReason').modal('hide');
  }
  //#endregion Reason lookup

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

  //#region button Approved
  btnApproved(TerminationForm: NgForm) {
    this.TerminationData = this.JSToNumberFloats(TerminationForm);

    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_code': this.TerminationData.p_code,
      'p_termination_approved_amount': this.TerminationData.p_termination_approved_amount,
      'action': ''
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
      this.showSpinner = true;
      if (result.value) {
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForApproved)
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
  //#endregion button Post

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

  //#region button Reject
  btnReject(code: string) {
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

  //#region button Cancel
  btnCancel(code: string) {
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
          const parsedata = parse.data[0];
          this.valDate = parsedata.policy_eff_date;
          this.valDate2 = parsedata.policy_exp_date;
          const ngbGetrow = this.getrowNgb(parse.data[0]);

          // if button
          if (parsedata.termination_status === 'HOLD') {
            this.isCancel = true;
          } else {
            this.isCancel = false;
          }

          if (parsedata.termination_status === 'HOLD') {
            this.TerminationStatus = true;
            this.isStatusHold = false;
          } else {
            this.TerminationStatus = false;
            this.isStatusHold = true;
          }

          if (parsedata.termination_status === 'ON PROCESS') {
            this.isOnProgress = false;
            this.isStatusHold = true;
            this.TerminationStatus = true;
            this.isReject = true;
          } else {
            this.isOnProgress = true;
            this.isStatusHold = true;
            this.TerminationStatus = true;
            this.isReject = false;
          }
          //

          // checkbox batch_status
          if (parsedata.termination_status !== 'HOLD') {
            this.isButton = true;
          } else {
            this.isButton = false;
          }
          // end checkbox batch_status

          // mapper dbtoui
          Object.assign(this.model, ngbGetrow);
          // end mapper dbtoui

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region  form submit
  onFormSubmit(TerminationForm: NgForm, isValid: boolean) {
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

    this.TerminationData = this.JSToNumberFloats(TerminationForm);
    if (this.TerminationData.p_termination_request_code == '') {
      this.TerminationData.p_termination_request_code = undefined;
    }

    const usersJson: any[] = Array.of(this.TerminationData);
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
              this.route.navigate(['/registration/subterminationlist/terminationdetail', parse.code]);
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
    this.route.navigate(['/registration/subterminationlist']);
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
          this.lookupSysBranch = parse.data;
          if (parse.data != null) {
            this.lookupSysBranch.numberIndex = dtParameters.start;
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
        this.dalservice.Getrows(dtParameters, this.APIControllerPolicy, this.APIRouteForLookup).subscribe(resp => {
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
          'p_termination_code': this.param
        });
        // end param tambahan untuk getrows dynamic


        this.dalservice.Getrows(dtParameters, this.APIControllerDetailAsset, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listterminationasset = parse.data;
          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

          if (parse.data != null) {
            this.listterminationasset.numberIndex = dtParameters.start;
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

  //#region lookup Asset
  btnLookupTerminationDetail() {
    $('#datatableTerminationAssetLookup').DataTable().clear().destroy();
    $('#datatableTerminationAssetLookup').DataTable({
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
          'p_policy_code': this.model.policy_code,
          'p_termination_code': this.param
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerAsset, this.APIRouteLookupForTerminate).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.lookupTerminationAsset = parse.data;

          if (parse.data != null) {
            this.lookupTerminationAsset.numberIndex = dtParameters.start;
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

  //#region checkbox all lookup
  btnSelectAllLookup() {
    this.checkedLookup = [];
    for (let i = 0; i < this.lookupTerminationAsset.length; i++) {
      if (this.lookupTerminationAsset[i].selectedLookup) {
        this.checkedLookup.push({
          Code: this.lookupTerminationAsset[i].policy_asset_code,
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
      // const codeData = this.checkedLookup[J];
      this.dataTamp = [{
        'p_termination_code': this.param,
        'p_policy_code': this.model.policy_code,
        'p_policy_asset_code': this.checkedLookup[J].Code,
      }];
      // end param tambahan untuk getrow dynamic
      this.dalservice.Insert(this.dataTamp, this.APIControllerDetailAsset, this.APIRouteForInsert)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              if (this.checkedLookup.length == J + 1) {
                $('#datatables').DataTable().ajax.reload();
                $('#datatableTerminationAssetLookup').DataTable().ajax.reload();
                $('#reloadHeader').click();
                this.showNotification('bottom', 'right', 'success');
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
    for (let i = 0; i < this.lookupTerminationAsset.length; i++) {
      this.lookupTerminationAsset[i].selectedLookup = this.selectedAllLookup;
    }
  }

  checkIfAllLookupSelected() {
    this.selectedAllLookup = this.lookupTerminationAsset.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion checkbox all table

  //#region Delete
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listterminationasset.length; i++) {
      if (this.listterminationasset[i].selected) {
        this.checkedList.push(this.listterminationasset[i].id);
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
      this.showSpinner = true;
      if (result.value) {
        this.dataTamp = [];
        for (let J = 0; J < this.checkedList.length; J++) {
          const code = this.checkedList[J];
          // param tambahan untuk getrow dynamic
          this.dataTamp = [{
            'p_id': code
          }];
          // end param tambahan untuk getrow dynamic

          this.dalservice.Delete(this.dataTamp, this.APIControllerDetailAsset, this.APIRouteForGetDelete)
            .subscribe(
              res => {
                this.showSpinner = false;
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatables').DataTable().ajax.reload();
                    $('#reloadHeader').click();
                    this.callGetrow();
                  }
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
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listterminationasset.length; i++) {
      this.listterminationasset[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listterminationasset.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion Delete

  //#region button save list
  btnSaveList() {

    this.listterminationdetailData = [];

    var i = 0;

    var getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    var getRefundAmount = $('[name="p_refund_amount"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getRefundAmount.length) {

        this.listterminationdetailData.push(
          this.JSToNumberFloats({
            p_id: getID[i],
            p_refund_amount: getRefundAmount[i],
          })
        );
        i++;
      }
      i++;
    }
    //#region web service
    this.dalservice.Update(this.listterminationdetailData, this.APIControllerDetailAsset, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          if (parse.result === 1) {
            this.showNotification('bottom', 'right', 'success');
            $('#datatables').DataTable().ajax.reload();
            this.callGetrow();
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);

        });
    //#endregion web service

  }
  //#region onBlur
  onBlur(event, i, type) {
    if (type === 'amount') {
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
    } else {
      event = '' + event.target.value;
      event = event.trim();
      event = parseFloat(event).toFixed(6);
    }

    if (event === 'NaN') {
      event = 0;
      event = parseFloat(event).toFixed(2);
    }

    if (type === 'amount') {
      $('#refund_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    } else {
      $('#refund_amount' + i)
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

    if (type === 'amount') {
      $('#refund_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    } else {
      $('#refund_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
  }
  //#endregion onFocus

  //#region lookup close
  btnLookupClose() {
    this.loadData();
  }
  //#endregion lookup close
}
