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
import { Interface } from './interface.routing';
import { AssetInterfacelistComponent } from './assetinterface/assetinterfacelist/assetinterfacelist.component';
import { AssetInterfacedetailComponent } from './assetinterface/assetinterfacedetail/assetinterfacedetail.component';
import { AssetInterfaceVehicleWizModule } from './assetinterface/assetinterfacedetail/assetinterfacevehiclewiz/assetinterfacevehiclewiz.module';
import { AssetInterfaceOtherWizModule } from './assetinterface/assetinterfacedetail/assetinterfaceotherwiz/assetinterfaceotherwiz.module';
import { AssetInterfaceElectronicWizModule } from './assetinterface/assetinterfacedetail/assetinterfaceelectronicwiz/assetinterfaceelectronicwiz.module';
import { AssetInterfaceMachineWizModule } from './assetinterface/assetinterfacedetail/assetinterfacemachinewiz/assetinterfacemachinewiz.module';
import { AssetInterfacePropertyWizModule } from './assetinterface/assetinterfacedetail/assetinterfacepropertywiz/assetinterfaceproperty.module';
import { AssetInterfaceFurnitureWizModule } from './assetinterface/assetinterfacedetail/assetinterfacefurniturewiz/assetinterfacefurniturewiz.module';
import { AssetInterfaceDocumentModule } from './assetinterface/assetinterfacedetail/assetinterfacedocumentwiz/assetinterfacedocumentwiz.module';
import { AssetInterfaceMaintenanceWizModule } from './assetinterface/assetinterfacedetail/assetinterfacemaintenancewiz/assetinterfacemaintenancewiz.module';
import { AssetInterfaceBarcodeHistoryWizModule } from './assetinterface/assetinterfacedetail/assetinterfacebarcodehistorywiz/assetinterfacebarcodehistorywiz.module';
import { PaymentlistComponent } from './payment/paymentlist/paymentlist.component';
import { PaymentdetailComponent } from './payment/paymentdetail/paymentdetail.component';
import { ReceivedrequestlistComponent } from './receivedrequest/receivedrequestlist/receivedrequestlist.component';
import { ReceivedrequestdetailComponent } from './receivedrequest/receivedrequestdetail/receivedrequestdetail.component';
import { JournallistComponent } from './journal/journallist/journallist.component';
import { JournaldetailComponent } from './journal/journaldetail/journaldetail.component';
import { MasterRegionlistComponent } from './masterregion/masterregionlist/masterregionlist.component';
import { MasterBranchlistComponent } from './masterbranch/masterbranchlist/masterbranchlist.component';
import { MasterDepartmentlistComponent } from './masterdepartment/masterdepartmentlist.component';
import { MasterDivisionlistComponent } from './masterdivision/masterdivisionlist.component';
import { MasterUnitlistComponent } from './masterunit/masterunitlist/masterunitlist.component';
import { MasterPositionlistComponent } from './masterposition/masterpositionlist.component';
import { MasterUserlistComponent } from './masteruser/masteruserlist/masteruserlist.component';
import { CashierReceivedRequestlistComponent } from './cashierreceivedrequest/cashierreceivedrequestlist/cashierreceivedrequestlist.component';
import { CashierreceivedrequestdetailComponent } from './cashierreceivedrequest/cashierreceivedrequestdetail/cashierreceivedrequestdetail.component';
import { DocumentRequestlistComponent } from './documentrequest/documentrequestlist/documentrequestlist.component';
import { interfaceapprovallistComponent } from './interfaceapproval/interfaceapprovallist/interfaceapprovallist.component';
import { InterfaceapprovaldetailComponent } from './interfaceapproval/interfaceapprovaldetail/interfaceapprovaldetail.component';
import { SpafassetlistinterfaceComponent } from './spafasset/spafassetlist.component';
import { InterfaceDocumentPendinglistComponent } from './interfacedocumentpending/interfacedocumentpendinglist/interfacedocumentpendinglist.component';
import { DocumentPendingdetailComponent } from './interfacedocumentpending/interfacedocumentpendingdetail/interfacedocumentpendingdetail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Interface),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
        AssetInterfaceVehicleWizModule,
        AssetInterfaceOtherWizModule,
        AssetInterfaceElectronicWizModule,
        AssetInterfaceMachineWizModule,
        AssetInterfaceFurnitureWizModule,
        AssetInterfacePropertyWizModule,
        AssetInterfaceDocumentModule,
        AssetInterfaceMaintenanceWizModule,
        AssetInterfaceBarcodeHistoryWizModule
    ],
    declarations: [
        AssetInterfacelistComponent,
        AssetInterfacedetailComponent,
        PaymentlistComponent,
        PaymentdetailComponent,
        ReceivedrequestlistComponent,
        ReceivedrequestdetailComponent,
        JournallistComponent,
        JournaldetailComponent,
        MasterRegionlistComponent,
        MasterBranchlistComponent,
        MasterDivisionlistComponent,
        MasterDepartmentlistComponent,
        MasterUnitlistComponent,
        MasterUserlistComponent,
        MasterPositionlistComponent,
        CashierReceivedRequestlistComponent,
        CashierreceivedrequestdetailComponent,
        DocumentRequestlistComponent,
        interfaceapprovallistComponent,
        InterfaceapprovaldetailComponent,
        InterfaceDocumentPendinglistComponent,
        DocumentPendingdetailComponent,
        SpafassetlistinterfaceComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
