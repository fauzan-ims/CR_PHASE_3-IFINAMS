import { Routes } from '@angular/router';
import { ReverseSaleDetailwizlistComponent } from './reversesaledetailwizlist/reversesaledetailwizlist.component';

export const ReverseSaleDetail: Routes = [{
    path: '',
    children: [
        {
            path: 'reversesaledetaillist/:id',
            component: ReverseSaleDetailwizlistComponent
        },
    ]

}];
