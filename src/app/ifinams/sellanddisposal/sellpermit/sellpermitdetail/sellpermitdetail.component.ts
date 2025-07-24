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
  templateUrl: './sellpermitdetail.component.html'
})

export class SellpermitdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public repomainData: any = [];
  public repopermitprocessData: any = [];
  public isReadOnly: Boolean = false;
  public remarkValidate: String;
  public sellrequestamount: String;
  private rolecode: any = [];
  public lookupitem: any = [];
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private APIController: String = 'Asset';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'UpdateForRepoProcess';
  private APIRouteForPermit: String = 'ExecSpForPermitUnpermit';
  private APIRouteLookup: String = 'GetRowsForLookup';
  private APIRouteForPost: String = 'ExecSpForPost';
  private APIRouteForGetRole: String = 'ExecSpForGetRole';
  private APIControllerItem: String = 'MasterItem';
  private RoleAccessCode = 'R00022270000000A';

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
      this.model.sell_request_amount = 0;

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

          // checkbox
          if (parsedata.is_permit_to_sell === '1') {
            parsedata.is_permit_to_sell = true;
          } else {
            parsedata.is_permit_to_sell = false;
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
    this.route.navigate(['/sellanddisposal/subsellpermitlist/sellpermitdetail/' + this.param + '/salepermitassetvehicle', this.param]); // , { skipLocationChange: true } 
  }
  assetotherwiz() {
    this.route.navigate(['/sellanddisposal/subsellpermitlist/sellpermitdetail/' + this.param + '/assetdetailothersdetail', this.param]); // , { skipLocationChange: true }
  }
  assetelectronicwiz() {
    this.route.navigate(['/sellanddisposal/subsellpermitlist/sellpermitdetail/' + this.param + '/salepermitassetelectronic', this.param]); // , { skipLocationChange: true }
  }
  assetfurniturewiz() {
    this.route.navigate(['/sellanddisposal/subsellpermitlist/sellpermitdetail/' + this.param + '/salepermitassetfurniture', this.param]); // , { skipLocationChange: true }
  }
  assetmachinewiz() {
    this.route.navigate(['/sellanddisposal/subsellpermitlist/sellpermitdetail/' + this.param + '/salepermitassetmachine', this.param]); // , { skipLocationChange: true }
  }
  assetpropertywiz() {
    this.route.navigate(['/sellanddisposal/subsellpermitlist/sellpermitdetail/' + this.param + '/salepermitassetproperty', this.param]); // , { skipLocationChange: true }
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

  //#region repopermitprocessyDetail form submit
  onFormSubmit(repopermitprocessForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        title: 'Warning',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = false;
    }

    this.repopermitprocessData = this.JSToNumberFloats(repopermitprocessForm);

    if (this.repopermitprocessData.p_sell_request_amount === '' || this.repopermitprocessData.p_sell_request_amount == null) {
      this.repopermitprocessData.p_sell_request_amount = 0;
    }
    if (this.repopermitprocessData.p_is_active == null) {
      this.repopermitprocessData.p_is_active = false;
    }

    const usersJson: any[] = Array.of(this.repopermitprocessData);

    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.callGetrow();
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

  remark(event: any) {
    this.remarkValidate = event.target.value;
  }

  SellRequestAmount(event: any) {
    this.sellrequestamount = event.target.value;
  }

  //#region button Permit
  btnPermit() {
    // param tambahan untuk button Proceed dynamic

    this.dataRoleTamp = [{
      'p_code': this.param,
      'p_permit_sell_remark': this.remarkValidate,
      'p_sell_request_amount': this.sellrequestamount,
      'action': 'default'
    }];
    // param tambahan untuk button Proceed dynamic
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
        // call web service
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPermit)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
              } else {
                this.swalPopUpMsg(parse.data)
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
    });
  }
  //#endregion button Permit

  //#region button back
  btnBack() {
    this.route.navigate(['/sellanddisposal/subsellpermitlist']);
    $('#datatableRepoPermitProcessList').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region Item Lookup
  btnLookupItem() {
    $('#datatableLookupItem').DataTable().clear().destroy();
    $('#datatableLookupItem').DataTable({
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
          'p_transaction_type': 'FXDAST' //FXDAST
        });

        // end param tambahan untuk getrows dynamic
        this.dalservice.GetrowsBam(dtParameters, this.APIControllerItem, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.lookupitem = parse.data;
          if (parse.data != null) {
            this.lookupitem.numberIndex = dtParameters.start;
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

  btnSelectRowItem(code: string, description: string, type_asset_code: string, type_asset_description: string, fa_category_code: string, fa_category_name: string, code_commercial: string, description_commercial: string, usefull: string, code_fiscal: string, description_fiscal: string) {
    this.model.item_code = code;
    this.model.item_name = description;
    this.model.type_code = type_asset_code;
    this.model.type_asset_description = type_asset_description;
    this.model.category_code = fa_category_code;
    this.model.category_name = fa_category_name;
    this.model.depre_category_comm_code = code_commercial;
    this.model.description_commercial = description_commercial;
    this.model.use_life = usefull;
    this.model.depre_category_fiscal_code = code_fiscal;
    this.model.description_fiscal = description_fiscal;

    $('#lookupModalItem').modal('hide');
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion Item lookup
}
