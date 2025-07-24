import { Routes } from '@angular/router';
import { DisposalDocumentlistComponent } from './disposaldocumentwizlist/disposaldocumentwizlist.component';


export const DisposalDocument: Routes = [{
    path: '',
    children: [
        {
            path: 'disposaldocumentlist/:id',
            component: DisposalDocumentlistComponent
        }
    ]

}];
