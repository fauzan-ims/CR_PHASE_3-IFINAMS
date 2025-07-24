import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { SaleBiddingHistory } from './salebiddinghistorywiz.routing';
import { SaleBiddingHistorywizlistComponent } from './salebiddinghistorywizlist/salebiddinghistorywizlist.component';
import { SaleBiddingHistoryWizDetailComponent } from './salebiddinghistorywizdetail/salebiddinghistorywizdetail.component';
import { SaleBiddingHistoryDetailComponent } from './salebiddinghistorywizdetail/salebiddinghistorydetail/salebiddinghistorydetail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SaleBiddingHistory),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        SaleBiddingHistorywizlistComponent,
        SaleBiddingHistoryWizDetailComponent,
        SaleBiddingHistoryDetailComponent
    ],
    providers: [
        DALService
    ]
})

export class SaleBiddingModule { }
