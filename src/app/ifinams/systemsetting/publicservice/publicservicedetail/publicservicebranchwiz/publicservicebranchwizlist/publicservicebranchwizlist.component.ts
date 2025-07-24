
import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './publicservicebranchwizlist.component.html'
})

export class PublicservicebranchlistComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // checklist
    public selectedAll: any;
    public isBreak: Boolean = false;
    private checkedList: any = [];

    // variable
    public listpublicservicebranch: any = [];
    
    private dataRoleTamp: any = [];
    private dataTamp: any = [];
    private RoleAccessCode = 'R00021430000000A';

    // API Controller
    private APIController: String = 'MasterPublicServiceBranch';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForGetDelete: String = 'Delete';
    

    // form 2 way binding
    model: any = {};

    // spinner
    showSpinner: Boolean = false;
    // end

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,
        public route: Router,
        public getRouteparam: ActivatedRoute,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

        this.compoSide('', this._elementRef, this.route);
        this.loadData();
    }

    //#region publicservicebranchList getrow data
    callGetrow() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param,
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
    //#endregion publicservicebranchList getrow data

    //#region publicservicebranchList load all data
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
                // param tambahan untuk getrow dynamic
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_public_service_code': this.param
                });
                // end param tambahan untuk getrow dynamic
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    const parse = JSON.parse(resp);
                    this.listpublicservicebranch = parse.data;
                    if (parse.data != null) {
                        this.listpublicservicebranch.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });

                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion public servicebranchList load all data

    //#region publicservicebranchList button add
    btnAdd() {
        this.route.navigate(['/systemsetting/subpublicservice/publicservicedetail/' + this.param + '/publicservicebranchlist/' + this.param + '/publicservicebranchdetail', this.param], { skipLocationChange: true });
    }
    //#endregion publicservicebranchList button add

    //#region publicservicebranchList button edit
    btnEdit(codeEdit: string) {
        this.route.navigate(['/systemsetting/subpublicservice/publicservicedetail/' + this.param + '/publicservicebranchlist/' + this.param + '/publicservicebranchdetail', this.param, codeEdit], { skipLocationChange: true });
    }
    //#endregion publicservicebranchList button edit

    //#region checkbox all table
    btnDeleteAll() {
        this.isBreak = false;
        this.checkedList = [];
        for (let i = 0; i < this.listpublicservicebranch.length; i++) {
            if (this.listpublicservicebranch[i].selected) {
                this.checkedList.push(this.listpublicservicebranch[i].code);
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
            this.showSpinner = true;
            if (result.value) {
                this.dataTamp = [];
                for (let J = 0; J < this.checkedList.length; J++) {
                    const code = this.checkedList[J];
                    // param tambahan untuk getrow dynamic
                    this.dataTamp = [{
                        'p_code': code
                    }];
                    // end param tambahan untuk getrow dynamic
                    this.dalservice.Delete(this.dataTamp, this.APIController, this.APIRouteForGetDelete)
                        .subscribe(
                            res => {
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    if (J + 1 === this.checkedList.length) {
                                        this.showSpinner = false;
                                        this.showNotification('bottom', 'right', 'success');
                                        $('#datatablesss').DataTable().ajax.reload();
                                    }
                                } else {
                                    this.isBreak = true;
                                    $('#datatablesss').DataTable().ajax.reload();
                                    this.showSpinner = false;
                                    this.swalPopUpMsg(parse.data);
                                }
                            },
                            error => {
                                this.isBreak = true;
                                this.showSpinner = false;
                                const parse = JSON.parse(error);
                                this.swalPopUpMsg(parse.data);
                            });
                    if (this.isBreak) {
                        break;
                    }
                }
            } else {
                this.showSpinner = false;
            }
        });
    }

    selectAllTable() {
        for (let i = 0; i < this.listpublicservicebranch.length; i++) {
            this.listpublicservicebranch[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listpublicservicebranch.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion checkbox all table
}




