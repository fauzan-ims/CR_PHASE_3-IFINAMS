import { Routes } from '@angular/router';
import { SaleDetailDetailwizlistComponent } from './saledetaildetailwizlist/saledetaildetailwizlist.component';

export const SaleDetail: Routes = [{
    path: '',
    children: [
        {
            path: 'saledetaillist/:id',
            component: SaleDetailDetailwizlistComponent
        },
    ]

}];
