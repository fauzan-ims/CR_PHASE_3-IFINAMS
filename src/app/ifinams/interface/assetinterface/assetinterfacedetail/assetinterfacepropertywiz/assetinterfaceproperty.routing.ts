import { Routes } from '@angular/router';
import { AssetInterfacePropertywizdetailComponent } from './assetinterfacepropertywizdetail/assetinterfacepropertywizdetail.component';

export const AssetInterfaceProperty: Routes = [{
    path: '',
    children: [
        {
            path: 'assetinterfacepropertydetail/:id',
            component: AssetInterfacePropertywizdetailComponent
        },
        {
            path: 'assetinterfacepropertydetail/:id/:id2',
            component: AssetInterfacePropertywizdetailComponent
        }
    ]
}];
