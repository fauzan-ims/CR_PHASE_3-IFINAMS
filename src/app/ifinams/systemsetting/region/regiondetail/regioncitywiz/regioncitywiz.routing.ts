import { Routes } from '@angular/router';
import { RegioncitylistComponent } from './regioncitylist/regioncitylist.component';

export const RegionCityWizRoutes: Routes = [{
    path: '',
    children: [
        {
            path: 'regioncitylist/:id',
            component: RegioncitylistComponent
        }
    ]
}];
