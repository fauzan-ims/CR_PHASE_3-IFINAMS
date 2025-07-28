import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
// tslint:disable-next-line:max-line-length
import { DALService } from '../../../DALservice.service';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { MonitoringAsset } from './monitoringasset.routing';
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

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MonitoringAsset),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        StockOnCustomerActivelistComponent,
        StockOnCustomerNotActivelistComponent,
        StockOnCustomerNotActiveSellOnProcessListComponent,
        StockOnHandListComponent,
        StockOnHandReservedListComponent,
        StockOnHandSellOnProcessListComponent,
        ReplacementOnCustomerListComponent,
        ReplacementOnHandListComponent,
        ReplacementInTransitListComponent,
        SoldSoldListComponent,
        SoldClaimToSellListComponent,
        DisposedListComponent,
        StockOnCustomerNotActiveEndContractListComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }