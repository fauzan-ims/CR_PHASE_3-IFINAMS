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
import { Settlement } from './settlement.routing';
import { SoldRequestListComponent } from './soldrequest/soldrequestlist/soldrequestlist.component';
import { SoldRequestdetailComponent } from './soldrequest/soldrequestdetail/soldrequestdetail.component';
import { SoldRequestDetailwizlistComponent } from './soldrequest/soldrequestdetail/soldrequestassetwiz/soldrequestassetwizlist/soldrequestwizlist.component';
import { SoldSettlementListComponent } from './soldsettlement/soldsettlementlist/soldsettlementlist.component';
import { SoldSettlementdetailComponent } from './soldsettlement/soldsettlementdetail/soldsettlementdetail.component';
import { SoldSettlementDetailFeewizlistComponent } from './soldsettlement/soldsettlementdetail/soldsettlementdetailfeewiz/soldsettlementdetailfeewizlist/soldsettlementdetailfeewizlist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Settlement),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        SoldRequestListComponent,
        SoldRequestdetailComponent,
        SoldRequestDetailwizlistComponent,
        SoldSettlementListComponent,
        SoldSettlementdetailComponent,
        SoldSettlementDetailFeewizlistComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
