import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { Registration } from './registration.routing';
import { ManualregistrationlistComponent } from './manualregistration/manualregistrationlist/manualregistrationlist.component';
import { ManualregistrationdetailComponent } from './manualregistration/manualregistrationdetail/manualregistrationdetail.component';
import { InsuranceexistinglistComponent } from './insuranceexisting/insuranceexistinglist/insuranceexistinglist.component';
import { InsuranceexistingdetailComponent } from './insuranceexisting/insuranceexistingdetail/insuranceexistingdetail.component';
import { SpparequestlistComponent } from './spparequest/spparequestlist/spparequestlist.component';
import { SppalistComponent } from './sppa/sppalist/sppalist.component';
import { SppadetailComponent } from './sppa/sppadetail/sppadetail.component';
import { PolicylistComponent } from './policy/policylist/policylist.component';
import { PolicydetailComponent } from './policy/policydetail/policydetail.component';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { SppadetailresultComponent } from './sppa/sppadetail/sppadetailresult/sppadetailresult.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { RegisterperiodlistComponent } from './manualregistration/manualregistrationdetail/registerperiodwiz/registerperiodlist/registerperiodlist.component';
import { RegisterperioddetailComponent } from './manualregistration/manualregistrationdetail/registerperiodwiz/registerperioddetail/registerperioddetail.component';
import { RegisterloadinglistComponent } from './manualregistration/manualregistrationdetail/registerloadingwiz/registerloadinglist/registerloadinglist.component';
import { PolicymainperiodlistComponent } from './policy/policydetail/policymainperiodwiz/policymainperiodlist/policymainperiodlist.component';
import { PolicymainperiodadjusmentlistComponent } from './policy/policydetail/policymainperiodadjusmentwiz/policymainperiodadjusmentlist/policymainperiodadjusmentlist.component';
import { PolicymainloadinglistComponent } from './policy/policydetail/policymainloadingwiz/policymainloadinglist/policymainloadinglist.component';
import { PolicymainhistorylistComponent } from './policy/policydetail/policymainhistorywiz/policymainhistorylist/policymainhistorylist.component';
import { ClaimlistComponent } from './claim/claimlist/claimlist.component';
import { ClaimdetailComponent } from './claim/claimdetail/claimdetail.component';
import { TerminationlistComponent } from './termination/terminationlist/terminationlist.component';
import { EndorsementlistComponent } from './endorsement/endorsementlist/endorsementlist.component';
import { EndorsementdetailComponent } from './endorsement/endorsementdetail/endorsementdetail.component';
import { TerminationdetailComponent } from './termination/terminationdetail/terminationdetail.component';
import { EndorsementperioddetailComponent } from './endorsement/endorsementdetail/endorsementperioddetail/endorsementperioddetail.component';
import { EndorsementloadingdetailComponent } from './endorsement/endorsementdetail/endorsementloadingdetail/endorsementloadingdetail.component';
import { ClaimprogresslistComponent } from './claim/claimdetail/claimprogresswiz/claimprogresslist/claimprogresslist.component';
import { ClaimprogressdetailComponent } from './claim/claimdetail/claimprogresswiz/claimprogressdetail/claimprogressdetail.component';
import { ClaimdoclistComponent } from './claim/claimdetail/claimdocwiz/claimdoclist/claimdoclist.component';
import { PaymentrenewallistComponent } from './paymentrenewal/paymentrenewallist/paymentrenewallist.component';
import { PaymentrenewaldetailComponent } from './paymentrenewal/paymentrenewaldetail/paymentrenewaldetail.component';
import { MonitoringlistComponent } from './monitoring/monitoringlist/monitoringlist.component';
import { RegisterassetlistComponent } from './manualregistration/manualregistrationdetail/registerassetwiz/registerassetwizlist/registerassetwizlist.component';
import { RegisterAssetdetailComponent } from './manualregistration/manualregistrationdetail/registerassetwiz/registerassetwizdetail/registerassetwizdetail.component';
import { PolicyMainAssetlistComponent } from './policy/policydetail/policymainasset/policymainassetlist/policymainassetlist.component';
import { PolicyMainAssetdetailComponent } from './policy/policydetail/policymainasset/policymainassetdetail/policymainassetdetail.component';
import { ClaimAssetwizlistComponent } from './claim/claimdetail/claimassetwiz/claimassetwizlist/claimassetwizlist.component';
import { PolicyApprovalComponent } from './policy/policyapproval/policyapproval.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Registration),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        ManualregistrationlistComponent,
        ManualregistrationdetailComponent,
        InsuranceexistinglistComponent,
        InsuranceexistingdetailComponent,
        SpparequestlistComponent,
        SppalistComponent,
        SppadetailComponent,
        SppadetailresultComponent,
        PolicylistComponent,
        PolicydetailComponent,
        ManualregistrationlistComponent,
        RegisterperiodlistComponent,
        RegisterperioddetailComponent,
        RegisterloadinglistComponent,
        PolicymainperiodlistComponent,
        PolicymainperiodadjusmentlistComponent,
        PolicymainloadinglistComponent,
        PolicymainhistorylistComponent,
        ClaimlistComponent,
        ClaimdetailComponent,
        TerminationlistComponent,
        EndorsementlistComponent,
        EndorsementdetailComponent,
        TerminationdetailComponent,
        EndorsementperioddetailComponent,
        EndorsementloadingdetailComponent,
        ClaimprogresslistComponent,
        ClaimprogressdetailComponent,
        ClaimdoclistComponent,
        PaymentrenewallistComponent,
        PaymentrenewaldetailComponent,
        MonitoringlistComponent,
        RegisterassetlistComponent,
        RegisterAssetdetailComponent,
        PolicyMainAssetlistComponent,
        PolicyMainAssetdetailComponent,
        ClaimAssetwizlistComponent,
        PolicyApprovalComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
