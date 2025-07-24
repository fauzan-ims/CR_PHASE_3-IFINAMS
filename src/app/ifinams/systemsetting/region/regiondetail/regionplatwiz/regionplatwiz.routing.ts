import { Routes } from '@angular/router';
import { RegionplatlistComponent } from './regionplatlist/regionplatlist.component';
import { RegionplatdetailComponent } from './regionplatdetail/regionplatdetail.component';

export const RegionPlateWizRoutes: Routes = [{
    path: '',
    children: [
        {
            path: 'regionplatlist/:id',
            component: RegionplatlistComponent
        },
        {
            path: 'regionplatdetail/:id',
            component: RegionplatdetailComponent
        },
        {
            path: 'regionplatdetail/:id/:id2',
            component: RegionplatdetailComponent
        }
    ]
}];
