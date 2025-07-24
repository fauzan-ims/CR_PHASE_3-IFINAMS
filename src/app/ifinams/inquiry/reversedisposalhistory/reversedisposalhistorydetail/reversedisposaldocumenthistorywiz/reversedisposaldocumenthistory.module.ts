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
import { ReverseDisposalDocument } from './reversedisposaldocumenthistory.routing';
import { ReverseDisposalDocumentHistoryWizListComponent } from './reversedisposaldocumenthistorywizlist/reversedisposaldocumenthistorywizlist.component';
import { DisposalDocumentReverseHistoryWizListComponent } from './reversedisposaldocumenthistorywizlist/disposaldocumenthistorywiz/disposaldocumenthistorywiz.component';
import { ReverseDocumentDisposalHistoryWizListComponent } from './reversedisposaldocumenthistorywizlist/reversedocumentdisposalhistorywizlist/reversedocumentdisposalhistorywizlist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ReverseDisposalDocument),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        ReverseDisposalDocumentHistoryWizListComponent,
        DisposalDocumentReverseHistoryWizListComponent,
        ReverseDocumentDisposalHistoryWizListComponent
    ],
    providers: [
        DALService
    ]
})

export class ReverseDisposalDocumentHistoryModule { }
