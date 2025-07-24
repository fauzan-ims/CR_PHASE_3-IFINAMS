import { Routes } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { AuthGuard } from '../../../auth.guard';
import { AuditlistComponent } from './audit/auditlist/auditlist.component';
import { BackuplistComponent } from './backup/backuplist/backuplist.component';
import { EodlistComponent } from './eod/eodlist/eodlist.component';
import { MasterfaqdetailComponent } from './faq/masterfaqdetail/masterfaqdetail.component';
import { MasterfaqlistComponent } from './faq/masterfaqlist/masterfaqlist.component';
import { GlobalParamdetailComponent } from './globalparam/globalparamdetail/globalparamdetail.component';
import { GlobalParamlistComponent } from './globalparam/globalparamlist/globalparamlist.component';
import { LockingdetailComponent } from './locking/lockingdetail/lockingdetail.component';
import { LockinglistComponent } from './locking/lockinglist/lockinglist.component';
import { MasterjobdetailComponent } from './masterjob/masterjobdetail/masterjobdetail.component';
import { MasterjoblistComponent } from './masterjob/masterjoblist/masterjoblist.component';
import { SysErrorLoglistComponent } from './syserrorlog/syserrorloglist/syserrorloglist.component';
import { ReportLogComponent } from './sysreportlog/reportlog/reportlog.component';



export const ControlPanel: Routes = [{
    path: '',
    children: [

        {
            path: 'subbackuplist',
            component: BackuplistComponent,
            canActivate: [AuthGuard],
        },
        {
            path: 'sublockinglist',
            component: LockinglistComponent,
            canActivate: [AuthGuard],
            children : [
                {
                    path: 'lockingdetail',
                    component: LockingdetailComponent
                },
                {
                    path: 'lockingdetail/:id',
                    component: LockingdetailComponent

                }
            ]
        },
        {
            path: 'subeodlist',
            component: EodlistComponent,
            canActivate: [AuthGuard],
        },
        {
            path: 'subauditlist',
            component: AuditlistComponent,
            canActivate: [AuthGuard],
        },

        //global param
        {
            path: 'subglobalparamlist',
            component: GlobalParamlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'globalparamdetail', /*add*/
                    component: GlobalParamdetailComponent
                },
                {
                    path: 'globalparamdetail/:id', /*update*/
                    component: GlobalParamdetailComponent
                },
            ]
        },
        
        //job taasklist
        {
            path: 'subjobtasklist',
            component: MasterjoblistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masterjobdetail', /*add*/
                    component: MasterjobdetailComponent
                },
                {
                    path: 'masterjobdetail/:id', /*update*/
                    component: MasterjobdetailComponent
                },
            ]
        },

        //FAQ
        {
            path: 'submasterfaqlist',
            component: MasterfaqlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'submasterfaqdetail', /*add */
                    component: MasterfaqdetailComponent
                },
                {
                    path: 'submasterfaqdetail/:id', /*update */
                    component: MasterfaqdetailComponent
                }, 
            ]
        },
        {
            path: 'subreportlog',
            component: ReportLogComponent,
            canActivate: [AuthGuard],
        },
        {
            path: 'subsyserrorloglist',
            component: SysErrorLoglistComponent,
            canActivate: [AuthGuard],
        },
        
    ]

}];
