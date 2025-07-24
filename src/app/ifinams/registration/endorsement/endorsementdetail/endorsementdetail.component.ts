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
  templateUrl: './endorsementdetail.component.html'
})
export class EndorsementdetailComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public endorsementData: any = [];
  public endorsementdetailData: any = [];
  public listendorsementperiod: any = [];
  public listendorsementnewperiod: any = [];
  public listendorsementloading: any = [];
  public listendorsementnewloading: any = [];
  public isReadOnly: Boolean = false;
  public isStatus: Boolean;
  public isReject: Boolean = false;
  public isCancel: Boolean = false;
  public isButton: Boolean = false;
  public valDate: any;
  public valDate2: any;
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private setStyle: any = [];

  //lookup
  public lookuppolicy: any = [];
  public lookupSysBranch: any = [];
  public lookupcurrency: any = [];
  public lookupoccupation: any = [];
  public lookupregion: any = [];
  public lookupcollateraltype: any = [];
  public lookupcollateralcategory: any = [];
  public lookupagremeent: any = [];
  public lookupReason: any = [];

  //controller
  private APIController: String = 'EndorsementMain';
  private APIControllerEndorsementDetail: String = 'EndorsementDetail';
  private APIControllerSubcode: String = 'SysGeneralSubcode';
  private APIControllerPolicy: String = 'InsurancePolicyMain';
  private APIControllerOccupation: String = 'MasterOccupation';
  private APIControllerRegion: String = 'MasterRegion';
  private APIControllerCollateralCategory: String = 'MasterCollateralCategory';
  private APIControllerEndorsementPeriod: String = 'EndorsementPeriod';
  private APIControllerEndorsementLoading: String = 'EndorsementLoading';
  private APIControllerSys: String = 'sysbranch';

  //router
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForGetDelete: String = 'DELETE';
  private APIRouteForGetProceed: String = 'ExecSpForGetProceed';
  private APIRouteForGetApprove: String = 'ExecSpForGetApprove';
  private APIRouteForGetCancel: String = 'ExecSpForGetCancel';
  private APIRouteForGetReject: String = 'ExecSpForGetReject';
  private APIRouteForGetPaid: String = 'ExecSpForGetPaid';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private RoleAccessCode = 'R00022000000000A';

  // form 2 way binding
  model: any = {};
  modelOld: any = {};
  modelNew: any = {};

  // checklist
  private selectedAllPeriod: any;
  private selectedAllLoading: any;
  private checkedListPeriod: any = [];
  private checkedListLoading: any = [];

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptionsEndorsementOldPeriod: DataTables.Settings = {};
  dtOptionsEndorsementNewPeriod: DataTables.Settings = {};
  dtOptionsEndorsementOldLoading: DataTables.Settings = {};
  dtOptionsEndorsementNewLoading: DataTables.Settings = {};

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
      this.isStatus = true;

      // call web service
      this.callGetrow();
      this.loadDataEndorsementOldPeriod();
      this.loadDataEndorsementNewPeriod();
      this.loadDataEndorsementOldLoading();
      this.loadDataEndorsementNewLoading();
      this.callGetrowEndorsementDetailOld();
      this.callGetrowEndorsementDetailNew();
    } else {
      this.showSpinner = false;
      this.model.endorsement_type = 'FN';
      this.model.endorsement_status = 'HOLD';
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
          'p_general_code': 'EREA',
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
    this.model.endorsement_reason_code = code;
    this.model.endorsement_reason_desc = description;
    $('#lookupModalReason').modal('hide');
  }
  //#endregion Reason lookup

  //#region load all data endorsement old period
  loadDataEndorsementOldPeriod() {
    this.dtOptionsEndorsementOldPeriod = {
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
          'p_endorsement_code': this.param,
          'p_old_or_new': 'OLD'
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerEndorsementPeriod, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listendorsementperiod = parse.data;
          this.listendorsementperiod.numberIndex = dtParameters.start;

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
  //#endregion load all data endorsement old period

  //#region load all data endorsement new period
  loadDataEndorsementNewPeriod() {
    this.dtOptionsEndorsementNewPeriod = {
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
          'p_endorsement_code': this.param,
          'p_old_or_new': 'NEW'
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerEndorsementPeriod, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listendorsementnewperiod = parse.data;
          this.listendorsementnewperiod.numberIndex = dtParameters.start;

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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data endorsement new period

  //#region load all data endorsement old loading
  loadDataEndorsementOldLoading() {
    this.dtOptionsEndorsementOldLoading = {
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
          'p_endorsement_code': this.param,
          'p_old_or_new': 'OLD'
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerEndorsementLoading, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listendorsementloading = parse.data;
          this.listendorsementloading.numberIndex = dtParameters.start;

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
  //#endregion load all data new endorsement old period

  //#region load all data endorsement new loading
  loadDataEndorsementNewLoading() {
    this.dtOptionsEndorsementNewLoading = {
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
          'p_endorsement_code': this.param,
          'p_old_or_new': 'NEW'
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerEndorsementLoading, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listendorsementnewloading = parse.data;
          this.listendorsementnewloading.numberIndex = dtParameters.start;

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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data endorsement old period

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
          const ngbGetrow = this.getrowNgb(parse.data[0]);

          // mapper dbtoui
          Object.assign(this.model, ngbGetrow);
          // end mapper dbtoui

          // if button
          if (parsedata.endorsement_status === 'HOLD') {
            this.isCancel = true;
          } else {
            this.isCancel = false;
          }

          if (parsedata.endorsement_status === 'ON PROCESS') {
            this.isReject = true;
          } else {
            this.isReject = false;
          }

          // checkbox batch_status
          if (parsedata.endorsement_status !== 'HOLD') {
            this.isButton = true;
          } else {
            this.isButton = false;
          }
          // end checkbox batch_status
          //

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region getrow data EndorsementDetailOld
  callGetrowEndorsementDetailOld() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_endorsement_code': this.param,
      'p_old_or_new': 'OLD'
    }];
    // end param tambahan untuk getrow dynamic
    this.dalservice.Getrow(this.dataTamp, this.APIControllerEndorsementDetail, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          Object.assign(this.modelOld, parsedata);
          // end mapper dbtoui
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow EndorsementDetailOld

  //#region getrow data EndorsementDetailNew
  callGetrowEndorsementDetailNew() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_endorsement_code': this.param,
      'p_old_or_new': 'NEW'
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIControllerEndorsementDetail, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];
          this.valDate = parsedata.eff_date;
          this.valDate2 = parsedata.exp_date;
          const ngbGetrow = this.getrowNgb(parse.data[0]);

          // mapper dbtoui
          Object.assign(this.modelNew, ngbGetrow);
          // end mapper dbtoui
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow EndorsementDetailNew

  //#region  form submit
  onFormSubmit(EndorsementForm: NgForm, isValid: boolean) {
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

    this.endorsementData = this.JSToNumberFloats(EndorsementForm);
    if (this.param == null) {
      this.endorsementData.p_endorsement_payment_amount = 0;
      this.endorsementData.p_endorsement_received_amount = 0;
    }
    if (this.endorsementData.p_endorsement_request_code == '') {
      this.endorsementData.p_endorsement_request_code = undefined;
    }

    const usersJson: any[] = Array.of(this.endorsementData);
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
              this.route.navigate(['/registration/subendorsementlist/endorsementdetail', parse.code]);
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

  //#region  form submit Endorsement Detail
  onFormSubmitEndorsementDetail(EndorsementdetailForm: NgForm, isValid: boolean) {
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

    this.endorsementdetailData = this.JSToNumberFloats(EndorsementdetailForm);
    const usersJson: any[] = Array.of(this.endorsementdetailData);

    // call web service
    this.dalservice.Update(usersJson, this.APIControllerEndorsementDetail, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            this.showNotification('bottom', 'right', 'success');
            this.callGetrowEndorsementDetailNew();
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
  //#endregion form submit submit Endorsement Detail

  //#region button add period
  btnAddPeriod(AssetName: string, InsuranceName: string) {
    this.route.navigate(['/registration/subendorsementlist/endorsementperioddetail', this.param, AssetName, InsuranceName]);
  }
  //#endregion button add period

  //#region button add Loading
  btnAddLoading(Agreement: string, ClientName: string) {
    this.route.navigate(['/registration/subendorsementlist/endorsementloadingdetail', this.param, Agreement, ClientName]);
  }
  //#endregion button add Loading

  //#region button edit period detail
  btnEditPeriod(codeEdit: string) {
    this.route.navigate(['/registration/subendorsementlist/endorsementperioddetail', this.param, codeEdit]);
  }
  //#endregion button edit period detail

  //#region button edit loading detail
  btnEditLoading(codeEdit: string) {
    this.route.navigate(['/registration/subendorsementlist/endorsementloadingdetail', this.param, codeEdit]);
  }
  //#endregion button edit loading detail

  //#region button back
  btnBack() {
    this.route.navigate(['/registration/subendorsementlist']);
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
        this.dalservice.GetrowsBase(dtParameters, this.APIControllerSys, this.APIRouteForLookup).subscribe(resp => {
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
          'p_is_existing': '0'
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

  //#region Occupation Code Lookup
  btnLookupOccupation() {
    $('#datatableLookupOccupation').DataTable().clear().destroy();
    $('#datatableLookupOccupation').DataTable({
      'pagingType': 'first_last_numbers',
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'default': ''
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerOccupation, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupoccupation = parse.data;

          if (parse.data != null) {
            this.lookupoccupation.numberIndex = dtParameters.start;
          }
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowOccupation(code: String, occupation_name: string) {
    this.modelNew.occupation_code_new = code;
    this.modelNew.occupation_name_new = occupation_name;
    $('#lookupModalOccupation').modal('hide');
  }
  //#endregion LossType lookup

  //#region Region Lookup
  btnLookupRegion() {
    $('#datatableLookupRegion').DataTable().clear().destroy();
    $('#datatableLookupRegion').DataTable({
      'pagingType': 'first_last_numbers',
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'default': ''
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerRegion, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupregion = parse.data;

          if (parse.data != null) {
            this.lookupregion.numberIndex = dtParameters.start;
          }

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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowRegion(code: String, region_name: string) {
    this.modelNew.region_code_new = code;
    this.modelNew.region_name_new = region_name;
    $('#lookupModalRegion').modal('hide');
  }
  //#endregion Region lookup

  //#region lookup Collateral category
  btnLookupCollateralCategory() {
    $('#datatableLookupCollateralCategory').DataTable().clear().destroy();
    $('#datatableLookupCollateralCategory').DataTable({
      'pagingType': 'first_last_numbers',
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_collateral_type_code': this.model.collateral_type_name_new
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerCollateralCategory, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupcollateralcategory = parse.data;

          if (parse.datea != null) {
            this.lookupcollateralcategory.numberIndex = dtParameters.start;
          }
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

  btnSelectRowCollateralCategory(code: String, category_name: string) {
    this.modelNew.collateral_category_code_new = code;
    this.modelNew.category_name_new = category_name;
    $('#lookupModalCollateralCategory').modal('hide');
  }
  //#endregion lookup Collateral category

  //#region checkbox all table
  btnDeleteAllPeriod() {
    this.checkedListPeriod = [];
    for (let i = 0; i < this.listendorsementnewperiod.length; i++) {
      if (this.listendorsementnewperiod[i].selectedPeriod) {
        this.checkedListPeriod.push(this.listendorsementnewperiod[i].id);
      }
    }

    // jika tidak di checklist
    if (this.checkedListPeriod.length === 0) {
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
        for (let J = 0; J < this.checkedListPeriod.length; J++) {
          const code = this.checkedListPeriod[J];
          // param tambahan untuk getrow dynamic
          this.dataTamp = [{
            'p_id': code
          }];
          // end param tambahan untuk getrow dynamic
          this.dalservice.Delete(this.dataTamp, this.APIControllerEndorsementPeriod, this.APIRouteForGetDelete)
            .subscribe(
              res => {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                $('#datatableEndorsementNewPeriod').DataTable().ajax.reload();
              },
              () => {
                this.showSpinner = false;
                swal({
                  title: 'Error!',
                  text: 'There was an error while Delete Data(API) !!!',
                  type: 'error',
                  confirmButtonClass: 'btn btn-warning',
                  buttonsStyling: false
                })
                return true;
              });
        }
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTablePeriod() {
    for (let i = 0; i < this.listendorsementnewperiod.length; i++) {
      this.listendorsementnewperiod[i].selectedPeriod = this.selectedAllPeriod;
    }
  }

  checkIfAllTableSelectedPeriod() {
    this.selectedAllPeriod = this.listendorsementnewperiod.every(function (item: any) {
      return item.selectedPeriod === true;
    })
  }
  //#endregion checkbox all table

  //#region checkbox all table
  btnDeleteAllLoading() {
    this.checkedListLoading = [];
    for (let i = 0; i < this.listendorsementnewloading.length; i++) {
      if (this.listendorsementnewloading[i].selectedLoading) {
        this.checkedListLoading.push(this.listendorsementnewloading[i].id);
      }
    }

    // jika tidak di checklist
    if (this.checkedListLoading.length === 0) {
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
        for (let J = 0; J < this.checkedListLoading.length; J++) {
          const code = this.checkedListLoading[J];
          // param tambahan untuk getrow dynamic
          this.dataTamp = [{
            'p_id': code
          }];
          // end param tambahan untuk getrow dynamic
          this.dalservice.Delete(this.dataTamp, this.APIControllerEndorsementLoading, this.APIRouteForGetDelete)
            .subscribe(
              res => {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                $('#datatableEndorsementNewLoading').DataTable().ajax.reload();
              },
              () => {
                this.showSpinner = false;
                swal({
                  title: 'Error!',
                  text: 'There was an error while Delete Data(API) !!!',
                  type: 'error',
                  confirmButtonClass: 'btn btn-warning',
                  buttonsStyling: false
                })
                return true;
              });
        }
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTableLoading() {
    for (let i = 0; i < this.listendorsementnewloading.length; i++) {
      this.listendorsementnewloading[i].selectedLoading = this.selectedAllLoading;
    }
  }

  checkIfAllTableSelectedLoading() {
    this.selectedAllLoading = this.listendorsementnewloading.every(function (item: any) {
      return item.selectedLoading === true;
    })
  }
  //#endregion checkbox all table

  //#region button Cancel
  btnCancel(code: string) {
    // param tambahan untuk button Cancel dynamic
    this.dataRoleTamp = [{
      'p_code': code,
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

  //#region button Approve
  btnApprove(code: string) {
    // param tambahan untuk button Approve dynamic
    this.dataRoleTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk button Approve dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForGetApprove)
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
  //#endregion button Approve

  //#region button Proceed
  btnProceed(code: string) {
    // param tambahan untuk button Proceed dynamic
    this.dataRoleTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk button Proceed dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForGetProceed)
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
    // param tambahan untuk button Reject dynamic
    this.dataRoleTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk button Reject dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForGetReject)
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

  //#region button Paid
  btnPaid(code: string) {
    // param tambahan untuk button Paid dynamic
    this.dataRoleTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk button Paid dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForGetPaid)
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
}
