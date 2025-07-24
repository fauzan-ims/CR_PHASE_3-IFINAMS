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
  templateUrl: './manualregistrationlist.component.html'
})

export class ManualregistrationlistComponent extends BaseComponent implements OnInit {
  // variable
  public listmanualregistration: any = [];
  public lookupBranch: any = [];
  public branchName: String;
  public branchCode: String;
  public tampStatus: String;
  public tampType: String;

  //controller
  private APIController: String = 'InsuranceRegister';
  private APIControllerSys: String = 'sysbranch';

  //router
  private APIRouteForSys: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GetRows';
  private RoleAccessCode = 'R00022030000000A';

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
    this.tampType = 'NON LIFE';
    this.tampStatus = 'HOLD';
    this.loadData();
  }

  //#region ddl PageStatus
  PageStatus(event: any) {
    this.tampStatus = event.target.value;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion ddl PageStatus

  //#region ddl PageType
  PageType(event: any) {
    this.tampType = event.target.value;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion ddl PageType

  //#region List load all data
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
          'p_branch_code': this.branchCode,
          'p_register_status': this.tampStatus,
          'p_insurance_type': this.tampType,
          'p_is_renual': '0'
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listmanualregistration = parse.data;
          if (parse.data != null) {
            this.listmanualregistration.numberIndex = dtParameters.start;
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
  //#endregion List load all data

  //#region List button add
  btnAdd() {
    this.route.navigate(['/registration/submanualregistrationlist/manualregistrationdetail']);
  }
  //#endregion List button add

  //#region List button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/registration/submanualregistrationlist/manualregistrationdetail', codeEdit]);
  }
  //#endregion List button edit

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
    this.branchCode = '';
    this.branchName = '';
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion branch lookup


}
