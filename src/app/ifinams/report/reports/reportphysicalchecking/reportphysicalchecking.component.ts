import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

@Component({
  selector: 'app-reportphysicalchecking',
  templateUrl: './reportphysicalchecking.component.html'
})
export class Reportphysicalchecking extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public reportData: any = [];
  public lookupsysbranch: any = [];
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
  public to_date: any = [];
  public DataType: any = [];
  public date_type: any = [];
  public lookupbranch: any = [];
  public lookuplocation: any = [];
  public tampStatus: String;


  private APIController: String = 'SysReport';
  private APIControllerSysItemGroupCode: String = 'MasterItemGroup';
  private APIRouteLookupArea: String = 'GetRowsForLookupArea';
  private APIControllerCategory: String = 'MasterCategory';
  private APIRouteLookup: String = 'GetRowsForLookup';
  private APIControllerBranch: String = 'SysBranch';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetPrint: String = 'PrintFileReportPenjualanPemutihanAsset';
  private APIControllerSysAreaCode: String = 'MasterArea';
  private APIRouteForValidation: String = 'ExecSpForValidation';
  private RoleAccessCode = 'R00016490000000A';
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';
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
    this.model.report_type1 = 'SUMMARY';

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

  //#region ddl PageStatus
  PageStatus(event: any) {
    this.tampStatus = event.target.value;

    $('#datatablemonitoringlist').DataTable().ajax.reload();
  }
  //#endregion ddl PageStatus

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

    this.reportData.p_report_name = 'rpt_pyshical_checking_full';
    this.reportData.p_is_condition = is_condition;

    const dataParam = {
      TableName: this.model.table_name,
      SpName: this.model.sp_name,
      reportparameters: this.reportData,
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      // console.log(JSON.parse(res));

      // const parse = JSON.parse(res);
      // if (parse.result === 1) {
      this.showSpinner = false;
      this.printRptNonCore(res);
      // } else {
      //   this.showSpinner = false;
      //   this.swalPopUpMsg(parse.data);
      // }
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }

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

