import { Routes } from '@angular/router';
import { DisposalDetailHistoryDetailwizlistComponent } from './disposaldetailhistorydetailwizlist/disposaldetailhistorydetailwizlist.component';


export const DisposalDetail: Routes = [{
    path: '',
    children: [
        {
            path: 'disposaldetaillist/:id',
            component: DisposalDetailHistoryDetailwizlistComponent
        },
    ]

}];
