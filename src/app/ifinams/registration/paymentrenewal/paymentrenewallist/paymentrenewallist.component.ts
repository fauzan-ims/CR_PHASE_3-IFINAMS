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
  templateUrl: './paymentrenewallist.component.html'
})

export class PaymentrenewallistComponent extends BaseComponent implements OnInit {
  // variable
  public listpaymentrenewal: any = [];
  public lookupBranch: any = [];
  public branchName: String;
  public branchCode: String;
  public from_date: any = [];
  public to_date: any = [];
  public system_date = new Date();
  public tampStatus: String;
  private dataTampPush: any = [];
  private dataTamp: any = [];

  //controller
  private APIController: String = 'InsurancePaymentScheduleRenewal';
  private APIControllerSys: String = 'SysBranch';

  //router
  private APIRouteForSys: String = 'GetRowsForLookup';
  private APIRouteForCancel: String = 'ExecSpForGetCancel';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetProceed: String = 'ExecSpForGetProceed';

  private RoleAccessCode = 'R00022650000001A';

  // checklist
  public selectedAll: any;
  private checkedList: any = [];

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
    this.tampStatus = 'HOLD';
    this.loadData();
    this.model.from_date = this.dateFormater('dateNow');
    this.model.to_date = this.dateFormater('nextMonth');
  }

  //#region ddl PageStatus
  PageStatus(event: any) {
    this.tampStatus = event.target.value;
    $('#datatablePaymentrenewallList').DataTable().ajax.reload();
  }
  //#endregion ddl PageStatus

  //#region from date
  FromDate(event: any) {
    this.model.from_date = event;
    $('#datatablePaymentrenewallList').DataTable().ajax.reload();
  }
  //#endregion from date

  //#region to date
  ToDate(event: any) {
    this.model.to_date = event;
    $('#datatablePaymentrenewallList').DataTable().ajax.reload();
  }
  //#endregion to date

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
          'p_from_date': this.model.from_date,
          'p_to_date': this.model.to_date,
          'p_payment_renual_status': this.tampStatus
        }
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))
        // end param tambahan untuk getrows dynamic          
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

          const parse = JSON.parse(resp);
          this.listpaymentrenewal = parse.data;
          if (parse.data != null) {
            this.listpaymentrenewal.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 8] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region Cancel
  btnCancel() {
    this.checkedList = [];
    for (let i = 0; i < this.listpaymentrenewal.length; i++) {
      if (this.listpaymentrenewal[i].selected) {
        this.checkedList.push(this.listpaymentrenewal[i].code);
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
        for (let J = 0; J < this.checkedList.length; J++) {
          const code = this.checkedList[J];
          // param tambahan untuk getrow dynamic
          this.dataTamp = [{
            'p_code': code
          }];
          // end param tambahan untuk getrow dynamic
          this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForCancel)
            .subscribe(
              res => {
                this.showNotification('bottom', 'right', 'success');
                if (result.value) {
                  this.showSpinner = false;
                  $('#datatablePaymentrenewallList').DataTable().ajax.reload();
                }
              },
              () => {
                this.showSpinner = false;
                swal({
                  title: 'Error!',
                  text: 'There was an error while Cancel Data(API) !!!',
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
  //#endregion Cancel

  //#region selectAllTable
  selectAllTable() {
    for (let i = 0; i < this.listpaymentrenewal.length; i++) {
      this.listpaymentrenewal[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listpaymentrenewal.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion selectAllTable

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/registration/subpaymentrenewallist/paymentrenewaldetail', codeEdit]);
  }
  //#endregion button edit

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
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSys, this.APIRouteForSys).subscribe(resp => {
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
    $('#datatablePaymentrenewallList').DataTable().ajax.reload();
  }

  btnClearBranch() {
    this.branchCode = '';
    this.branchName = '';
    $('#datatablePaymentrenewallList').DataTable().ajax.reload();
  }
  //#endregion branch lookup

  //#region checkbox all Proceed
  btnProceed() {
    this.checkedList = [];
    for (let i = 0; i < this.listpaymentrenewal.length; i++) {
      if (this.listpaymentrenewal[i].selected) {
        this.checkedList.push(this.listpaymentrenewal[i].code);
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

    this.dataTampPush = [];
    for (let J = 0; J < this.checkedList.length; J++) {
      const code = this.checkedList[J];
      // param tambahan untuk getrow dynamic
      this.dataTampPush.push({
        'p_code': code
      });
      // end param tambahan untuk getrow dynamic
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
        this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteForGetProceed)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                $('#datatablePaymentrenewallList').DataTable().ajax.reload();
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.data);
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);
            })
      } else {
        this.showSpinner = true;
      }
    });
  }
  //#endregion checkbox all Proceed
}
