import { Routes } from '@angular/router';
import { MasterReportCustomColumnComponent } from './mastercustomreportcolumnwizlist/masterreportcustomcolumnwizlist.component';

export const MasterReportCustomColumn: Routes = [{
    path: '',
    children: [
        {
            path: 'masterreportcustomcolumn/:id',
            component: MasterReportCustomColumnComponent
        },
    ]

}];
