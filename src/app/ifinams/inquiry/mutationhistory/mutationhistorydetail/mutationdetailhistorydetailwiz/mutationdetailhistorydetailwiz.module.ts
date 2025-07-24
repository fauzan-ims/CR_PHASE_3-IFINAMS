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
import { MutationDetailHistory } from './mutationdetailhistorydetailwiz.routing';
import { MutationDetailHistoryDetailwizlistComponent } from './mutationdetailhistorydetailwizlist/mutationdetailhistorydetailwizlist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MutationDetailHistory),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        MutationDetailHistoryDetailwizlistComponent,
    ],
    providers: [
        DALService
    ]
})

export class MutationDetailHistoryModule { }
