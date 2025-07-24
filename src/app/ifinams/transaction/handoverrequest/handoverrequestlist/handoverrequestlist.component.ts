import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-handoverrequestlist',
  templateUrl: './handoverrequestlist.component.html'
})
export class HandoverRequestlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listhandoverrequest: any = [];
  public lookupSource: any = [];
  public lookupBatch: any = [];
  public lookupbranch: any = [];
  public is_active: String;
  private dataTamp: any = [];
  public branch_code: String = '';
  public branch_name: String = '';
  public tampStatus: String;
  private dataTampDisposalData: any = [];
  private dataTampPush: any = [];

  //controller
  private APIController: String = 'HandoverRequest';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIControllerBranch: String = 'SysBranch';
  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';
  private APIForDelete: String = 'ExecSpDeleteJalan';
  private APIForInsert: String = 'ExecSpInsert';

  //router
  private APIRouteForGetrowsSys: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetUnreject: String = 'ExecSpForUnreject';
  private APIRouteLookup: String = 'GetRowsForLookup';
  private APIRouteForProceed: String = 'ExecSpForProceed';

  private RoleAccessCode = 'R00021870000000A';

  // checklist
  public selectedAll: any;
  public checkedList: any = [];

  // spinner
  showSpinner: Boolean = false;
  // end

  // form 2 way binding
  model: any = {};

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  lookupPlafond: any;

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    // this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide(this._location, this._elementRef, this.route);
    this.loadData();
    this.tampStatus = 'HOLD';
  }

  //#region button unreject
  // btnUnreject() {
  //     this.checkedList = [];
  //     for (let i = 0; i < this.listhandoverrequest.length; i++) {
  //         if (this.listhandoverrequest[i].selected) {
  //             this.checkedList.push({ 'id': this.listhandoverrequest[i].id });
  //         }
  //     }

  //     // jika tidak di checklist
  //     if (this.checkedList.length === 0) {
  //         swal({
  //             title: this._listdialogconf,
  //             buttonsStyling: false,
  //             confirmButtonClass: 'btn btn-danger'
  //         }).catch(swal.noop)
  //         return
  //     }

  //     this.dataTamp = [];
  //     for (let J = 0; J < this.checkedList.length; J++) {
  //         // param tambahan untuk getrow dynamic
  //         this.dataTamp.push({
  //             'p_id': this.checkedList[J].id,
  //         });
  //         // end param tambahan untuk getrow dynamic

  //         swal({
  //             title: 'Are you sure?',
  //             type: 'warning',
  //             showCancelButton: true,
  //             confirmButtonClass: 'btn btn-success',
  //             cancelButtonClass: 'btn btn-danger',
  //             confirmButtonText: this._deleteconf,
  //             buttonsStyling: false
  //         }).then((result) => {
  //             this.showSpinner = true;
  //             if (result.value) {
  //                 this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForGetUnreject)
  //                     .subscribe(
  //                         res => {
  //                             const parse = JSON.parse(res);
  //                             if (parse.result === 1) {

  //                                 $('#datatable').DataTable().ajax.reload();
  //                                 this.showNotification('bottom', 'right', 'success');
  //                             } else {
  //                                 this.swalPopUpMsg(parse.data);
  //                             }
  //                         },
  //                         error => {
  //                             this.showSpinner = false;
  //                             const parse = JSON.parse(error);
  //                             this.swalPopUpMsg(parse.data);
  //                         });
  //             } else {
  //                 this.showSpinner = false;
  //             }
  //         });
  //     }
  // }

  // selectAllTable() {
  //     for (let i = 0; i < this.listhandoverrequest.length; i++) {
  //         this.listhandoverrequest[i].selected = this.selectedAll;
  //     }
  // }

  // checkIfAllTableSelected() {
  //     this.selectedAll = this.listhandoverrequest.every(function (item: any) {
  //         return item.selected === true;
  //     })
  // }
  //#endregion button unreject

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
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_branch_code': this.branch_code,
          'p_status': this.tampStatus
        });

        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listhandoverrequest = parse.data;
          if (parse.data != null) {
            this.showSpinner = false;
            this.listhandoverrequest.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall
          
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, searchable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;">No Data Available !</p>'
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

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
          'p_branch_code': this.model.branch_code,
        });

        // end param tambahan untuk getrows dynamic
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerBranch, this.APIRouteLookup).subscribe(resp => {
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

  btnSelectRowBranch(code: string, name: string) {

    this.branch_code = code;
    this.branch_name = name;
    $('#lookupModalBranch').modal('hide');
    $('#datatablelisthandoverrequest').DataTable().ajax.reload();
  }

  btnClearBranch() {
    this.branch_code = '';
    this.branch_name = '';
    $('#datatablelisthandoverrequest').DataTable().ajax.reload();
  }
  //#endregion Branch lookup

  //#region ddl master module
  PageStatus(event: any) {
    this.tampStatus = event.target.value;
    $('#datatablelisthandoverrequest').DataTable().ajax.reload();
  }
  //#endregion ddl master module

  //#region btn process
  btnProceed() {
    this.dataTamp = [];
    this.checkedList = [];
    for (let i = 0; i < this.listhandoverrequest.length; i++) {
      if (this.listhandoverrequest[i].selected) {
        this.checkedList.push({
          code: this.listhandoverrequest[i].code,
          branch_code: this.listhandoverrequest[i].branch_code,
          branch_name: this.listhandoverrequest[i].branch_name
        });
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
        (function loopAgreementMaturity() {
          if (i < th.checkedList.length) {
            th.dataTamp = [{
              'p_code': th.checkedList[i].code,
              'p_branch_code': th.checkedList[i].branch_code,
              'p_branch_name': th.checkedList[i].branch_name,
              'action': ''
            }];

            th.dalservice.ExecSp(th.dataTamp, th.APIController, th.APIRouteForProceed)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatablelisthandoverrequest').DataTable().ajax.reload();
                      th.showSpinner = false;
                    } else {
                      i++;
                      loopAgreementMaturity();
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


  selectAllTable() {
    for (let i = 0; i < this.listhandoverrequest.length; i++) {
      this.listhandoverrequest[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listhandoverrequest.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion btn process

  //#region btn print

  // btnPrint() {
  //   //checklist data 
  //   this.checkedList = [];
  //   for (let i = 0; i < this.listhandoverrequest.length; i++) {
  //     if (this.listhandoverrequest[i].selected) {
  //       this.checkedList.push(this.listhandoverrequest[i].code);
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
  //   swal({
  //     title: 'Are you sure?',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonClass: 'btn btn-success',
  //     cancelButtonClass: 'btn btn-danger',
  //     confirmButtonText: this._deleteconf,
  //     buttonsStyling: false
  //   }).then((result) => {

  //     if (result.value) {
  //       // this.dataTampPush = [];
  //       // 
  //       // (function loopReportChecklist() {
  //       for (let J = 0; J < this.checkedList.length; J++) {

  //         this.showSpinner = true;
  //         let th = this;
  //         let dataParamPrint = {
  //           TableName: 'rpt_surat_jalan',
  //           SpName: 'xsp_rpt_surat_jalan',
  //           reportparameters: {
  //             p_code: this.checkedList[J],
  //             p_user_id: th.userId,
  //             p_first_data : J + 1, 
  //             p_print_option: 'PDF'
  //           }
  //         };  

  //         th.dalservice.ReportFile(dataParamPrint, th.APIControllerReport, th.APIRouteForDownload).subscribe(res => {
  //           th.printRptNonCore(res);
  //           // loopReportChecklist()
  //           th.showSpinner = false;
  //         }, err => {
  //           th.showSpinner = false;
  //           const parse = JSON.parse(err);
  //           th.swalPopUpMsg(parse.data);

  //         });

  //       }


  //     } else {
  //       this.showSpinner = false;
  //     }

  //   });

  // }
  //#endregion btn priint

  // //#region btnMultiPrint
  // btnPrint() {
  //   //checklist data 
  //   this.checkedList = [];
  //   for (let i = 0; i < this.listhandoverrequest.length; i++) {
  //     if (this.listhandoverrequest[i].selected) {
  //       this.checkedList.push(this.listhandoverrequest[i].code);
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
  //   this.showSpinner = true;

  //   let th = this;
  //   var i = 0;
  //   let dataTampDelete = [{
  //     'p_user_id': th.userId,
  //     'action': ''
  //   }];
  //   th.dalservice.ExecSp(dataTampDelete, th.APIController, th.APIForDelete)
  //     .subscribe(
  //       res => {
  //         const parse = JSON.parse(res);
  //         if (parse.result === 1) {
  //           i++;
  //           this.insertandprint(th.checkedList)
  //         } else {
  //           th.showSpinner = false;
  //           th.swalPopUpMsg(parse.data);
  //         }
  //       },
  //       error => {
  //         th.showSpinner = false;
  //         const parse = JSON.parse(error);
  //         th.swalPopUpMsg(parse.data)
  //       });
  // }

  // insertandprint(dataChecklist: any) {
  //   let th = this;
  //   var j = 0;

  //   (function loopReportInsertandPrint() {
  //     if (j < dataChecklist.length - 1) {
  //       let dataTampInsert = [{
  //         'p_code': dataChecklist[j],
  //         'p_user_id': th.userId,
  //         'p_first_data': j + 1,
  //         'action': ''
  //       }];

  //       th.dalservice.ExecSp(dataTampInsert, th.APIController, th.APIForInsert)
  //         .subscribe(
  //           res => {
  //             const parse = JSON.parse(res);
  //             if (parse.result === 1) {
  //               j++;
  //               loopReportInsertandPrint()
  //             } else {
  //               th.showSpinner = false;
  //               th.swalPopUpMsg(parse.data);
  //             }
  //           },
  //           error => {

  //             th.showSpinner = false;
  //             const parse = JSON.parse(error);
  //             th.swalPopUpMsg(parse.data)
  //           });
  //     } else {
  //       let dataParamPrint = {
  //         TableName: 'rpt_surat_jalan',
  //         SpName: 'xsp_rpt_surat_jalan',
  //         reportparameters: {
  //           p_code: dataChecklist[j],
  //           p_user_id: th.userId,
  //           p_first_data: j + 1,
  //           p_print_option: 'PDF'
  //         }
  //       };

  //       th.dalservice.ReportFile(dataParamPrint, th.APIControllerReport, th.APIRouteForDownload).subscribe(res => {
  //         th.printRptNonCore(res);
  //         th.showSpinner = false;
  //       }, err => {
  //         th.showSpinner = false;
  //         const parse = JSON.parse(err);
  //         th.swalPopUpMsg(parse.data);
  //       });
  //     }
  //   })();
  // }
  // //#endregion btnMultiPrint
}
