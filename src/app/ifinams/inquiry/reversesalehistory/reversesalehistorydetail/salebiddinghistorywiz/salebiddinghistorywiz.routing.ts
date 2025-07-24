import { Routes } from '@angular/router';
import { SaleBiddingHistoryDetailComponent } from './salebiddinghistorywizdetail/salebiddinghistorydetail/salebiddinghistorydetail.component';
import { SaleBiddingHistoryWizDetailComponent } from './salebiddinghistorywizdetail/salebiddinghistorywizdetail.component';
import { SaleBiddingHistorywizlistComponent } from './salebiddinghistorywizlist/salebiddinghistorywizlist.component';

export const SaleBiddingHistory: Routes = [{
    path: '',
    children: [
        {
            path: 'salebiddinghistorylist/:id',
            component: SaleBiddingHistorywizlistComponent
        },
        {
            path: 'salebiddinghistorydetail/:id',
            component: SaleBiddingHistoryWizDetailComponent
        },
        {
            path: 'salebiddinghistorydetail/:id/:id2',
            component: SaleBiddingHistoryWizDetailComponent
        },
        {
            path: 'salebiddingdetailhistorydetail/:id/:id2',
            component: SaleBiddingHistoryDetailComponent
        },
        {
            path: 'salebiddingdetailhistorydetail/:id/:id2/:id2',
            component: SaleBiddingHistoryDetailComponent
        }
    ]

}];
