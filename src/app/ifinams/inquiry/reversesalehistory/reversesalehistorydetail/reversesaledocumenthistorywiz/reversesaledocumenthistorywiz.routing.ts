import { Routes } from '@angular/router';
import { ReverseDocumentHistoryWizListComponent } from './reversesaledocumenthistorywizlist/reversedocumenthistorywizlist/reversedocumenthistorywizlist.component';
//import { ReverseSaleDocumentHistoryWizListComponent } from './reversesaledocumenthistorywizlist/reversesaledocumenthistorywizlist.component';
import { SaleDocumentReverseHistoryWizListComponent } from './reversesaledocumenthistorywizlist/saledocumentreversehistorywizlist/saledocumentreversehistorywizlist.component';


export const ReverseSaleDocumentHistory: Routes = [{
    path: '',
    children: [
        // {
        //     path: 'reversesaledocumenthistorylist/:id',
        //     component: ReverseSaleDocumentHistoryWizListComponent,
        // },
        {
            path: 'saledocumentreversehistorylist/:id/',
            component: SaleDocumentReverseHistoryWizListComponent
        },
        {
            path: 'reversedocumenthistorylist/:id',
            component: ReverseDocumentHistoryWizListComponent
        }
    ]

}];
