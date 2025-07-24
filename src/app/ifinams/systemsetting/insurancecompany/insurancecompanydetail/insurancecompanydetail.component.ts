import { Component, OnInit, ElementRef, ViewChild, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlContainer, NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

// call function from js shared
declare function headerPage(controller, route): any;
declare function hideButtonLink(idbutton): any;
declare function hideTabWizard(): any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './insurancecompanydetail.component.html'
})
export class InsurancecompanydetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public NpwpPattern = this._npwpformat;
  public WebsitePattern = this._websiteformat;
  public EmailPattern = this._emailformat;
  public insurancecompanyData: any = [];
  public isReadOnly: Boolean = false;
  public isButton: Boolean = false;
  public typeIns: String = '';
  public type: String = '';
  private dataTamp: any = [];
  private dataRoleTamp: any = [];
  private RoleAccessCode = 'R00021390000000A';

  //comtroller
  private APIController: String = 'MasterInsurance';

  //router
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForValidate: String = 'ExecSpForValidate';

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
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    $("#npwp").attr('maxlength', '15');
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {
      this.isReadOnly = true;
      // call web service
      this.Delimiter(this._elementRef);
      this.callGetrow();
      this.insurancecompanyaddresswiz();
    } else {
      this.model.tax_file_type = 'N21';
      this.model.insurance_type = 'LIFE';
      this.model.insurance_business_unit = 'CONVENTIONAL'
      this.showSpinner = false;
    }
  }

  onRouterOutletActivate(event: any) {
  }

  callWizard() {
    setTimeout(() => {
      const insurancetype = $('#insurancetype').val();

      if (insurancetype === 'LIFE') {
        $('#depreciation').remove();
      }

      this.wizard();
    }, 500);
  }

  //#region npwp
  onKeydownNpwp(event: any) {

    let ctrlDown = false;

    if (event.keyCode == 17 || event.keyCode == 91) {
      ctrlDown = true;
    }

    if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)
      || (ctrlDown && (event.keyCode == 86 || event.keyCode == 67 || event.keyCode == 65 || event.keyCode == 90))
      || event.keyCode == 8 || event.keyCode == 9
      || (event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 38 || event.keyCode == 40)
    )) {

      return false;
    }

  }

  onPasteNpwp(event: any) {

    if (!event.originalEvent.clipboardData.getData('Text').match(/^[0-9,.-]*$/)) {
      event.preventDefault();
    }

  }

  onFokusNpwp(event: any) {
    let valEvent: any;
    valEvent = '' + event.target.value;

    if (valEvent != null) {
      this.model.tax_file_no = valEvent.replace(/[^0-9]/g, '');
    }

  }

  onChangeNpwp(event: any) {

    let valEvent: any;

    valEvent = '' + event.target.value;
    var x = valEvent.split('');

    if (x.length == 15) {
      var tt = x[0] + x[1] + '.';
      var dd = tt + x[2] + x[3] + x[4] + '.';
      var ee = dd + x[5] + x[6] + x[7] + '.';
      var ff = ee + x[8] + '-';
      var gg = ff + x[9] + x[10] + x[11] + '.';
      var hh = gg + x[12] + x[13] + x[14];

      this.model.tax_file_no = hh;
    }

  }
  //#endregion npwp

  //#region btnValidate
  btnValidate() {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_code': this.param
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
        this.dalservice.Update(this.dataRoleTamp, this.APIController, this.APIRouteForValidate)
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
  //#endregion btnValidate

  //#region Type
  PageTax(event: any) {
    this.model.tax_file_type = event.target.value;
    if (this.model.tax_file_type === 'N21' && this.model.tax_file_type === 'N23') {
      this.model.tax_file_no = '';
      this.model.tax_file_name = '';
      this.model.tax_file_address = '';
    }
  }
  //#endregion Type

  //#region getrow data
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': this.param
    }]
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.type = parsedata.insurance_type;
          // checkbox
          if (parsedata.is_validate === '1') {
            parsedata.is_validate = true;
          } else {
            parsedata.is_validate = false;
          }
          // end checkbox

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui

          this.typeIns = parsedata.insurance_type;

          //reload button 
          this.callWizard();
          //reload button 

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region btnLookupCoverage
  btnLookupCoverage() {

  }
  //#endregion btnLookupCoverage

  //#region form submit
  onFormSubmit(insurancecompanyForm: NgForm, isValid: boolean) {
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

    this.insurancecompanyData = insurancecompanyForm;
    if (this.insurancecompanyData.p_is_validate == null) {
      this.insurancecompanyData.p_is_validate = false;
    }
    if (this.insurancecompanyData.p_insurance_type == null) {
      this.insurancecompanyData.p_insurance_type = this.type;
    }
    const usersJson: any[] = Array.of(this.insurancecompanyData);

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
              this.route.navigate(['/systemsetting/subinsurancecompanylist/insurancecompanydetail', parse.code]);
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
    this.route.navigate(['/systemsetting/subinsurancecompanylist']);
  }
  //#endregion button back

  //#region address list tabs
  insurancecompanyaddresswiz() {
    this.route.navigate(['/systemsetting/subinsurancecompanylist/insurancecompanydetail/' + this.param + '/insurancecompanyaddresslist', this.param], { skipLocationChange: true });
  }
  //#endregion address list tabs

  //#region bank list tabs
  insurancecompanybankwiz() {
    this.route.navigate(['/systemsetting/subinsurancecompanylist/insurancecompanydetail/' + this.param + '/insurancecompanybanklist', this.param], { skipLocationChange: true });
  }
  //#endregion bank list tabs

  //#region branch list tabs
  insurancecompanybranchwiz() {
    this.route.navigate(['/systemsetting/subinsurancecompanylist/insurancecompanydetail/' + this.param + '/insurancecompanybranchlist', this.param], { skipLocationChange: true });
  }
  //#endregion branch list tabs

  //#region document list tabs
  insurancecompanydocumentwiz() {
    this.route.navigate(['/systemsetting/subinsurancecompanylist/insurancecompanydetail/' + this.param + '/insurancecompanydocumentlist', this.param], { skipLocationChange: true });
  }
  //#endregion document list tabs

  //#region depreciation list tabs
  insurancecompanydepreciationwiz() {
    this.route.navigate(['/systemsetting/subinsurancecompanylist/insurancecompanydetail/' + this.param + '/insurancecompanydepreciationlist', this.param], { skipLocationChange: true });
  }
  //#endregion depreciation list tabs

  //#region fee list tabs
  insurancecompanyfeewiz() {
    this.route.navigate(['/systemsetting/subinsurancecompanylist/insurancecompanydetail/' + this.param + '/insurancecompanyfeelist', this.param], { skipLocationChange: true });
  }
  //#endregion fee list tabs

  // send type to detail
  sendType() {
    let typeInsss = $("input[name='p_insurance_type']").val();
    return typeInsss;
  }
  // end type to detail
}
