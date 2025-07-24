import { Routes } from '@angular/router';
import { MasterCustomReportConditionWizListComponent } from './mastercustomreportconditionwizlist/mastercustomreportconditionwizlist.component';

export const MasterReportCustomCondition: Routes = [{
    path: '',
    children: [
        {
            path: 'masterreportcustomcondition/:id',
            component: MasterCustomReportConditionWizListComponent
        },
    ]

}];
