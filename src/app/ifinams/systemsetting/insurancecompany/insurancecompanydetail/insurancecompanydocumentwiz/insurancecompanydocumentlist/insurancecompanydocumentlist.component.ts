import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../.././../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { log } from 'util';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './insurancecompanydocumentlist.component.html'
})

export class InsurancecompanydocumentlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listinsurancecompanydocument: any = [];
  public insurancecompanydocumentData: any = [];
  public isButton: Boolean = false;
  public isBreak: Boolean = false;
  public tempFile: any;
  public listdataDoc: any = [];
  public lookupdoc: any = [];
  private tampDocumentCode: String;
  private base64textString: string;
  private date: any;
  private code: any;
  private dataTamp: any = [];
  private tamps = new Array();
  private tampss = new Array();
  private setStyle: any = [];
  private dataTampPush: any = [];
  private dataTampPush2: any = [];
  private tempFileSize: any;

  //rolecode
  private RoleAccessCode = 'R00021390000000A';

  //controller
  private APIController: String = 'MasterInsuranceDocument';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';
  private APIControllerSysGeneralDocument: String = 'SysGeneralDocument';
  private APIControllerDocumentMain: String = 'DocumentMain';

  //router
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForDelete: String = 'DELETE';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteLookupForInsuranceCompany: String = 'GetRowsLookupForInsuranceCompany';
  private APIRouteForUploadFile: String = 'Upload';
  private APIRouteForDeleteFile: String = 'Deletefile';
  private APIRouteForPriviewFile: String = 'Priview';

  // form 2 way binding
  model: any = {};

  // checklist
  public selectedAllLookup: any;
  public selectedAll: any;
  public checkedList: any = [];
  public checkedLookup: any = [];

  // spinner
  showSpinner: Boolean = true;
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
    this.callGetrowGlobalParam();
  }

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'first_last_numbers',
      'pageLength': 10,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_insurance_code': this.param
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listinsurancecompanydocument = parse.data;
          this.listinsurancecompanydocument.numberIndex = dtParameters.start;

          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

          // this.listdocumentbank = parse.data;
          this.showSpinner = false;

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 5] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region lookup document
  btnLookupDocument() {
    $('#datatableLookupDocument').DataTable().clear().destroy();
    $('#datatableLookupDocument').DataTable({
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
          'p_insurance_code': this.param
        });
        // end param tambahan untuk getrows dynamic

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralDocument, this.APIRouteLookupForInsuranceCompany).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupdoc = parse.data;
          this.lookupdoc.numberIndex = dtParameters.start;

          // if use checkAll use this
          $('#checkallLookup').prop('checked', false);
          // end checkall

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
    });
  }

  //#endregion lookup document

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

  //#region button save in list
  saveList() {
    this.listdataDoc = [];
    let i = 0;

    const getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    const getExp = $('[name="p_expired_date"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {
      if (getExp[i] === '') {
        getExp[i] = undefined;
      }
      this.listdataDoc.push(this.JSToNumberFloats({
        p_id: getID[i],
        p_expired_date: this.dateFomatList(getExp[i]),
      }));
      i++;
    }

    this.listdataDoc.p_file = [];
    // tslint:disable-next-line: no-shadowed-variable
    for (let i = 0; i < this.tamps.length; i++) {
      this.listdataDoc.p_file.push({
        p_module: 'IFINAMS',
        p_header: 'COMPANY_DOCUMENT',
        p_child: this.param,
        p_id: this.tamps[i].p_id,
        p_insurance_no: this.param,
        p_file_paths: this.tamps[i].p_id,
        p_file_name: this.tamps[i].filename,
        p_base64: this.tamps[i].base64
      });
    }

    this.showSpinner = true;
    //#region web service
    this.dalservice.Update(this.listdataDoc, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            if (this.listdataDoc.p_file.length <= 0) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              $('#datatabledoc').DataTable().ajax.reload();
            } else {
              this.dalservice.UploadFile(this.listdataDoc.p_file, this.APIController, this.APIRouteForUploadFile)
                .subscribe(
                  // tslint:disable-next-line:no-shadowed-variable
                  res => {
                    this.showSpinner = false;
                    this.tamps = new Array();
                    // tslint:disable-next-line:no-shadowed-variable
                    const parses = JSON.parse(res);
                    if (parses.result === 1) {
                      this.showSpinner = false;
                      this.showNotification('bottom', 'right', 'success');
                      $('#datatabledoc').DataTable().ajax.reload();
                    } else {
                      this.showSpinner = false;
                      this.swalPopUpMsg(parses.data);
                    }
                  },
                  error => {
                    this.showSpinner = false;
                    this.tamps = new Array();
                    // tslint:disable-next-line:no-shadowed-variable
                    const parses = JSON.parse(error);
                    this.swalPopUpMsg(parses.data);
                  });
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
    //#endregion web service

  }
  //#endregion button save in list

  //#region checkbox all lookup
  btnSelectAllLookup() {
    this.checkedLookup = [];
    for (let i = 0; i < this.lookupdoc.length; i++) {
      if (this.lookupdoc[i].selectedLookup) {
        this.checkedLookup.push(this.lookupdoc[i].code);
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

    this.dataTamp = [];
    for (let J = 0; J < this.checkedLookup.length; J++) {
      const codeData = this.checkedLookup[J];
      this.dataTamp.push({
        'p_insurance_code': this.param,
        'p_document_code': codeData,
      });
      // end param tambahan untuk getrow dynamic
    }

    this.dalservice.Insert(this.dataTamp, this.APIController, this.APIRouteForInsert)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            $('#datatabledoc').DataTable().ajax.reload();
            this.showNotification('bottom', 'right', 'success');
            setTimeout(function () {
              $('#datatableLookupDocument').DataTable().ajax.reload(null, false);
            }, 500);
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        })
  }

  selectAllLookup() {
    for (let i = 0; i < this.lookupdoc.length; i++) {
      this.lookupdoc[i].selectedLookup = this.selectedAllLookup;
    }
  }

  checkIfAllLookupSelected() {
    this.selectedAllLookup = this.lookupdoc.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion checkbox all table

  //#region checkbox all table
  btnDeleteAll() {
    this.isBreak = false;
    this.checkedList = [];
    for (let i = 0; i < this.listinsurancecompanydocument.length; i++) {
      if (this.listinsurancecompanydocument[i].selected) {
        this.checkedList.push({
          p_id: this.listinsurancecompanydocument[i].id,
          p_paths: this.listinsurancecompanydocument[i].paths,
          p_file_name: this.listinsurancecompanydocument[i].file_name
        });
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
    }).then(async (result) => {
      this.showSpinner = true;
      if (result.value) {
        this.dataTampPush = [];
        this.dataTampPush2 = [];
        for (let J = 0; J < this.checkedList.length; J++) {
          if (this.checkedList[J].p_paths === '') {
            // param tambahan untuk getrow dynamic
            this.dataTampPush = [{
              'p_id': this.checkedList[J].p_id,
            }];
            // end param tambahan untuk getrow dynamic
          } else {
            // param tambahan untuk getrow dynamic
            this.dataTampPush = [{
              'p_id': this.checkedList[J].p_id,
            }];
            // end param tambahan untuk getrow dynamic
            // param tambahan untuk getrow dynamic
            this.dataTampPush2 = [{
              'p_id': this.checkedList[J].p_id,
              'p_file_paths': this.checkedList[J].p_paths,
              'p_file_name': this.checkedList[J].p_file_name
            }];
            // end param tambahan untuk getrow dynamic
          }

          if (this.checkedList[J].p_paths === '') {
            this.dalservice.Delete(this.dataTampPush, this.APIController, this.APIRouteForDelete)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (J + 1 === this.checkedList.length) {
                      this.showSpinner = false;
                      this.showNotification('bottom', 'right', 'success');
                      $('#datatabledoc').DataTable().ajax.reload();
                    }
                  } else {
                    this.isBreak = true;
                    this.showSpinner = false;
                    $('#datatabledoc').DataTable().ajax.reload();
                    this.swalPopUpMsg(parse.data);
                  }
                },
                error => {
                  this.isBreak = true;
                  this.showSpinner = false;
                  const parse = JSON.parse(error);
                  this.swalPopUpMsg(parse.data)
                });
            if (this.isBreak) {
              break;
            }
          } else {
            await this.dalservice.Delete(this.dataTampPush2, this.APIController, this.APIRouteForDeleteFile)
              .toPromise().then(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    this.dalservice.Delete(this.dataTampPush, this.APIController, this.APIRouteForDelete)
                      .subscribe(
                        ress => {
                          const parses = JSON.parse(ress);
                          if (parses.result === 1) {
                            if (J + 1 === this.checkedList.length) {
                              this.showSpinner = false;
                              this.showNotification('bottom', 'right', 'success');
                              $('#datatabledoc').DataTable().ajax.reload();
                            }
                          } else {
                            this.isBreak = true;
                            this.showSpinner = false;
                            $('#datatabledoc').DataTable().ajax.reload();
                            this.swalPopUpMsg(parses.data);
                          }
                        },
                        error => {
                          this.isBreak = true;
                          this.showSpinner = false;
                          const parses = JSON.parse(error);
                          this.swalPopUpMsg(parses.data)
                        });
                  } else {
                    this.isBreak = true;
                    this.showSpinner = false;
                    this.swalPopUpMsg(parse.data);
                  }
                },
                error => {
                  this.isBreak = true;
                  this.showSpinner = false;
                  const parse = JSON.parse(error);
                  this.swalPopUpMsg(parse.data)
                });
            if (this.isBreak) {
              break;
            }
          }
        }
      } else {
        this.showSpinner = false;
      }
    });
  }


  selectAll() {
    for (let i = 0; i < this.listinsurancecompanydocument.length; i++) {
      this.listinsurancecompanydocument[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listinsurancecompanydocument.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox all table

  //#region getrow data
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

          this.tempFileSize = parsedata.value;

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region button select image
  onUpload(event, code: String) {
    const files = event.target.files;
    const file = files[0];

    if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
      $('#fileControl').val(undefined);
      this.tempFile = undefined;
      $('#datatabledoc').DataTable().ajax.reload();
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
      this.tempFile = files[0].name;
      this.tampDocumentCode = code;
    }
  }
  //#endregion button select image

  //#region expired date
  expiredDate(code: any, date: any) {
    this.code = code;
    this.date = date.target.value;
    this.tampss.push({
      p_id: this.code,
      p_expired_date: this.date
    });
  }
  //#endregion expired date

  //#region button priview image
  priviewFile(row1, row2) {
    this.showSpinner = true;
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_file_name: row1,
      p_file_paths: row2
    });

    this.dalservice.PriviewFile(usersJson, this.APIController, this.APIRouteForPriviewFile)
      .subscribe(
        (res) => {
          const parse = JSON.parse(res);

          if (parse.value.filename !== '') {
            const fileType = parse.value.filename.split('.').pop();
            if (fileType === 'PNG') {
              this.downloadFile(parse.value.data, parse.value.filename, fileType);
              // const newTab = window.open();
              // newTab.document.body.innerHTML = this.pngFile(parse.value.data);
              // this.showSpinner = false;
            }
            if (fileType === 'JPEG' || fileType === 'JPG') {
              this.downloadFile(parse.value.data, parse.value.filename, fileType);
              // const newTab = window.open();
              // newTab.document.body.innerHTML = this.jpgFile(parse.value.data);
              // this.showSpinner = false;
            }
            if (fileType === 'PDF') {
              this.downloadFile(parse.value.data, parse.value.filename, 'pdf');
              // const newTab = window.open();
              // newTab.document.body.innerHTML = this.pdfFile(parse.value.data);
              // this.showSpinner = false;
            }
            if (fileType === 'DOCX' || fileType === 'DOC') {
              this.downloadFile(parse.value.data, parse.value.filename, 'msword');
            }
            if (fileType === 'XLSX') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.ms-excel');
            }
            if (fileType === 'PPTX') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.ms-powerpoint');
            }
            if (fileType === 'TXT') {
              this.downloadFile(parse.value.data, parse.value.filename, 'txt');
            }
            if (fileType === 'ODT' || fileType === 'ODS' || fileType === 'ODP') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.oasis.opendocument');
            }
            if (fileType === 'ZIP') {
              this.downloadFile(parse.value.data, parse.value.filename, 'zip');
            }
            if (fileType === '7Z') {
              this.downloadFile(parse.value.data, parse.value.filename, 'x-7z-compressed');
            }
            if (fileType === 'RAR') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.rar');
            }
          }
        }
      );
  }
  downloadFile(base64: string, fileName: string, extention: string) {
    var temp = 'data:application/' + extention + ';base64,'
      + encodeURIComponent(base64);
    var download = document.createElement('a');
    download.href = temp;
    download.download = fileName;
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
    this.showSpinner = false;
  }

  //#endregion button priview image

  //#region button delete image
  deleteImage(file_name: any, code: String, paths: any) {
    this.showSpinner = true;
    const usersJson: any[] = Array.of();
    usersJson.push({
      'p_id': code,
      'p_file_paths': paths,
      'p_file_name': file_name
    });

    swal({
      allowOutsideClick: false,
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        this.dalservice.DeleteFile(usersJson, this.APIController, this.APIRouteForDeleteFile)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.data);
              }
              $('#datatabledoc').DataTable().ajax.reload();
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion button delete image

  //#region convert to base64
  handleFile(event) {
    this.showSpinner = true;
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);

    this.tamps.push({
      p_module: 'IFINAMS',
      p_header: 'COMPANY_DOCUMENT',
      p_child: this.tampDocumentCode,
      p_id: this.tampDocumentCode,
      p_file_paths: this.tampDocumentCode,
      p_file_name: this.tempFile,
      p_base64: this.base64textString
    });
    this.dalservice.UploadFile(this.tamps, this.APIController, this.APIRouteForUploadFile)
      .subscribe(
        res => {
          this.tamps = new Array();
          const parses = JSON.parse(res);
          if (parses.result === 1) {
            this.showSpinner = false;
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parses.value.data);
          }
          $('#datatabledoc').DataTable().ajax.reload();
        },
        error => {
          this.showSpinner = false;
          this.tamps = new Array();
          const parses = JSON.parse(error);
          this.swalPopUpMsg(parses.message);
          $('#datatabledoc').DataTable().ajax.reload();
        });
  }
  //#endregion convert to base64
}
