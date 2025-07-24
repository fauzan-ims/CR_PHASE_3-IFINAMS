import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
// tslint:disable-next-line:max-line-length
import { DALService } from '../../../DALservice.service';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { Payment } from './payment.routing';

import { PaymentlistComponent } from './payment/paymentlist/paymentlist.component';
import { PaymentdetailComponent } from './payment/paymentdetail/paymentdetail.component';
import { PaymentrequstlistComponent } from './paymentrequest/paymentrequestlist/paymentrequestlist.component';
import { WorkOrderApprovalComponent } from './payment/paymentapproval/workorderapproval/workorderapproval.component';
import { PaymentapprovalComponent } from './payment/paymentapproval/paymentapprovallist/paymentapproval.component';
import { RealizationapprovalComponent } from './payment/paymentapproval/realizationapproval/realizationapproval.component';
import { OrdertopublicserviceapprovalComponent } from './payment/paymentapproval/ordertopublicserviceapproval/ordertopublicserviceapproval.component';
import { PolicyApprovalComponent } from './payment/paymentapproval/policyapproval/policyapproval.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Payment),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        PaymentlistComponent,
        PaymentdetailComponent,
        PaymentrequstlistComponent,
        PaymentapprovalComponent,
        WorkOrderApprovalComponent,
        RealizationapprovalComponent,
        OrdertopublicserviceapprovalComponent,
        PolicyApprovalComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }