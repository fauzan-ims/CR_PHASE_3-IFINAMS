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
import { MasterReportCustomColumn } from './masterreportcustomcolumnwiz.routing';
import { MasterReportCustomColumnComponent } from './mastercustomreportcolumnwizlist/masterreportcustomcolumnwizlist.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MasterReportCustomColumn),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        MasterReportCustomColumnComponent
    ],
    providers: [
        DALService
    ]
})

export class MasterReportCustomColumnWizModule { }
