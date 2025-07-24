import { Routes } from '@angular/router';
import { SaleBiddingDetailComponent } from './salebiddingwizdetail/salebiddingdetail/salebiddingdetail.component';
import { SaleBiddingWizDetailComponent } from './salebiddingwizdetail/salebiddingwizdetail.component';
import { SaleBiddingwizlistComponent } from './salebiddingwizlist/salebiddingwizlist.component';

export const SaleBidding: Routes = [{
    path: '',
    children: [
        {
            path: 'salebiddinglist/:id',
            component: SaleBiddingwizlistComponent
        },
        {
            path: 'salebiddingdetail/:id',
            component: SaleBiddingWizDetailComponent
        },
        {
            path: 'salebiddingdetail/:id/:id2',
            component: SaleBiddingWizDetailComponent
        },
        {
            path: 'salebiddingdetaildetail/:id/:id2/:id3',
            component: SaleBiddingDetailComponent
        },
        {
            path: 'salebiddingdetaildetail/:id/:id2/:id3/:id4',
            component: SaleBiddingDetailComponent
        }
    ]

}];
