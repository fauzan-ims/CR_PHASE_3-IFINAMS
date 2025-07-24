import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './insuranceratenonlifelist.component.html',
})

export class InsuranceratenonlifelistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listinsuranceratenonlife: any;
  public lookupinsurance: any = [];
  public lookupcollateraltype: any = [];
  public tampStatus: String;
  private APIController: String = 'MasterInsuranceRateNonLife';
  private APIControllerMasterInsurance: String = 'MasterInsurance';
  private APIControllerCollateralType: String = 'SysGeneralSubcode';
  private APIRouteForGetRows: String = 'GETROWS'
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private RoleAccessCode = 'R00002290000230A';

  // spinner
  showSpinner: Boolean = true;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  // form 2 way binding
  model: any = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide(this._location, this._elementRef, this.route);
    this.loadData();
  }

  //#region load all data
  loadData() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      serverSide: true,
      processing: true,
      stateSave: true,
      paging: true,
      'lengthMenu': [
        [10, 25, 50, 100],
        [10, 25, 50, 100]
      ],
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_insurance_code': this.model.insurance_code,
          'p_collateral_type_code': this.model.collateral_type_code,
        })
        // end param tambahan untuk getrows dynamic

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listinsuranceratenonlife = parse.data;
          if (parse.data != null) {
            this.listinsuranceratenonlife.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 8] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region button add
  btnAdd() {
    this.route.navigate(['/systemsetting/subinsuranceratenonlifelist/insuranceratenonlifedetail']);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/systemsetting/subinsuranceratenonlifelist/insuranceratenonlifedetail', codeEdit]);
  }
  //#endregion button edit

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
          'p_insurance_type': 'NON LIFE',
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }
  btnSelectRowInsurance(code: String, insurance_name: String) {
    this.model.insurance_code = code;
    this.model.insurance_name = insurance_name;
    this.model.collateral_type_code = '';
    this.model.description = '';
    $('#lookupModalInsurance').modal('hide');
    $('#datatable').DataTable().ajax.reload();
  }

  btnClearInsurance() {
    this.model.insurance_code = '';
    this.model.insurance_name = '';
    this.model.collateral_type_code = '';
    this.model.description = '';
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion insurance lookup

  //#region lookup Collateral type
    btnLookupCollateralType() {
    $('#datatableLookupCollateralType').DataTable().clear().destroy();
    $('#datatableLookupCollateralType').DataTable({
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
          'p_general_code': 'ASTYPE',
          'p_company_code': this.company_code
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerCollateralType, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupcollateraltype = parse.data;
          if (parse.data != null) {
            this.lookupcollateraltype.numberIndex = dtParameters.start;
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
  btnSelectRowCollateralType(code: String, description: string) {
    this.model.collateral_type_code = code;
    this.model.description = description;
    this.model.collateral_category_code = '';
    this.model.category_name = '';
    $('#lookupModalCollateralType').modal('hide');
    $('#datatable').DataTable().ajax.reload();
  }

  btnClearCollateral() {
    this.model.collateral_type_code = '';
    this.model.description = '';
    this.model.collateral_category_code = '';
    this.model.category_name = '';
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion lookup Collateral type


}


