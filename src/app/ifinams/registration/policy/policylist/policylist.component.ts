import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './policylist.component.html'
})

export class PolicylistComponent extends BaseComponent implements OnInit {
  // variable
  public listpolicy: any = [];
  public lookupBranch: any = [];
  public lookupinsurance: any = [];
  public insurance_code: String;
  public insurance_name: String;
  public branchName: String;
  public branchCode: String;
  public tampType: String;
  // public hiddenPrint: boolean = true;
  public hiddenPrint: String;
  public tampPolicyStatus: String;
  public tampPolicyPaymentStatus: String;
  private dataTampPush: any = [];
  private dataTampProceed: any = [];
  public dataTamp: any = [];


  //contoller
  private APIController: String = 'InsurancePolicyMain';
  private APIControllerMasterInsurance: String = 'MasterInsurance';
  private APIControllerSys: String = 'sysbranch';

  //router
  private APIRouteForSys: String = 'GetRowsForLookup';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GetRows';
  private RoleAccessCode = 'R00022090000000A';
  private APIRouteInsertGroup: String = 'ExecSpInsertGroup';
  private APIRouteDeleteGroup: String = 'ExecSpDeleteGroup';

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

  // checklist
  // public selectedAllTable: any;
  public checkedList: any = [];
  public selectedAll: any;

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
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide(this._location, this._elementRef, this.route);
    this.tampPolicyStatus = 'ACTIVE';
    this.tampType = 'ALL';
    this.tampPolicyPaymentStatus = 'HOLD';
    this.loadData();
    this.insurance_code = 'ALL';
    this.model.from_date = '';
    this.model.to_date = '';
  }

  //#region ddl PageStatus
  PageStatus(event: any) {
    this.tampPolicyStatus = event.target.value;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion ddl PageStatus

  //#region ddl PagePaymentStatus
  PagePaymentStatus(event: any) {
    this.tampPolicyPaymentStatus = event.target.value;
    // console.log(this.tampPolicyPaymentStatus)
    $('#datatable').DataTable().ajax.reload();
    // this.hiddenPrint = this.tampPolicyPaymentStatus
    // if (this.tampPolicyPaymentStatus === 'PAID'){
    // } 

  }
  //#endregion ddl PagePaymentStatus

  //#region ddl PageType
  PageType(event: any) {
    this.tampType = event.target.value;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion ddl PageType

  //#region ddl from date
  FromDate(event: any) {
    this.model.from_date = event;
    var fromDate = event.singleDate.formatted;
    // console.log(fromDate)
    if (fromDate == '') {
      this.model.from_date = undefined;
    } else {
      this.model.from_date = event;
    }
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion ddl from date

  //#region ddl to date
  ToDate(event: any) {
    this.model.to_date = event;
    var toDate = event.singleDate.formatted;
    // console.log(fromDate)
    if (toDate == '') {
      this.model.to_date = undefined;
    } else {
      this.model.to_date = event;
    }
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion ddl to date


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
        let paramTamps = {};
        paramTamps = {
          'p_branch_code': this.branchCode,
          'p_insurance_code': this.insurance_code,
          'p_policy_status': this.tampPolicyStatus,
          'p_policy_payment_status': this.tampPolicyPaymentStatus,
          'p_insurance_payment_type': this.tampType,
          'p_from_date': this.model.from_date,
          'p_to_date': this.model.to_date,
        };
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

          const parse = JSON.parse(resp);
          this.listpolicy = parse.data;
          if (parse.data != null) {
            this.listpolicy.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
          this.showSpinner = false;
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 9] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/registration/subpolicylist/policydetail', codeEdit]);
  }
  //#endregion button edit

  //#region button print pajak
  btnPrintPajak() {
    this.dataTampProceed = [];
    this.checkedList = [];

    for (let i = 0; i < this.listpolicy.length; i++) {
      if (this.listpolicy[i].selected) {
        this.checkedList.push({
          'policy_no': this.listpolicy[i].code,
          'user_id': this.userId,

        })
      }
    }

    const dataParam = {
      TableName: 'rpt_print_pajak_insurance_group',
      SpName: 'xsp_rpt_print_pajak_insurance_group',
      reportparameters: {
        p_user_id: this.userId,
        // p_sale_id: this.checkedList.sale_id,
        p_print_option: 'Excel'
      }
    };

    // param tambahan untuk getrole dynamic
    this.dataTampPush = [{
      'p_user_id': this.userId,
      'action': 'default'
    }];
    // param tambahan untuk getrole dynamic

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }
    this.showSpinner = true;
    // console.log(this.checkedList)
    this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteDeleteGroup)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          // console.log(this.checkedList[1].id)
          if (parse.result === 1) {
            this.dataTamp = [];
            let th = this;
            var i = 0;
            (function loopPrintPajak() {
              if (i < th.checkedList.length) {
                const paramtxt = [
                  {
                    'p_user_id': th.checkedList[i].user_id,
                    'p_policy_no': th.checkedList[i].policy_no
                  }
                ];
                // call web service
                th.dalservice.ExecSp(paramtxt, th.APIController, th.APIRouteInsertGroup)
                  .subscribe(
                    res => {
                      const parse = JSON.parse(res);
                      if (parse.result === 1) {
                        //#region proceed file
                        if (th.checkedList.length == i + 1) {
                          th.dalservice.ReportFile(dataParam, th.APIControllerReport, th.APIRouteForDownload).subscribe(res => {
                            th.printRptNonCore(res);
                            th.showSpinner = false;
                            th.loadData();
                            th.showNotification('bottom', 'right', 'success');
                            $('#datatable').DataTable().ajax.reload();

                          }, err => {
                            th.showSpinner = false;
                            // const parse = JSON.parse(err);
                            // th.swalPopUpMsg(parse.data);
                          });
                        } else {
                          i++;
                          loopPrintPajak();
                        }
                        //#endregion
                      } else {
                        th.showSpinner = false;
                      }
                    });
              }
            })();
          } else {
            this.showSpinner = false;
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }

  //#region Branch Lookup
  btnLookupbranch() {
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
          this.lookupBranch = parse.data;
          if (parse.data != null) {
            this.lookupBranch.numberIndex = dtParameters.start;
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

  btnSelectRowLookupBranch(branch_code: String, branch_name: String) {
    this.branchCode = branch_code;
    this.branchName = branch_name;
    $('#lookupModalbranch').modal('hide');
    $('#datatable').DataTable().ajax.reload();
  }

  btnClearBranch() {
    this.branchCode = undefined;
    this.branchName = undefined;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion branch lookup

  //#region insurance lookup
  btnLookupInsurance() {
    $('#datatableLookupInsurance').DataTable().clear().destroy();
    $('#datatableLookupInsurance').DataTable({
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
          'p_insurance_type': 'ALL'
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterInsurance, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupinsurance = parse.data;
          if (parse.data != null) {
            this.lookupinsurance.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowInsurance(code: String, insurance_name: String) {
    this.insurance_code = code;
    this.insurance_name = insurance_name;
    $('#lookupModalInsurance').modal('hide');
    $('#datatable').DataTable().ajax.reload();
  }

  btnClearInsurance() {
    this.insurance_code = '';
    this.insurance_name = '';
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion insurance lookup
  selectAllTable() {
    for (let i = 0; i < this.listpolicy.length; i++) {
      console.log('a')
      this.listpolicy[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listpolicy.every(function (item: any) {
      return item.selected === true;
    })

  }

}
