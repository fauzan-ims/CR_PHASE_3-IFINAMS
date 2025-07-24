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
    templateUrl: './masterregionlist.component.html'
})

export class MasterRegionlistComponent extends BaseComponent implements OnInit {
    // variable
    public listmasterregion: any = [];
    public dataTamp: any = [];
    public status: any; 

    private APIController: String = 'InterfaceMasterRegion';

    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForInsert: String = 'InsertThirdParty';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForCallThirdParty: String = 'CallThirdParty';
    private APIControllerGlobalParam: String = 'GlobalParam';

    private RoleAccessCode = 'R00016420000000A';

    // form 2 way binding
    model: any = {};

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    // checklist
    public selectedAll: any;

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
                })
                // end param tambahan untuk getrows dynamic

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    this.listmasterregion = parse.data;

                    if (parse.data != null) {
                        this.listmasterregion.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region button edit
    btnEdit(codeEdit: string) {
        this.route.navigate(['/interface/submasterregion/masterregiondetail', codeEdit]);
    }
    //#endregion button edit

    //#region btnSync
    btnSync() {
        this.showSpinner = true;

        this.dataTamp = [{
            'p_code': "ARB"
        }];
        this.dalservice.GetrowBam(this.dataTamp, this.APIControllerGlobalParam, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = parse.data[0];

                    const dataSync = { "body_req": { "idName": "data_master_region" }, "url": parsedata.value };

                    this.dalservice.CallThirdPartyAPI(dataSync, this.APIController, this.APIRouteForCallThirdParty)
                        .subscribe(
                            res => {
                                const parse = JSON.parse(res); 

                                if (parse.data.responseCode === '00') {
                                    this.dalservice.Insert(parse.data.data, this.APIController, this.APIRouteForInsert)
                                        .subscribe(
                                            res => {
                                                const parse = JSON.parse(res);
                                                if (parse.result === 1) {
                                                    $('#datatable').DataTable().ajax.reload();
                                                    this.showNotification('bottom', 'right', 'success');
                                                    this.showSpinner = false;
                                                } else {
                                                    this.swalPopUpMsg(parse.data);
                                                    this.showSpinner = false;
                                                }
                                            },
                                            error => {
                                                const parse = JSON.parse(error);
                                                this.swalPopUpMsg(parse.data);
                                                this.showSpinner = false;
                                            });
                                } else {
                                    this.swalPopUpMsg('V;' + parse.responseMessage);
                                    this.showSpinner = false;
                                }
                            },
                            error => {
                                this.swalPopUpMsg('V;Internal Server Error');
                                this.showSpinner = false;
                            });
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                    this.showSpinner = false;
                });

    }
    //#endregion btnSync

}


