import { Routes } from '@angular/router';
import { AssetInterfaceVehicleDetailWizComponent } from './assetinterfacevehicledetail/assetinterfacevehicledetailwiz.component';

export const AssetInterfaceVehicle: Routes = [{
    path: '',
    children: [
        {
            path: 'assetinterfacevehicledetail/:id',
            component: AssetInterfaceVehicleDetailWizComponent
        },
        {
            path: 'assetinterfacevehicledetail/:id/:id2',
            component: AssetInterfaceVehicleDetailWizComponent
        }
    ]
}];
