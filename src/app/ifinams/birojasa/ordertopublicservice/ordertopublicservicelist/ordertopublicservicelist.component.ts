
import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './ordertopublicservicelist.component.html'
})

export class OrdertopublicservicelistComponent extends BaseComponent implements OnInit {
    // variable
    public listordertopublicservice: any = [];
    public branchCode: any = [];
    public lookupSysBranch: any = [];
    public branchName: any = [];
    public date: any = [];
    public tampStatus: String;
    public public_service_code: String = '';
    public public_service_name: String = '';
    public lookupPublicService: any = [];
    
    private dataRoleTamp: any = [];
    private RoleAccessCode = 'R00022330000000A';

    // API Controller
    private APIController: String = 'OrderMain';
    private APIControllerSysBranch: String = 'SysBranch';
    private APIControllerMasterPublicService: String = 'MasterPublicService';


    // API Function
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForGetRows: String = 'GETROWS';
    
    // form 2 way binding
  model: any = {};


    // ini buat datatables
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
        this.tampStatus = 'HOLD';
        this.loadData();
    }

    //#region ddl master module
    PageStatus(event: any) {
        this.tampStatus = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl master module

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
            'p_public_service': this.public_service_code,
            'p_date': this.model.date,
            'p_order_main_status': this.tampStatus
        }
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))
        // end param tambahan untuk getrows dynamic          
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

          const parse = JSON.parse(resp);
          this.listordertopublicservice = parse.data;
                    if (parse.data != null) {
                        this.listordertopublicservice.numberIndex = dtParameters.start;
                    }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [9] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

    // //#region load all data
    // loadData() {
    //     this.dtOptions = {
    //         pagingType: 'full_numbers',
    //         responsive: true,
    //         serverSide: true,
    //         processing: true,
    //         paging: true,
    //         'lengthMenu': [
    //             [10, 25, 50, 100],
    //             [10, 25, 50, 100]
    //         ],
    //         ajax: (dtParameters: any, callback) => {
    //             // param tambahan untuk getrows dynamic
    //             dtParameters.paramTamp = [];
    //             dtParameters.paramTamp.push({
    //                 'p_branch_code': this.branchCode,
    //                 'p_public_service': this.public_service_code,
    //                 'p_date': this.model.date,
    //                 'p_order_main_status': this.tampStatus
    //             });

    //             console.log(dtParameters);
    //             dtParameters.paramTamp = [];
    //             dtParameters.paramTamp.push(this.JSToNumberFloats(dtParameters))
    //             // end param tambahan untuk getrows dynamic
    //             this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
    //                 const parse = JSON.parse(resp)
    //                 this.listordertopublicservice = parse.data;
    //                 if (parse.data != null) {
    //                     this.listordertopublicservice.numberIndex = dtParameters.start;
    //                 }

    //                 callback({
    //                     draw: parse.draw,
    //                     recordsTotal: parse.recordsTotal,
    //                     recordsFiltered: parse.recordsFiltered,
    //                     data: []
    //                 });

    //             }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
    //         },
    //         columnDefs: [{ orderable: false, width: '5%', targets: [9] }], // for disabled coloumn
    //         language: {
    //             search: '_INPUT_',
    //             searchPlaceholder: 'Search records',
    //             infoEmpty: '<p style="color:red;" > No Data Available !</p> '

    //         },
    //         searchDelay: 800 // pake ini supaya gak bug search
    //     }
    // }
    //#endregion load all data

    //#region button add
    btnAdd() {
        this.route.navigate(['/birojasa/ordertobirojasalist/ordertopublicservicedetail']);
    }
    //#endregion button add

    //#region button edit
    btnEdit(codeEdit: string) {
        this.route.navigate(['/birojasa/ordertobirojasalist/ordertopublicservicedetail', codeEdit]);
    }
    //#endregion button edit

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
            columnDefs: [{ orderable: false, width: '5%', targets: [4] }], // for disabled coloumn
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
        this.public_service_code = '';
        this.public_service_name = '';
        $('#lookupModalSysBranch').modal('hide');
       $('#datatable').DataTable().ajax.reload();
    }

    btnClearBranch() {
        this.branchCode = '';
        this.branchName = '';
        this.public_service_code = '';
        this.public_service_name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion branch

    //#region insurance lookup
  btnLookupPublicService() {
    $('#datatableLookupPublicService').DataTable().clear().destroy();
    $('#datatableLookupPublicService').DataTable({
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
            'p_branch_code': this.branchCode
        });

        
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterPublicService, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupPublicService = parse.data;

          if (parse.data != null) {
            this.lookupPublicService.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowPublicService(public_service_code: String, public_service_name: String) {
    this.public_service_code = public_service_code;
    this.public_service_name = public_service_name;
    $('#lookupModalPublicService').modal('hide');
    $('#datatable').DataTable().ajax.reload();
  }

  btnClearPublicService() {
    this.public_service_code = '';
    this.public_service_name = '';
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion insurance lookup

  //#region from date
  FromDate(event: any) {
    this.model.date = event;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion from date


}

