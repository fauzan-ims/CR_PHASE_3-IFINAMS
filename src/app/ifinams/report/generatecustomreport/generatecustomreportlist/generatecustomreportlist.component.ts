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
    templateUrl: './generatecustomreportlist.component.html'
})

export class GenerateCustomReportListComponent extends BaseComponent implements OnInit {
    // variable
    public lookupreport: any            = [];
    private dataRoleTamp: any           = [];
    public tampStatus: String;
    private APIController: String       = 'MasterCustomReport';
    private APIRouteForGetRows: String  = 'GetRowsForLookup';
    private APIRouteForPrint: String    = 'PrintFile';
    private RoleAccessCode              = 'R00022250000000A';

    // spinner
    showSpinner: Boolean = false;
    // end

    // form 2 way binding
    model: any = {};

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,
        private _location: Location,
        public route: Router,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.model.table_name = '-';
    }

    //#region ddl master module
    PageStatus(event: any) {
        this.tampStatus = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl master module

    //#region lookup report
    btnLookupReport() {
        $('#datatableLookupReport').DataTable().clear().destroy();
        $('#datatableLookupReport').DataTable({
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
                    'p_company_code': this.company_code
                });
                // end param tambahan untuk getrows dynamic 
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupreport = parse.data;

                    if (parse.data != null) {
                        this.lookupreport.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [1, 3] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }
    btnSelectRowReport(code: string, name: String) {
        this.model.custom_report_code = code;
        this.model.table_name = name;
        $('#lookupModalReport').modal('hide');
    }
    //#endregion lookup report

    //#region btnPrint
    btnPrint() {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
            'p_custom_report_code': this.model.custom_report_code,
            'action': 'default'
        }];        
        // param tambahan untuk getrole dynamic

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
                this.showSpinner = true;
                this.dalservice.DownloadFileWithData(this.dataRoleTamp, this.APIController, this.APIRouteForPrint).subscribe(res => {

                    this.showSpinner = false;
                    var contentDisposition = res.headers.get('content-disposition');
                    var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
    
                    const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = window.URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    link.click();
                    // window.open(url);
                }, err => {
                    this.showSpinner = false;
                    const parse = JSON.parse(err);
                    this.swalPopUpMsg(parse.data);
                });
            } else {
                this.showSpinner = false;
            }
        })
    }
    // #endregion btnPrint

}


