import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './unsubscriberequestgpslist.component.html'
})

export class UnsubscribeRequestGpsListComponent extends BaseComponent implements OnInit {
    // variable

    public listunsubscribegpsrequest: any = [];
    private dataTampRequest: any = [];
    public selectedAllTable: any;
    public status: any;
    public sourceTransaction: any;


    private dataRoleTamp: any = [];
    private RoleAccessCode = 'R00024720000001A';


    // API Controller
    private APIController: String = 'MonitoringGps';

    // API Function
    private APIRouteForGetRows: String = 'GetRowsUnsubscribeRequestGps';
    private APIRouteForProceed: String = 'ExecSpProceed';
    private APIRouteForCancel: String = 'ExecSpCancel';
    // private APIRouteForCancel: String = 'ExecSpCancel';

    // checklist
    public selectedAll: any;
    public checkedList: any = [];
    private dataTamp: any = [];

    // ini buat datatables
    model: any = {};
    showSpinner: Boolean = false;
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,

        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

        this.compoSide(this._location, this._elementRef, this.route);
        this.loadData();
        this.status = 'ALL';
        this.sourceTransaction = 'ALL';
    }

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
                    'p_company_code': this.company_code,
                    'p_status': this.status,
                    'p_source_transaction': this.sourceTransaction
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)

                    this.listunsubscribegpsrequest = parse.data;
                    if (parse.data != null) {
                        this.listunsubscribegpsrequest.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });

                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 8] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region ddl master module
    PageStatus(event: any) {
        this.status = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl master module

    //#region ddl master module
    PageSourceTransaction(event: any) {
        this.sourceTransaction = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl master module

    //#region  select list
    selectAllTable() {
        for (let i = 0; i < this.listunsubscribegpsrequest.length; i++) {
            this.listunsubscribegpsrequest[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listunsubscribegpsrequest.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion  select list

    //#region btn Cancel
    btnCancel() {
        this.dataTampRequest = [];
        this.checkedList = [];
        for (let i = 0; i < this.listunsubscribegpsrequest.length; i++) {
          if (this.listunsubscribegpsrequest[i].selected) {
            this.checkedList.push({
              'request_no': this.listunsubscribegpsrequest[i].request_no,
              'code': this.listunsubscribegpsrequest[i].code,
              'status': this.listunsubscribegpsrequest[i].status,
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
            (function loopPoProceesCancel() {
              if (i < th.checkedList.length) {
                th.dataTampRequest = [{
                  'p_request_no': th.checkedList[i].request_no,
                  'p_code': th.checkedList[i].code,
                  'action': '',
                }];            
                th.dalservice.ExecSp(th.dataTampRequest, th.APIController, th.APIRouteForCancel)
                  .subscribe(
                    res => {
                      const parse = JSON.parse(res);
                      if (parse.result === 1) {
                        if (th.checkedList.length == i + 1) {
                          th.showNotification('bottom', 'right', 'success');
                          $('#datatable').DataTable().ajax.reload();
                          th.showSpinner = false;
                        } else {
                          i++;
                          loopPoProceesCancel();
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
    //#endregion btn Cancel
    
    //#region btn Proceed
    btnProceed() {
      this.checkedList = [];

      // Ambil daftar request_no yang dicentang
      for (let i = 0; i < this.listunsubscribegpsrequest.length; i++) {
        if (this.listunsubscribegpsrequest[i].selected) {
          this.checkedList.push(this.listunsubscribegpsrequest[i].request_no);
        }
      }

      // Jika tidak ada yang dicentang
      if (this.checkedList.length === 0) {
        swal({
          title: this._listdialogconf,
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-danger'
        }).catch(swal.noop);
        return;
      }

      // Konfirmasi
      swal({
        title: 'Are you sure?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Yes',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          this.showSpinner = true;

          // Buat string request_no terpisah koma
          const requestNoList = this.checkedList.join(',');

          // Siapkan parameter untuk SP
          this.dataTampRequest = [{
            'p_request_list': requestNoList,
          }];

          this.dalservice.ExecSp(this.dataTampRequest, this.APIController, this.APIRouteForProceed)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  this.showNotification('bottom', 'right', 'success');
                  $('#datatable').DataTable().ajax.reload();
                } else {
                  this.swalPopUpMsg(parse.data);
                }
                this.showSpinner = false;
              },
              error => {
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data);
                this.showSpinner = false;
              }
            );
        }
      });
    }

    // btnProceed() {
    //     this.dataTampRequest = [];
    //     this.checkedList = [];
    //     for (let i = 0; i < this.listunsubscribegpsrequest.length; i++) {
    //       if (this.listunsubscribegpsrequest[i].selected) {
    //         this.checkedList.push({
    //           'request_no': this.listunsubscribegpsrequest[i].request_no,
    //           'code': this.listunsubscribegpsrequest[i].code,
    //           'status': this.listunsubscribegpsrequest[i].status,
    //         })
    //       }
    //     }
    
    //     // jika tidak di checklist
    //     if (this.checkedList.length === 0) {
    //       swal({
    //         title: this._listdialogconf,
    //         buttonsStyling: false,
    //         confirmButtonClass: 'btn btn-danger'
    //       }).catch(swal.noop)
    //       return
    //     }
    //     this.dataTamp = [];
    //     swal({
    //       title: 'Are you sure?',
    //       type: 'warning',
    //       showCancelButton: true,
    //       confirmButtonClass: 'btn btn-success',
    //       cancelButtonClass: 'btn btn-danger',
    //       confirmButtonText: 'Yes',
    //       buttonsStyling: false
    //     }).then((result) => {
    //       this.showSpinner = true;
    //       if (result.value) {
    //         let th = this;
    //         var i = 0;
    //         (function loopPoProceesCancel() {
    //           if (i < th.checkedList.length) {
    //             th.dataTampRequest = [{
    //               'p_request_no': th.checkedList[i].request_no,
    //               'p_code': th.checkedList[i].code,
    //               'action': '',
    //             }];            
    //             th.dalservice.ExecSp(th.dataTampRequest, th.APIController, th.APIRouteForProceed)
    //               .subscribe(
    //                 res => {
    //                   const parse = JSON.parse(res);
    //                   if (parse.result === 1) {
    //                     if (th.checkedList.length == i + 1) {
    //                       th.showNotification('bottom', 'right', 'success');
    //                       $('#datatable').DataTable().ajax.reload();
    //                       th.showSpinner = false;
    //                     } else {
    //                       i++;
    //                       loopPoProceesCancel();
    //                     }
    //                   } else {
    //                     th.swalPopUpMsg(parse.data);
    //                     th.showSpinner = false;
    //                   }
    //                 },
    //                 error => {
    //                   const parse = JSON.parse(error);
    //                   th.swalPopUpMsg(parse.data);
    //                   th.showSpinner = false;
    //                 });
    //           }
    
    //         })();
    //       } else {
    //         this.showSpinner = false;
    //       }
    //     });
    //   }
    //#endregion btn Proceed
}

