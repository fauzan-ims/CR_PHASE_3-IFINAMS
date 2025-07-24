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
import { ReverseDisposalDocument } from './reversedisposaldocument.routing';
import { ReverseDisposalDocumentWizListComponent } from './reversedisposaldocumentwizlist/reversedisposaldocumentwizlist.component';
import { DisposalDocumentReverseWizListComponent } from './reversedisposaldocumentwizlist/disposaldocumentwiz/disposaldocumentwiz.component';
import { ReverseDocumentDisposalWizListComponent } from './reversedisposaldocumentwizlist/reversedocumentdisposalwizlist/reversedocumentdisposalwizlist.component';

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
        ReverseDisposalDocumentWizListComponent,
        DisposalDocumentReverseWizListComponent,
        ReverseDocumentDisposalWizListComponent
    ],
    providers: [
        DALService
    ]
})

export class ReverseDisposalDocumentModule { }
