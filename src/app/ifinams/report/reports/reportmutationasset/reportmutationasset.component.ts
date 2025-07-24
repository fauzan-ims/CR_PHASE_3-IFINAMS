import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

@Component({
  selector: 'app-reportmutationasset',
  templateUrl: './reportmutationasset.component.html'
})
export class ReportMutationAsset extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public reportData: any = [];
  public lookupsysbranch: any = [];
  public dataTamp: any = [];
  public lookupnik: any = [];
  public lookupregioncode: any = [];
  public lastsocondition: any;
  public status: any;
  public date_type: any = [];
  public lookupbranch: any = [];
  public lookupcategory: any = [];
  public lookuplocation: any = [];
  public lookupAsset: any = [];
  public setStyle: any = [];
  private currentDate = new Date();
  public from_date: any = [];
  public to_date: any = [];
  public DataType: any = [];
  public isButton: Boolean = false;

  private APIController: String = 'SysReport';
  private APIControllerLocation: String = 'MasterLocation';
  private APIControllerAsset: String = 'Asset';
  private APIRouteLookup: String = 'GetRowsForLookup';
  private APIControllerCategory: String = 'MasterCategory';
  private APIRouteLookupReport: String = 'GetRowsForLookupReport';
  private APIControllerBranch: String = 'SysBranch';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetPrint: String = 'PrintFileMutationAsset';
  private APIControllerSysRegionCode: String = 'MasterRegion';
  private APIRouteForValidation: String = 'ExecSpForValidation';
  private RoleAccessCode = 'R00016490000000A';
  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  // showNotification: any;

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    // this.callGetRole(this.userId);
    //this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.model.print_option = 'ExcelRecord';
    this.callGetrow();
    this.model.status = 'ALL';
    this.Date();
    this.model.date_type = 'RANGE';
    this.model.report_type1 = 'SUMMARY';
  }

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

  //#region onFormSubmit
  onFormSubmit(rptForm: NgForm, isValid: boolean) {
    if (!isValid) {
      swal({
        allowOutsideClick: false,
        title: 'Warning!',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
    }

    this.reportData = this.JSToNumberFloats(rptForm);

    const dataParam = [this.JSToNumberFloats(
      {
        TableName: this.model.table_name,
        SpName: this.model.sp_name,
        'p_user_id': this.userId,
        'p_from_date': this.model.from_date,
        'p_to_date': this.model.to_date,
        'p_date_type': this.model.date_type,
        'p_region_code': this.model.region_code,
        'p_branch_code': this.model.branch_code,
        'p_location_code': this.model.location_code,
        'p_category_code': this.model.category_code,
        'p_asset_code': this.model.asset_code,
      }
    )];    
    this.dalservice.ExecSp(dataParam, this.APIController, this.APIRouteForValidation)
      .subscribe(
        res => {
          this.showSpinner = true;
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.dalservice.DownloadFileWithData(dataParam, this.APIController, this.APIRouteForGetPrint).subscribe(res => {

              this.showSpinner = false;
              var contentDisposition = res.headers.get('content-disposition');
              var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

              const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              var link = document.createElement('a');
              link.href = url;
              link.download = filename;
              link.click();
              // window.open(url);

            }, err => {
              this.showSpinner = false;
              const parse = JSON.parse(err);
              this.swalPopUpMsg(parse.data);
            });
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
  //#endregion onFormSubmit

  //#region button back
  btnBack() {
    this.route.navigate(['/report/' + this.pageType]);
  }
  //#endregion button back

  //#region ddl from date
  FromDate(event: any) {
    this.model.from_date = event;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion ddl from date

  //#region ddl to date
  ToDate(event: any) {
    this.model.to_date = event;
    if (this.model.date_type === 'ALL') {
      this.model.from_date = this.model.to_date
    }
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion ddl to date

  //#region ddl Status
  PageLastSOCondition(event: any) {
    this.lastsocondition = event.target.value;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion ddl StatusPageLastSOCondition

  //#region ddl Status
  PageStatus(event: any) {
    this.status = event.target.value;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion ddl Status

  //#region RegionCode Lookup
  btnLookupRegionCode() {
    $('#datatableLookupRegionCode').DataTable().clear().destroy();
    $('#datatableLookupRegionCode').DataTable({
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
          'action': 'getResponse'
        });

        // end param tambahan untuk getrows dynamic
        this.dalservice.GetrowBam(dtParameters, this.APIControllerSysRegionCode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupregioncode = parse.data;

          if (parse.data != null) {
            this.lookupregioncode.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowRegionCode(code: String, description: String) {
    this.model.region_code = code;
    this.model.region_description = description;
    this.model.area_code = undefined;
    this.model.area_description = undefined;
    this.model.branch_code = '';
    this.model.branch_name = '';
    this.model.location_code = '';
    this.model.description_location = '';
    this.model.asset_code = '';
    this.model.barcode = '';
    this.model.item_name = '';
    $('#lookupModalRegionCode').modal('hide');
  }

  btnClearLookupRegion() {
    this.model.region_code = '';
    this.model.region_description = '';
    this.model.branch_code = '';
    this.model.branch_name = '';
    this.model.location_code = '';
    this.model.description_location = '';
    this.model.asset_code = '';
    this.model.barcode = '';
    this.model.item_name = '';
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion RegionCode lookup

  //#region Branch Lookup
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
          'p_company_code': this.company_code,
          'p_region_code': this.model.region_code
        });

        // end param tambahan untuk getrows dynamic
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerBranch, this.APIRouteLookupReport).subscribe(resp => {
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowBranch(code: string, description: string) {
    // this.model.company_code = company_code;
    this.model.branch_code = code;
    this.model.branch_name = description;
    this.model.location_code = '';
    this.model.description_location = '';
    this.model.asset_code = '';
    this.model.barcode = '';
    this.model.item_name = '';
    $('#lookupModalBranch').modal('hide');
    $('#datatable').DataTable().ajax.reload();
  }

  btnClearLookupBranch() {
    this.model.branch_code = '';
    this.model.branch_name = '';
    this.model.location_code = '';
    this.model.description_location = '';
    this.model.asset_code = '';
    this.model.barcode = '';
    this.model.item_name = '';
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion Branch lookup

  //#region Location Lookup
  btnLookupLocation() {
    $('#datatableLookupLocation').DataTable().clear().destroy();
    $('#datatableLookupLocation').DataTable({
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
        });

        // end param tambahan untuk getrows dynamic
        this.dalservice.GetrowsBam(dtParameters, this.APIControllerLocation, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookuplocation = parse.data;
          if (parse.data != null) {
            this.lookuplocation.numberIndex = dtParameters.start;
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

  btnSelectRowLocation(code: string, description_location: string) {
    // this.model.company_code = company_code;
    this.model.location_code = code;
    this.model.description_location = description_location;
    $('#lookupModalLocation').modal('hide');
    $('#datatable').DataTable().ajax.reload();
  }

  btnClearLookupLocation() {
    this.model.location_code = '';
    this.model.description_location = '';
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion Location lookup

  //#region Category Lookup
  btnLookupCategory() {
    $('#datatableLookupCategory').DataTable().clear().destroy();
    $('#datatableLookupCategory').DataTable({
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
        });

        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerCategory, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupcategory = parse.data;
          if (parse.data != null) {
            this.lookupcategory.numberIndex = dtParameters.start;
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

  btnSelectRowCategory(code: string, description_category: string) {
    this.model.category_code = code;
    this.model.description_category = description_category;
    $('#lookupModalCategory').modal('hide');
    $('#datatable').DataTable().ajax.reload();
  }

  btnClearLookupCategory() {
    this.model.category_code = '';
    this.model.description_category = '';
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion Category lookup

  //#region Asset Lookup
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
          'p_company_code': this.company_code,
          'p_branch_code': this.model.branch_code,
          'p_category_code': this.model.category_code,
          'p_location_code': this.model.location_code,
          'p_region_code': this.model.region_code,
        });

        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerAsset, this.APIRouteLookupReport).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupAsset = parse.data;

          if (parse.data != null) {
            this.lookupAsset.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 5] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowAsset(code: string, barcode: string, item_name: string
  ) {
    this.model.asset_code = code;
    this.model.barcode = barcode;
    this.model.item_name = item_name;

    $('#lookupModalAsset').modal('hide');
    $('#datatable').DataTable().ajax.reload();
  }

  btnClearLookupBarcode() {
    this.model.asset_code = '';
    this.model.barcode = '';
    this.model.item_name = '';
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion Asset lookup

  //#region Radio Buttn
  Datetype(event: any) {
    this.DataType = event.target.value;
    if (this.DataType === 'ALL') {
      this.isButton = true;
      this.model.from_date = this.model.to_date
      // this.model.from_date = Date();
    }
    else {
      this.isButton = false;
    }
  }
  //#endregion Radio Button

  //#region getStyles
  getStyles(isTrue: Boolean) {
    if (isTrue) {
      this.setStyle = {
        'pointer-events': 'none',
      }
    } else {
      this.setStyle = {
        'pointer-events': 'unset',
      }
    }

    return this.setStyle;
  }
  //#endregion getStyles

  //#region currentDate
  Date() {
    let day: any = this.currentDate.getDate();
    let from_month: any = this.currentDate.getMonth() + 1;
    let to_month: any = this.currentDate.getMonth() + 2;
    let year: any = this.currentDate.getFullYear();

    if (day < 10) {
      day = '0' + day.toString();
    }
    if (from_month < 10) {
      from_month = '0' + from_month.toString();
    }
    if (to_month < 10) {
      to_month = '0' + to_month.toString();
    }

    this.from_date = { 'year': ~~year, 'month': ~~from_month, 'day': ~~day.toString() };
    const obj = {
      dateRange: null,
      isRange: false,
      singleDate: {
        date: this.from_date,
        // epoc: 1600102800,
        formatted: day.toString() + '/' + from_month + '/' + year,
        // jsDate: new Date(dob[key])
      }
    }

    this.model.from_date = obj
    this.model.to_date = obj
  }
  //#endregion currentDate
}

