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
import { MutationDetail } from './mutationdetaildetailwiz.routing';
import { MutationDetailDetailwizlistComponent } from './mutationdetaildetailwizlist/mutationdetaildetailwizlist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MutationDetail),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        MutationDetailDetailwizlistComponent,
    ],
    providers: [
        DALService
    ]
})

export class MutationDetailModule { }
