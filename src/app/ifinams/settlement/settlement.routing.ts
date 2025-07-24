import { Routes } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { AuthGuard } from '../../../auth.guard';
import { SoldRequestDetailwizlistComponent } from './soldrequest/soldrequestdetail/soldrequestassetwiz/soldrequestassetwizlist/soldrequestwizlist.component';
import { SoldRequestdetailComponent } from './soldrequest/soldrequestdetail/soldrequestdetail.component';
import { SoldRequestListComponent } from './soldrequest/soldrequestlist/soldrequestlist.component';
import { SoldSettlementdetailComponent } from './soldsettlement/soldsettlementdetail/soldsettlementdetail.component';
import { SoldSettlementDetailFeewizlistComponent } from './soldsettlement/soldsettlementdetail/soldsettlementdetailfeewiz/soldsettlementdetailfeewizlist/soldsettlementdetailfeewizlist.component';
import { SoldSettlementListComponent } from './soldsettlement/soldsettlementlist/soldsettlementlist.component';

export const Settlement: Routes = [{
    path: '',
    children: [
        {
            path: 'subsoldrequestlist',
            component: SoldRequestListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'soldrequestdetail',
                    component: SoldRequestdetailComponent
                },
                {
                    path: 'soldrequestdetail/:id',
                    component: SoldRequestdetailComponent,
                    children: [
                        {
                            path: 'soldrequestassetlist/:id',
                            component: SoldRequestDetailwizlistComponent
                        }
                    ]
                }
            ]
        },
        {
            path: 'subsoldsettlement',
            component: SoldSettlementListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'soldsettlementdetail',
                    component: SoldSettlementdetailComponent
                },
                {
                    path: 'soldsettlementdetail/:id',
                    component: SoldSettlementdetailComponent,
                    children: [
                        {
                            path: 'soldsettlement/:id',
                            component: SoldSettlementDetailFeewizlistComponent
                        }
                    ]
                }
            ]
        }
    ]
}];
