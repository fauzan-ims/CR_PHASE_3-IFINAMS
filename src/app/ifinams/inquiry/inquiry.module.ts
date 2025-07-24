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
import { Inquiry } from './inquiry.routing';
// import { AssetlistComponent } from './asset/assetlist/assetlist.component';
// import { AssetdetailComponent } from './asset/assetdetail/assetdetail.component';
// import { AssetDocumentModule } from './asset/assetdetail/assetdocumentwiz/assetdocumentwiz.module';
// import { AssetBarcodeHistoryWizModule } from './asset/assetdetail/assetbarcodehistorywiz/assetbarcodehistorywiz.module';
// import { AssetVehicleWizModule } from './asset/assetdetail/assetvehiclewiz/assetvehicle.module';
// import { AssetOtherWizModule } from './asset/assetdetail/assetotherwiz/assetotherwiz.module';
// import { AssetElectronicWizModule } from './asset/assetdetail/assetelectronicwiz/assetelectronicwiz.module';
// import { AssetFurnitureWizModule } from './asset/assetdetail/assetfurniturewiz/assetfurniturewiz.module';
// import { AssetMachineWizModule } from './asset/assetdetail/assetmachinewiz/assetmachinewiz.module';
// import { AssetPropertyWizModule } from './asset/assetdetail/assetpropertywiz/assetpropertywiz.module';
// import { AssetMaintenanceWizModule } from './asset/assetdetail/assetmaintenancewiz/assetmaintenancewiz.module';
import { DisposalHistoryListComponent } from './disposalhistory/disposalhistorylist/disposalhistorylist.component';
import { DisposalHistorydetailComponent } from './disposalhistory/disposalhistorydetail/disposalhistorydetail.component';
import { DisposalDetailHistoryModule } from './disposalhistory/disposalhistorydetail/disposaldetailhistorydetailwiz/disposaldetailhistorydetailwiz.module';
// import { MutationHistoryListComponent } from './mutationhistory/mutationhistorylist/mutationhistorylist.component';
// import { MutationDetailComponent } from './mutationhistory/mutationhistorydetail/mutationdetail.component';
// import { MutationDetailModule } from './mutationhistory/mutationhistorydetail/mutationdetailhistorydetailwiz/mutationdetailhistorydetailwiz.module';
// import { MutationDocumentModule } from './mutationhistory/mutationhistorydetail/mutationdocumenthistorywiz/mutationdocumentwiz.module';
import * as salelistComponent from './salehistory/salehistorylist/salehistorylist.component';
import { SaleHistoryDetailComponent } from './salehistory/salehistorydetail/salehistorydetail.component';
import { SaleDetailHistoryModule } from './salehistory/salehistorydetail/saledetailhistorydetailwiz/saledetailhistorydetailwiz.module';
import { SaleDocumentHistoryModule } from './salehistory/salehistorydetail/saledocumenthistorywiz/saledocumenthistorywiz.module';
import { SaleBiddingHistoryModule } from './salehistory/salehistorydetail/salebiddinghistorywiz/salebiddinghistorywiz.module';
import { MaintenanceHistoryListComponent } from './maintenancehistory/maintenancehistorylist/maintenancehistorylist.component';
import { MaintenanceHistoryDetailComponent } from './maintenancehistory/maintenancehistorydetail/maintenancehistorydetail.component';
// import { OpnameListComponent } from './opname/opnamelist/opnamelist.component';
// import { OpnamedetailComponent } from './opname/opnamedetail/opnamedetail.component';
// import { OpnameHistoryListComponent } from './opnamehistory/opnamehistorylist/opnamehistorylist.component';
// import { MutationReceiveListComponent } from './mutationreceive/mutationreceivelist/mutationreceivelist.component';
// import { MutationReceiveDetailComponent } from './mutationreceive/mutationreceivedetail/mutationreceivedetail.component';
// import { AssetMutationHistoryWizModule } from './asset/assetdetail/assetmutationhistorywiz/assetmutationhistorywiz.module';
// import { listassetdepretiationlistComponent } from './assetdepreciation/assetdepreciationlist/assetdepretiationlist.component';
// import { WorkOrderListComponent } from './workorder/workorderlist/workorderlist.component';
// import { WorkOrderDetailComponent } from './workorder/workorderdetail/workorderdetail.component';
// import { AssetListWizComponent } from './asset/assetlistwiz/assetlistwiz.component';
// import { AssetWizListListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistlist/assetwizlistlist.component';
// import { AssetWizListModule } from './asset/assetlistwiz/assetwizlist/assetwizlistlist.module';
// import { AssetUplaodListComponent } from './asset/assetlistwiz/assetuploadlist/assetuploadlistlist/assetuploadlistlist.component';
import { ReverseSaleHistorydetailComponent } from './reversesalehistory/reversesalehistorydetail/reversesalehistorydetail.component';
import { ReverseSaleDetailModule } from './reversesalehistory/reversesalehistorydetail/reversesaledetailhistorywiz/reversesaledetailhistorywiz.module';
// import { ReverseSaleDocumentModule } from './reversesale/reversesaledetail/reversesaledocumentwiz/reversesaledocumentwiz.module';
import { ReverseSaleHistoryListComponent } from './reversesalehistory/reversesalehistorylist/reversesalehistorylist.component';
import { ReverseDisposalHistoryListComponent } from './reversedisposalhistory/reversedisposalhistorylist/reversedisposalhistorylist.component';
import { ReverseDisposalDetailHistoryModule } from './reversedisposalhistory/reversedisposalhistorydetail/reversedisposaldetailhistorywiz/reversedisposaldetailhistory.module';
import { ReverseDisposalDocumentHistoryModule } from './reversedisposalhistory/reversedisposalhistorydetail/reversedisposaldocumenthistorywiz/reversedisposaldocumenthistory.module';
import { ChangeCategoryHistoryListComponent} from './changecategoryhistory/changecategoryhistorylist/changecategoryhistorylist.component';
import { ChangeCategoryHistoryDetailComponent } from './changecategoryhistory/changecategoryhistorydetail/changecategoryhistorydetail.component';
import { AdjustmentHistoryListComponent } from './adjustmenthistory/adjustmenthistorylist/adjustmenthistorylist.component';
import { AdjustmentHistorydetailComponent } from './adjustmenthistory/adjustmenthistorydetail/adjustmenthistorydetail.component';
import { AdjustmentHistoryDetailModule } from './adjustmenthistory/adjustmenthistorydetail/adjustmentdetailhistorydetailwiz/adjustmentdetailhistorydetailwiz.module';
import { AdjustmentDocumentHistoryModule } from './adjustmenthistory/adjustmenthistorydetail/adjustmentdocumenthistorywiz/adjustmentdocumenthistorywiz.module';
import { ChangeItemTypeHistoryDetailComponent } from './changeitemtypehistory/changeitemtypehistorydetail/changeitemtypehistorydetail.component';
import { ChangeItemTypeHistoryListComponent } from './changeitemtypehistory/changitemtypehistorylist/changeitemtypehistorylist.component';
import { OpnameHistoryListComponent } from './opnamehistory/opnamehistorylist/opnamehistorylist.component';
import { OpnameHistoryDetailComponent } from './opnamehistory/opnamehistorydetail/opnamehistorydetail.component';
import { DisposalDocumentHistoryModule } from './disposalhistory/disposalhistorydetail/disposaldocumenthistorywiz/disposaldocumenthistorywiz.module';
import { SaleHistoryListComponent } from './salehistory/salehistorylist/salehistorylist.component';
import { MutationDocumentHistoryModule } from './mutationhistory/mutationhistorydetail/mutationdocumenthistorywiz/mutationdocumenthistorywiz.module';
import { MutationDetailHistoryModule } from './mutationhistory/mutationhistorydetail/mutationdetailhistorydetailwiz/mutationdetailhistorydetailwiz.module';
import { MutationHistoryDetailComponent } from './mutationhistory/mutationhistorydetail/mutationhistorydetail.component';
import { ReverseSaleDocumentHistoryModule } from './reversesalehistory/reversesalehistorydetail/reversesaledocumenthistorywiz/reversesaledocumenthistorywiz.module';
// import { ReverseDisposalHistoryDetailComponent } from './reversedisposalhistory/reversedisposaldetail/reversedisposaldetail.component';
// import { ReverseDisposalHistoryDetailComponent } from './reversedisposalhistory/reversedisposaldetail/reversedisposaldetail.component';
import { ReverseSaleDocumentHistoryWizListComponent } from './reversesalehistory/reversesalehistorydetail/reversesaledocumenthistorywiz/reversesaledocumenthistorywizlist/reversesaledocumenthistorywizlist.component';
import { ReverseDisposalHistorydetailComponent } from './reversedisposalhistory/reversedisposalhistorydetail/reversedisposalhistorydetail.component';
import { MutationHistoryListComponent } from './mutationhistory/mutationhistorylist/mutationhistorylist.component';
// import { SaleDocumentReverseHistoryWizListComponent } from './reversesalehistory/reversesalehistorydetail/reversesaledocumenthistorywiz/reversesaledocumenthistorywizlist/saledocumentreversehistorywizlist/saledocumentreversehistorywizlist.component';
// import { ReverseDocumentHistoryWizListComponent } from './reversesalehistory/reversesalehistorydetail/reversesaledocumenthistorywiz/reversesaledocumenthistorywizlist/reversedocumenthistorywizlist/reversedocumenthistorywizlist.component';
//import { AssetDepreciationModule } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdepreciationwiz/assetdepreciationwizlist.module';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Inquiry),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
        // AssetDocumentModule,
        // AssetBarcodeHistoryWizModule,
        // AssetVehicleWizModule,
        // AssetOtherWizModule,
        // AssetElectronicWizModule,
        // AssetFurnitureWizModule,
        // AssetMachineWizModule,
        // AssetPropertyWizModule,
        // // AssetMaintenanceWizModule,
        DisposalDetailHistoryModule,
        DisposalDocumentHistoryModule,
        MutationDetailHistoryModule,
        MutationDocumentHistoryModule,
        SaleDetailHistoryModule,
        SaleDocumentHistoryModule,
        SaleBiddingHistoryModule,
        ReverseSaleDetailModule,
        // AssetWizListModule,
        ReverseDisposalDetailHistoryModule,
        ReverseDisposalDocumentHistoryModule, 
        AdjustmentHistoryDetailModule,
        AdjustmentDocumentHistoryModule,
        ReverseSaleDocumentHistoryModule
        //AssetDepreciationModule
    ],
    declarations: [
        // AssetlistComponent,
        // // AssetdetailComponent,
        DisposalHistoryListComponent,
        DisposalHistorydetailComponent,
        MutationHistoryListComponent,
        MutationHistoryDetailComponent,
        SaleHistoryListComponent,
        SaleHistoryDetailComponent,
        ReverseSaleHistorydetailComponent,
        MaintenanceHistoryListComponent,
        MaintenanceHistoryDetailComponent,
        OpnameHistoryListComponent,
        OpnameHistoryDetailComponent,
        // OpnamedetailComponent,
        // OpnameHistoryListComponent,
        // MutationReceiveListComponent,
        // MutationReceiveDetailComponent,
        // listassetdepretiationlistComponent,
        // WorkOrderListComponent,
        // WorkOrderDetailComponent,
        // AssetListWizComponent,
        // AssetUplaodListComponent,
        ReverseSaleHistoryListComponent,
        ReverseDisposalHistoryListComponent,
        // ReverseDisposalHistoryDetailComponent,
        ChangeCategoryHistoryListComponent,
        ChangeCategoryHistoryDetailComponent,
        ReverseSaleDocumentHistoryWizListComponent,
        // ReverseDocumentHistoryWizListComponent,
        // SaleDocumentReverseHistoryWizListComponent,
        AdjustmentHistoryListComponent,
        AdjustmentHistorydetailComponent,
        ChangeItemTypeHistoryListComponent,
        ChangeItemTypeHistoryDetailComponent,
        ReverseDisposalHistorydetailComponent
        
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
