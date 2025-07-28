import { Routes } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { AuthGuard } from '../../../auth.guard';
import { StockOnCustomerActivelistComponent } from './stockoncustomeractive/stockoncustomeractivelist/stockoncustomeractivelist.component';
import { StockOnCustomerNotActivelistComponent } from './stockoncustomernotactive/stockoncustomernotactivelist/stockoncustomernotactivelist.component';
import { StockOnCustomerNotActiveSellOnProcessListComponent } from './stockoncustomernotactivesellonprocess/stockoncustomernotactivesellonprocesslist/stockoncustomernotactivesellonprocesslist.component';
import { StockOnHandReservedListComponent } from './stockonhandreserved/stockonhandreservedlist/stockonhandreservedlist.component';
import { StockOnHandSellOnProcessListComponent } from './stockonhandsellonprocess/stockonhandsellonprocesslist/stockonhandsellonprocesslist.component';
import { ReplacementOnCustomerListComponent } from './replacementoncustomer/replacementoncustomerlist/replacementoncustomerlist.component';
import { ReplacementOnHandListComponent } from './replacementonhand/replacementonhandlist/replacementonhandlist.component';
import { SoldSoldListComponent } from './soldsold/soldsoldlist/soldsoldlist.component';
import { SoldClaimToSellListComponent } from './soldclaimtosell/soldclaimtoselllist/soldclaimtoselllist.component';
import { DisposedListComponent } from './disposed/disposedlist/disposedlist.component';
import { StockOnCustomerNotActiveEndContractListComponent } from './stockoncustomernotactiveendcontract/stockoncustomernotactiveendcontractlist/stockoncustomernotactiveendcontractlist.component';
import { StockOnHandListComponent } from './stockonhand/stockonhandlist/stockonhandlist.component';
import { ReplacementInTransitListComponent } from './replacementintransit/replacementintransitlist/replacementintransitlist.component';

export const MonitoringAsset: Routes = [{
    path: '',
    children:[
    // stock on customer active
    {
        path: 'substockoncustomeractivelist',
        component: StockOnCustomerActivelistComponent,
        canActivate: [AuthGuard],
    },

    // stock on customer not active
    {
        path: 'substockoncustomernotactivelist',
        component: StockOnCustomerNotActivelistComponent,
        canActivate: [AuthGuard]
    },
    
    // stock on customer not active on sell
    {
        path: 'substockoncustomernotactivesellonprocesslist',
        component: StockOnCustomerNotActiveSellOnProcessListComponent,
        canActivate: [AuthGuard]
    },

    // stock on hand
    {
        path: 'substockonhandlist',
        component: StockOnHandListComponent,
        canActivate: [AuthGuard]
    },

    // stock on hand reserved
    {
        path: 'substockonhandreservedlist',
        component: StockOnHandReservedListComponent,
        canActivate: [AuthGuard]
    },

    // stock on hand sell on process
    {
        path: 'substockonhandsellonprocesslist',
        component: StockOnHandSellOnProcessListComponent,
        canActivate: [AuthGuard]
    },

    // replacement on customer
    {
        path: 'subreplacementoncustomerlist',
        component: ReplacementOnCustomerListComponent,
        canActivate: [AuthGuard]
    },

    // replacement on hand
    {
        path: 'subreplacementonhandlist',
        component: ReplacementOnHandListComponent,
        canActivate: [AuthGuard]
    },

    // replacement in transit
    {
        path: 'subreplacementintransitlist',
        component: ReplacementInTransitListComponent,
        canActivate: [AuthGuard]
    },

    // sold sold
    {
        path: 'subsoldsoldlist',
        component: SoldSoldListComponent,
        canActivate: [AuthGuard]
    },

    // sold claim to sell
    {
        path: 'subsoldclaimtoselllist',
        component: SoldClaimToSellListComponent,
        canActivate: [AuthGuard]
    },

    // disposed
    {
        path: 'subdisposedlist',
        component: DisposedListComponent,
        canActivate: [AuthGuard]
    },

    // stock on customer not active end contract
    {
        path: 'substockoncustomernotactiveendcontractlist',
        component: StockOnCustomerNotActiveEndContractListComponent,
        canActivate: [AuthGuard]
    },
 ] 
}]