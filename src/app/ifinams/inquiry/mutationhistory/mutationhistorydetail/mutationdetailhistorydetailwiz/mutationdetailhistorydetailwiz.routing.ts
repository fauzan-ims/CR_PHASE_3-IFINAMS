import { Routes } from '@angular/router';
import { MutationDetailHistoryDetailwizlistComponent } from './mutationdetailhistorydetailwizlist/mutationdetailhistorydetailwizlist.component';

export const MutationDetailHistory: Routes = [{
    path: '',
    children: [
        {
            path: 'mutationdetailhistorylist/:id',
            component: MutationDetailHistoryDetailwizlistComponent
        },
    ]

}];
