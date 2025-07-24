import { Routes } from '@angular/router';
import { SaleDocumentwizlistComponent } from './saledocumentwizlist/saledocumentwizlist.component';


export const SaleDocument: Routes = [{
    path: '',
    children: [
        {
            path: 'saledocumentlist/:id',
            component: SaleDocumentwizlistComponent
        }
    ]

}];
