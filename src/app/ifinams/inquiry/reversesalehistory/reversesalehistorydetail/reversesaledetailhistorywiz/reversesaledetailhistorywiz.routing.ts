import { Routes } from '@angular/router';
import { ReverseSaleDetailHistorywizlistComponent } from './reversesaledetailhistorywizlist/reversesaledetailhistorywizlist.component';

export const ReverseSaleDetailHistory: Routes = [{
    path: '',
    children: [
        {
            path: 'reversesaledetaillist/:id',
            component: ReverseSaleDetailHistorywizlistComponent
        },
    ]

}];
