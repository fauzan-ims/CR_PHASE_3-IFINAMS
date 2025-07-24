import { Routes } from '@angular/router';
import { MutationDetailDetailwizlistComponent } from './mutationdetaildetailwizlist/mutationdetaildetailwizlist.component';

export const MutationDetail: Routes = [{
    path: '',
    children: [
        {
            path: 'mutationdetaillist/:id',
            component: MutationDetailDetailwizlistComponent
        },
    ]

}];
