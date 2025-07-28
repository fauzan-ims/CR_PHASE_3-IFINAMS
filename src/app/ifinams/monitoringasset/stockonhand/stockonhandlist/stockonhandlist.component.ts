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
    templateUrl: './stockonhandlist.component.html'
})

export class StockOnHandListComponent extends BaseComponent implements OnInit {
    // variable

    public liststockonhand: any = [];
    public lookupSysBranch: any = [];
    public listStatusTemp: any = [];
    public tampStatus: String;
    public branchCode: String;
    public branchName: String;
    public selectedAllTable: any;


    private dataRoleTamp: any = [];
    private RoleAccessCode = 'R00024560000001A';


    // API Controller
    private APIController: String = 'MonitoringAsset';
    private APIControllerSysBranch: String = 'SysBranch';

    // API Function
    private APIRouteLookup: String = 'GetRowsForLookup';
    private APIRouteForGetRows: String = 'GetRowsStockOnHand';
    private APIRouteForUpdateStatus: String = 'UpdateStatusAsset';


    // ini buat datatables
    model: any = {};
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    showSpinner: boolean;

    constructor(private dalservice: DALService,

        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

        this.compoSide(this._location, this._elementRef, this.route);
        this.loadData();
        // form 2 way binding
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
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_branch_code': this.branchCode
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)

                    this.liststockonhand = parse.data;
                    if (parse.data != null) {
                        this.liststockonhand.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });

                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 11] }], // for disabled coloumn
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
        this.tampStatus = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl master module

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
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
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
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearBranch() {
        this.branchCode = '';
        this.branchName = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion branch

    //#region Button Save
    btnSaveList(){
        this.listStatusTemp = [];

        var i = 0;

        var getCode = $('[name="p_code"]')
        .map(function () { return $(this).val(); }).get();

        var getStatusCondition = $('[name="p_status_condition"]')
        .map(function () { return $(this).val(); }).get();

        var getStatusProgress = $('[name="p_status_progress"]')
        .map(function () { return $(this).val(); }).get();
        
        var getStatusRemark = $('[name="p_status_remark"]')
        .map(function () { return $(this).val(); }).get();
        
        while (i < getCode.length) {
            while (i < getStatusCondition.length) {
                while (i < getStatusProgress.length) {
                    this.listStatusTemp.push(
                        this.JSToNumberFloats({
                        p_code: getCode[i],
                        p_status_condition: getStatusCondition[i],
                        p_status_progress: getStatusProgress[i],
                        p_status_remark: getStatusRemark[i],
                        })
                    );
                    i++;
                }
                i++;
            }
            i++;
        }

        // console.log(this.listStatusTemp)

        this.dalservice.Update(this.listStatusTemp, this.APIController, this.APIRouteForUpdateStatus)
        .subscribe(
            res => {
            const parse = JSON.parse(res);

            if (parse.result === 1) {
                $('#datatable').DataTable().ajax.reload();
                // this.loadData();
                this.showSpinner = false
            } else {
                this.swalPopUpMsg(parse.data);
                this.showSpinner = false
            }
            },
            error => {
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false
            });
    }
    

    changeStatus(){
        this.btnSaveList();
    }
    //#endregion Button Save

    //#region condition DDL
    onStatusConditionChange(row: any): void {
        const options = this.statusProgressOptionsMap[row.status_condition];
        row.status_progress = null;

        if (options && options.length > 0) {
            // Isi default value pertama
            row.status_progress = options[0];
        } else {
            // Tidak ada pilihan → kosongkan field
            row.status_progress = '';
        }
    }
    statusProgressOptionsMap: { [key: string]: string[] } = {
    '': [
        '',
    ],
    'Stock Procurement': [
        '',
    ],
    'USP - Free': [
        '',
    ],
    'USP - Booked': [
        '',
        'Booked As GS',
        'Booked As GTS',
        'Booked As Contract',
    ],
    'USJ - Pool': [
        '',
        'On Check',
        'Service Plan',
        'On Service At Pool',
        'Final QC',
        'Claim Insurance',
        'Plan Need Survey',
        'Plan Survey Done',
        'Renewal Document',
    ],
    'USJ - Bengkel': [
        '',
        'On Service',
        'Finish Service',
        'On Claim Insurance',
        'Finish Claim',
    ],
    // No entries for 'Stock Procurement' and 'USP - Free'
    };
    //#endregion condition DDL
}

