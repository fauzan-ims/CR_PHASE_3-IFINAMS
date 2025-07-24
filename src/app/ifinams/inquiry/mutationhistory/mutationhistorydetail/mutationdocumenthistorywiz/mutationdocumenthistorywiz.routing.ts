import { Routes } from '@angular/router';
import { MutationDocumentHistorywizlistComponent } from './mutationdocumenthistorywizlist/mutationdocumenthistorywizlist.component';


export const MutationDocumentHistory: Routes = [{
    path: '',
    children: [
        {
            path: 'mutationdocumenthistorylist/:id',
            component: MutationDocumentHistorywizlistComponent
        }
    ]

}];
