import { Routes } from '@angular/router';
import { AssetInterfaceFurniturewizdetailComponent } from './assetinterfacefurniturewizdetail/assetinterfacefurniturewizdetail.component';


export const AssetInterfaceFurniture: Routes = [{
    path: '',
    children: [
        {
            path: 'assetinterfacefurnituredetail/:id',
            component: AssetInterfaceFurniturewizdetailComponent
        },
        {
            path: 'assetinterfacefurnituredetail/:id/:id2',
            component: AssetInterfaceFurniturewizdetailComponent
        }
    ]
}];
