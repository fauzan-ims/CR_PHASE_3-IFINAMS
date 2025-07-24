import { Routes } from '@angular/router';
import { AssetInterfaceMachinewizdetailComponent } from './assetinterfacemachinewizdetail/assetinterfacemachinewizdetail.component';

export const AssetInterfaceMachine: Routes = [{
    path: '',
    children: [
        {
            path: 'assetinterfacemachinedetail/:id',
            component: AssetInterfaceMachinewizdetailComponent
        },
        {
            path: 'assetinterfacemachinedetail/:id/:id2',
            component: AssetInterfaceMachinewizdetailComponent
        }
        
    ]
}];
