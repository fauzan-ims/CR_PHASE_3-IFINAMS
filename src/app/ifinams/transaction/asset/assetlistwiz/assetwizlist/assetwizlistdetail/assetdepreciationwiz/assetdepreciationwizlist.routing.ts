import { Routes } from '@angular/router';
import { AssetDepreCommWizListComponent } from './assetdepreciationwizlist/assetdepreciationcommwizlist/assetdepreciationcommwizlist.component';
import { AssetDepreFiscalWizListComponent } from './assetdepreciationwizlist/assetdepreciationfiscalwizlist/assetdepreciationfiscalwizlist.component';
import { AssetDepreciationWizListComponent } from './assetdepreciationwizlist/asssetdepreciationwizlist.component';


export const AssetDepreciation: Routes = [{
    path: '',
    children: [
        {
            path: 'assetdepreciationwizlist/:id',
            component: AssetDepreciationWizListComponent,
        },
        {
            path: 'assetdepreciationcommwizlist/:id',
            component: AssetDepreCommWizListComponent
        },
        {
            path: 'assetdeprefiscalwizlist/:id',
            component: AssetDepreFiscalWizListComponent
        }        
    ]

}];
