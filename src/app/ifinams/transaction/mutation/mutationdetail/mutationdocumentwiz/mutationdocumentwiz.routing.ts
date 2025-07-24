import { Routes } from '@angular/router';
import { MutationDocumentwizlistComponent } from './mutationdocumentwizlist/mutationdocumentwizlist.component';


export const MutationDocument: Routes = [{
    path: '',
    children: [
        {
            path: 'mutationdocumentlist/:id',
            component: MutationDocumentwizlistComponent
        }
    ]

}];
