import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './soldsettlementlist.component.html'
})

export class SoldSettlementListComponent extends BaseComponent implements OnInit {
    // variable
    public listsoldsettlement: any = [];
    public dataTamp: any = [];
    public status: any;
    public branch_code: any;
    public lookupbranch: any = [];
    public lookuplocation: any = [];
    public tempFile: any;
    private dataTampProceed: any = [];
    public isBreak: Boolean = false;
    public rptParam: any = [];
    public dataParam: any = [];
    private dataTampPush: any = [];
    //controller
    private APIController: String = 'SaleDetail';
    private APIControllerBranch: String = 'SysBranch';
    //routing
    private APIRouteForGetRows: String = 'GetRowsForSoldSettlement';
    private APIRouteLookup: String = 'GetRowsForLookup';
    private RoleAccessCode = 'R00022590000001A';
    private APIRouteInsertGroup: String = 'ExecSpInsertGroup';
    private APIRouteDeleteGroup: String = 'ExecSpDeleteGroup';

    // report
    private APIControllerReport: String = 'Report';
    private APIRouteForDownload: String = 'getReport';

    // form 2 way binding
    model: any = {};

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    // checklist
    public selectedAll: any;
    private checkedList: any = [];

    // spinner
    showSpinner: Boolean = false;
    // end

    constructor(private dalservice: DALService,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide(this._location, this._elementRef, this.route);
        this.loadData();
        this.status = 'HOLD';
        this.model.from_date = '';
        this.model.to_date = '';
    }

    //#region ddl from date
  FromDate(event: any) {
    this.model.from_date = event;
    var fromDate = event.singleDate.formatted;
    // console.log(fromDate)
    if(fromDate == ''){
        this.model.from_date = undefined;
    } else 
    {
        this.model.from_date = event;
    }
    $('#datatablesoldrequest').DataTable().ajax.reload();
  }
  //#endregion ddl from date

  //#region ddl to date
  ToDate(event: any) {
    this.model.to_date = event;
    var toDate = event.singleDate.formatted;
    // console.log(fromDate)
    if(toDate == ''){
        this.model.to_date = undefined;
    } else 
    {
        this.model.to_date = event;
    }
    $('#datatablesoldrequest').DataTable().ajax.reload();
  }
  //#endregion ddl to date

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
                'p_company_code': this.company_code,
                'p_status'      : this.status,
                'p_from_date'   : this.model.from_date,
                'p_to_date'     : this.model.to_date,
              };
              dtParameters.paramTamp = [];
              dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))

              this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                  // if use checkAll use this
                  $('#checkall').prop('checked', false);
                  // end checkall

                  const parse = JSON.parse(resp);
                  this.listsoldsettlement = parse.data;
                  if (parse.data != null) {
                      this.listsoldsettlement.numberIndex = dtParameters.start;
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
          columnDefs: [{ orderable: false, width: '5%', targets:  [0, 1, 2, 12] }], // for disabled coloumn
          language: {
              search: '_INPUT_',
              searchPlaceholder: 'Search records',
              infoEmpty: '<p style="color:red;" > No Data Available !</p> '
          },
          searchDelay: 800 // pake ini supaya gak bug search
      }
  }
  //#endregion load all data
    //#region button add
    btnAdd() {
        this.route.navigate(['/sellanddisposal/subsoldsettlement/soldsettlementdetail']);
    }
    //#endregion button add

    //#region button edit
    btnEdit(codeEdit: string) {
        this.route.navigate(['/sellanddisposal/subsoldsettlement/soldsettlementdetail', codeEdit]);
    }
    //#endregion button edit

    //#region ddl Status
    PageStatus(event: any) {
        this.status = event.target.value;
        $('#datatablesoldrequest').DataTable().ajax.reload();
    }
    //#endregion ddl Status



    //#region button print pajak
      btnPrintPajak() {
          this.dataTampProceed = [];
          this.checkedList = [];
      
          for (let i = 0; i < this.listsoldsettlement.length; i++) {
            if (this.listsoldsettlement[i].selected) {
              this.checkedList.push({                  
                'sale_id': this.listsoldsettlement[i].id,
                'user_id': this.userId,
                
              })
            }
          }
          
          const dataParam = {
          TableName: 'rpt_print_pajak_group',
          SpName: 'xsp_rpt_print_pajak_group',
              reportparameters: {
              p_user_id: this.userId,
              // p_sale_id: this.checkedList.sale_id,
              p_print_option: 'Excel'
            }
          };
      
          // param tambahan untuk getrole dynamic
          this.dataTampPush = [{
            'p_user_id': this.userId,
            'action': 'default'
          }];
          // param tambahan untuk getrole dynamic
      
          // jika tidak di checklist
          if (this.checkedList.length === 0) {
            swal({
              title: this._listdialogconf,
              buttonsStyling: false,
              confirmButtonClass: 'btn btn-danger'
            }).catch(swal.noop)
            return
          }
          this.showSpinner = true;
          // console.log(this.checkedList)
          this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteDeleteGroup)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                // console.log(this.checkedList[1].id)
                if (parse.result === 1) {
                  this.dataTamp = [];
                  let th = this;
                  var i = 0;
                  (function loopPrintPajak() {
                    if (i < th.checkedList.length) {
                      const paramtxt = [
                        {
                          'p_user_id': th.checkedList[i].user_id,
                          'p_sale_id': th.checkedList[i].sale_id
                        }
                      ];
                      // call web service
                      th.dalservice.ExecSp(paramtxt, th.APIController, th.APIRouteInsertGroup)
                        .subscribe(
                          res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                              //#region proceed file
                              if (th.checkedList.length == i + 1) {
                                th.dalservice.ReportFile(dataParam, th.APIControllerReport, th.APIRouteForDownload).subscribe(res => {
                                  th.printRptNonCore(res);
                                  th.showSpinner = false;
                                  th.loadData();
                                  th.showNotification('bottom', 'right', 'success');
                                  $('#datatablesoldrequest').DataTable().ajax.reload();
      
                                }, err => {
                                  th.showSpinner = false;
                                  // const parse = JSON.parse(err);
                                  // th.swalPopUpMsg(parse.data);
                                });
                              } else {
                                i++;
                                loopPrintPajak();
                              }
                              //#endregion
                            } else {
                              th.showSpinner = false;
                            }
                          });
                    }
                  })();
                } else {
                  this.showSpinner = false;
                }
              },
              error => {
                this.showSpinner = false;
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data);
              });
        }    
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

    btnSelectRowBranch(code: string, description: string) {
        this.model.branch_code = code;
        this.model.branch_name = description;
        this.model.location_code = '';
        this.model.description_location = '';
        $('#lookupModalBranch').modal('hide');
        $('#datatablesoldrequest').DataTable().ajax.reload();
    }
    //#endregion Branch lookup

    selectAllTable() {
        for (let i = 0; i < this.listsoldsettlement.length; i++) {
            this.listsoldsettlement[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listsoldsettlement.every(function (item: any) {
            return item.selected === true;
        })
    }
}


