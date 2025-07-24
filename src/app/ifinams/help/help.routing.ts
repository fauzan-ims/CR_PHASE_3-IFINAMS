import { Routes } from '@angular/router';

import { AuthGuard } from '../../../auth.guard';
import { HelplistComponent } from './helplist/helplist.component';

export const Report: Routes = [{
    path: '',
    children: [

        {
            path: 'subhelplist',
            component: HelplistComponent,         
            canActivate: [AuthGuard],
        },
    ]

}];
