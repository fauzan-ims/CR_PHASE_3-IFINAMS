import { Routes } from '@angular/router';
import { DisposalDocumentReverseWizListComponent } from './reversedisposaldocumentwizlist/disposaldocumentwiz/disposaldocumentwiz.component';
import { ReverseDisposalDocumentWizListComponent } from './reversedisposaldocumentwizlist/reversedisposaldocumentwizlist.component';
import { ReverseDocumentDisposalWizListComponent } from './reversedisposaldocumentwizlist/reversedocumentdisposalwizlist/reversedocumentdisposalwizlist.component';


export const ReverseDisposalDocument: Routes = [{
    path: '',
    children: [
        {
            path: 'reversedisposaldocumentlist/:id',
            component: ReverseDisposalDocumentWizListComponent,
        },
        {
            path: 'disposaldocumentlist/:id',
            component: DisposalDocumentReverseWizListComponent
        },
        {
            path: 'reversedisposaldocumentlist/:id',
            component: ReverseDocumentDisposalWizListComponent
        }
        
    ]

}];
