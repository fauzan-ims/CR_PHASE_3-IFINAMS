import { Routes } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { AuthGuard } from '../../../auth.guard';
import { AssetInterfaceBarcodeHistorywizlistComponent } from './assetinterface/assetinterfacedetail/assetinterfacebarcodehistorywiz/assetinterfacebarcodehistorywizlist/assetinterfacebarcodehistorywizlist.component';
import { AssetInterfacedetailComponent } from './assetinterface/assetinterfacedetail/assetinterfacedetail.component';
import { AssetInterfaceDocumentlistComponent } from './assetinterface/assetinterfacedetail/assetinterfacedocumentwiz/assetinterfacedocumentwizlist/assetinterfacedocumentwizlist.component';
import { AssetInterfaceElectronicWizdetailComponent } from './assetinterface/assetinterfacedetail/assetinterfaceelectronicwiz/assetinterfaceelectronicwizdetail/assetinterfaceelectronicwizdetail.component';
import { AssetInterfaceFurniturewizdetailComponent } from './assetinterface/assetinterfacedetail/assetinterfacefurniturewiz/assetinterfacefurniturewizdetail/assetinterfacefurniturewizdetail.component';
import { AssetInterfaceMachinewizdetailComponent } from './assetinterface/assetinterfacedetail/assetinterfacemachinewiz/assetinterfacemachinewizdetail/assetinterfacemachinewizdetail.component';
import { AssetInterfaceMaintenancewizlistComponent } from './assetinterface/assetinterfacedetail/assetinterfacemaintenancewiz/assetinterfacemaintenancewizlist/assetinterfacemaintenancewizlist.component';
import { AssetInterfaceOtherwizdetailComponent } from './assetinterface/assetinterfacedetail/assetinterfaceotherwiz/assetinterfaceotherwizdetail/assetinterfaceotherwizdetail.component';
import { AssetInterfacePropertywizdetailComponent } from './assetinterface/assetinterfacedetail/assetinterfacepropertywiz/assetinterfacepropertywizdetail/assetinterfacepropertywizdetail.component';
import { AssetInterfaceVehicleDetailWizComponent } from './assetinterface/assetinterfacedetail/assetinterfacevehiclewiz/assetinterfacevehicledetail/assetinterfacevehicledetailwiz.component';
import { AssetInterfacelistComponent } from './assetinterface/assetinterfacelist/assetinterfacelist.component';
import { PaymentdetailComponent } from './payment/paymentdetail/paymentdetail.component';
import { PaymentlistComponent } from './payment/paymentlist/paymentlist.component';
import { JournaldetailComponent } from './journal/journaldetail/journaldetail.component';
import { JournallistComponent } from './journal/journallist/journallist.component';
import { ReceivedrequestdetailComponent } from './receivedrequest/receivedrequestdetail/receivedrequestdetail.component';
import { ReceivedrequestlistComponent } from './receivedrequest/receivedrequestlist/receivedrequestlist.component';
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

export const Interface: Routes = [{
    path: '',
    children: [
        /*asset*/
        {
            path: 'subassetinterface',
            component: AssetInterfacelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'assetinterfacedetail',
                    component: AssetInterfacedetailComponent,
                },
                {
                    path: 'assetinterfacedetail/:id',
                    component: AssetInterfacedetailComponent,
                    children: [
                        {
                            path: 'assetinterfacevehicledetail/:id',
                            component: AssetInterfaceVehicleDetailWizComponent
                        },
                        {
                            path: 'assetinterfacevehicledetail/:id/:id2',
                            component: AssetInterfaceVehicleDetailWizComponent
                        },
                        {
                            path: 'assetinterfaceotherdetail/:id',
                            component: AssetInterfaceOtherwizdetailComponent
                        },
                        {
                            path: 'assetinterfaceotherdetail/:id/:id2',
                            component: AssetInterfaceOtherwizdetailComponent
                        },
                        {
                            path: 'assetinterfaceelectronicdetail/:id',
                            component: AssetInterfaceElectronicWizdetailComponent
                        },
                        {
                            path: 'assetinterfaceelectronicdetail/:id/:id2',
                            component: AssetInterfaceElectronicWizdetailComponent
                        },
                        {
                            path: 'assetinterfacefurnituredetail/:id',
                            component: AssetInterfaceFurniturewizdetailComponent
                        },
                        {
                            path: 'assetinterfacefurnituredetail/:id/:id2',
                            component: AssetInterfaceFurniturewizdetailComponent
                        },
                        {
                            path: 'assetinterfacemachinedetail/:id',
                            component: AssetInterfaceMachinewizdetailComponent
                        },
                        {
                            path: 'assetinterfacemachinedetail/:id/:id2',
                            component: AssetInterfaceMachinewizdetailComponent
                        },
                        {
                            path: 'assetinterfacepropertydetail/:id',
                            component: AssetInterfacePropertywizdetailComponent
                        },
                        {
                            path: 'assetinterfacepropertydetail/:id/:id2',
                            component: AssetInterfacePropertywizdetailComponent
                        },
                        {
                            path: 'assetinterfacedocumentlist/:id',
                            component: AssetInterfaceDocumentlistComponent
                        },
                        {
                            path: 'assetinterfacedocumentlist/:id/:id2',
                            component: AssetInterfaceDocumentlistComponent
                        },
                        {
                            path: 'assetinterfacemaintenancelist/:id',
                            component: AssetInterfaceMaintenancewizlistComponent
                        },
                        {
                            path: 'assetinterfacemaintenancelist/:id/:id2',
                            component: AssetInterfaceMaintenancewizlistComponent
                        },
                        {
                            path: 'assetinterfacebarcodehistorylist/:id',
                            component: AssetInterfaceBarcodeHistorywizlistComponent
                        },
                        {
                            path: 'assetinterfacebarcodehistorylist/:id/:id2',
                            component: AssetInterfaceBarcodeHistorywizlistComponent
                        }
                    ]
                }
            ]
        },
        /*asset*/

        // payment
        {
            path: 'paymentlist',
            component: PaymentlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'paymentdetail',
                    component: PaymentdetailComponent,
                },
                {
                    path: 'paymentdetail/:id',
                    component: PaymentdetailComponent,
                }

            ]
        },
        // payment


        /*master recivedlist*/
        {
            path: 'recivedlist',
            component: ReceivedrequestlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'receiveddetail',
                    component: ReceivedrequestdetailComponent,
                },
                {
                    path: 'receiveddetail/:id',
                    component: ReceivedrequestdetailComponent
                }
            ]
        },
        /*master recivedlist*/

        /*master journallist*/
        {
            path: 'journallist',
            component: JournallistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'journaldetail',
                    component: JournaldetailComponent,
                },
                {
                    path: 'journaldetail/:id',
                    component: JournaldetailComponent
                }
            ]
        },
        /*master journallist*/

        // master region
        {
            path: 'submasterregion',
            component: MasterRegionlistComponent,
            canActivate: [AuthGuard]
        },
        // master region

        // master branch
        {
            path: 'submasterbranch',
            component: MasterBranchlistComponent,
            canActivate: [AuthGuard]
        },
        // master branch

        // master division
        {
            path: 'submasterdivision',
            component: MasterDivisionlistComponent,
            canActivate: [AuthGuard]
        },
        // master division

        // master department
        {
            path: 'submasterdepartment',
            component: MasterDepartmentlistComponent,
            canActivate: [AuthGuard]
        },
        // master department

        // master unit
        {
            path: 'submasterunit',
            component: MasterUnitlistComponent,
            canActivate: [AuthGuard]
        },
        // master unit

        // master user
        {
            path: 'submasteruser',
            component: MasterUserlistComponent,
            canActivate: [AuthGuard]
        },
        // master user

        // master position
        {
            path: 'submasterposition',
            component: MasterPositionlistComponent,
            canActivate: [AuthGuard]
        },
        // master position

        //Cashier Received
        {
            path: 'subcashierreceivedrequestlist',
            component: CashierReceivedRequestlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'cashierreceivedrequestdetail/:id',
                    component: CashierreceivedrequestdetailComponent
                }
            ]
        },
        //Cashier Received

        //document request
        {
            path: 'subdocumentrequestlist',
            component: DocumentRequestlistComponent,
            canActivate: [AuthGuard]
        },
        //document request

        //approval
        {
            path: 'subinterfaceapprovallist',
            component: interfaceapprovallistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'interfaceapprovaldetail/:id',
                    component: InterfaceapprovaldetailComponent,
                },
            ]
        },
        //document pending
        {
            path: 'subdocumentpendinglist',
            component: InterfaceDocumentPendinglistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'documentpendinginterfacedetail/:id',
                    component: DocumentPendingdetailComponent
                }
            ]
        },
        //approval
        {
            path: 'subspafassetlistinterface',
            component: SpafassetlistinterfaceComponent,
            canActivate: [AuthGuard],
        }
    ]
}];
