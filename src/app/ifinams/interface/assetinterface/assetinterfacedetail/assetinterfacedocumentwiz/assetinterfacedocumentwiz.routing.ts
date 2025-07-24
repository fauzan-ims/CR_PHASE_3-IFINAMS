import { Routes } from '@angular/router';
import { AssetInterfaceDocumentlistComponent } from './assetinterfacedocumentwizlist/assetinterfacedocumentwizlist.component';


export const AssetInterfaceDocument: Routes = [{
    path: '',
    children: [
        {
            path: 'assetinterfacedocumentlist/:id',
            component: AssetInterfaceDocumentlistComponent
        }
    ]

}];
