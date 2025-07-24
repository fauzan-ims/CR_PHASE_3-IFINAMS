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
import { ReverseSaleDocumentHistory } from './reversesaledocumenthistorywiz.routing';
// import { ReverseSaleDocumentHistoryWizListComponent } from './reversesaledocumenthistorywizlist/reversesaledocumenthistorywizlist.component';
import { SaleDocumentReverseHistoryWizListComponent } from './reversesaledocumenthistorywizlist/saledocumentreversehistorywizlist/saledocumentreversehistorywizlist.component';
import { ReverseDocumentHistoryWizListComponent } from './reversesaledocumenthistorywizlist/reversedocumenthistorywizlist/reversedocumenthistorywizlist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ReverseSaleDocumentHistory),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        // ReverseSaleDocumentHistoryWizListComponent,
        SaleDocumentReverseHistoryWizListComponent,
        ReverseDocumentHistoryWizListComponent
    ],
    providers: [
        DALService
    ]
})

export class ReverseSaleDocumentHistoryModule { }
