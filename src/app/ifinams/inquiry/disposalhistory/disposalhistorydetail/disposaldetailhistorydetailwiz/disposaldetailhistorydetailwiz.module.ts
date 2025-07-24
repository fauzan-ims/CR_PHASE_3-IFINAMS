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
import { DisposalDetail } from './disposaldetailhistorydetailwiz.routing';
import { DisposalDetailHistoryDetailwizlistComponent } from './disposaldetailhistorydetailwizlist/disposaldetailhistorydetailwizlist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DisposalDetail),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        DisposalDetailHistoryDetailwizlistComponent,
    ],
    providers: [
        DALService
    ]
})

export class DisposalDetailHistoryModule { }
