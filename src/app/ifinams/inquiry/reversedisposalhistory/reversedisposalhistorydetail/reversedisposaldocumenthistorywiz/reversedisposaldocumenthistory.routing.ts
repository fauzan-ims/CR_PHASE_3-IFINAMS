import { Routes } from '@angular/router';
import { DisposalDocumentReverseHistoryWizListComponent } from './reversedisposaldocumenthistorywizlist/disposaldocumenthistorywiz/disposaldocumenthistorywiz.component';
import { ReverseDisposalDocumentHistoryWizListComponent } from './reversedisposaldocumenthistorywizlist/reversedisposaldocumenthistorywizlist.component';
import { ReverseDocumentDisposalHistoryWizListComponent } from './reversedisposaldocumenthistorywizlist/reversedocumentdisposalhistorywizlist/reversedocumentdisposalhistorywizlist.component';


export const ReverseDisposalDocument: Routes = [{
    path: '',
    children: [
        {
            path: 'reversedisposaldocumenthistorylist/:id',
            component: ReverseDisposalDocumentHistoryWizListComponent,
        },
        {
            path: 'disposaldocumenthistorylist/:id',
            component: DisposalDocumentReverseHistoryWizListComponent
        },
        {
            path: 'reversedisposaldocumenthistorylist/:id',
            component: ReverseDocumentDisposalHistoryWizListComponent
        }
        
    ]

}];
