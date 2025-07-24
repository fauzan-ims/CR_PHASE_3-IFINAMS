import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../../base.component';
import { DALService } from '../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './endorsementperioddetail.component.html'
})
export class EndorsementperioddetailComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  paramss = this.getRouteparam.snapshot.paramMap.get('id3');
  paramsss = this.getRouteparam.snapshot.paramMap.get('id4');
  paramssss = this.getRouteparam.snapshot.paramMap.get('id4');


  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public endorsementperiodData: any = [];
  public lookupcoverage: any = [];
  public lookupagremeent: any = [];
  public isReadOnly: Boolean = false;
  public isNull: Boolean = false;
  public isNullAmount: Boolean = false;
  public total_buy_amount: any = [];
  public isStatus: String = '';
  private dataTamp: any = [];
  private initial_buy_rate: any = [];
  private sum_insured: any = [];
  private initial_sell_rate: any = [];
  private initial_buy_amount: any = [];
  private initial_sell_admin_fee_amount: any = [];
  private initial_discount_amount: any = [];
  private initial_buy_admin_fee_amount: any = [];
  private initial_discount_pct: any = [];
  private initial_stamp_fee_amount: any = [];

  private APIController: String = 'EndorsementPeriod';
  private APIControllerHeader: String = 'EndorsementMain';
  private APIControllerMasterCoverage: String = 'MasterCoverage';

  private APIRouteForLookupCoverage: String = 'GetRowsForLookup';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForGetRow: String = 'GetRow';

  private RoleAccessCode = 'R00022000000000A';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
  // end

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.Delimiter(this._elementRef);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.model.agreement_external_no = this.params;
    this.model.asset_name = this.paramss;
    if (this.paramssss != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
    } else {
      this.callGetrowHeader();
      this.initial_buy_rate = 0;
      this.initial_discount_pct = 0;
      this.sum_insured = 0;
      this.initial_buy_amount = 0;
      this.initial_sell_rate = 0;
      this.initial_buy_admin_fee_amount = 0;
      this.initial_sell_admin_fee_amount = 0;
      this.initial_stamp_fee_amount = 0;
      this.total_buy_amount = 0;
      this.initial_discount_amount = 0;
      this.showSpinner = false;
    }
  }

  //#region getrow data
  callGetrowHeader() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': this.param
    }];
    // end param tambahan untuk getrow dynamic
    this.dalservice.Getrow(this.dataTamp, this.APIControllerHeader, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.model.insurance_type = parsedata.insurance_type;

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

  //#region StampDuty
  StampDuty(event: any) {
    this.initial_stamp_fee_amount = event.target.value * 1;
    this.model.total_buy_amount = this.model.buy_amount - this.model.initial_discount_amount + this.initial_buy_admin_fee_amount + this.initial_stamp_fee_amount;
    this.model.total_sell_amount = this.model.sell_amount + this.initial_sell_admin_fee_amount + this.initial_stamp_fee_amount;
  }
  //#endregion StampDuty

  //#region Sell
  Sell(event: any) {
    this.initial_sell_admin_fee_amount = event.target.value * 1;
    this.model.total_sell_amount = this.model.sell_amount + this.initial_sell_admin_fee_amount;
  }
  //#endregion Sell

  //#region Buy
  Buy(event: any) {
    this.initial_buy_admin_fee_amount = event.target.value * 1;
    this.model.total_buy_amount = this.model.buy_amount - this.initial_discount_amount + this.initial_buy_admin_fee_amount;
  }
  //#endregion Buy

  //#region DisAmount
  DisAmount(event: any) {
    this.initial_discount_amount = event.target.value;
  }
  //#endregion DisAmount

  //#region DisPct
  DisPct(event: any) {
    this.initial_discount_pct = event.target.value;
    this.model.initial_discount_amount = this.model.buy_amount * this.initial_discount_pct / 100;
  }
  //#endregion DisPct

  //#region SumInsured
  SumInsured(event: any) {
    this.sum_insured = event.target.value;
    this.model.buy_amount = this.sum_insured * this.model.initial_buy_rate / 100;
    this.model.sell_amount = this.sum_insured * this.model.initial_sell_rate / 100;
  }
  //#endregion SumInsured

  //#region stampInitialBuy
  stampInitialBuy(event: any) {
    this.initial_buy_rate = event.target.value * 1;
    if (this.initial_buy_rate > 0) {
      this.isNull = true;
      this.model.initial_buy_amount = 0;
      this.model.initial_sell_amount = 0;
      this.model.buy_amount = this.sum_insured * this.initial_buy_rate / 100;
    }
    else {
      this.isNull = false;
    }
  }
  //#endregion stampInitialBuy 

  //#region stampInitialSell
  stampInitialSell(event: any) {
    this.initial_sell_rate = event.target.value * 1;
    if (this.initial_sell_rate > 0) {
      this.isNull = true;
      this.model.initial_buy_amount = 0;
      this.model.initial_sell_amount = 0;
      this.model.sell_amount = this.sum_insured * this.initial_sell_rate / 100;
    }
    else {
      this.isNull = false;
    }
  }
  //#endregion stampInitialSell 

  //#region stampInitialAmount
  stampInitialAmount(event: any) {
    this.initial_buy_amount = event.target.value * 1;
    if (this.initial_buy_amount > 0) {
      this.isNullAmount = true;
      this.model.initial_buy_rate = 0;
      this.model.initial_sell_rate = 0;
      this.model.buy_amount = this.sum_insured * this.initial_buy_amount / 100;
    }
    else {
      this.isNullAmount = false;
    }
  }
  //#endregion stampInitialAmount

  //#region stampInitialSellAmount
  stampInitialSellAmount(event: any) {
    this.model.initial_sell_amount = event.target.value * 1;
    if (this.model.initial_sell_amount > 0) {
      this.isNullAmount = true;
      this.model.initial_buy_rate = 0;
      this.model.initial_sell_rate = 0;
      this.model.sell_amount = this.model.initial_sell_amount;
    }
    else {
      this.isNullAmount = false;
    }
  }
  //#endregion stampInitialSellAmount 

  //#region getrow data
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_id': this.paramssss,
    }];
    // end param tambahan untuk getrow dynamic
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.sum_insured = parsedata.sum_insured;
          this.initial_buy_rate = parsedata.initial_buy_rate;
          this.initial_sell_rate = parsedata.initial_sell_rate;
          this.initial_buy_admin_fee_amount = parsedata.initial_buy_admin_fee_amount;
          this.initial_stamp_fee_amount = parsedata.initial_stamp_fee_amount;

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
  onFormSubmit(endorsementperiodForm: NgForm, isValid: boolean) {
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

    this.endorsementperiodData = this.JSToNumberFloats(endorsementperiodForm);
    this.endorsementperiodData.p_old_or_new = 'NEW';
    const usersJson: any[] = Array.of(this.endorsementperiodData);
    if (this.paramsss != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
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
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['registration/subendorsementlist/endorsementperioddetail', this.param, this.params, this.paramss, parse.id]);
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
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['registration/subendorsementlist/endorsementdetail', this.param]);
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
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerMasterCoverage, this.APIRouteForLookupCoverage).subscribe(resp => {
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
    this.model.currency_code = currency_code;
    $('#lookupModalCoverage').modal('hide');
  }
  //#endregion coverage lookup



}
