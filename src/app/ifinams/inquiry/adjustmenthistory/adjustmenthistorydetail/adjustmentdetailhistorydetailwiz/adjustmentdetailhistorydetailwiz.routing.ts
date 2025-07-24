import { Routes } from '@angular/router';
import { AdjustmentdetailhistorydetailwizlistComponent } from './adjustmentdetailhistorydetailwizlist/adjustmentdetailhistorydetailwizlist.component';


export const AdjustmentDetail: Routes = [{
    path: '',
    children: [
        {
            path: 'adjustmentdetaihistoryllist/:id',
            component: AdjustmentdetailhistorydetailwizlistComponent

        },
    ]

}];
