import { Routes } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { AuthGuard } from '../../../auth.guard';
import { RealizationlistComponent } from './realization/realizationlist/realizationlist.component';
import { RealizationdetailComponent } from './realization/realizationdetail/realizationdetail.component';
import { DeliveryresultlistComponent } from './deliveryresult/deliveryresultlist/deliveryresultlist.component';
import { DeliveryresultdetailComponent } from './deliveryresult/deliveryresultdetail/deliveryresultdetail.component';
import { OrdertopublicservicedetailComponent } from './ordertopublicservice/ordertopublicservicedetail/ordertopublicservicedetail.component';
import { OrdertopublicservicelistComponent } from './ordertopublicservice/ordertopublicservicelist/ordertopublicservicelist.component';
import { RegisterdocumentlistComponent } from './register/registerdetail/registerdocumentwiz/registerdocumentlist/registerdocumentlist.component';
import { RegisterdetaillistComponent } from './register/registerdetail/registerdetailwiz/registerdetaillist/registerdetaillist.component';
import { RegisterdetailComponent } from './register/registerdetail/registerdetail.component';
import { RegisterlistComponent } from './register/registerlist/registerlist.component';
import { MonitoringlistComponent } from './monitoring/monitoringlist/monitoringlist.component';
import { DeliverylistComponent } from './delivery/deliverylist/deliverylist.component';
import { DeliverydetailComponent } from './delivery/deliverydetail/deliverydetail.component';
import { RealizationapprovalComponent } from './realization/realizationapproval/realizationapproval.component';
import { OrdertopublicserviceapprovalComponent } from './ordertopublicservice/ordertopublicserviceapproval/ordertopublicserviceapproval.component';
import { DeliveryRequestListComponent } from './deliveryrequest/deliveryrequestlist/deliveryrequestlist.component';

export const Birojasa: Routes = [{
    path: '',
    children: [
        {
            path: 'registerbirojasalist',
            component: RegisterlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'registerdetail',
                    component: RegisterdetailComponent
                },
                {
                    path: 'registerdetail/:id',
                    component: RegisterdetailComponent,
                    children: [
                        {
                            path: 'registerdetaillist/:id',
                            component: RegisterdetaillistComponent
                        },
                        {
                            path: 'registerdocumentlist/:id',
                            component: RegisterdocumentlistComponent
                        }
                    ]
                }
            ]
        },
        {
            path: 'ordertobirojasalist',
            component: OrdertopublicservicelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'ordertopublicservicedetail',
                    component: OrdertopublicservicedetailComponent
                },
                {
                    path: 'ordertopublicservicedetail/:id',
                    component: OrdertopublicservicedetailComponent
                }
            ]
        },
        {
            path: 'realizationlist',
            component: RealizationlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'realizationdetail',
                    component: RealizationdetailComponent
                },
                {
                    path: 'realizationdetail/:id',
                    component: RealizationdetailComponent
                }
            ]
        },
        {
            path: 'deliveryresultlist',
            component: DeliveryresultlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'deliveryresultdetail',
                    component: DeliveryresultdetailComponent
                },
                {
                    path: 'deliveryresultdetail/:id',
                    component: DeliveryresultdetailComponent
                }
            ]
        },

        //monitoring
        {
            path: 'monitoringlist',
            component: MonitoringlistComponent,
            canActivate: [AuthGuard]
        },
        //monitoring
        {
            path: 'subdeliverylist',
            component: DeliverylistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'deliverydetail/:id',
                    component: DeliverydetailComponent
                }
            ]
        },

        //
        {
            path: 'realizationapproval/:id',
            component: RealizationapprovalComponent
        },
        //

        //
        {
            path: 'ordertobureau/:id',
            component: OrdertopublicserviceapprovalComponent
        },
        //

                //delivery request
        {
            path: 'subdeliveryrequestlist',
            component: DeliveryRequestListComponent
        },
        //end delivery request
      
      
    ]
}];
