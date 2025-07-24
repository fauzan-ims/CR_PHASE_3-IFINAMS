import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './inquirydetail.component.html'
})

export class InquirydetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public isReadOnly: Boolean = false;
  private rolecode: any = [];
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private APIController: String = 'Asset';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRole: String = 'ExecSpForGetRole';
  private RoleAccessCode = 'R00022280000000A';

  // form 2 way binding
  model: any = {};

  // checklist
  public selectedAllTable: any;
  public selectedAllLookup: any;

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  dtOptions: DataTables.Settings = {};
  setStyle: { 'pointer-events': string; };

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.Delimiter(this._elementRef);
    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
    } else {
      this.showSpinner = false;
    }
  }

  //#region getrow data
  // callGetrow() {
  //   // param tambahan untuk getrow dynamic
  //   this.dataTamp = [{
  //     'p_code': this.param,
  //   }];
  //   // end param tambahan untuk getrow dynamic

  //   this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
  //     .subscribe(
  //       res => {
  //         const parse = JSON.parse(res);
  //         const parsedata = this.getrowNgb(parse.data[0]);

  //         // checkbox
  //         if (parsedata.is_permit_to_sell === '1') {
  //           parsedata.is_permit_to_sell = true;
  //         } else {
  //           parsedata.is_permit_to_sell = false;
  //         }
  //         // end checkbox

  //         // mapper dbtoui
  //         Object.assign(this.model, parsedata);
  //         // end mapper dbtoui

  //         this.showSpinner = false;
  //       },
  //       error => {
  //         console.log('There was an error while Retrieving Data(API) !!!' + error);
  //       });
  // }
  //#endregion getrow data

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

          // checkbox
          if (parsedata.is_maintenance === '1') {
            parsedata.is_maintenance = true;
          } else {
            parsedata.is_maintenance = false;
          }
          // end checkbox

          // checkbox
          if (parsedata.is_depre === '1') {
            parsedata.is_depre = true;
          } else {
            parsedata.is_depre = false;
          }
          // end checkbox

          // checkbox
          if (parsedata.is_rental === '1') {
            parsedata.is_rental = true;
          } else {
            parsedata.is_rental = false;
          }
          // end checkbox

          // checkbox
          if (parsedata.is_lock === '1') {
            parsedata.is_lock = true;
          } else {
            parsedata.is_lock = false;
          }
          // end checkbox

          setTimeout(() => {
            if (parsedata.type_code === 'ELCT') {
              if (parsedata.is_maintenance != true || parsedata.is_maintenance != '1') {
                $('#tabassetmaintenance').remove();
              }
              $('#tabassetvehicle').remove();
              $('#tabassetother').remove();
              $('#tabassetfurniture').remove();
              $('#tabassetmachine').remove();
              $('#tabassetproperty').remove();
              // $('#tabassetelectronic .nav-link').addClass('active');
              this.assetelectronicwiz();
            } else if (parsedata.type_code === 'FNTR') {
              if (parsedata.is_maintenance != true || parsedata.is_maintenance != '1') {
                $('#tabassetmaintenance').remove();
              }
              $('#tabassetvehicle').remove();
              $('#tabassetother').remove();
              $('#tabassetelectronic').remove();
              $('#tabassetmachine').remove();
              $('#tabassetproperty').remove();
              // $('#tabassetfurniture .nav-link').addClass('active');
              this.assetfurniturewiz();
            } else if (parsedata.type_code === 'MCHN') {
              if (parsedata.is_maintenance != true || parsedata.is_maintenance != '1') {
                $('#tabassetmaintenance').remove();
              }
              $('#tabassetvehicle').remove();
              $('#tabassetother').remove();
              $('#tabassetelectronic').remove();
              $('#tabassetfurniture').remove();
              $('#tabassetproperty').remove();
              // $('#tabassetmachine .nav-link').addClass('active');
              this.assetmachinewiz();
            } else if (parsedata.type_code === 'OTHR') {
              if (parsedata.is_maintenance != true || parsedata.is_maintenance != '1') {
                $('#tabassetmaintenance').remove();
              }
              $('#tabassetvehicle').remove();
              $('#tabassetmachine').remove();
              $('#tabassetelectronic').remove();
              $('#tabassetfurniture').remove();
              $('#tabassetproperty').remove();
              // $('#tabassetother .nav-link').addClass('active');
              this.assetotherwiz();
            } else if (parsedata.type_code === 'PRTY') {
              if (parsedata.is_maintenance != true || parsedata.is_maintenance != '1') {
                $('#tabassetmaintenance').remove();
              }
              $('#tabassetvehicle').remove();
              $('#tabassetmachine').remove();
              $('#tabassetelectronic').remove();
              $('#tabassetfurniture').remove();
              $('#tabassetother').remove();
              // $('#tabassetproperty .nav-link').addClass('active');
              this.assetpropertywiz();
            } else if (parsedata.type_code === 'VHCL') {
              if (parsedata.is_maintenance != true || parsedata.is_maintenance != '1') {
                $('#tabassetmaintenance').remove();
              }
              $('#tabassetproperty').remove();
              $('#tabassetmachine').remove();
              $('#tabassetelectronic').remove();
              $('#tabassetfurniture').remove();
              $('#tabassetother').remove();
              // $('#tabassetvehicle .nav-link').addClass('active');
              this.assetvehiclewiz();
            }
            this.wizard();
          }, 500);

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

  //#region Asset list tabs
  assetvehiclewiz() {
    this.route.navigate(['/sellanddisposal/subinquirylist/inquirydetail/' + this.param + '/inquiryassetvehicle', this.param]); // , { skipLocationChange: true } 
  }
  assetotherwiz() {
    this.route.navigate(['/sellanddisposal/subinquirylist/inquirydetail/' + this.param + '/assetdetailothersdetail', this.param]); // , { skipLocationChange: true }
  }
  assetelectronicwiz() {
    this.route.navigate(['/sellanddisposal/subinquirylist/inquirydetail/' + this.param + '/inquiryassetelectronic', this.param]); // , { skipLocationChange: true }
  }
  assetfurniturewiz() {
    this.route.navigate(['/sellanddisposal/subinquirylist/inquirydetail/' + this.param + '/inquiryassetfurniture', this.param]); // , { skipLocationChange: true }
  }
  assetmachinewiz() {
    this.route.navigate(['/sellanddisposal/subinquirylist/inquirydetail/' + this.param + '/inquiryassetmachine', this.param]); // , { skipLocationChange: true }
  }
  assetpropertywiz() {
    this.route.navigate(['/sellanddisposal/subinquirylist/inquirydetail/' + this.param + '/inquiryassetproperty', this.param]); // , { skipLocationChange: true }
  }
  //#endregion Asset list tabs

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

  //#region form submit
  onFormSubmit(repopermitinquiryForm: NgForm, isValid: boolean) {

  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/sellanddisposal/subinquirylist']);
    $('#datatableRepoPermitInquiryList').DataTable().ajax.reload();
  }
  //#endregion button back

}
