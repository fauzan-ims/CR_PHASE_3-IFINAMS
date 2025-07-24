import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './registerperioddetail.component.html'
})

export class RegisterperioddetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  status = this.getRouteparam.snapshot.paramMap.get('status');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public registerperiodData: any = [];
  public lookupcoverage: any = [];
  public isReadOnly: Boolean = false;
  public isStatus: Boolean;
  public initial_buy_admin_fee_amount: any = [];
  public initial_stamp_fee_amount: any = [];
  public deduction_amount: any = [];
  private dataTamp: any = [];

  //controller
  private APIController: String = 'InsuranceRegisterPeriod';
  private APIControllerMasterCoverage: String = 'MasterCoverage';
  private APIControllerCoverage: String = 'InsuranceRegister';

  //router
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForInsert: String = 'Insert';
  private RoleAccessCode = 'R00022030000000A';

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

    if (this.params != null) {
      this.isReadOnly = true;
      // this.wizard();

      // call web service
      this.callGetrow();
    } else {
      this.callGetrowTypeIns();
      this.showSpinner = false;
      this.isStatus = false;
    }
  }

  //#region getrow data
  callGetrowTypeIns() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': this.param
    }];
    // end param tambahan untuk getrow dynamics
    this.dalservice.Getrow(this.dataTamp, this.APIControllerCoverage, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

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
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_id': this.params,
    }];
    // end param tambahan untuk getrow dynamics
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.initial_buy_admin_fee_amount = parsedata.initial_buy_admin_fee_amount;
          this.initial_stamp_fee_amount = parsedata.initial_stamp_fee_amount;
          this.deduction_amount = parsedata.deduction_amount;

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

  //#region form submit
  onFormSubmit(registerperiodForm: NgForm, isValid: boolean) {
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
    this.registerperiodData = this.JSToNumberFloats(registerperiodForm);

    const usersJson: any[] = Array.of(this.registerperiodData);
    if (this.params != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => { 
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              $('#reloadregisterdetail').click();
              this.callGetrow()
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
              this.route.navigate(['/registration/submanualregistrationlist/manualregistrationdetail/' + this.param + '/subregisterperiodlist/' + this.param], { skipLocationChange: true });
              // $('#reloadregisterdetail').click();
              $('#datatables').DataTable().ajax.reload();
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

  //#region adminFeeAmount
  adminFeeAmount(event: any) {
    this.initial_buy_admin_fee_amount = event.target.value * 1;
    this.model.total_buy_amount = this.model.buy_amount + this.initial_stamp_fee_amount + this.initial_buy_admin_fee_amount;
    this.model.total_sell_amount = this.model.sell_amount + this.initial_buy_admin_fee_amount + this.initial_stamp_fee_amount + this.deduction_amount;
  }
  //#endregion adminFeeAmount

  //#region adminFeeAmount
  stampFeeAmount(event: any) {
    this.initial_stamp_fee_amount = event.target.value * 1;
    this.model.total_buy_amount = this.model.buy_amount + this.initial_stamp_fee_amount + this.initial_buy_admin_fee_amount;
    this.model.total_sell_amount = this.model.sell_amount + this.initial_buy_admin_fee_amount + this.initial_stamp_fee_amount + this.deduction_amount;
  }
  //#endregion adminFeeAmount

  //#region deductionFeeAmount
  deductionFeeAmount(event: any) {
    this.deduction_amount = event.target.value * 1;
    this.model.total_sell_amount = this.model.sell_amount + this.model.initial_sell_admin_fee_amount + this.initial_stamp_fee_amount + this.deduction_amount;
  }
  //#endregion deductionFeeAmount

  //#region button back
  btnBack() {
    this.route.navigate(['/registration/submanualregistrationlist/manualregistrationdetail/' + this.param + '/subregisterperiodlist', this.param], { skipLocationChange: true });
    $('#datatables').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region coverage lookup
  btnLookupCoverage() {
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
          'p_insurance_type': this.model.insurance_type,
          'p_currency_code': this.model.currency_code
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
  }

  btnSelectRowCoverage(code: String, coverage_name: string, currency_code: string) {
    this.model.coverage_code = code;
    this.model.coverage_name = coverage_name;
    this.model.currency = currency_code;
    $('#lookupModalCoverage').modal('hide');
  }
  //#endregion coverage lookup
}

