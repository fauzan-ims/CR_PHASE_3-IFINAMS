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
import { Birojasa } from './birojasa.routing';

import { RegisterdetailComponent } from './register/registerdetail/registerdetail.component';
import { RegisterdetaillistComponent } from './register/registerdetail/registerdetailwiz/registerdetaillist/registerdetaillist.component';
import { RegisterdocumentlistComponent } from './register/registerdetail/registerdocumentwiz/registerdocumentlist/registerdocumentlist.component';
import { OrdertopublicservicelistComponent } from './ordertopublicservice/ordertopublicservicelist/ordertopublicservicelist.component';
import { OrdertopublicservicedetailComponent } from './ordertopublicservice/ordertopublicservicedetail/ordertopublicservicedetail.component';
import { RealizationlistComponent } from './realization/realizationlist/realizationlist.component';
import { DeliveryresultlistComponent } from './deliveryresult/deliveryresultlist/deliveryresultlist.component';
import { DeliveryresultdetailComponent } from './deliveryresult/deliveryresultdetail/deliveryresultdetail.component';
import { RealizationdetailComponent } from './realization/realizationdetail/realizationdetail.component';
import { RegisterlistComponent } from './register/registerlist/registerlist.component';
import { MonitoringlistComponent } from './monitoring/monitoringlist/monitoringlist.component';
import { DeliverylistComponent } from './delivery/deliverylist/deliverylist.component';
import { DeliverydetailComponent } from './delivery/deliverydetail/deliverydetail.component';
import { RealizationapprovalComponent } from './realization/realizationapproval/realizationapproval.component';
import { OrdertopublicserviceapprovalComponent } from './ordertopublicservice/ordertopublicserviceapproval/ordertopublicserviceapproval.component';
import { DeliveryRequestListComponent } from './deliveryrequest/deliveryrequestlist/deliveryrequestlist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Birojasa),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
 
    ],
    declarations: [
       
        RegisterlistComponent,
        RegisterdetailComponent,
        RegisterdetaillistComponent,
        RegisterdocumentlistComponent,
        OrdertopublicservicelistComponent,
        OrdertopublicservicedetailComponent,
        RealizationlistComponent,
        RealizationdetailComponent,
        DeliveryresultlistComponent,
        DeliveryresultdetailComponent,
        MonitoringlistComponent,
        DeliverylistComponent,
        DeliverydetailComponent,
        RealizationapprovalComponent,
        OrdertopublicserviceapprovalComponent,
        DeliveryRequestListComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
