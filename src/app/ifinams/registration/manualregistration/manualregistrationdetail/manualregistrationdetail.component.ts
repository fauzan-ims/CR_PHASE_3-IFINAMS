import { Component, OnInit, ElementRef, ViewChild, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
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
  templateUrl: './manualregistrationdetail.component.html'
})

export class ManualregistrationdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public manualregistrationData: any = [];
  public isReadOnly: Boolean = false;
  public isButton: Boolean = false;
  public isProp: Boolean;
  public lookupbranch: any = [];
  public lookupregion: any = [];
  public lookupasset: any = [];
  public lookupcurrency: any = [];
  public lookupinsurance: any = [];
  public lookupdepreciation: any = [];
  public lookupoccupation: any = [];
  public lookupcollateralcategory: any = [];
  public isDisabled: Boolean;
  public tampType: String;
  public client_gender: Boolean;
  public type: String = '';
  public gender: String = '';
  public payment_type: String = '';
  public register_type: String;
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private setStyle: any = [];
  public lookupexistingpolicy: any = [];
  public lookupassettype: any = [];
  public isRadio1: Boolean = false;
  public isRadio2: Boolean = false;
  private RoleAccessCode = 'R00022030000000A';

  //controller
  private APIController: String = 'InsuranceRegister';
  private APIControllerAsset: String = 'Asset';
  private APIControllerMasterInsurance: String = 'MasterInsurance';
  private APIControllerMasterDepreciation: String = 'MasterDepreciation';
  private APIControllerMasterOccupation: String = 'MasterOccupation';
  private APIControllerMasterRegion: String = 'MasterRegion';
  private APIControllerCollateralType: String = 'SysGeneralSubcode';
  private APIControllerCollateralCategory: String = 'MasterCollateralCategory';
  private APIControllerSys: String = 'sysbranch';
  private APIControllerCur: String = 'syscurrency';
  private APIControllerInsurancePolicy: String = 'InsurancePolicyMain';

  //lookup
  private APIRouteForSys: String = 'GetRowsForLookup';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForPost: String = 'ExecSpForGetPost';
  private APIRouteForCancel: String = 'ExecSpForGetCancel';
  private APIRouteForLookupInsuranceExisting: String = 'GetRowsForLookupManualRegister';
  private APIRouteForGetRowCollateralType: String = 'GetRowCollateralType'

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
    this.Delimiter(this._elementRef);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {
      // call web service
      this.callGetrow();
    } else {
      this.model.register_status = 'HOLD';
      this.model.insurance_type = 'NON LIFE';
      this.model.source_type = 'COLLATERAL';
      this.model.source_type = 'ASSET';
      this.model.insurance_paid_by = 'MF';
      this.model.client_gender = 'F';
      this.model.insurance_payment_type = 'FTFP';
      this.showSpinner = false;
      this.model.register_type = 'NEW';
    }
  }

  callWizard() {
    setTimeout(() => {
      const insurancetype = $('#insurancetype').val();
      const collateraltype = $('#collateraltype').val();

      // if (insurancetype === 'LIFE' || collateraltype !== 'VHCL') {
      //   $('#loading').remove();
      // }
      this.wizard();
    }, 500);
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

  //#region ddl PageType
  PageType(event: any) {
    this.model.insurance_type = event.target.value;
    if (this.model.insurance_type === 'LIFE') {
      this.model.insurance_code = '';
      this.model.insurance_name = '';
      this.model.insurance_payment_type = 'FTFP';
      this.model.source_type = 'AGREEMENT';
      this.model.register_name = '';
      this.model.client_no = '';
      this.model.client_name = '';
    }
    else {
      this.model.insurance_code = '';
      this.model.insurance_name = '';
      this.model.agreement_no = '';
      this.model.agreement_external_no = '';
      this.model.register_name = '';
      this.model.client_no = '';
      this.model.client_name = '';
    }
  }
  //#endregion ddl PageType

  //#region ddl SourceType
  SourceType(event: any) {
    this.model.source_type = event.target.value;
    this.model.register_name = '';
    this.model.fa_code = '';
    this.model.fa_name = '';
    this.model.register_object_name = '';
    this.model.register_qq_name = ''
    this.model.collateral_type = ''
    this.model.collateral_year = ''
    this.model.collateral_type_desc = ''
  }
  //#endregion ddl SourceType

  //#region button Post
  btnPost(code: string) {
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
      this.showSpinner = true;
      if (result.value) {
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPost)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                $('#reloadWiz').click();
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
                $('#reloadWiz').click();
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
      'p_code': this.param
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);
          this.type = parsedata.insurance_type;

          this.isReadOnly = true;

          if (parsedata.source === 'APPLICATION') {
            this.isDisabled = true;
          }

          // checkbox register_status
          if (parsedata.register_status !== 'HOLD') {
            this.isButton = true;
          } else {
            this.isButton = false;
          }
          // end checkbox register_status

          // checkbox register_status
          if (this.param !== null) {
            this.isRadio1 = true;
            this.isRadio2 = true;
          } else {
            this.isRadio1 = false;
            this.isRadio2 = false;
          }
          // end checkbox register_status

          this.callWizard();
          this.registerassetwiz();

          // checkbox
          if (parsedata.is_authorized_workshop === '1') {
            parsedata.is_authorized_workshop = true;
          } else {
            parsedata.is_authorized_workshop = false;
          }
          if (parsedata.is_renual === '1') {
            parsedata.is_renual = true;
          } else {
            parsedata.is_renual = false;
          }
          if (parsedata.is_commercial === '1') {
            parsedata.is_commercial = true;
          } else {
            parsedata.is_commercial = false;
          }
          // end checkbox

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
  onFormSubmit(manualregistrationForm: NgForm, isValid: boolean) {
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
    this.manualregistrationData = manualregistrationForm;
    if (this.manualregistrationData.p_is_renual == null) {
      this.manualregistrationData.p_is_renual = false;
    }
    if (this.manualregistrationData.p_is_authorized_workshop == null) {
      this.manualregistrationData.p_is_authorized_workshop = false;
    }
    if (this.manualregistrationData.p_is_commercial == null) {
      this.manualregistrationData.p_is_commercial = false;
    }
    if (this.manualregistrationData.p_insurance_type == null) {
      this.manualregistrationData.p_insurance_type = this.type;
    }

    if (this.manualregistrationData.p_source_type == null) {
      this.manualregistrationData.p_source_type = this.type;
    }

    const usersJson: any[] = Array.of(this.JSToNumberFloats(this.manualregistrationData));

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
              this.route.navigate(['/registration/submanualregistrationlist/manualregistrationdetail', parse.code]);
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
    this.route.navigate(['/registration/submanualregistrationlist']);

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
    this.model.agreement_external_no = '';
    this.model.register_name = '';
    this.model.collateral_external_no = '';
    this.model.register_object_name = '';

    this.model.client_no = '';
    this.model.client_name = '';

    //plafond
    this.model.plafond_no = '';
    this.model.plafond_external_no = '';
    this.model.plafond_name = '';
    this.model.fa_code = '';
    this.model.register_object_name = '';
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

  btnSelectRowAsset(fa_code: String, fa_name: String, collateral_type: String, description: String, collateral_year: String, net_book_value_comm: any) {
    this.model.fa_code = fa_code;
    this.model.fa_name = fa_name;
    this.model.register_object_name = fa_name;
    this.model.collateral_type = collateral_type;
    this.model.collateral_type_desc = description;
    this.callGetrowAssetType(this.model.collateral_type);
    this.model.collateral_year = collateral_year;
    this.model.sum_insured = net_book_value_comm;
    $('#lookupModalAsset').modal('hide');
  }
  //#endregion lookup Asset

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

          this.model.collateral_type_desc = parsedata.description;
          if (code == 'PROP') {
            this.model.insurance_payment_type = 'FTFP'
            this.isProp = true
          }
          else {
            this.isProp = false
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowRegion(code: String, region_name: string) {
    this.model.region_code = code;
    this.model.region_name = region_name;
    $('#lookupModalRegion').modal('hide');
  }
  //#endregion region lookup

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

  //#region List tabs
  registerassetwiz() {
    this.route.navigate(['/registration/submanualregistrationlist/manualregistrationdetail/' + this.param + '/subregisterassetlist', this.param], { skipLocationChange: true });
  }

  registerperiodwiz() {
    this.route.navigate(['/registration/submanualregistrationlist/manualregistrationdetail/' + this.param + '/subregisterperiodlist', this.param], { skipLocationChange: true });
  }

  registerloadingwiz() {
    this.route.navigate(['/registration/submanualregistrationlist/manualregistrationdetail/' + this.param + '/subregisterloadinglist/' + this.param], { skipLocationChange: true });
  }

  //#endregion List tabs

  //#region change
  changeData(event: any) {
    this.register_type = event.target.value;
  }
  //#endregion change

  //#region lookup currency
  btnLookupExistingPolicy() {
    $('#datatableLookupExistingPolicy').DataTable().clear().destroy();
    $('#datatableLookupExistingPolicy').DataTable({
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
          'p_insurance_code': this.model.insurance_code
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerInsurancePolicy, this.APIRouteForLookupInsuranceExisting).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupexistingpolicy = parse.data;
          if (parse.data != null) {
            this.lookupexistingpolicy.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 5] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowExistingPolicy(code: String, policy_no: String, policy_eff_date: String, policy_exp_date: String, to_year: String
    , currency_code: String, insured_qq_name: String) {
    this.model.policy_code = code;
    this.model.policy_no = policy_no;
    if (this.register_type == 'ADDITIONAL') {
      this.model.year_period = to_year;
      this.model.from_date = this.dateFormater(policy_eff_date);
      this.model.to_date = this.dateFormater(policy_exp_date);
    } else if (this.register_type == 'PERIOD') {
      this.model.year_period = '';
      this.model.from_date = this.dateFormater(policy_exp_date);
      this.model.to_date = '';
    }
    // this.model.year_period = to_year;
    // this.model.from_date = this.dateFormater(policy_eff_date);
    // this.model.to_date = this.dateFormater(policy_exp_date);
    this.model.currency_code = currency_code;
    this.model.register_qq_name = insured_qq_name;
    $('#lookupModalExistingPolicy').modal('hide');
  }
  //#endregion lookup currency

  btnClearExistingPolicy() {
    this.model.policy_code = '';
    this.model.policy_no = '';
  }

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
    this.model.collateral_type_description = description;
    $('#lookupModalAssetType').modal('hide');
  }
  //#endregion lookup Asset Type
}

