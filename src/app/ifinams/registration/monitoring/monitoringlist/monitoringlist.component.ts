import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe, Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './monitoringlist.component.html'
})

export class MonitoringlistComponent extends BaseComponent implements OnInit {
  // variable
  public listmonitoring: any = [];
  private dataTampPush: any = [];
  public branchName: String;
  private branchCode: String;
  public lookupBranch: any = [];
  public status: any;
  public budget_status: any;
  public dataTampProceed: any = [];
  private dataTamp: any = [];
  datePipe: DatePipe = new DatePipe('en-US');

  //controller
  private APIController: String = 'Asset';
  private APIControllerSys: String = 'sysbranch';

  //router
  private APIRouteForMonitoringGetRows: String = 'GetRowsForMonitoringPolicy';
  private APIRouteForProceed: String = 'ExecSpForGetProceedMonitoringPolicy';
  private APIRouteForSys: String = 'GetRowsForLookup';
  private RoleAccessCode = 'R00022750000001A';

  // checklist
  public selectedAll: any;
  public checkedList: any = [];

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
    private _location: Location,
    public datepipe: DatePipe,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide(this._location, this._elementRef, this.route);
    this.loadData();
    this.status = 'NOT EXIST';
    this.budget_status = 'YES';
  }


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
          'p_status': this.status,
          'p_budget_status': this.budget_status,
        };

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForMonitoringGetRows).subscribe(resp => {
          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

          const parse = JSON.parse(resp);
          this.listmonitoring = parse.data;
          if (parse.data != null) {
            this.listmonitoring.numberIndex = dtParameters.start;
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

  //#region Proceed
  btnProceed() {
    var FlagDate = new Date();
    let latest_date = this.datepipe.transform(FlagDate, 'yyyy-MM-dd HH:mm:ss');

    this.dataTampProceed = [];
    this.checkedList = [];
    for (let i = 0; i < this.listmonitoring.length; i++) {
      if (this.listmonitoring[i].selected) {
        this.checkedList.push({
          'Code': this.listmonitoring[i].code,
          'BudgetStatus': this.listmonitoring[i].budget_status,
        })
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
    this.dataTamp = [];
    swal({
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

        let th = this;
        var i = 0;
        (function loopPoProceesProceed() {
          if (i < th.checkedList.length) {
            th.dataTampProceed = [{
              'p_code': th.checkedList[i].Code,
              'p_flag_date': latest_date,
              'p_budget_status': th.checkedList[i].BudgetStatus,
              'action': '',
            }];
            th.dalservice.ExecSp(th.dataTampProceed, th.APIController, th.APIRouteForProceed)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatablemonitoringlistpolicy').DataTable().ajax.reload();
                      th.showSpinner = false;
                    } else {
                      i++;
                      loopPoProceesProceed();
                    }
                  } else {
                    th.swalPopUpMsg(parse.data);
                    th.showSpinner = false;
                  }
                },
                error => {
                  const parse = JSON.parse(error);
                  th.swalPopUpMsg(parse.data);
                  th.showSpinner = false;
                });
          }

        })();
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listmonitoring.length; i++) {
      this.listmonitoring[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listmonitoring.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion Proceed

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
    $('#datatablemonitoringlistpolicy').DataTable().ajax.reload();
  }

  btnClearBranch() {
    this.branchCode = '';
    this.branchName = '';
    $('#datatablemonitoringlistpolicy').DataTable().ajax.reload();
  }
  //#endregion branch lookup

  //#region ddl Status
  PageStatus(event: any) {
    this.status = event.target.value;
    $('#datatablemonitoringlistpolicy').DataTable().ajax.reload();
  }
  //#endregion ddl Status

  //#region ddl Status
  BudgetStatus(event: any) {
    this.budget_status = event.target.value;
    $('#datatablemonitoringlistpolicy').DataTable().ajax.reload();
  }
  //#endregion ddl Status
}
