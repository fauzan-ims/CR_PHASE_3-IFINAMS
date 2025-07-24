import { Routes } from '@angular/router';
import { AssetadjustmenthistorywizlistComponent } from './assetwizlistdetail/assetadjustmenthistorywiz/assetadjustmenthistorywizlist/assetadjustmenthistorywizlist.component';
import { AssetDetailBarcodeHistoryWizListComponent } from './assetwizlistdetail/assetdetailbarcodehistorywiz/assetdetailbarcodehistorywizlist/assetdetailbarcodehistorywizlist.component';
import { AssetDetailDocumentWizlistComponent } from './assetwizlistdetail/assetdetaildocumentwiz/assetdetaildocumentwizlist/assetdetaildocumentwizlist.component';
import { AssetDetailElectronicwizdetailComponent } from './assetwizlistdetail/assetdetailelectronicwiz/assetdetailelectronicwizdetail/assetdetailelectronicwizdetail.component';
import { AssetDetailFurniturewizdetailComponent } from './assetwizlistdetail/assetdetailfurniturewiz/assetdetailfurniturewizdetail/assetdetailfurniturewizdetail.component';
import { AssetDetailMachinewizdetailComponent } from './assetwizlistdetail/assetdetailmachinewiz/assetdetailmachinewizdetail/assetdetailmachinewizdetail.component';
import { AssetDetailMaintenanceWizlistComponent } from './assetwizlistdetail/assetdetailmaintenancewiz/assetdetailmaintenancewizlist/assetdetailmaintenancewizlist.component';
import { AssetDetailMutationHistorywizlistComponent } from './assetwizlistdetail/assetdetailmutationhistorywiz/assetdetailmutationhistorywizlist/assetdetailmutationhistorywizlist.component';
import { AssetDetailOtherwizdetailComponent } from './assetwizlistdetail/assetdetailotherswiz/assetdetailotherswizdetail/assetdetailotherswizdetail.component';
import { AssetDetailPropertywizdetailComponent } from './assetwizlistdetail/assetdetailpropertywiz/assetdetailpropertywizdetail/assetdetailpropertywizdetail.component';
import { AssetDetailVehiclewizdetailComponent } from './assetwizlistdetail/assetdetailvehiclewiz/assetdetailvehiclewizlist/assetdetailvehiclewizlist.component';
import { AssetHandoverhistorydetailComponent } from './assetwizlistdetail/assethandoverhistorywiz/assethandoverhistorywizdetail/assethandoverhistorywizdetail.component';
import { AssetHandoverHistorywizlistComponent } from './assetwizlistdetail/assethandoverhistorywiz/assethandoverhistorywizlist/assethandoverhistorywizlist.component';
import { AssetwizlistdetailComponent } from './assetwizlistdetail/assetwizlistdetail.component';
import { AssetWizListListComponent } from './assetwizlistlist/assetwizlistlist.component';


export const AssetWizListRouting: Routes = [{
    path: '',
    children: [
        {
            path: 'subassetwizlist',
            component: AssetWizListListComponent,
            children: [
                {
                    path: 'assetwizlistdetail/:id', /*update*/
                    component: AssetwizlistdetailComponent,
                },
                {
                    path: 'assetdetailpropertydetail/:id',
                    component: AssetDetailPropertywizdetailComponent
                },
                {
                    path: 'assetdetaildocumentdetail/:id',
                    component: AssetDetailDocumentWizlistComponent
                },
                {
                    path: 'assetdetailmaintenancedetail/:id',
                    component: AssetDetailMaintenanceWizlistComponent
                },
                {
                    path: 'assetdetailbarcodehistorydetail/:id',
                    component: AssetDetailBarcodeHistoryWizListComponent
                },
                {
                    path: 'assetdetailmutationhistorydetail/:id',
                    component: AssetDetailMutationHistorywizlistComponent
                },
                {
                    path: 'assetdetailelectronicdetail/:id',
                    component: AssetDetailElectronicwizdetailComponent
                },
                {
                    path: 'assetdetailfurnituredetail/:id',
                    component: AssetDetailFurniturewizdetailComponent
                },
                {
                    path: 'assetdetailmachinedetail/:id',
                    component: AssetDetailMachinewizdetailComponent
                },
                {
                    path: 'assetdetailothersdetail/:id',
                    component: AssetDetailOtherwizdetailComponent
                },
                {
                    path: 'assetdetailvehicledetail/:id',
                    component: AssetDetailVehiclewizdetailComponent
                },
                {
                    path: 'assetdetailadjustmenthistory/:id',
                    component: AssetadjustmenthistorywizlistComponent
                },
                {
                    path: 'assetdetailhandoverhistory/:id',
                    component: AssetHandoverHistorywizlistComponent,
                    children: [
                        {
                            path: 'assetdetailhandoverhistorydetail/:id/:id2',
                            component: AssetHandoverhistorydetailComponent
                        }
                    ]
                },
            ]
        },
        
    ]


}];