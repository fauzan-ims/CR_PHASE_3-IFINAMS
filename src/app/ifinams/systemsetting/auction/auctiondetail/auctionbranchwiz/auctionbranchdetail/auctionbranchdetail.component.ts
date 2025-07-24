import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './auctionbranchdetail.component.html'
})

export class AuctionbranchdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public auctionbranchData: any = [];
  public isReadOnly: Boolean = false;
  public lookupbranch: any = [];
  public lookupcurrency: any = [];
  private rolecode: any = [];
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private APIController: String = 'MasterAuctionBranch';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRole: String = 'ExecSpForGetRole';
  private RoleAccessCode = 'R00023800000001A';

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
    if (this.params != null) {
      this.isReadOnly = true;
      this.wizard();

      // call web service
      this.callGetrow();
    } else {
      this.showSpinner = false;
    }
  }

  //#region auctionBranchDetail getrow data
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_id': this.params,
    }];
    // end param tambahan untuk getrow dynamics
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
  //#endregion auctionBranchDetail getrow data

  //#region auctionBranchDetail form submit
  onFormSubmit(auctionbranchForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        title: 'Warning',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
    }

    this.auctionbranchData = auctionbranchForm;
    const usersJson: any[] = Array.of(this.auctionbranchData);

    if (this.params != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parseBranch = JSON.parse(res);
            if (parseBranch.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.callGetrow();
              $('#auctionDetail', parent.parent.document).click();
            } else {
              this.swalPopUpMsg(parseBranch.data);
            }
          },
          error => {
            const parseBranch = JSON.parse(error);
            this.swalPopUpMsg(parseBranch.data);
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parseBranch = JSON.parse(res);
            if (parseBranch.result === 1) {
              this.route.navigate(['/systemsetting/subauctionlist/auctiondetail/' + this.param + '/auctionbranchlist/' + this.param + '/auctionbranchdetail', this.param, parseBranch.id], { skipLocationChange: true });
              this.showNotification('bottom', 'right', 'success');
              $('#auctionDetail', parent.parent.document).click();
            } else {
              this.swalPopUpMsg(parseBranch.data);
            }
          },
          error => {
            const parseBranch = JSON.parse(error);
            this.swalPopUpMsg(parseBranch.data);
          });
    }
  }
  //#endregion auctionBranchDetail form submit

  //#region auctionBranchDetail button back
  btnBack() {
    this.route.navigate(['/systemsetting/subauctionlist/auctiondetail/' + this.param + '/auctionbranchlist', this.param], { skipLocationChange: true });
    $('#datatableAuctionBranchWiz').DataTable().ajax.reload();
  }
  //#endregion auctionBranchDetail button back

  //#region auctionBranchDetail Lookup
  btnLookupBranch() {
    $('#datatableLookupBranch').DataTable().clear().destroy();
    $('#datatableLookupBranch').DataTable({
      'pagingType': 'full_numbers',
      'processing': true,
      'serverSide': true,
      responsive: true,
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'default': ''
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbranch = parse.data;
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      'lengthMenu': [
        [5, 25, 50, 100],
        [5, 25, 50, 100]
      ],
      columnDefs: [{ orderable: false, width: '5%', targets: [3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowBranch(branch_code: String, branch_desc: string) {
    this.model.branch_code = branch_code;
    this.model.branch_name = branch_desc;
    $('#lookupModalBranch').modal('hide');
  }
  //#endregion auctionBranchDetail lookup

}


