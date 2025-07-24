import { Routes } from '@angular/router';
import { DisposalDetailDetailwizlistComponent } from './disposaldetaildetailwizlist/disposaldetaildetailwizlist.component';


export const DisposalDetail: Routes = [{
    path: '',
    children: [
        {
            path: 'disposaldetaillist/:id',
            component: DisposalDetailDetailwizlistComponent
        },
    ]

}];
