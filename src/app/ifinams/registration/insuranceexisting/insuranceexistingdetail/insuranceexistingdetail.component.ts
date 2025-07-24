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
  templateUrl: './insuranceexistingdetail.component.html'
})

export class InsuranceexistingdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public CurrencyFormat = this._currencyformat;
  public NumberOnlyPattern = this._numberonlyformat;
  public insuranceexistingData: any = [];
  public tempFile: any;
  public isReadOnly: Boolean = false;
  public isButton: Boolean = false;
  private setStyle: any = [];
  private tampDocumentCode: String;

  //lookup
  public lookupbranch: any = [];
  public lookupagreement: any = [];
  public lookupplafond: any = [];
  public lookupregion: any = [];
  public lookupcollateral: any = [];
  public lookupplafondcollateral: any = [];
  public lookupcurrency: any = [];
  public lookupinsurance: any = [];
  public lookupdepreciation: any = [];
  public lookupoccupation: any = [];
  public lookupassettype: any = [];
  public lookupcollateraltype: any = [];
  public lookupcollateralcategory: any = [];
  public lookupasset: any = [];
  public tampHidden: Boolean;
  public tampType: String;
  public type: String = '';
  public gender: String = '';
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private base64textString: string;
  private tamps = new Array();
  private tempFileSize: any;
  public lookupExistingAsset: any = [];
  public listexistingasset: any = [];
  public listexistingassetdetailData: any = [];
  public lookupcoverage: any = [];
  public idCoverage: String;

  //controller
  private APIController: String = 'InsuranceRegisterExisting';
  private APIControllerDetail: String = 'InsuranceRegisterExistingAsset';
  private APIControllerAsset: String = 'Asset';
  private APIControllerMasterRegion: String = 'MasterRegion';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';
  private APIControllerCollateralType: String = 'SysGeneralSubcode';
  private APIControllerMasterInsurance: String = 'MasterInsurance';
  private APIControllerMasterOccupation: String = 'MasterOccupation';
  private APIControllerMasterDepreciation: String = 'MasterDepreciation';
  private APIControllerCollateralCategory: String = 'MasterCollateralCategory';
  private APIControllerSys: String = 'sysbranch';
  private APIControllerCur: String = 'syscurrency';
  private APIControllerMasterCoverage: String = 'MasterCoverage';


  //lookup
  private APIRouteForSys: String = 'GetRowsForLookup';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRowCollateralType: String = 'GetRowCollateralType'
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForDeleteFile: String = 'Deletefile';
  private APIRouteForPriviewFile: String = 'Priview';
  private APIRouteForUploadFile: String = 'Upload';
  private APIRouteForPost: String = 'ExecSpForGetPost';
  private APIRouteForCancel: String = 'ExecSpForGetCancel';
  private APIRouteForLookupAsset: String = 'GetRowsForLookupInsuranceExisting';
  private APIRouteForGetDelete: String = 'Delete';
  private APIRouteForUpdateCoverage: String = 'UpdateForCoverage';
  private RoleAccessCode = 'R00022050000000A';

  //checklist
  private checkedLookup: any = [];
  public selectedAllLookup: any;
  public selectedAll: any;
  private checkedList: any = [];

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
    this.Delimiter(this._elementRef);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.callGetrowGlobalParam();
      this.loadData();
    } else {
      this.model.register_status = 'HOLD';
      this.model.insurance_type = 'NON LIFE';
      this.model.source_type = 'ASSET';
      this.model.client_gender = 'F';
      this.tampHidden = true;
      this.showSpinner = false;
    }
  }

  //#region ddl PageType
  PageType(event: any) {
    this.tampType = event.target.value;
    this.model.insurance_code = '';
    this.model.insurance_name = '';
    this.model.fa_code = '';
    this.model.depreciation_code = '';
    this.model.depreciation_name = '';
    this.model.collateral_type = '';
    this.model.collateral_desc = '';
    this.model.collateral_category_code = '';
    this.model.category_name = '';
    this.model.occupation_code = '';
    this.model.occupation_name = '';
    this.model.region_code = '';
    this.model.region_name = '';
  }
  //#endregion ddl PageType

  //#region ddl SourceType
  SourceType(event: any) {
    this.model.source_type = event.target.value;
    if (this.model.source_type === 'PLAFOND') {
      this.model.policy_object_name = '';
      this.model.policy_name = '';
    }
    else {
      this.model.policy_name = '';
      this.model.fa_code = '';
      this.model.fa_name = '';
      this.model.policy_object_name = '';
    }
  }
  //#endregion ddl SourceType

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

  //#region button Post
  btnPost(code: string) {
    this.showSpinner = true;
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_code': code,
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
      if (result.value) {
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPost)
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

  //#region button Cancel
  btnCancel(code: string) {
    // param tambahan untuk button Done dynamic
    this.dataRoleTamp = [{
      'p_code': code,
    }];
    // param tambahan untuk button Done dynamic

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
    })
  }

  //#endregion button Cancel

  //#region getrow data
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': this.param,
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.type = parsedata.insurance_type;
          if (parsedata.paths === '' || parsedata.paths == null) {
            this.tampHidden = true;
          } else {
            this.tampHidden = false;
          }

          // checkbox register_status
          if (parsedata.register_status !== 'HOLD') {
            this.isButton = true;
          } else {
            this.isButton = false;
          }
          // end checkbox register_status

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

  //#region getrow data
  callGetrowGlobalParam() {
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
          'p_register_code': this.param
        });
        // end param tambahan untuk getrows dynamic


        this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listexistingasset = parse.data;
          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

          if (parse.data != null) {
            this.listexistingasset.numberIndex = dtParameters.start;
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

  //#region form submit
  onFormSubmit(insuranceexistingForm: NgForm, isValid: boolean) {
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

    this.insuranceexistingData = this.JSToNumberFloats(insuranceexistingForm);

    if (this.insuranceexistingData.p_insurance_type == null) {
      this.insuranceexistingData.p_insurance_type = this.type;
    }
    if (this.insuranceexistingData.p_source_type == null) {
      this.insuranceexistingData.p_source_type = this.type;
    }
    if (this.insuranceexistingData.p_client_gender == null) {
      this.insuranceexistingData.p_client_gender = this.gender;
    }
    if (this.insuranceexistingData.p_date_of_birth == null || this.insuranceexistingData.p_date_of_birth == '') {
      this.insuranceexistingData.p_date_of_birth = undefined;
    }
    const usersJson: any[] = Array.of(this.insuranceexistingData);

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
            }
            else {
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
              this.route.navigate(['/registration/subinsuranceexistinglist/insuranceexistingdetail', parse.code]);
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
    this.route.navigate(['/registration/subinsuranceexistinglist']);
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

  btnSelectRowBranch(code: String, branch_name: String) {
    this.model.branch_code = code;
    this.model.branch_name = branch_name;
    this.model.agreement_external_no = '';
    this.model.currency_code = '';
    this.model.policy_name = '';
    this.model.fa_code = '';
    this.model.fa_name = '';
    this.model.policy_object_name = '';
    this.model.client_no = '';
    this.model.client_name = '';
    $('#lookupModalBranch').modal('hide');
  }
  //#endregion lookup branch

  //#region lookup Asset
  btnLookupAsset() {
    $('#datatableLookupAsset').DataTable().clear().destroy();
    $('#datatableLookupAsset').DataTable({
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
          'p_agreement_no': this.model.agreement_no
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerAsset, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupasset = parse.data;
          if (parse.data != null) {
            this.lookupasset.numberIndex = dtParameters.start;
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

  btnSelectRowAsset(fa_code: String, fa_name: String, collateral_type: String, description: String, collateral_year: String) {
    this.model.fa_code = fa_code;
    this.model.fa_name = fa_name;
    this.model.policy_object_name = fa_name;
    this.model.collateral_type = collateral_type;
    this.model.collateral_type_desc = description;
    this.callGetrowAssetType(this.model.collateral_type);
    this.model.collateral_year = collateral_year;
    $('#lookupModalAsset').modal('hide');
  }
  //#endregion lookup Asset

  //#region lookup Asset Type
  btnLookupAssetType() {
    $('#datatableLookupAssetType').DataTable().clear().destroy();
    $('#datatableLookupAssetType').DataTable({
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
          this.lookupassettype = parse.data;
          if (parse.data != null) {
            this.lookupassettype.numberIndex = dtParameters.start;
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

  btnSelectRowAssetType(code: String, description: String) {
    this.model.collateral_type = code;
    this.model.collateral_desc = description;
    $('#lookupModalAssetType').modal('hide');
  }
  //#endregion lookup Asset Type

  //#region getrow data
  callGetrowAssetType(code: String) {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': code,
      'action': 'getResponse',
    }];

    // end param tambahan untuk getrow dynamic
    this.dalservice.Getrow(this.dataTamp, this.APIControllerCollateralType, this.APIRouteForGetRowCollateralType)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.model.description = parsedata.description;
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

  //#region lookup currency
  btnLookupCurrency() {
    $('#datatableLookupCurrency').DataTable().clear().destroy();
    $('#datatableLookupCurrency').DataTable({
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
        this.dalservice.GetrowsBase(dtParameters, this.APIControllerCur, this.APIRouteForSys).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupcurrency = parse.data;
          if (parse.data != null) {
            this.lookupcurrency.numberIndex = dtParameters.start;
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

  btnSelectRowCurrency(currency_code: String, currency_desc: string) {
    this.model.currency_code = currency_code;
    this.model.currency_desc = currency_desc;
    $('#lookupModalCurrency').modal('hide');
  }
  //#endregion lookup currency

  //#region Lookup Insurance
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
          'p_insurance_type': this.model.insurance_type,
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

  btnSelectRowInsurance(insurance_code: String, insurance_name: string) {
    this.model.insurance_code = insurance_code;
    this.model.insurance_name = insurance_name;
    $('#lookupModalInsurance').modal('hide');
  }
  //#endregion Lookup Insurance

  //#region Lookup Depreciation
  btnLookupDepreciation() {
    $('#datatableLookupDepreciation').DataTable().clear().destroy();
    $('#datatableLookupDepreciation').DataTable({
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
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterDepreciation, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupdepreciation = parse.data;
          if (parse.data != null) {
            this.lookupdepreciation.numberIndex = dtParameters.start;
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

  btnSelectRowDepreciation(code: String, depreciation_name: string) {
    this.model.depreciation_code = code;
    this.model.depreciation_name = depreciation_name;
    $('#lookupModalDepreciation').modal('hide');
  }
  //#endregion Lookup Depreciation

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
          'p_general_code': 'ICTC',
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowCollateralType(code: String, description: string) {
    this.model.collateral_type = code;
    this.model.collateral_desc = description;
    this.model.collateral_category_code = '';
    this.model.category_name = '';
    $('#lookupModalCollateralType').modal('hide');
  }
  //#endregion lookup Collateral type

  //#region lookup Collateral category
  btnLookupCollateralCategory() {
    $('#datatableLookupCollateralCategory').DataTable().clear().destroy();
    $('#datatableLookupCollateralCategory').DataTable({
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
          'p_collateral_type_code': this.model.collateral_type
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerCollateralCategory, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupcollateralcategory = parse.data;
          if (parse.data != null) {
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowCollateralCategory(code: String, category_name: string) {
    this.model.collateral_category_code = code;
    this.model.category_name = category_name;
    $('#lookupModalCollateralCategory').modal('hide');
  }
  //#endregion lookup Collateral category

  //#region lookup occupation
  btnLookupOccupation() {
    $('#datatableLookupOccupation').DataTable().clear().destroy();
    $('#datatableLookupOccupation').DataTable({
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
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterOccupation, this.APIRouteForLookup).subscribe(resp => {
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowOccupation(occupation_code: String, occupation_name: string) {
    this.model.occupation_code = occupation_code;
    this.model.occupation_name = occupation_name;
    $('#lookupModalOccupation').modal('hide');
  }

  btnClearOccupation() {
    this.model.occupation_code = undefined;
    this.model.occupation_name = undefined;
  }
  //#endregion lookup occupation

  //#region region lookup
  btnLookupRegion() {
    $('#datatableLookupRegion').DataTable().clear().destroy();
    $('#datatableLookupRegion').DataTable({
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
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterRegion, this.APIRouteForLookup).subscribe(resp => {
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowRegion(region_code: String, region_name: string) {
    this.model.region_code = region_code;
    this.model.region_name = region_name;
    $('#lookupModalRegion').modal('hide');
  }

  btnClearRegion() {
    this.model.region_code = undefined;
    this.model.region_name = undefined;
    $('#lookupModalRegion').modal('hide');
  }
  //#endregion region lookup

  //#region button priview image
  priviewFile(row1, row2) {
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

  //#endregion button priview image

  //#region button delete image
  deleteImage(file_name: any, code: String, paths: any) {
    this.showSpinner = true;
    const usersJson: any[] = Array.of();
    usersJson.push({
      'p_code': code,
      'p_file_paths': paths,
      'p_file_name': file_name
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
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.message);
                $('#fileControl').val(undefined);
                this.tempFile = undefined;
              }
              this.callGetrow();
              $('#fileControl').val(undefined);
              this.tempFile = undefined;
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.message);
              $('#fileControl').val(undefined);
              this.tempFile = undefined;
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion button delete image

  //#region button select image
  onUpload(event, code: String) {
    const files = event.target.files;
    const file = files[0];

    if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
      $('#fileControl').val(undefined);
      this.tempFile = undefined;
    } else {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        // tslint:disable-next-line:no-shadowed-variable
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
      p_module: 'IFINAMS',
      p_header: 'INSURANCE_EXISTING_DOCUMENT',
      p_child: this.param,
      p_code: this.tampDocumentCode,
      p_file_paths: this.tampDocumentCode,
      p_file_name: this.tempFile,
      p_base64: this.base64textString
    });
    this.dalservice.UploadFile(this.tamps, this.APIController, this.APIRouteForUploadFile)
      .subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        res => {
          this.tamps = new Array();
          // tslint:disable-next-line:no-shadowed-variable
          const parses = JSON.parse(res);
          if (parses.result === 1) {
            this.showSpinner = false;
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parses.message);
            $('#fileControl').val(undefined);
            this.tempFile = undefined;
          }
          this.callGetrow();
        },
        error => {
          this.showSpinner = false;
          this.tamps = new Array();
          // tslint:disable-next-line:no-shadowed-variable
          const parses = JSON.parse(error);
          this.swalPopUpMsg(parses.message);
          $('#fileControl').val(undefined);
          this.tempFile = undefined;
        });
  }
  //#endregion convert to base64

  //#region lookup Asset
  btnLookupExistingAsset() {
    $('#datatableExistingAsset').DataTable().clear().destroy();
    $('#datatableExistingAsset').DataTable({
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
          'p_company_code': this.company_code,
          'p_branch_code': this.model.branch_code,
          'p_register_code': this.param,
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerAsset, this.APIRouteForLookupAsset).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.lookupExistingAsset = parse.data;
          if (parse.data != null) {
            this.lookupExistingAsset.numberIndex = dtParameters.start;
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

  //#region lookup close
  btnLookupClose() {
    this.loadData();
  }
  //#endregion lookup close

  //#region checkbox all lookup
  btnSelectAllLookup() {
    this.checkedLookup = [];
    for (let i = 0; i < this.lookupExistingAsset.length; i++) {
      if (this.lookupExistingAsset[i].selectedLookup) {
        // this.checkedLookup.push(this.lookupDisposalAsset[i].code);
        this.checkedLookup.push({
          assetCode: this.lookupExistingAsset[i].code,
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
        'p_register_code': this.param,
        'p_fa_code': this.checkedLookup[J].assetCode,
      }];
      // end param tambahan untuk getrow dynamic
      this.dalservice.Insert(this.dataTamp, this.APIControllerDetail, this.APIRouteForInsert)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              if (this.checkedLookup.length == J + 1) {
                if (this.checkedLookup.length == J + 1) {
                  $('#datatables').DataTable().ajax.reload();
                  $('#datatableExistingAsset').DataTable().ajax.reload();
                  $('#reloadHeader').click();
                  this.showNotification('bottom', 'right', 'success');
                }
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
    for (let i = 0; i < this.lookupExistingAsset.length; i++) {
      this.lookupExistingAsset[i].selectedLookup = this.selectedAllLookup;
    }
  }

  checkIfAllLookupSelected() {
    this.selectedAllLookup = this.lookupExistingAsset.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion checkbox all table

  //#region Delete
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listexistingasset.length; i++) {
      if (this.listexistingasset[i].selected) {
        this.checkedList.push(this.listexistingasset[i].id);
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

          this.dalservice.Delete(this.dataTamp, this.APIControllerDetail, this.APIRouteForGetDelete)
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
    for (let i = 0; i < this.listexistingasset.length; i++) {
      this.listexistingasset[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listexistingasset.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion Delete

  //#region button save list
  btnSaveList() {

    this.listexistingassetdetailData = [];

    var i = 0;

    var getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    var getInsuredAmount = $('[name="p_sum_insured_amount_detail"]')
      .map(function () { return $(this).val(); }).get();

    var getPremiAmount = $('[name="p_premi_sell_amount"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getInsuredAmount.length) {

        while (i < getPremiAmount.length) {
          this.listexistingassetdetailData.push(
            this.JSToNumberFloats({
              p_id: getID[i],
              p_register_code: this.param,
              p_sum_insured_amount: getInsuredAmount[i],
              p_premi_sell_amount: getPremiAmount[i],
            })
          );
          i++;
        }
        i++
      }
      i++;
    }
    //#region web service
    this.dalservice.Update(this.listexistingassetdetailData, this.APIControllerDetail, this.APIRouteForUpdate)
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
    if (type === 'sum_insured_amount') {
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
    } else if (type === 'premi_sell_amount') {
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
    }
    else {
      event = '' + event.target.value;
      event = event.trim();
      event = parseFloat(event).toFixed(6);
    }

    if (event === 'NaN') {
      event = 0;
      event = parseFloat(event).toFixed(2);
    }

    if (type === 'sum_insured_amount') {
      $('#sum_insured_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    } else if (type === 'premi_sell_amount') {
      $('#premi_sell_amount' + i)
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

    if (type === 'sum_insured_amount') {
      $('#sum_insured_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    } else if (type === 'premi_sell_amount') {
      $('#premi_sell_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
  }
  //#endregion onFocus

  //#endregion button save list

  //#region coverage lookup
  btnLookupCoverage(id: any) {
    $('#datatableLookupCoverage').DataTable().clear().destroy();
    $('#datatableLookupCoverage').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_insurance_type': 'ALL',
          'p_currency_code': 'ALL'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerMasterCoverage, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupcoverage = parse.data;

          if (parse.data != null) {
            this.lookupcoverage.numberIndex = dtParameters.start;
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

    this.idCoverage = id;

  }

  btnSelectRowCoverage(coverage_code: string, coverage_name: string) {
    // this.model.company_code = company_code;
    let tempLocation = [];
    tempLocation = [{
      'p_id': this.idCoverage,
      'p_coverage_code': coverage_code,
      // 'p_coverage_name': coverage_name,
    }]

    this.dalservice.Update(tempLocation, this.APIControllerDetail, this.APIRouteForUpdateCoverage)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            $('#datatableLookupCoverage').DataTable().ajax.reload();
            $('#datatables').DataTable().ajax.reload();
            this.callGetrow();
            this.showNotification('bottom', 'right', 'success');
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });

    this.model.coverage_code = coverage_code;
    this.model.coverage_name = coverage_name;
    $('#lookupModalCoverage').modal('hide');
    $('#datatables').DataTable().ajax.reload();
  }
  //#endregion coverage lookup
}
