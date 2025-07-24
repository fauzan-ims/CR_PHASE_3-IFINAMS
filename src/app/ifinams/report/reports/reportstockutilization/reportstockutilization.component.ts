import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

@Component({
  selector: 'app-reportstockutilization',
  templateUrl: './reportstockutilization.component.html'
})
export class Reportstockutilization extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public reportData: any = [];
  public lookupSysBranch: any = [];
  public dataTamp: any = [];
  public lookupnik: any = [];
  public lookupcategory: any = [];
  public lookupitemgroupcode: any = [];
  public lastsocondition: any;
  public status: any;
  public lookupareacode: any = [];
  public isButton: Boolean = false;
  public setStyle: any = [];
  private currentDate = new Date();
  public from_date: any = [];
  public DataType: any = [];
  public date_type: any = [];
  public lookupbranch: any = [];
  public lookuplocation: any = [];
  public p_net_book_value_commercial: String = '';
  public lookupagreement: any = [];
  public lookupasset: any = [];

  private APIController: String = 'SysReport';
  private APIControllerSysBranch: String = 'SysBranch';
  public lookupAssetDetail: any = [];

  private APIControllerSysItemGroupCode: String = 'MasterItemGroup';
  private APIRouteLookupArea: String = 'GetRowsForLookupArea';
  private APIControllerCategory: String = 'MasterCategory';
  private APIRouteLookup: String = 'GetRowsForLookupAsset';
  private APIRouteLookupBranch: String = 'GetRowsForLookup';
  private APIRouteForRepossessionLetterLookup: String = 'GetRowsForNotInRepossessionLetterLookup';
  private APIControllerAgreement: String = 'AgreementMain';
  private APIControllerBranch: String = 'SysBranch';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetPrint: String = 'PrintFileReportPenjualanPemutihanAsset';
  private APIControllerSysAreaCode: String = 'MasterArea';
  private APIRouteForValidation: String = 'ExecSpForValidation';
  private RoleAccessCode = 'R00016490000000A';
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';
  private APIRouteForLookupAsset: String = 'GetRowsForLookupAssetCard';
  private APIRouteForLookupAgreement: String = 'GetRowsForLookupAgreementCard';
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
    this.callGetrow();
    this.Date();

    this.model.print_option = 'Excel';
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
  onFormSubmit(rptForm: NgForm, isValid: boolean, print_option: any) {
    if (!isValid) {
      swal({
        allowOutsideClick: false,
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

    var is_condition = '';

    if (print_option === 'ExcelRecord') {
      is_condition = '0';
    }
    else if (print_option === 'Excel') {
      is_condition = '1';
    }
    else {
      is_condition = '1';
    }

    this.reportData = this.JSToNumberFloats(rptForm);
    this.reportData.p_user_id = this.userId;

    this.reportData.p_report_name = this.model.name;
    this.reportData.p_is_condition = is_condition;

    const dataParam = {
      TableName: this.model.table_name,
      SpName: this.model.sp_name,
      reportparameters: this.reportData,
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.showSpinner = false;
      this.printRptNonCore(res);
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
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
        this.dalservice.GetrowsBase(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupSysBranch = parse.data;
          if (parse.data != null) {
            this.lookupSysBranch.numberIndex = dtParameters.start;
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
    this.model.agreement_no = ''
    this.model.agreement_external_no = ''
    this.model.client_name = ''
    this.model.policy_no = ''
    this.model.collateral_external_no = ''
    this.model.collateral_name = ''
    this.model.insurance_name = ''
    $('#lookupModalBranch').modal('hide');
  }
  //#endregion lookup branch

  //#region Agreement Lookup
  btnLookupAgreement() {
    $('#datatableLookupAgreement').DataTable().clear().destroy();
    $('#datatableLookupAgreement').DataTable({
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
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForLookupAgreement).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupagreement = parse.data;
          if (parse.data != null) {
            this.lookupagreement.numberIndex = dtParameters.start;
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

  btnClearAgreement() {
    this.model.agreement_no = '';
    this.model.client_name = '';
    this.model.asset_no = '';
    this.model.asset_name = '';
    $('#datatable').DataTable().ajax.reload();
  }

  btnSelectRowAgreement(agreement_no: String, client_name: string) {
    this.model.agreement_no = agreement_no;
    this.model.client_name = client_name;
    $('#lookupModalAgreement').modal('hide');
  }
  //#endregion Agreement lookup

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

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_agreement_no': this.model.agreement_no
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForLookupAsset).subscribe(resp => {
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowAsset(asset_code: String, item_name: string) {
    this.model.asset_code = asset_code;
    this.model.item_name = item_name;
    $('#lookupModalAsset').modal('hide');
  }
  //#endregion Asset lookup

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

