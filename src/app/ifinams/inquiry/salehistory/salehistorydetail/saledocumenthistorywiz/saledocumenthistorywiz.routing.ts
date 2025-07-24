import { Routes } from '@angular/router';
import { SaleDocumentHistorywizlistComponent } from './saledocumenthistorywizlist/saledocumenthistorywizlist.component';


export const SaleDocument: Routes = [{
    path: '',
    children: [
        {
            path: 'saledocumenthistorylist/:id',
            component: SaleDocumentHistorywizlistComponent
        }
    ]

}];
