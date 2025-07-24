import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './sppadetail.component.html'
})

export class SppadetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public sppaData: any = [];
  public listsppadetail: any = [];
  public isReadOnly: Boolean = false;
  public isButton: Boolean = false;
  public tempFile: any;
  public tampHidden: Boolean;
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private base64textString: string;
  private dataTampPush: any = [];
  private tamps = new Array();
  private setStyle: any = [];
  private tempFileSize: any;

  //controller
  private APIController: String = 'SppaMain';
  private APIControllerSppaDetail: String = 'SppaDetail';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';

  //router
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForUpdatePrint: String = 'UpdatePrint';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForUploadFile: String = 'ExecSpForSppaGetUpload';
  private APIRouteForSend: String = 'ExecSpForGetSend';
  private APIRouteForPost: String = 'ExecSpForGetPost';
  private APIRouteForCancel: String = 'ExecSpForGetCancel';
  private APIRouteForReturn: String = 'ExecSpForGetReturn';
  private APIRouteForPrint: String = 'PrintFile';
  private RoleAccessCode = 'R00022080000000A';

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

  // checklist
  public selectedAllTable: any;
  public checkedList: any = [];

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef, private datePipe: DatePipe
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.callGetrowGlobalParam();
      this.loadData();
    } else {
      this.showSpinner = false;
      this.tampHidden = true;
    }
  }

  //#region  set datepicker
  getStyles(isTrue: Boolean) {
    if (isTrue) {
      this.setStyle = {
        'pointer-events': 'none',
      }
    } else {
      this.setStyle = {
        'pointer-events': 'auto',
      }
    }

    return this.setStyle;
  }
  //#endregion  set datepicker

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/registration/subsppalist/sppadetailresult', this.param, codeEdit]);
  }
  //#endregion button edit

  //#region button Send
  btnSend(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_code': code,
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
        this.showSpinner = true;
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForSend)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
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
      } else {
        this.showSpinner = false;
      }
    })
  }

  //#endregion button Send

  //#region button Post
  btnPost(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_code': code,
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
      this.showSpinner = true;
      if (result.value) {
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPost)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
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
      } else {
        this.showSpinner = false;
      }
    })
  }
  //#endregion button Post

  //#region button Cancel
  btnCancel(code: string) {
    this.showSpinner = true;
    // param tambahan untuk button Done dynamic
    this.dataRoleTamp = [{
      'p_code': code,
    }];
    // param tambahan untuk button Done dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancel)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
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
      } else {
        this.showSpinner = false;
      }
    })
  }

  //#endregion button Cancel

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
          'p_sppa_code': this.param
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerSppaDetail, this.APIRouteForGetRows).subscribe(resp => {
          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

          const parse = JSON.parse(resp)
          this.listsppadetail = parse.data;
          this.listsppadetail.numberIndex = dtParameters.start;

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      order: [[1, 'asc']],
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 9] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region Delete data
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listsppadetail.length; i++) {
      if (this.listsppadetail[i].selectedTable) {
        this.checkedList.push(this.listsppadetail[i].id);
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
        for (let J = 0; J < this.checkedList.length; J++) {
          const codeData = this.checkedList[J];
          // param tambahan untuk getrow dynamic
          this.dataTampPush = [{
            'p_id': codeData
          }];
          // end param tambahan untuk getrow dynamic
          this.dalservice.Delete(this.dataTampPush, this.APIControllerSppaDetail, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatables').DataTable().ajax.reload();
                  }
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
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listsppadetail.length; i++) {
      this.listsppadetail[i].selectedTable = this.selectedAllTable;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAllTable = this.listsppadetail.every(function (item: any) {
      return item.selectedTable === true;
    })
  }
  //#endregion checkbox all table

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
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.paths === '' || parsedata.paths === null) {
            this.tampHidden = true;
          } else {
            this.tampHidden = false;
          }

          // checkbox
          if (parsedata.is_base === '1') {
            parsedata.is_base = true;
          } else {
            parsedata.is_base = false;
          }
          // end checkbox

          if (parsedata.sppa_status !== 'HOLD') {
            this.isButton = true;
          } else {
            this.isButton = false;
          }

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

  //#region callGetrowGlobalParam
  callGetrowGlobalParam() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': 'FUPS'
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIControllerSysGlobalparam, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.tempFileSize = parsedata.value

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion callGetrowGlobalParam

  //#region form submit
  onFormSubmit(sppaForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        title: 'Warning!',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid!!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
    }

    this.sppaData = this.JSToNumberFloats(sppaForm);
    const usersJson: any[] = Array.of(this.sppaData);
    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.callGetrow();
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
      // call web service

      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/registration/subsppalist/sppadetail', parse.code]);
            } else {
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });
    }
  }
  //#endregion form submit

  //#region btnDownload
  btnPrint() {
    this.showSpinner = true;
    const dataParam = [
      {
        'p_code': this.param
      }
    ];
    this.dalservice.Update(dataParam, this.APIController, this.APIRouteForUpdatePrint).subscribe(
      ress => {
        this.showSpinner = false;
        const parse = JSON.parse(ress);

        this.dalservice.DownloadFileWithData(dataParam, this.APIController, this.APIRouteForPrint).subscribe(res => {

          var contentDisposition = res.headers.get('content-disposition');

          var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

          const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          var link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          this.showSpinner = false;

        }, err => {
          this.showSpinner = false;
          const parse = JSON.parse(err);
          this.swalPopUpMsg(parse.data);
        });
      },
      error => {
        this.showSpinner = false;
        const parse = JSON.parse(error);
        this.swalPopUpMsg(parse.data);
      });
  }
  // #endregion btnDownload

  //#region upload excel reader
  handleFile(event) {
    this.tamps = []
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);
    this.tamps.push({
      p_module: 'IFINAMS',
      p_sppa_code: this.param,
      filename: this.tempFile,
      p_header: 'SPPA',
      p_child: this.param,
      base64: this.base64textString
    });
  }

  onUploadReader(event) {
    const files = event.target.files;
    const file = files[0];

    if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
      // $('#datatableReceiveDetail').DataTable().ajax.reload();
    } else {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        // tslint:disable-next-line:no-shadowed-variable
        reader.onload = (event) => {
          reader.onload = this.handleFile.bind(this);
          reader.readAsBinaryString(file);
        }
      }
    }
    this.tempFile = files[0].name;
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this._deleteconf,
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {

        this.dalservice.UploadFile(this.tamps, this.APIControllerSppaDetail, this.APIRouteForUploadFile)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                $('#fileControl').val(undefined);
                this.tempFile = '';
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                $('#datatables').DataTable().ajax.reload();

              } else {
                this.swalPopUpMsg(parse.data);
                $('#fileControl').val(undefined);
                this.tempFile = '';
              }
            }, error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);
              $('#fileControl').val(undefined);
              this.tempFile = '';
            });
      } else {
        this.showSpinner = false;
        $('#fileControl').val(undefined);
        this.tempFile = '';
      }
    })
  }
  //#endregion button select image

  //#region button back
  btnBack() {
    $('#datatable').DataTable().ajax.reload();
    this.route.navigate(['/registration/subsppalist']);
  }
  //#endregion button back

  //#region btnLookupBranch
  btnLookupBranch() {
    // this.route.navigate(['/registration/subsppalist']);
  }
  //#endregion btnLookupBranch

  //#region btnLookupInsurance
  btnLookupInsurance() {
    // this.route.navigate(['/registration/subsppalist']);
  }
  //#endregion btnLookupInsurance

  //#region btnReturn
  btnReturn() {
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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForReturn)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.ngOnInit();
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
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
  //#endregion btnReturn

  //#region button print sppa with
  btnPrintSppaWith() {
    this.showSpinner = true;
    const dataParam = {
    TableName: 'RPT_SPPA_WITH_PAYMENT_STATUS',
    SpName: 'xsp_rpt_sppa_with_payment_status',
    reportparameters: {
        p_user_id: this.userId,
        p_code: this.param,
        p_sppa_no: this.model.code,
        p_print_option: 'PDF'
    }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
    this.printRptNonCore(res);
    this.showSpinner = false;
    }, err => {
    this.showSpinner = false;
    const parse = JSON.parse(err);
    this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion button print sppa with

  //#region button print sppa without
  btnPrintSppaWithOut() {
    this.showSpinner = true;
    const dataParam = {
    TableName: 'RPT_SPPA_WITHOUT_PAYMENT_STATUS',
    SpName: 'xsp_rpt_sppa_without_payment_status',
    reportparameters: {
        p_user_id: this.userId,
        p_code: this.param,
        p_sppa_no: this.model.code,
        p_print_option: 'PDF'
    }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
    this.printRptNonCore(res);
    this.showSpinner = false;
    }, err => {
    this.showSpinner = false;
    const parse = JSON.parse(err);
    this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion button print sppa without
}
