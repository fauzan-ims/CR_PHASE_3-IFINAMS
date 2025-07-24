import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
// tslint:disable-next-line:max-line-length
import { DALService } from '../../../DALservice.service';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { Transaction } from './transaction.routing';
import { DisposalListComponent } from './disposal/disposallist/disposallist.component';
import { DisposaldetailComponent } from './disposal/disposaldetail/disposaldetail.component';
import { DisposalDetailModule } from './disposal/disposaldetail/disposaldetaildetailwiz/disposaldetaildetailwiz.module';
import { DisposalDocumentModule } from './disposal/disposaldetail/disposaldocumentwiz/disposaldocumentwiz.module';
import { MutationlListComponent } from './mutation/mutationlist/mutationlist.component';
import { MutationDetailComponent } from './mutation/mutationdetail/mutationdetail.component';
import { MutationDetailModule } from './mutation/mutationdetail/mutationdetaildetailwiz/mutationdetaildetailwiz.module';
import { MutationDocumentModule } from './mutation/mutationdetail/mutationdocumentwiz/mutationdocumentwiz.module';
import { SaleListComponent } from './sale/salelist/salelist.component';
import { SaledetailComponent } from './sale/saledetail/saledetail.component';
import { SaleDetailModule } from './sale/saledetail/saledetaildetailwiz/saledetaildetailwiz.module';
import { SaleDocumentModule } from './sale/saledetail/saledocumentwiz/saledocumentwiz.module';
import { SaleBiddingModule } from './sale/saledetail/salebiddingwiz/salebiddingwiz.module';
import { MaintenanceListComponent } from './maintenance/maintenancelist/maintenancelist.component';
import { MaintenanceDetailComponent } from './maintenance/maintenancedetail/maintenancedetail.component';
import { OpnameListComponent } from './opname/opnamelist/opnamelist.component';
import { OpnamedetailComponent } from './opname/opnamedetail/opnamedetail.component';
import { OpnameHistoryListComponent } from './opnamehistory/opnamehistorylist/opnamehistorylist.component';
import { MutationReceiveListComponent } from './mutationreceive/mutationreceivelist/mutationreceivelist.component';
import { MutationReceiveDetailComponent } from './mutationreceive/mutationreceivedetail/mutationreceivedetail.component';
import { listassetdepretiationlistComponent } from './assetdepreciation/assetdepreciationlist/assetdepretiationlist.component';
import { WorkOrderListComponent } from './workorder/workorderlist/workorderlist.component';
import { WorkOrderDetailComponent } from './workorder/workorderdetail/workorderdetail.component';
import { AssetWizListListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistlist/assetwizlistlist.component';
import { AssetWizListModule } from './asset/assetlistwiz/assetwizlist/assetwizlistlist.module';
import { AssetUplaodListComponent } from './asset/assetlistwiz/assetuploadlist/assetuploadlistlist/assetuploadlistlist.component';
import { ReverseSaledetailComponent } from './reversesale/reversesaledetail/reversesaledetail.component';
import { ReverseSaleDetailModule } from './reversesale/reversesaledetail/reversesaledetailwiz/reversesaledetailwiz.module';
import { ReverseSaleDocumentModule } from './reversesale/reversesaledetail/reversesaledocumentwiz/reversesaledocumentwiz.module';
import { ReverseSaleListComponent } from './reversesale/reversesalelist/reversesalelist.component';
import { ReverseDisposalListComponent } from './reversedisposal/reversedisposallist/reversedisposallist.component';
import { ReverseDisposaldetailComponent } from './reversedisposal/reversedisposaldetail/reversedisposaldetail.component';
import { ReverseDisposalDetailModule } from './reversedisposal/reversedisposaldetail/reversedisposaldetailwiz/reversedisposaldetail.module';
import { ReverseDisposalDocumentModule } from './reversedisposal/reversedisposaldetail/reversedisposaldocumentwiz/reversedisposaldocument.module';
import { ChangeCategoryListComponent } from './changecategory/changecategorylist/changecategorylist.component';
import { ChangecategorydetailComponent } from './changecategory/changecategorydetail/changecategorydetail.component';
import { AdjustmentListComponent } from './adjustment/adjustmentlist/adjustmentlist.component';
import { AdjustmentdetailComponent } from './adjustment/adjustmentdetail/adjustmentdetail.component';
import { AdjustmentDetailModule } from './adjustment/adjustmentdetail/adjustmentdetaildetailwiz/adjustmentdetaildetailwiz.module';
import { AdjustmentDocumentModule } from './adjustment/adjustmentdetail/adjustmentdocumentwiz/adjustmentdocumentwiz.module';
import { AssetDepreciationModule } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdepreciationwiz/assetdepreciationwizlist.module';
import { ChangeItemTypeListComponent } from './changeitemtype/changitemtypelist/changeitemtypelist.component';
import { ChangeitemtypedetailComponent } from './changeitemtype/changeitemtypedetail/changeitemtypedetail.component';
import { HandoverRequestlistComponent } from './handoverrequest/handoverrequestlist/handoverrequestlist.component';
import { HandoverListComponent } from './handover/handoverlist/handoverlist.component';
import { HandoverdetailComponent } from './handover/handoverdetail/handoverdetail.component';
import { HandoverchecklistwizlistComponent } from './handover/handoverdetail/handoverassetcheklistwiz/handoverassetchecklistwizlist/handoverchecklistwizlist.component';
import { HandoverdocumentwizlistComponent } from './handover/handoverdetail/handoverassetdocumentwiz/handoverassetdocumentwizlist/handoverassetdocumentwizlist.component';
import { AssetIncomeExpenseWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetincomeexpensewiz/assetincomeexpensewizlist/assetincomeexpensewizlist.component';
import { RegisterlistComponent } from './register/registerlist/registerlist.component';
import { RegisterdetailComponent } from './register/registerdetail/registerdetail.component';
import { RegisterdetaillistComponent } from './register/registerdetail/registerdetailwiz/registerdetaillist/registerdetaillist.component';
import { RegisterdocumentlistComponent } from './register/registerdetail/registerdocumentwiz/registerdocumentlist/registerdocumentlist.component';
import { OrdertopublicservicelistComponent } from './ordertopublicservice/ordertopublicservicelist/ordertopublicservicelist.component';
import { OrdertopublicservicedetailComponent } from './ordertopublicservice/ordertopublicservicedetail/ordertopublicservicedetail.component';
import { AssetHandoverHistorydocumentwizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assethandoverhistorywiz/assethandoverhistorywizdetail/assethandoverhistoryassetdocumentwiz/assethandoverhistoryassetdocumentwizlist.component';
import { AssetHandoverHistoryAssetchecklistwizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assethandoverhistorywiz/assethandoverhistorywizdetail/assethandoverhistoryassetchecklistwiz/assethandoverhistoryassetchecklistwizlist.component';
import { RealizationlistComponent } from './realization/realizationlist/realizationlist.component';
// import { RealizationdetailComponent } from './realization/realizationdetail/realizationdetail.component';
import { DeliveryresultlistComponent } from './deliveryresult/deliveryresultlist/deliveryresultlist.component';
import { DeliveryresultdetailComponent } from './deliveryresult/deliveryresultdetail/deliveryresultdetail.component';
import { AssetpublicservicewizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetpublicservicewiz/assetpublicservicewizlist/assetpublicservicewizlist.component';
import { RealizationdetailComponent } from './realization/realizationdetail/realizationdetail.component';
import { AssetDetailHEwizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailhewiz/assetdetailhewizdetail/assetdetailhewizdetail.component';
import { MonitoringMaintenancelistComponent } from './monitoringmaintenance/monitoringmaintenancelist/monitoringmaintenancelist.component';
import { AssetExpendLedgerlistWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetincomeexpensewiz/assetincomeexpensewizlist/assetexpendledger/assetexpendledgerlist/assetexpendledgerlist.component';
import { AssetIncomeLedgerlistWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetincomeexpensewiz/assetincomeexpensewizlist/assetincomeledger/assetincomeledgerlist/assetincomeledgerlist.component';
import { SpafassetlistComponent } from './spafasset/spafassetlist.component';
import { AssetAsStockApprovalComponent } from './asset/assetlistwiz/assetwizlist/assetasstockapproval/assetasstockapproval.component';
import { SpafClaimListComponent } from './spafclaim/spafclaimlist/spafclaimlist.component';
import { SpafClaimDetailComponent } from './spafclaim/spafclaimdetail/spafclaimdetail.component';
import { WorkOrderApprovalComponent } from './workorder/workorderapproval/workorderapproval.component';
import { AssetInsuranceDetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetinsurance/assetinsurancedetail.component';
import { AssethistoryinsurancewizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assethistoryinsurance/assethistoryinsurancewizlist/assethistoryinsurancewizlist.component';
import { AssetDetailLocationHistoryWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetaillocationhistorywiz/assetdetaillocationhistorywizlist/assetdetaillocationhistorywizlist.component';
import { MonitoringGpslistComponent } from './monitoringgps/monitoringgpslist/monitoringgpslist.component';
import { MonitoringGpsDetailComponent } from './monitoringgps/monitoringgpsdetail/monitoringgpsdetail.component';
import { UnsubscribeRequestGpsListComponent } from './unsubscriberequestgps/unsubscriberequestgpslist/unsubscriberequestgpslist.component';
import { RealizationSubscriptionGpsListComponent } from './realizationsubscriptiongps/realizationsubscriptiongpslist/realizationsubscriptiongpslist.component';
import { RealizationSubscriptionGpsDetailComponent } from './realizationsubscriptiongps/realizationsubscriptiongpsdetail/realizationsubscriptiongpsdetail.component';
import { MaintenanceApprovalComponent } from './maintenance/maintenanceapproval/maintenanceapproval.component';
import { MaintenanceReturnApprovalComponent } from './maintenance/maintenancereturnapproval/maintenancereturnapproval.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Transaction),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
        DisposalDetailModule,
        DisposalDocumentModule,
        MutationDetailModule,
        MutationDocumentModule,
        SaleDetailModule,
        SaleDocumentModule,
        SaleBiddingModule,
        ReverseSaleDetailModule,
        ReverseSaleDocumentModule,
        AssetWizListModule,
        ReverseDisposalDetailModule,
        ReverseDisposalDocumentModule,
        AdjustmentDetailModule,
        AdjustmentDocumentModule,
        AssetDepreciationModule
    ],
    declarations: [
        DisposalListComponent,
        DisposaldetailComponent,
        MutationlListComponent,
        MutationDetailComponent,
        SaleListComponent,
        SaledetailComponent,
        ReverseSaledetailComponent,
        MaintenanceListComponent,
        MaintenanceDetailComponent,
        OpnameListComponent,
        OpnamedetailComponent,
        OpnameHistoryListComponent,
        MutationReceiveListComponent,
        MutationReceiveDetailComponent,
        listassetdepretiationlistComponent,
        WorkOrderListComponent,
        WorkOrderDetailComponent,
        AssetUplaodListComponent,
        ReverseSaleListComponent,
        ReverseDisposalListComponent,
        ReverseDisposaldetailComponent,
        ChangeCategoryListComponent,
        ChangecategorydetailComponent,
        ReverseDisposaldetailComponent,
        AdjustmentListComponent,
        AdjustmentdetailComponent,
        ChangeItemTypeListComponent,
        ChangeitemtypedetailComponent,
        HandoverRequestlistComponent,
        HandoverListComponent,
        HandoverdetailComponent,
        HandoverchecklistwizlistComponent,
        HandoverdocumentwizlistComponent,
        AssetHandoverHistoryAssetchecklistwizlistComponent,
        AssetHandoverHistorydocumentwizlistComponent,
        AssetIncomeExpenseWizListComponent,
        RegisterlistComponent,
        RegisterdetailComponent,
        RegisterdetaillistComponent,
        RegisterdocumentlistComponent,
        OrdertopublicservicelistComponent,
        OrdertopublicservicedetailComponent,
        RealizationlistComponent,
        RealizationdetailComponent,
        DeliveryresultlistComponent,
        DeliveryresultdetailComponent,
        AssetpublicservicewizlistComponent,
        AssetDetailHEwizdetailComponent,
        MonitoringMaintenancelistComponent,
        AssetExpendLedgerlistWizListComponent,
        AssetIncomeLedgerlistWizListComponent,
        SpafassetlistComponent,
        AssetAsStockApprovalComponent,
        SpafClaimListComponent,
        SpafClaimDetailComponent,
        WorkOrderApprovalComponent,
        AssetInsuranceDetailComponent,
        AssethistoryinsurancewizlistComponent,
        MaintenanceApprovalComponent,
        MaintenanceReturnApprovalComponent,
        AssetDetailLocationHistoryWizListComponent,
        MonitoringGpslistComponent,
        MonitoringGpsDetailComponent,
        UnsubscribeRequestGpsListComponent,
        RealizationSubscriptionGpsListComponent,
        RealizationSubscriptionGpsDetailComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
