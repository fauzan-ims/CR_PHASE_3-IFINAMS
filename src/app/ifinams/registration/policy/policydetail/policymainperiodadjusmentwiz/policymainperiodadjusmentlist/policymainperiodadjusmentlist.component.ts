import { OnInit, ViewChild, Component, ElementRef, AfterViewInit, OnDestroy, AfterContentInit } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../.././../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './policymainperiodadjusmentlist.component.html'
})

export class PolicymainperiodadjusmentlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  status = this.getRouteparam.snapshot.paramMap.get('status');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public listpolicymainperiodadjusment: any = [];
  public code: any;
  public adjustment_buy_amount: any;
  public adjustment_admin_amount: any;
  public adjustment_discount_amount: any;
  private dataTamp: any = [];
  private APIController: String = 'InsurancePolicyMainPeriodAdjusment';
  private APIControllerHeader: String = 'InsurancePolicyMain';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GetRow';
  private RoleAccessCode = 'R00022090000000A';

  // form 2 way binding
  model: any = {};

  // checklist
  public selectedAll: any;
  public checkedList: any = [];

  // spinner
  showSpinner: Boolean = true;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public route: Router,
    public getRouteparam: ActivatedRoute,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide('', this._elementRef, this.route);
    this.callGetrow();
    this.loadData();
  }

  //#region getrow data
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': this.param
    }];
    // end param tambahan untuk getrow dynamic
    this.dalservice.Getrow(this.dataTamp, this.APIControllerHeader, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.model.policy_payment_status = parsedata.policy_payment_status;

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

  //#region onBlur
  onBlur(event, i, type) {
    var controlName = '#' + event.target.id;
    var controlValue = '' + event.target.value;
    this.onBlur(controlName, controlValue, type);
  }
  //#endregion onBlur

  //#region onFocus
  onFocus(event, i, type) {
    var controlName = '#' + event.target.id;
    var controlValue = '' + event.target.value;
    this.onFocus(controlName, controlValue, type);
  }
  //#endregion onFocus

  //#region adjustmentAmount
  // adjustmentAmount(code: any, adjustment_buy_amount: any, adjustment_admin_amount: any, adjustment_discount_amount: any) {
  //   this.code = code;
  //   this.adjustment_buy_amount = adjustment_buy_amount;
  //   this.adjustment_admin_amount = adjustment_admin_amount.target.value;
  //   this.adjustment_discount_amount = adjustment_discount_amount.target.value;
  //   this.tamps.push({
  //     p_id: this.code,
  //     p_adjustment_buy_amount: this.adjustment_buy_amount,
  //     p_adjustment_admin_amount: this.adjustment_admin_amount,
  //     p_adjustment_discount_amount: this.adjustment_discount_amount
  //   });
  // }
  //#endregion adjustmentAmount

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'first_last_numbers',
      'pageLength': 10,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_policy_code': this.param
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listpolicymainperiodadjusment = parse.data;
          this.listpolicymainperiodadjusment.numberIndex = dtParameters.start;

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
          this.showSpinner = false;
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      order: [[1, 'asc']],
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

  //#region button save list
  btnSaveList() {
    this.showSpinner = true;
    this.listpolicymainperiodadjusment = [];
    var i = 0;

    var getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    var getBuy = $('[name="p_adjustment_buy_amount"]')
      .map(function () { return $(this).val(); }).get();

    var getAdmin = $('[name="p_adjustment_admin_amount"]')
      .map(function () { return $(this).val(); }).get();

    var getDiscount = $('[name="p_adjustment_discount_amount"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getBuy.length) {

        while (i < getAdmin.length) {

          while (i < getDiscount.length) {

            this.listpolicymainperiodadjusment.push(
              this.JSToNumberFloats({
                p_id: getID[i],
                p_policy_code: this.param,
                p_adjustment_buy_amount: getBuy[i],
                p_adjustment_admin_amount: getAdmin[i],
                p_adjustment_discount_amount: getDiscount[i]
              })
            );

            i++;
          }
          i++;
        }
        i++;
      }
      i++;
    }

    //#region web service
    this.dalservice.Update(this.listpolicymainperiodadjusment, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            this.showNotification('bottom', 'right', 'success');
            $('#reloadpolicydetail').click();
            $('#datatabless').DataTable().ajax.reload();
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
    //#endregion web service
  }
  //#endregion button save list


}
