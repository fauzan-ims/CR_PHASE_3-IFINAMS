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
import { ReverseSaleDocument } from './reversesaledocumentwiz.routing';
import { ReversesaleDocumentWizListComponent } from './reversesaledocumentwizlist/reversesaledocumentwizlist.component';
import { SaleDocumentReverseWizListComponent } from './reversesaledocumentwizlist/saledocumentreversewizlist/saledocumentreversewizlist.component';
import { ReverseDocumentWizListComponent } from './reversesaledocumentwizlist/reversedocumentwizlist/reversedocumentwizlist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ReverseSaleDocument),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        ReversesaleDocumentWizListComponent,
        SaleDocumentReverseWizListComponent,
        ReverseDocumentWizListComponent
    ],
    providers: [
        DALService
    ]
})

export class ReverseSaleDocumentModule { }
