import { Routes } from '@angular/router';
import { AssetInterfaceBarcodeHistorywizlistComponent } from './assetinterfacebarcodehistorywizlist/assetinterfacebarcodehistorywizlist.component';


export const AssetInterfaceBarcodeHistory: Routes = [{
    path: '',
    children: [
        {
            path: 'assetinterfacebarcodehistorylist/:id',
            component: AssetInterfaceBarcodeHistorywizlistComponent
        }
    ]
}];
