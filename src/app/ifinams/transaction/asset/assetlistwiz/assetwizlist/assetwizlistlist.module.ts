import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { AuthInterceptor } from '../../../../../../auth-interceptor';
import { AuthGuard } from '../../../../../../auth.guard';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AssetWizListRouting } from './assetwizlistlist.routing';
import { AssetWizListListComponent } from './assetwizlistlist/assetwizlistlist.component';
import { AssetwizlistdetailComponent } from './assetwizlistdetail/assetwizlistdetail.component';
import { AssetDetailPropertywizdetailComponent } from './assetwizlistdetail/assetdetailpropertywiz/assetdetailpropertywizdetail/assetdetailpropertywizdetail.component';
import { AssetDetailDocumentWizlistComponent } from './assetwizlistdetail/assetdetaildocumentwiz/assetdetaildocumentwizlist/assetdetaildocumentwizlist.component';
import { AssetDetailMaintenanceWizlistComponent } from './assetwizlistdetail/assetdetailmaintenancewiz/assetdetailmaintenancewizlist/assetdetailmaintenancewizlist.component';
import { AssetDetailBarcodeHistoryWizListComponent } from './assetwizlistdetail/assetdetailbarcodehistorywiz/assetdetailbarcodehistorywizlist/assetdetailbarcodehistorywizlist.component';
import { AssetDetailMutationHistorywizlistComponent } from './assetwizlistdetail/assetdetailmutationhistorywiz/assetdetailmutationhistorywizlist/assetdetailmutationhistorywizlist.component';
import { AssetDetailElectronicwizdetailComponent } from './assetwizlistdetail/assetdetailelectronicwiz/assetdetailelectronicwizdetail/assetdetailelectronicwizdetail.component';
import { AssetDetailFurniturewizdetailComponent } from './assetwizlistdetail/assetdetailfurniturewiz/assetdetailfurniturewizdetail/assetdetailfurniturewizdetail.component';
import { AssetDetailMachinewizdetailComponent } from './assetwizlistdetail/assetdetailmachinewiz/assetdetailmachinewizdetail/assetdetailmachinewizdetail.component';
import { AssetDetailOtherwizdetailComponent } from './assetwizlistdetail/assetdetailotherswiz/assetdetailotherswizdetail/assetdetailotherswizdetail.component';
// import { QRCodeModule } from 'angular2-qrcode';
// import { NgxBarcodeModule } from 'ngx-barcode';
import { AssetadjustmenthistorywizlistComponent } from './assetwizlistdetail/assetadjustmenthistorywiz/assetadjustmenthistorywizlist/assetadjustmenthistorywizlist.component';
import { AssetHandoverHistorywizlistComponent } from './assetwizlistdetail/assethandoverhistorywiz/assethandoverhistorywizlist/assethandoverhistorywizlist.component';
import { AssetHandoverhistorydetailComponent } from './assetwizlistdetail/assethandoverhistorywiz/assethandoverhistorywizdetail/assethandoverhistorywizdetail.component';
import { AssetDetailVehiclewizdetailComponent } from './assetwizlistdetail/assetdetailvehiclewiz/assetdetailvehiclewizlist/assetdetailvehiclewizlist.component';
import { AssetDetailHEwizdetailComponent } from './assetwizlistdetail/assetdetailhewiz/assetdetailhewizdetail/assetdetailhewizdetail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AssetWizListRouting),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
        // QRCodeModule,
        // NgxBarcodeModule
    ],
    declarations: [
        AssetWizListListComponent,
        AssetwizlistdetailComponent,
        AssetDetailPropertywizdetailComponent,
        AssetDetailDocumentWizlistComponent,
        AssetDetailMaintenanceWizlistComponent,
        AssetDetailBarcodeHistoryWizListComponent,
        AssetDetailMutationHistorywizlistComponent,
        AssetDetailElectronicwizdetailComponent,
        AssetDetailFurniturewizdetailComponent,
        AssetDetailMachinewizdetailComponent,
        AssetDetailOtherwizdetailComponent,
        AssetDetailVehiclewizdetailComponent,
        AssetadjustmenthistorywizlistComponent,
        AssetHandoverHistorywizlistComponent,
        AssetHandoverhistorydetailComponent,
    ],
    providers: [
        DALService,
        // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        // , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class AssetWizListModule { }
