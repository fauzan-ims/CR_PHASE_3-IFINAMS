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
  templateUrl: './deliveryrequestlist.component.html'
})

export class DeliveryRequestListComponent extends BaseComponent implements OnInit {
  // variable
  public listDeliveryRequest: any = [];
  public lookupClient: any = [];
  public lookupSysBranch: any = [];
  public clientCode: String;
  public clientName: String;
  public branchCode: String;
  public branchName: String; 
  private dataTampPush: any = [];
  private dataTampProceed: any = [];
  private dataTamp: any = [];

  //controller
  private APIController: String = 'RegisterDelivery';
  private APIControllerSysBranch: String = 'SysBranch';

  //router
  private APIRouteForGetRowsDeliveryRequest: String = 'GetRowsDeliveryRequest';
  private APIRouteForProceed: String = 'ExecSpForGetProceedDeliveryRequest';
  private APIRouteLookup: String = 'GetRowsForLookup';
  private APIRouteLookupClient: String = 'GetRowsForLookupClient';
  private RoleAccessCode = 'R00024710000001A';

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
    this.loadData();
    this.model.client_name = '';
    this.model.branch_name = '';
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
        let paramTamps = {};
        paramTamps = {
            'p_branch_code': this.branchCode,
            'p_client_code': this.clientCode,
        };
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRowsDeliveryRequest).subscribe(resp => {
          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

          const parse = JSON.parse(resp);
          this.listDeliveryRequest = parse.data;
          if (parse.data != null) {
            this.listDeliveryRequest.numberIndex = dtParameters.start;
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

  //#region btn proceed
  btnProceed() {
    const selectedCodes = this.listDeliveryRequest
      .filter(row => row.selected)
      .map(row => row.code);

    if (selectedCodes.length === 0) {
        swal({
          title: this._listdialogconf,
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-danger'
        }).catch(swal.noop);
        return;
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
      if (result.value) {
        this.showSpinner = true;

        // Gabungkan semua kode jadi string comma-separated
        const codesString = selectedCodes.join(',');

        const payload = [{
          p_code_list: codesString,
        }];

        this.dalservice.ExecSp(payload, this.APIController, this.APIRouteForProceed)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                $('#datatableDeliveryRequest').DataTable().ajax.reload();
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
      } else {
        this.showSpinner = false;
      }
    });
  }


  selectAllTable() {
    for (let i = 0; i < this.listDeliveryRequest.length; i++) {
      this.listDeliveryRequest[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listDeliveryRequest.every(function (item: any) {
      return item.selected === true;
    })
    console.log(this.selectedAll)
  }
  //#endregion btn proceed

  //#region Client
    btnLookupClient() {
        $('#datatableLookupClient').DataTable().clear().destroy();
        $('#datatableLookupClient').DataTable({
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
                    'default': ''
                });
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteLookupClient).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupClient = parse.data;
                    this.lookupClient.numberIndex = dtParameters.start;
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    })
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            'lengthMenu': [
                [5, 25, 50, 100],
                [5, 25, 50, 100]
            ],
            columnDefs: [{ orderable: false, width: '5%', targets: [2] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowClient(code: String, name: String) {
        this.clientCode = code;
        this.clientName = name;
        console.log(this.clientCode, this.clientName)
        $('#lookupModalClient').modal('hide');
        $('#datatableDeliveryRequest').DataTable().ajax.reload();
    }

    btnClearClient() {
        this.clientCode = ''
        this.clientName = '';
        $('#datatableDeliveryRequest').DataTable().ajax.reload();
    }
    //#endregion Client 

    //#region Branch Name
    btnLookupSysBranch() {
        $('#datatableLookupSysBranch').DataTable().clear().destroy();
        $('#datatableLookupSysBranch').DataTable({
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
                    'default': ''
                });
                this.dalservice.GetrowsBase(dtParameters, this.APIControllerSysBranch, this.APIRouteLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupSysBranch = parse.data;
                    this.lookupSysBranch.numberIndex = dtParameters.start;
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    })
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            'lengthMenu': [
                [5, 25, 50, 100],
                [5, 25, 50, 100]
            ],
            columnDefs: [{ orderable: false, width: '5%', targets: [3] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowSysBranch(code: String, name: String) {
        this.branchCode = code;
        this.branchName = name;
        $('#lookupModalSysBranch').modal('hide');
        $('#datatableDeliveryRequest').DataTable().ajax.reload();
    }

    btnClearBranch() {
        this.branchCode = ''
        this.branchName = '';
        $('#datatableDeliveryRequest').DataTable().ajax.reload();
    }
    //#endregion branch
}
