import { Routes } from '@angular/router';
import { AssetInterfaceMaintenancewizlistComponent } from './assetinterfacemaintenancewizlist/assetinterfacemaintenancewizlist.component';


export const AssetInterfaceMaintenance: Routes = [{
    path: '',
    children: [
        {
            path: 'assetinterfacemaintenancelist/:id',
            component: AssetInterfaceMaintenancewizlistComponent
        }
    ]
}];
