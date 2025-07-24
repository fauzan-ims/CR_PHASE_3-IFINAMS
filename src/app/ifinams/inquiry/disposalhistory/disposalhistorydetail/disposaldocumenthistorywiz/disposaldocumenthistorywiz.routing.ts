import { Routes } from '@angular/router';
import { DisposalDocumentHistorylistComponent } from './disposaldocumenthistorywizlist/disposaldocumenthistorywizlist.component';


export const DisposalDocument: Routes = [{
    path: '',
    children: [
        {
            path: 'disposaldocumenthistorylist/:id',
            component: DisposalDocumentHistorylistComponent
        }
    ]

}];
