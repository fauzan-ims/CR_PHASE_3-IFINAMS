import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../../base.component';
import { DALService } from '../../../../../../DALservice.service';

@Component({
  selector: 'app-endorsementloadingdetail',
  templateUrl: './endorsementloadingdetail.component.html'
})
export class EndorsementloadingdetailComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  paramss = this.getRouteparam.snapshot.paramMap.get('id3');
  paramsss = this.getRouteparam.snapshot.paramMap.get('id4');

  // variable
  public endorsementloadingData: any = [];
  public lookupagremeent: any = [];
  public lookuploading: any = [];
  public isReadOnly: Boolean = false;
  public NumberOnlyPattern = this._numberonlyformat;
  private APIController: String = 'EndorsementLoading';
  private APIControllerMasterCoverageLoading: String = 'MasterCoverageLoading';
  private APIRouteForlookuploading: String = 'GetRowsForLookup';
  private APIRouteForInsert: String = 'INSERT';
  private RoleAccessCode = 'R00022000000000A';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
  // end

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.isReadOnly = true;
    this.model.agreement_external_no = this.params;
    this.model.client_name = this.paramss;
  }

  //#region form submit
  onFormSubmit(endorsementloadingForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        title: 'Warning',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
    }

    this.endorsementloadingData = endorsementloadingForm;
    this.endorsementloadingData.p_initial_buy_rate = '0';
    this.endorsementloadingData.p_initial_sell_rate = '0';
    this.endorsementloadingData.p_initial_buy_amount = '0';
    this.endorsementloadingData.p_initial_sell_amount = '0';
    this.endorsementloadingData.p_total_buy_amount = '0';
    this.endorsementloadingData.p_total_sell_amount = '0';
    this.endorsementloadingData.p_old_or_new = 'NEW';
    const usersJson: any[] = Array.of(this.endorsementloadingData);
    // call web service
    this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            this.showNotification('bottom', 'right', 'success');
            this.route.navigate(['/registration/subendorsementlist/endorsementloadingdetail', this.param, this.params, this.paramss, this.paramsss, parse.id]);
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
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/registration/subendorsementlist/endorsementdetail', this.param]);
  }
  //#endregion button back

  //#region Loading lookup
  btnLookupLoading() {
    $('#datatableLookupLoading').DataTable().clear().destroy();
    $('#datatableLookupLoading').DataTable({
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
          'default': ''
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterCoverageLoading, this.APIRouteForlookuploading).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookuploading = parse.data;
          if (parse.data != null) {
            this.lookuploading.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowLoading(code: String, loading_name: string) {
    this.model.loading_code = code;
    this.model.loading_name = loading_name;
    $('#lookupModalLoading').modal('hide');
  }
  //#endregion coverage lookup

}
