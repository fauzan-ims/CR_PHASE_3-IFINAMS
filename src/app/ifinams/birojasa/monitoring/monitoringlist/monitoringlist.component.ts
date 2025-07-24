import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './monitoringlist.component.html'
})

export class MonitoringlistComponent extends BaseComponent implements OnInit {
  // variable
  public listmonitoring: any = [];
  public tampStatus: String;
  public aging: any;
  private dataTampPush: any = [];
  private dataTampProceed: any = [];
  private dataTamp: any = [];

  //controller
  private APIController: String = 'Asset';

  //router
  private APIRouteForMonitoringGetRows: String = 'GetRowsForMonitoring';
  private APIRouteForProceed: String = 'ExecSpForGetProceedMonitoring';
  private RoleAccessCode = 'R00022750000001A';

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

  // checklist
  public selectedAll: any;
  public checkedList: any = [];

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
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide(this._location, this._elementRef, this.route);
    this.tampStatus = 'STNK';
    this.aging = null;
    this.loadData();
  }

  //#region ddl PageStatus
  PageStatus(event: any) {
    this.tampStatus = event.target.value;
    $('#datatablemonitoringlist').DataTable().ajax.reload();
  }
  //#endregion ddl PageStatus

  //#region from date
  Agingstatus(event: any) {
    this.aging = event.target.value;;
    $('#datatablemonitoringlist').DataTable().ajax.reload();
  }
  //#endregion from date

  //#region load all data
  loadData() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      serverSide: true,
      processing: true,
      paging: true,
      'lengthMenu': [
        [10, 25, 50, 100],
        [10, 25, 50, 100]
      ],
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        let paramTamps = {};
        paramTamps = {
          'p_document_type': this.tampStatus,
          'p_aging': this.aging
        };
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForMonitoringGetRows).subscribe(resp => {
          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

          const parse = JSON.parse(resp);
          this.listmonitoring = parse.data;
          if (parse.data != null) {
            this.listmonitoring.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
          this.showSpinner = false;
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
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

  //#region Proceed
  // btnProceed() {
  //   this.checkedList = [];
  //   for (let i = 0; i < this.listmonitoring.length; i++) {
  //     if (this.listmonitoring[i].selected) {
  //       this.checkedList.push(this.listmonitoring[i].code);
  //     }
  //   }

  //   // jika tidak di checklist
  //   if (this.checkedList.length === 0) {
  //     swal({
  //       title: this._listdialogconf,
  //       buttonsStyling: false,
  //       confirmButtonClass: 'btn btn-danger'
  //     }).catch(swal.noop)
  //     return
  //   }

  //   this.dataTampPush = [];
  //   for (let J = 0; J < this.checkedList.length; J++) {
  //     const code = this.checkedList[J];
  //     // param tambahan untuk getrow dynamic
  //     this.dataTampPush.push({
  //       'p_code': code,
  //       'p_document_type': this.tampStatus

  //     });
  //     // end param tambahan untuk getrow dynamic
  //   }

  //   swal({
  //     title: 'Are you sure?',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonClass: 'btn btn-success',
  //     cancelButtonClass: 'btn btn-danger',
  //     confirmButtonText: this._deleteconf,
  //     buttonsStyling: false
  //   }).then((result) => {
  //     this.showSpinner = true;
  //     if (result.value) {
  //       this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteForProceed)
  //         .subscribe(
  //           res => {
  //             const parse = JSON.parse(res);
  //             if (parse.result === 1) {
  //               this.showSpinner = false;
  //               this.showNotification('bottom', 'right', 'success');
  //               $('#datatablemonitoringlist').DataTable().ajax.reload();
  //             } else {
  //               this.showSpinner = false;
  //               this.swalPopUpMsg(parse.data);
  //             }
  //           },
  //           error => {
  //             this.showSpinner = false;
  //             const parse = JSON.parse(error);
  //             this.swalPopUpMsg(parse.data);
  //           })
  //     }
  //     else {
  //       this.showSpinner = false;
  //     }
  //   });
  // }

  //#region btn proceed
  btnProceed() {
    this.dataTampProceed = [];
    this.checkedList = [];
    for (let i = 0; i < this.listmonitoring.length; i++) {
      if (this.listmonitoring[i].selected) {
        this.checkedList.push({
          'CODE': this.listmonitoring[i].code,
          'TYPE': this.listmonitoring[i].document_type,
        })
      }
    }

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }
    this.dataTamp = [];
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        let th = this;
        var i = 0;
        (function loopPoProceesProceed() {
          if (i < th.checkedList.length) {
            th.dataTampProceed = [{
              'p_code': th.checkedList[i].CODE,
              'p_document_type': th.checkedList[i].TYPE,
              'action': '',
            }];            
            th.dalservice.ExecSp(th.dataTampProceed, th.APIController, th.APIRouteForProceed)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatablemonitoringlist').DataTable().ajax.reload();
                      th.showSpinner = false;
                    } else {
                      i++;
                      loopPoProceesProceed();
                    }
                  } else {
                    th.swalPopUpMsg(parse.data);
                    th.showSpinner = false;
                  }
                },
                error => {
                  const parse = JSON.parse(error);
                  th.swalPopUpMsg(parse.data);
                  th.showSpinner = false;
                });
          }

        })();
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion btn proceed

  selectAllTable() {
    for (let i = 0; i < this.listmonitoring.length; i++) {
      this.listmonitoring[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listmonitoring.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion Proceed

  //#region button print tanda terima
  btnPrint(code: any, document_type: any) {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'RPT_MONITORING',
      SpName: 'xsp_rpt_monitoring',
      reportparameters: {
        p_user_id: this.userId,
        // p_code: this.param,
        p_asset_no: code,
        p_document_type: document_type,
        p_print_option: 'PDF'
      }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.printRptNonCore(res);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion button print tanda terima

}
