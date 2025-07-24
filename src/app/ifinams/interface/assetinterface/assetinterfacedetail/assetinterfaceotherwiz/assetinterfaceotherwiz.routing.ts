import { Routes } from '@angular/router';
import { AssetInterfaceOtherwizdetailComponent } from './assetinterfaceotherwizdetail/assetinterfaceotherwizdetail.component';

export const AssetInterfaceOther: Routes = [{
    path: '',
    children: [
        {
            path: 'assetinterfaceotherdetail/:id',
            component: AssetInterfaceOtherwizdetailComponent,
        },
        {
            path: 'assetinterfaceotherdetail/:id/:id2',
            component: AssetInterfaceOtherwizdetailComponent
        }
    ]
}];
