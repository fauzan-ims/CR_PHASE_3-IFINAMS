import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../base.component';
import { DALService } from '../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './spafassetlist.component.html'
})

export class SpafassetlistComponent extends BaseComponent implements OnInit {
    // variable
    public listspafasset: any = [];
    private dataTamp: any = [];
    public tampStatus: String;
    public setStyle: any = [];
    public datauploadlist: any = [];

    private dataTampPush: any = [];

    //controller
    private APIController: String = 'SpafAsset';
    //router

    // API Function
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForUpdateItem: String = 'Update';
    private APIRouteForUpdateSubvention: String = 'UpdateForSubvention';
    private APIRouteForUpdateReceiptDate: String = 'UpdateForReceiptDate';

    //private APIRouteForProceed: String = 'ExecSpForGetProceedPaymentRequest';
    private RoleAccessCode = 'R00023980000001A';

    // checklist
    public selectedAll: any;
    public checkedList: any = [];

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
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide(this._location, this._elementRef, this.route);
        this.tampStatus = 'HOLD';
        this.loadData();
    }

    //#region ddl PageStatus
    PageStatus(event: any) {
        this.tampStatus = event.target.value;
        $('#datatablespafassetlist').DataTable().ajax.reload();
    }
    //#endregion ddl PageStatus

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
                    'p_validation_status': this.tampStatus
                });
                // end param tambahan untuk getrows dynamic
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)

                    this.listspafasset = parse.data;
                    if (parse.data != null) {
                        this.listspafasset.numberIndex = dtParameters.start;
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
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region Proceed
    //   btnProceed() {
    //     this.checkedList = [];
    //     for (let i = 0; i < this.listpaymentrequest.length; i++) {
    //       if (this.listpaymentrequest[i].selected) {
    //         this.checkedList.push(this.listpaymentrequest[i].code);
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

    //     this.dataTampPush = [];
    //     for (let J = 0; J < this.checkedList.length; J++) {
    //       const code = this.checkedList[J];
    //       // param tambahan untuk getrow dynamic
    //       this.dataTampPush.push({
    //         'p_code': code,
    //         'p_document_type': this.tampStatus

    //       });
    //       // end param tambahan untuk getrow dynamic
    //     }

    //     swal({
    //       title: 'Are you sure?',
    //       type: 'warning',
    //       showCancelButton: true,
    //       confirmButtonClass: 'btn btn-success',
    //       cancelButtonClass: 'btn btn-danger',
    //       confirmButtonText: this._deleteconf,
    //       buttonsStyling: false
    //     }).then((result) => {
    //       this.showSpinner = true;
    //       if (result.value) {
    //         this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteForProceed)
    //           .subscribe(
    //             res => {
    //               const parse = JSON.parse(res);
    //               if (parse.result === 1) {
    //                 this.showSpinner = false;
    //                 this.showNotification('bottom', 'right', 'success');
    //                 $('#datatablepaymentrequestlist').DataTable().ajax.reload();
    //               } else {
    //                 this.showSpinner = false;
    //                 this.swalPopUpMsg(parse.data);
    //               }
    //             },
    //             error => {
    //               this.showSpinner = false;
    //               const parse = JSON.parse(error);
    //               this.swalPopUpMsg(parse.data);
    //             })
    //       }
    //       else {
    //         this.showSpinner = false;
    //       }
    //     });
    //   }

    selectAllTable() {
        for (let i = 0; i < this.listspafasset.length; i++) {
            this.listspafasset[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listspafasset.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion Proceed

    //#region spafreceiptno
    spafreceiptno(event, id) {
        // param tambahan untuk update dynamic
        this.dataTamp = [{
            'p_code': id,
            'p_spaf_receipt_no': event.target.value,
            'p_subvention_receipt_no': event.target.value
        }];
        // end param tambahan untuk update dynamic
        // call web service
        this.dalservice.Update(this.dataTamp, this.APIController, this.APIRouteForUpdateItem)
            .subscribe(
                res => {
                    this.showSpinner = false;
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatablespafassetlist').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data)
                });
    }
    //#endregion spafreceiptno

    //#region subventionreceiptno
    subventionreceiptno(event, id) {
        // param tambahan untuk update dynamic
        this.dataTamp = [{
            'p_code': id,
            'p_subvention_receipt_no': event.target.value
        }];
        // end param tambahan untuk update dynamic
        // call web service
        this.dalservice.Update(this.dataTamp, this.APIController, this.APIRouteForUpdateSubvention)
            .subscribe(
                res => {
                    this.showSpinner = false;
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatablespafassetlist').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data)
                });
    }
    //#endregion subventionreceiptno

    //#region button save in list
    btnSaveList() {
        this.showSpinner = true;
        this.datauploadlist = [];
        let j = 0;

        const getID = $('[name="p_code"]')
            .map(function () { return $(this).val(); }).get();

        const getdate = $('[name="p_receipt_date"]')
            .map(function () { return $(this).val(); }).get();


        while (j < getID.length) {
            while (j < getdate.length) {
                let date = null
                if (getdate[j] !== "") {
                    date = this.dateFomatList(getdate[j]);
                }
                this.datauploadlist.push(
                    {
                        p_code: getID[j],
                        p_receipt_date: date,
                    }
                );
                j++
            }
            j++;
        }
        //#region web service
        this.dalservice.Update(this.datauploadlist, this.APIController, this.APIRouteForUpdateReceiptDate)
            .subscribe(
                res => {
                    this.showSpinner = false;
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.showSpinner = false;
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatablespafassetlist').DataTable().ajax.reload();
                    } else {
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

    //#region getStyles
    getStyles(isTrue: Boolean) {
        if (isTrue) {
            this.setStyle = {
                'pointer-events': 'none',
            }
        } else {
            this.setStyle = {
                'pointer-events': 'unset',
            }
        }

        return this.setStyle;
    }
    //#endregion getStyles
}
