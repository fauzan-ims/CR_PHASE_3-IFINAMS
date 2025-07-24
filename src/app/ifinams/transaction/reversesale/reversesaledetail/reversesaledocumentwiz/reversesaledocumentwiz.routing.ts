import { Routes } from '@angular/router';
import { ReverseDocumentWizListComponent } from './reversesaledocumentwizlist/reversedocumentwizlist/reversedocumentwizlist.component';
import { ReversesaleDocumentWizListComponent } from './reversesaledocumentwizlist/reversesaledocumentwizlist.component';
import { SaleDocumentReverseWizListComponent } from './reversesaledocumentwizlist/saledocumentreversewizlist/saledocumentreversewizlist.component';


export const ReverseSaleDocument: Routes = [{
    path: '',
    children: [
        {
            path: 'reversesaledocumentlist/:id',
            component: ReversesaleDocumentWizListComponent,
        },
        {
            path: 'saledocumentreverselist/:id/',
            component: SaleDocumentReverseWizListComponent
        },
        {
            path: 'reversedocumentlist/:id',
            component: ReverseDocumentWizListComponent
        }
    ]

}];
