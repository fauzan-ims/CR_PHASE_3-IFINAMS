import { Routes } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { AuthGuard } from '../../../auth.guard';
import { PaymentlistComponent } from './payment/paymentlist/paymentlist.component';
import { PaymentdetailComponent } from './payment/paymentdetail/paymentdetail.component';
import { PaymentrequstlistComponent } from './paymentrequest/paymentrequestlist/paymentrequestlist.component';
import { WorkOrderApprovalComponent } from './payment/paymentapproval/workorderapproval/workorderapproval.component';
import { PaymentapprovalComponent } from './payment/paymentapproval/paymentapprovallist/paymentapproval.component';
// import { worker } from 'cluster';
import { RealizationapprovalComponent } from './payment/paymentapproval/realizationapproval/realizationapproval.component';
import { OrdertopublicserviceapprovalComponent } from './payment/paymentapproval/ordertopublicserviceapproval/ordertopublicserviceapproval.component';
import { PolicyApprovalComponent } from './payment/paymentapproval/policyapproval/policyapproval.component';

export const Payment: Routes = [{
    path: '',
    children:[
    {
        path: 'subpaymentlist',
        component: PaymentlistComponent,
        canActivate: [AuthGuard],
        children: 
        [
            {
                path: 'paymentdetail',
                component: PaymentdetailComponent
            },
            {
                path: 'paymentdetail/:paymentcode',
                component: PaymentdetailComponent,
                
            }
        ]
    },
    //payment request
    {
        path: 'subpaymentrequest',
        component: PaymentrequstlistComponent,
        canActivate: [AuthGuard]
    },

    //payment request
    {
        path: 'subpaymentapproval/:id',
        component: PaymentapprovalComponent,
        canActivate: [AuthGuard],
        children: 
        [
            {
                path: 'paymentapproval/:id',
                component: PaymentapprovalComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'workorderapproval/:id/:id2',
                component: WorkOrderApprovalComponent,
                canActivate: [AuthGuard]
                // children: [
                //     {
                //         path: 'workorderapproval/:id/:id',
                //         component: WorkOrderApprovalComponent
                //     }
                // ]
            },
        ]
    },

    //workorder
    {
        path: 'subworkorder/:id/:id2',
        component: WorkOrderApprovalComponent,
        canActivate: [AuthGuard],
    },
    //

    //realization
    {
        path: 'subrealization/:id/:id2',
        component: RealizationapprovalComponent,
        canActivate: [AuthGuard],
    },
    //realization

    //birojasa
    {
        path: 'subdporder/:id/:id2',
        component: OrdertopublicserviceapprovalComponent,
        canActivate: [AuthGuard],
    },
    //birojasa

    //birojasa
    {
        path: 'subpolicy/:id/:id2',
        component: PolicyApprovalComponent,
        canActivate: [AuthGuard],
    },
    //birojasa

 ] //payment request
}]