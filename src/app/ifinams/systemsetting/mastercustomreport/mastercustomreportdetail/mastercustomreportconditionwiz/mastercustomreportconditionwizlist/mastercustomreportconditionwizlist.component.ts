import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/map'
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './mastercustomreportconditionwizlist.component.html'
})

export class MasterCustomReportConditionWizListComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public listmasterreportcondition: any = [];
    public datauploadlist: any = [];
    public dataTamp: any = [];
    public uploadFile: any = [];
    public isDisplay: any = [];
    public tempFile: any;
    public id: any;
    public row1: any[];
    public row2: any[];
    public image: any[];
    public imageUrl: string;
    public description: any;
    private dataRoleTamp: any = [];
    private dataTampPush: any = [];
    public logical_operator: any;
    public comparison_operator: any;
    public idDetailList: string;
    public readOnlyListDetail: string;
    public listdataDetail: any = [];
    public lookupColumnName: any = [];
    private tamps = new Array();
    private base64textString: string;
    private tampDocumentCode: String;
    private idDetailForReason: any;

    //controller
    private APIController: String = 'MasterCustomReportCondition';
    private APIControllerHeader: String = 'MasterCustomReport';
    private APIControllerColumnName: String = 'MasterCustomReportColumn';
    private APIControllerReconCategoryStep: String = 'MasterReconCategoryStep';
    private APIControllerDetail: String = 'MaintenanceDetail';

    //routing
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForDelete: String = 'DELETE';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForGetRow: String = 'GETROW';
    private APIRouteForUploadFile: String = 'Upload';
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForOrderUp: String = 'ExecSpForOrderKeyUp';
    private APIRouteForOrderDown: String = 'ExecSpForOrderKeyDown';
    private APIRouteForUpdateColumn: String = 'UpdateDataColumn';
    private RoleAccessCode = 'R00021280000000A';

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
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide('', this._elementRef, this.route);
        this.loadData();
        this.callGetrowHeader();
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
                    'p_custom_report_code': this.param,
                })
                // end param tambahan untuk getrows dynamic

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    for (let i = 0; i < parse.data.length; i++) {
                        this.listmasterreportcondition = parse.data;
                    }

                    this.listmasterreportcondition = parse.data;

                    if (parse.data != null) {
                        this.listmasterreportcondition.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
            order: [['7', 'asc']],
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
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [this.JSToNumberFloats({
            'p_custom_report_code': this.param,
            'p_logical_operator': '',
            'p_column_name': '',
            'p_comparison_operator': '',
            'p_start_value': '',
            'p_end_value': '',
        })];

        // param tambahan untuk getrole dynamic
        this.dalservice.Insert(this.dataRoleTamp, this.APIController, this.APIRouteForInsert)
            .subscribe(
                res => {
                    this.showSpinner = false;
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {
                        this.route.navigate(['/systemsetting/submastercustomreportlist/mastercustomreportdetail/' + parse.id + '/masterreportcustomcondition', parse.id]);
                        $('#datatableMasterReportCondition').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
    }
    //#endregion button add

    //#region button save in list
    // btnSaveList() {

    //     this.uploadFile = [];
    //     this.showSpinner = true;
    //     this.datauploadlist = [];
    //     let j = 0;

    //     const getID = $('[name="p_id_cond"]')
    //         .map(function () { return $(this).val(); }).get();

    //     const getDescription = $('[name="p_column_name"]')
    //         .map(function () { return $(this).val(); }).get();

    //     const getStartValue = $('[name="p_start_value"]')
    //         .map(function () { return $(this).val(); }).get();

    //     const getEndValue = $('[name="p_end_value"]')
    //         .map(function () { return $(this).val(); }).get();

    //     const getLogicalOperator = $('[name="p_logical_operator"]')
    //         .map(function () { return $(this).val(); }).get();

    //     const getComparisonOperator = $('[name="p_comparison_operator"]')
    //         .map(function () { return $(this).val(); }).get();

    //     while (j < getID.length) {

    //         while (j < getDescription.length) {

    //             while (j < getStartValue.length) {

    //                 while (j < getEndValue.length) {

    //                     while (j < getLogicalOperator.length) {

    //                         while (j < getComparisonOperator.length) {
    //                             this.datauploadlist.push(
    //                                 {
    //                                     p_id: getID[j],
    //                                     p_custom_report_code: this.param,
    //                                     p_column_name: getDescription[j],
    //                                     p_start_value: getStartValue[j],
    //                                     p_end_value: getEndValue[j],
    //                                     p_logical_operator: getLogicalOperator[j],
    //                                     p_comparison_operator: getComparisonOperator[j]
    //                                 });
    //                             j++;
    //                         }
    //                         j++

    //                     }
    //                     j++

    //                 }
    //                 j++
    //             }
    //             j++
    //         }
    //         j++;
    //     }
    //     this.dalservice.Update(this.datauploadlist, this.APIController, this.APIRouteForUpdate)
    //         .subscribe(
    //             res => {
    //                 this.showSpinner = false;

    //                 const parse = JSON.parse(res);

    //                 if (parse.result === 1) {
    //                     if (this.tamps.length > 0) {
    //                         for (let i = 0; i < this.tamps.length; i++) {
    //                             this.uploadFile.push({
    //                                 p_header: 'PHOTO',
    //                                 p_child: this.param,
    //                                 p_company_code: this.company_code,
    //                                 p_id: this.tampDocumentCode,
    //                                 p_file_paths: this.param,
    //                                 p_file_name: this.tempFile,
    //                                 p_base64: this.base64textString
    //                             });
    //                         }

    //                         this.dalservice.UploadFile(this.uploadFile, this.APIController, this.APIRouteForUploadFile)
    //                             .subscribe(
    //                                 res => {
    //                                     const parse = JSON.parse(res);
    //                                     if (parse.result === 1) {
    //                                         this.showSpinner = false;
    //                                         this.showNotification('bottom', 'right', 'success');
    //                                         $('#datatableMasterReportCondition').DataTable().ajax.reload();
    //                                         this.tamps = [];
    //                                     } else {
    //                                         this.swalPopUpMsg(parse.data);
    //                                     }
    //                                 },
    //                                 error => {
    //                                     this.showSpinner = false;
    //                                     const parse = JSON.parse(error);
    //                                     this.swalPopUpMsg(parse.data);
    //                                 });
    //                     } else {
    //                         this.showNotification('bottom', 'right', 'success');
    //                         $('#datatableMasterReportCondition').DataTable().ajax.reload();
    //                     }
    //                 } else {
    //                     this.swalPopUpMsg(parse.data);
    //                 }
    //             },
    //             error => {
    //                 this.showSpinner = false;
    //                 const parse = JSON.parse(error);
    //                 this.swalPopUpMsg(parse.data);
    //             });
    // }
    //#endregion button save in list

    //#region button save list
    btnSaveList() {
        this.datauploadlist = [];

        var j = 0;

        const getID = $('[name="p_id_cond"]')
            .map(function () { return $(this).val(); }).get();

        const getStartValue = $('[name="p_start_value"]')
            .map(function () { return $(this).val(); }).get();

        const getEndValue = $('[name="p_end_value"]')
            .map(function () { return $(this).val(); }).get();

        const getLogicalOperator = $('[name="p_logical_operator"]')
            .map(function () { return $(this).val(); }).get();

        const getComparisonOperator = $('[name="p_comparison_operator"]')
            .map(function () { return $(this).val(); }).get();

        while (j < getID.length) {

            while (j < getStartValue.length) {

                while (j < getEndValue.length) {

                    while (j < getLogicalOperator.length) {

                        while (j < getComparisonOperator.length) {
                            this.datauploadlist.push(
                                this.JSToNumberFloats({
                                    p_id: getID[j],
                                    p_custom_report_code: this.param,
                                    p_start_value: getStartValue[j],
                                    p_end_value: getEndValue[j],
                                    p_logical_operator: getLogicalOperator[j],
                                    p_comparison_operator: getComparisonOperator[j]
                                })
                            );
                            j++;
                        }
                        j++

                    }
                    j++

                }
                j++
            }
            j++
        }

        //#region web service
        this.dalservice.Update(this.datauploadlist, this.APIController, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatableMasterReportCondition').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);

                });
        //#endregion web service

    }
    //#endregion button save list

    //#region checkbox all table
    btnDeleteAll() {
        this.checkedList = [];
        for (let i = 0; i < this.listmasterreportcondition.length; i++) {
            if (this.listmasterreportcondition[i].selected) {
                this.checkedList.push(this.listmasterreportcondition[i].id_cond);
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
                                        $('#datatableMasterReportCondition').DataTable().ajax.reload();
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
        for (let i = 0; i < this.listmasterreportcondition.length; i++) {
            this.listmasterreportcondition[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listmasterreportcondition.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion checkbox all table

    //#region Header getrow data
    callGetrowHeader() {
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param,
        }]
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIControllerHeader, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    // const parsedata = parse.data[0];
                    const parsedata = this.getrowNgb(parse.data[0]);

                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui
                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion BatchDetail getrow data

    //#region ddl logical_operator
    // LogicalOperator(status: any, id: any) {

    //     this.idDetailList = id;

    //     this.readOnlyListDetail = status.target.value;

    //     this.listdataDetail = [];

    //     var i = 0;

    //     const getID = $('[name="p_id_cond"]')
    //         .map(function () { return $(this).val(); }).get();

    //     const getLogicalOperator = $('[name="p_logical_operator"]')
    //         .map(function () { return $(this).val(); }).get();

    //     while (i < getID.length) {

    //         while (i < getLogicalOperator.length) {

    //             this.datauploadlist.push(
    //                 {
    //                     p_id: getID[i],
    //                     p_logical_operator: getLogicalOperator[i],
    //                 });
    //             i++;
    //         }
    //         i++;
    //     }
    //     this.dalservice.Update(this.listdataDetail, this.APIController, this.APIRouteForUpdate)
    //         .subscribe(
    //             res => {
    //                 const parse = JSON.parse(res);
    //                 if (parse.result === 1) {
    //                     $('#datatableMasterReportCondition').DataTable().ajax.reload();
    //                 } else {
    //                     this.swalPopUpMsg(parse.data);
    //                 }
    //             },
    //             error => {
    //                 this.showSpinner = false;
    //                 const parse = JSON.parse(error);
    //                 this.swalPopUpMsg(parse.data);
    //             });
    // }
    //#endregion ddl logical_operator

    //#region ddl comparison_operator
    // ComparasionOperator(status: any, id: any) {

    //     this.idDetailList = id;

    //     this.readOnlyListDetail = status.target.value;

    //     this.listdataDetail = [];

    //     var i = 0;

    //     const getID = $('[name="p_id_cond"]')
    //         .map(function () { return $(this).val(); }).get();

    //     const getComparisonOperator = $('[name="p_comparison_operator"]')
    //         .map(function () { return $(this).val(); }).get();

    //     while (i < getID.length) {

    //         while (i < getComparisonOperator.length) {

    //             this.datauploadlist.push(
    //                 {
    //                     p_id: getID[i],
    //                     p_comparison_operator: getComparisonOperator[i],

    //                 });
    //             i++;

    //         }
    //         i++;
    //     }

    //     this.dalservice.Update(this.listdataDetail, this.APIController, this.APIRouteForUpdate)
    //         .subscribe(
    //             res => {
    //                 const parse = JSON.parse(res);
    //                 if (parse.result === 1) {
    //                     $('#datatableMasterReportCondition').DataTable().ajax.reload();
    //                 } else {
    //                     this.swalPopUpMsg(parse.data);
    //                 }
    //             },
    //             error => {
    //                 this.showSpinner = false;
    //                 const parse = JSON.parse(error);
    //                 this.swalPopUpMsg(parse.data);
    //             });
    // }
    //#endregion ddl comparison_operator

    //#region ColumnName Lookup
    btnLookupColumnName(id: any) {
        $('#datatableLookupColumnName').DataTable().clear().destroy();
        $('#datatableLookupColumnName').DataTable({
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
                    'p_company_code': this.company_code,
                    'p_custom_report_code': this.param,
                });
                this.dalservice.Getrows(dtParameters, this.APIControllerColumnName, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupColumnName = parse.data;
                    if (parse.data != null) {
                        this.lookupColumnName.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    })
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });

        this.idDetailForReason = id;

    }

    btnSelectRowColumnName(column_name: String) {

        this.listdataDetail = [];

        var i = 0;

        var getID = $('[name="p_id_cond"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {

            if (getID[i] == this.idDetailForReason) {

                this.listdataDetail.push({
                    p_id: getID[i],
                    p_custom_report_code: this.param,
                    p_column_name: column_name
                });
            }

            i++;
        }
        //#region web service
        this.dalservice.Update(this.listdataDetail, this.APIController, this.APIRouteForUpdateColumn)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        $('#datatableMasterReportCondition').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service
        $('#lookupModalColumnName').modal('hide');
    }
    //#endregion ColumnName Lookup

    //#region btn order up
    btnOrderUp(code: any) {
        this.showSpinner = true;
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
                        $('#datatableMasterReportCondition').DataTable().ajax.reload();
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
        this.showSpinner = true;
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
                        $('#datatableMasterReportCondition').DataTable().ajax.reload();
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


