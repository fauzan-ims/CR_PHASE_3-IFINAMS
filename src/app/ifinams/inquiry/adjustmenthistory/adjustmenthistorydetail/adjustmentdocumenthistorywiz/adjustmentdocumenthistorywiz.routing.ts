import { Routes } from '@angular/router';
import { AdjustmentdocumentHistorywizlistComponent } from './adjustmentdocumenthistorywizlist/adjustmentdocumenthistorywizlist.component';


export const AdjustmentDocument: Routes = [{
    path: '',
    children: [
        {
            path: 'adjustmentdocumentlist/:id',
            component: AdjustmentdocumentHistorywizlistComponent
        }
    ]

}];
