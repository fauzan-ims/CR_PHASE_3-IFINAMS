import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './masterreportcustomcolumnwizlist.component.html'
})
export class MasterReportCustomColumnComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public reportData: any = [];
  public lookupsysbranch: any = [];
  public dataTamp: any = [];
  public testTamp: any = [];
  public listmappingvalue: any = [];
  public listmastercustomcolumn: any = [];
  private dataRoleTamp: any = [];
  private checkedLookup: any = [];
  private dataTampPush: any = [];
  public datauploadlist: any = [];
  private tamps = new Array();

  private RoleAccessCode = 'R00021280000000A';
  private APIController: String = 'MasterCustomReportColumn';
  private APIControllerMasterMapping: String = 'MasterMappingValueDetail';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'Getrows'
  private APIRouteForAdd: String = 'ExecSpForAdd'
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForDelete: String = 'DELETE';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForOrderUp: String = 'ExecSpForOrderKeyUp';
  private APIRouteForOrderDown: String = 'ExecSpForOrderKeyDown';

  // form 2 way binding
  model: any = {};

  // checklist 
  public selectedAllTableColumn: any;
  public selectedAllMapping: any;
  public selectedAllLookup: any;
  private checkedList: any = [];
  public selectedAll: any;

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtOptionsBranch: DataTables.Settings = {};
  // showNotification: any;

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.callGetrow();
    this.loadData();
    this.loadDataMasterColumn();
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
          const parsedata = parse.data[0];

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

  //#region load Mapping Detail
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
          'p_custom_report_code': this.param,
        })
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterMapping, this.APIRouteForGetRows).subscribe(resp => {
          // if use checkAll use this
          $('#checkallReport').prop('checked', false);
          // end checkall

          const parse = JSON.parse(resp)
          this.listmappingvalue = parse.data;

          if (parse.data != null) {
            this.listmappingvalue.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, searchable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load Mapping Detail

  //#region load Master Column
  loadDataMasterColumn() {
    this.dtOptionsBranch = {
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
          'p_custom_report_code': this.param,
        });
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          // if use checkAll use this
          $('#checkallColumn').prop('checked', false);
          // end checkall

          const parse = JSON.parse(resp)

          this.listmastercustomcolumn = parse.data;
          if (parse.data != null) {
            this.listmastercustomcolumn.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, searchable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      order: [['3', 'asc']],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load Master Column

  //#region btnAdd
  btnAdd() {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_code': this.param,
      'action': 'default'
    }];
    // param tambahan untuk getrole dynamic

    // call web service
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForAdd)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);

              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                $('#datatables').DataTable().ajax.reload();
              } else {
                this.swalPopUpMsg(parse.data);
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
    })
  }
  //#endregion btnAdd

  //#region checkbox unselected field
  btnSelectAllLookup() {
    this.checkedLookup = [];
    for (let i = 0; i < this.listmappingvalue.length; i++) {
      if (this.listmappingvalue[i].selectedLookup) {
        this.checkedLookup.push({
          Id: this.listmappingvalue[i].id,
          columnName: this.listmappingvalue[i].column_name,
          fieldName: this.listmappingvalue[i].field_name
        });
      }
    }

    // jika tidak di checklist
    if (this.checkedLookup.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }
    for (let J = 0; J < this.checkedLookup.length; J++) {
      this.dataTamp = [{
        'p_custom_report_code': this.param,
        'p_column_name': this.checkedLookup[J].columnName,
        'p_header_name': this.checkedLookup[J].fieldName,
      }];
      // end param tambahan untuk getrow dynamic
      this.dalservice.Insert(this.dataTamp, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              if (this.checkedLookup.length == J + 1) {
                this.showNotification('bottom', 'right', 'success');
                $('#datatableMappingValue').DataTable().ajax.reload();
                $('#datatableMasterCustColumn').DataTable().ajax.reload();
              }
              // })
            } else {
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          })
    }
  }

  selectAllTableMapping() {
    for (let i = 0; i < this.listmappingvalue.length; i++) {
      this.listmappingvalue[i].selectedLookup = this.selectedAllMapping;
    }
  }

  checkIfAllTableSelectedMapping() {
    this.selectedAllMapping = this.listmappingvalue.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion checkbox unselected field

  //#region checkbox selected field
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listmastercustomcolumn.length; i++) {
      if (this.listmastercustomcolumn[i].selected) {
        this.checkedList.push(this.listmastercustomcolumn[i].id_column);
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
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dataTampPush = [];
        for (let J = 0; J < this.checkedList.length; J++) {
          const id = this.checkedList[J];
          // param tambahan untuk getrow dynamic
          this.dataTampPush = [{
            'p_id': id
          }];
          // end param tambahan untuk getrow dynamic
          this.dalservice.Delete(this.dataTampPush, this.APIController, this.APIRouteForDelete)
            .subscribe(
              res => {
                this.showSpinner = false;
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableMappingValue').DataTable().ajax.reload();
                    $('#datatableMasterCustColumn').DataTable().ajax.reload();
                  }
                } else {
                  this.swalPopUpMsg(parse.data);
                }
              },
              error => {
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data);
              });
        }
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAll() {
    for (let i = 0; i < this.listmastercustomcolumn.length; i++) {
      this.listmastercustomcolumn[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listmastercustomcolumn.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox selected field

  //#region button save in list
  btnSaveList() {
    this.datauploadlist = [];
    this.showSpinner = true;
    let j = 0;

    const getID = $('[name="p_id_col"]')
      .map(function () { return $(this).val(); }).get();

    const getHeaderName = $('[name="p_header_name"]')
      .map(function () { return $(this).val(); }).get();

    while (j < getID.length) {

      while (j < getHeaderName.length) {

        this.datauploadlist.push(
          {
            p_id: getID[j],
            p_header_name: getHeaderName[j]
          });

        j++;
      }
      j++;
    }
    //#region web service
    this.dalservice.Update(this.datauploadlist, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          if (parse.result === 1) {
            this.showSpinner = false;
            this.showNotification('bottom', 'right', 'success');
            this.loadDataMasterColumn();
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
    //#endregion web service

  }
  //#endregion button save in list

  //#region btn order up
  btnOrderUp(code: any) {
    // this.showSpinner = true;
    // param tambahan untuk getrole dynamic
    this.dataTamp = [{
      'p_id': code,
      'p_custom_report_code': this.param
    }];
    // param tambahan untuk getrole dynamic

    this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForOrderUp)
      .subscribe(
        res => {

          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            $('#datatableMasterCustColumn').DataTable().ajax.reload();
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
  //#endregion btn order up

  //#region btn order Down
  btnOrderDown(code: any) {
    // this.showSpinner = true;
    // param tambahan untuk getrole dynamic
    this.dataTamp = [{
      'p_id': code,
      'p_custom_report_code': this.param
    }];
    // param tambahan untuk getrole dynamic

    this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForOrderDown)
      .subscribe(
        res => {

          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            $('#datatableMasterCustColumn').DataTable().ajax.reload();
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
  //#endregion btn order Down
}

