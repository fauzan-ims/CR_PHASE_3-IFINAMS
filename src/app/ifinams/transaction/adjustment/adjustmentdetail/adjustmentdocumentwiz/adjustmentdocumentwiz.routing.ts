import { Routes } from '@angular/router';
import { AdjustmentdocumentwizlistComponent } from './adjustmentdocumentwizlist/adjustmentdocumentwizlist.component';


export const AdjustmentDocument: Routes = [{
    path: '',
    children: [
        {
            path: 'adjustmentdocumentlist/:id',
            component: AdjustmentdocumentwizlistComponent
        }
    ]

}];
