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
import { SaleBidding } from './salebiddingwiz.routing';
import { SaleBiddingwizlistComponent } from './salebiddingwizlist/salebiddingwizlist.component';
import { SaleBiddingWizDetailComponent } from './salebiddingwizdetail/salebiddingwizdetail.component';
import { SaleBiddingDetailComponent } from './salebiddingwizdetail/salebiddingdetail/salebiddingdetail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SaleBidding),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        SaleBiddingwizlistComponent,
        SaleBiddingWizDetailComponent,
        SaleBiddingDetailComponent
    ],
    providers: [
        DALService
    ]
})

export class SaleBiddingModule { }
