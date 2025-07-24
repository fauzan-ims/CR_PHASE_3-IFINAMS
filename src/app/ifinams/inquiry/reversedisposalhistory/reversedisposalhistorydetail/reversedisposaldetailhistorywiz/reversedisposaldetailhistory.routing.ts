import { Routes } from '@angular/router';
import { ReverseDisposalDetailHistorywizlistComponent } from './reversedisposaldetailhistorywizlist/reversedisposaldetailhistorywizlist.component';

export const ReverseDisposalDetail: Routes = [{
    path: '',
    children: [
        {
            path: 'reversedisposaldetaillist/:id',
            component: ReverseDisposalDetailHistorywizlistComponent
        },
    ]

}];
