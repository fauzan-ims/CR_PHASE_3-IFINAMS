import { Routes } from '@angular/router';
import { SaleDetailHistoryDetailwizlistComponent } from './saledetailhistorydetailwizlist/saledetailhistorydetailwizlist.component';

export const SaleDetail: Routes = [{
    path: '',
    children: [
        {
            path: 'saledetaillist/:id',
            component: SaleDetailHistoryDetailwizlistComponent
        },
    ]

}];
