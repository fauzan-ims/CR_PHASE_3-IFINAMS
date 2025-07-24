import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { BaseComponent } from '../../../../../../base.component';
import { DALService } from '../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './insuranceratenonlifedetaildetail.component.html'
})

export class InsuranceratenonlifedetaildetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public insuranceratenonlifedetailData: any = [];
  public isReadOnly: Boolean = false;
  private dataTamp: any = [];
  private APIController: String = 'MasterInsuranceRateNonLifeDetail';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private RoleAccessCode = 'R00002290000230A';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.Delimiter(this._elementRef);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.params != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
    } else {
      this.showSpinner = false;
      this.model.calculate_by = 'AMOUNT';
    }
  }

  //#region getrow data
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_id': this.params
    }]
    // end param tambahan untuk getrow dynamic
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          // checkbox
          if (parsedata.is_commercial === '1') {
            parsedata.is_commercial = true;
          } else {
            parsedata.is_commercial = false;
          }
          if (parsedata.is_authorized === '1') {
            parsedata.is_authorized = true;
          } else {
            parsedata.is_authorized = false;
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

  //#region form submit
  onFormSubmit(insuranceratenonlifedetailForm: NgForm, isValid: boolean) {
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

    this.insuranceratenonlifedetailData = this.JSToNumberFloats(insuranceratenonlifedetailForm);
    if (this.insuranceratenonlifedetailData.p_calculate_by === 'AMOUNT') {
      this.insuranceratenonlifedetailData.p_sell_rate = 0;
      this.insuranceratenonlifedetailData.p_buy_rate = 0;
    } else {
      this.insuranceratenonlifedetailData.p_sell_amount = 0;
      this.insuranceratenonlifedetailData.p_buy_amount = 0;
    }
    if (this.insuranceratenonlifedetailData.p_is_commercial === null) {
      this.insuranceratenonlifedetailData.p_is_commercial = false;
    }
    if (this.insuranceratenonlifedetailData.p_is_authorized === null) {
      this.insuranceratenonlifedetailData.p_is_authorized = false;
    }

    const usersJson: any[] = Array.of(this.insuranceratenonlifedetailData);
    if (this.params != null) {
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
              this.route.navigate(['/systemsetting/subinsuranceratenonlifelist/insuranceratenonlifedetaildetail', this.param, parse.id]);
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
    this.route.navigate(['/systemsetting/subinsuranceratenonlifelist/insuranceratenonlifedetail', this.param]);
    $('#datatables').DataTable().ajax.reload();
  }
  //#endregion button back


}
