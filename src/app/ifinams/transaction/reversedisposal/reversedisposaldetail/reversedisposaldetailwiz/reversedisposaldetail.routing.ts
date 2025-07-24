import { Routes } from '@angular/router';
import { ReverseDisposalDetailwizlistComponent } from './reversedisposaldetailwizlist/reversedisposaldetailwizlist.component';

export const ReverseDisposalDetail: Routes = [{
    path: '',
    children: [
        {
            path: 'reversedisposaldetaillist/:id',
            component: ReverseDisposalDetailwizlistComponent
        },
    ]

}];
