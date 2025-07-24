import { Routes } from '@angular/router';
import { AdjustmentdetaildetailwizlistComponent } from './adjustmentdetaildetailwizlist/adjustmentdetaildetailwizlist.component';


export const AdjustmentDetail: Routes = [{
    path: '',
    children: [
        {
            path: 'adjustmentdetaillist/:id',
            component: AdjustmentdetaildetailwizlistComponent

        },
    ]

}];
