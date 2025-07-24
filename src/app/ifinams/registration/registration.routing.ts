import { Routes } from '@angular/router';
import { ManualregistrationlistComponent } from './manualregistration/manualregistrationlist/manualregistrationlist.component';
import { ManualregistrationdetailComponent } from './manualregistration/manualregistrationdetail/manualregistrationdetail.component';
import { InsuranceexistinglistComponent } from './insuranceexisting/insuranceexistinglist/insuranceexistinglist.component';
import { InsuranceexistingdetailComponent } from './insuranceexisting/insuranceexistingdetail/insuranceexistingdetail.component';
import { SpparequestlistComponent } from './spparequest/spparequestlist/spparequestlist.component';
import { SppadetailComponent } from './sppa/sppadetail/sppadetail.component';
import { SppadetailresultComponent } from './sppa/sppadetail/sppadetailresult/sppadetailresult.component';
import { SppalistComponent } from './sppa/sppalist/sppalist.component';
import { PolicydetailComponent } from './policy/policydetail/policydetail.component';
import { PolicylistComponent } from './policy/policylist/policylist.component';
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

//wizard
import { RegisterperiodlistComponent } from './manualregistration/manualregistrationdetail/registerperiodwiz/registerperiodlist/registerperiodlist.component';
import { RegisterperioddetailComponent } from './manualregistration/manualregistrationdetail/registerperiodwiz/registerperioddetail/registerperioddetail.component';
import { RegisterloadinglistComponent } from './manualregistration/manualregistrationdetail/registerloadingwiz/registerloadinglist/registerloadinglist.component';
import { PolicymainhistorylistComponent } from './policy/policydetail/policymainhistorywiz/policymainhistorylist/policymainhistorylist.component';
import { PolicymainloadinglistComponent } from './policy/policydetail/policymainloadingwiz/policymainloadinglist/policymainloadinglist.component';
import { PolicymainperiodadjusmentlistComponent } from './policy/policydetail/policymainperiodadjusmentwiz/policymainperiodadjusmentlist/policymainperiodadjusmentlist.component';
import { PolicymainperiodlistComponent } from './policy/policydetail/policymainperiodwiz/policymainperiodlist/policymainperiodlist.component';

import { AuthGuard } from '../../../auth.guard';
import { PaymentrenewallistComponent } from './paymentrenewal/paymentrenewallist/paymentrenewallist.component';
import { PaymentrenewaldetailComponent } from './paymentrenewal/paymentrenewaldetail/paymentrenewaldetail.component';
import { MonitoringlistComponent } from './monitoring/monitoringlist/monitoringlist.component';
import { RegisterassetlistComponent } from './manualregistration/manualregistrationdetail/registerassetwiz/registerassetwizlist/registerassetwizlist.component';
import { RegisterAssetdetailComponent } from './manualregistration/manualregistrationdetail/registerassetwiz/registerassetwizdetail/registerassetwizdetail.component';
import { PolicyMainAssetlistComponent } from './policy/policydetail/policymainasset/policymainassetlist/policymainassetlist.component';
import { PolicyMainAssetdetailComponent } from './policy/policydetail/policymainasset/policymainassetdetail/policymainassetdetail.component';
import { ClaimAssetwizlistComponent } from './claim/claimdetail/claimassetwiz/claimassetwizlist/claimassetwizlist.component';
import { PolicyApprovalComponent } from './policy/policyapproval/policyapproval.component';

export const Registration: Routes = [{
    path: '',
    children: [
        //manualregistration
        {
            path: 'submanualregistrationlist',
            component: ManualregistrationlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'manualregistrationdetail', /*add*/
                    component: ManualregistrationdetailComponent
                },
                {
                    path: 'manualregistrationdetail/:id', /*update*/
                    component: ManualregistrationdetailComponent,
                    children: [
                        {
                            path: 'subregisterperiodlist/:id',
                            component: RegisterperiodlistComponent,
                            children: [
                                {
                                    path: 'registerperioddetail/:id',
                                    component: RegisterperioddetailComponent
                                }, {
                                    path: 'registerperioddetail/:id/:id2',
                                    component: RegisterperioddetailComponent
                                }
                            ]
                        },
                        {
                            path: 'subregisterloadinglist/:id',
                            component: RegisterloadinglistComponent
                        },
                        {
                            path: 'subregisterassetlist/:id',
                            component: RegisterassetlistComponent,
                            children: [
                                {
                                    path: 'registerassetdetail/:id/:id2',
                                    component: RegisterAssetdetailComponent
                                }
                            ]
                        }
                    ]
                },
            ]
        },
        //manualregistration

        //insuranceexisting
        {
            path: 'subinsuranceexistinglist',
            component: InsuranceexistinglistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'insuranceexistingdetail', /*add*/
                    component: InsuranceexistingdetailComponent
                },
                {
                    path: 'insuranceexistingdetail/:id', /*update*/
                    component: InsuranceexistingdetailComponent
                },
            ]
        },
        //insuranceexisting

        //spparequest
        {
            path: 'subspparequestlist',
            component: SpparequestlistComponent,
            canActivate: [AuthGuard]
        },
        //spparequest

        //MonitoringlistComponent
        {
            path: 'submonitoring',
            component: MonitoringlistComponent,
            canActivate: [AuthGuard]
        },
        //MonitoringlistComponent

        //sppa
        {
            path: 'subsppalist',
            component: SppalistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'sppadetail', /*add*/
                    component: SppadetailComponent
                },
                {
                    path: 'sppadetail/:id', /*update*/
                    component: SppadetailComponent
                },
                {
                    path: 'sppadetailresult/:id/:id2', /*update*/
                    component: SppadetailresultComponent
                },
            ]
        },
        //sppa

        //policy
        {
            path: 'subpolicylist',
            component: PolicylistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'policydetail', /*add*/
                    component: PolicydetailComponent
                },
                {
                    path: 'policydetail/:id', /*update*/
                    component: PolicydetailComponent,
                    children: [
                        /*policymainperiod*/
                        {
                            path: 'subpolicymainperiodlist/:id',
                            component: PolicymainperiodlistComponent
                        },
                        /*policymainperiod*/

                        /*policymainperiodadjusment*/
                        {
                            path: 'subpolicymainperiodadjusmentlist/:id',
                            component: PolicymainperiodadjusmentlistComponent
                        },
                        {
                            path: 'subpolicymainperiodadjusmentlist/:id/:status',
                            component: PolicymainperiodadjusmentlistComponent
                        },
                        /*policymainperiodadjusment*/

                        /*policymainloading*/
                        {
                            path: 'subpolicymainloadinglist/:id',
                            component: PolicymainloadinglistComponent
                        },
                        /*policymainloading*/

                        /*policymainhistory*/
                        {
                            path: 'subpolicymainhistorylist/:id',
                            component: PolicymainhistorylistComponent
                        },
                        /*policymainhistory*/

                        /*policy asset*/
                        {
                            path: 'subpolicyassetlist/:id',
                            component: PolicyMainAssetlistComponent,
                            children: [
                                {
                                    path: 'policyassetdetail/:id/:id2',
                                    component: PolicyMainAssetdetailComponent,
                                }
                            ]
                        }
                        /*policy asset*/
                    ]
                },
            ]
        },
        //policy

        /*Claim*/
        {
            path: 'subclaimlist',
            component: ClaimlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'claimdetail', /*add*/
                    component: ClaimdetailComponent
                },
                {
                    path: 'claimdetail/:id', /*update*/
                    component: ClaimdetailComponent,
                    children: [
                        {
                            path: 'claimprogresslist/:id',
                            component: ClaimprogresslistComponent,
                            children: [
                                {
                                    path: 'claimprogressdetail/:id',
                                    component: ClaimprogressdetailComponent
                                },
                                {
                                    path: 'claimprogressdetail/:id/:id2',
                                    component: ClaimprogressdetailComponent
                                },
                            ]
                        },
                        {
                            path: 'claimdoclist/:id',
                            component: ClaimdoclistComponent
                        },
                        {
                            path: 'claimassetdetail/:id',
                            component: ClaimAssetwizlistComponent
                        }
                    ]
                },
            ]
        },
        /*end Claim*/

        /* Termination*/
        {
            path: 'subterminationlist',
            component: TerminationlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'terminationdetail', /*add*/
                    component: TerminationdetailComponent
                },
                {
                    path: 'terminationdetail/:id', /*update*/
                    component: TerminationdetailComponent
                },
            ]
        },
        /*end Termination*/

        /* Endorsement*/
        {
            path: 'subendorsementlist',
            component: EndorsementlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'endorsementdetail', /*add*/
                    component: EndorsementdetailComponent
                },
                {
                    path: 'endorsementdetail/:id', /*update*/
                    component: EndorsementdetailComponent
                },
                {
                    path: 'endorsementperioddetail/:id/:id2/:id3', /*add*/
                    component: EndorsementperioddetailComponent
                },
                {
                    path: 'endorsementperioddetail/:id/:id2/:id3/:id4', /*update*/
                    component: EndorsementperioddetailComponent
                },
                {
                    path: 'endorsementperioddetail/:id/:id2', /*update*/
                    component: EndorsementperioddetailComponent
                },
                {
                    path: 'endorsementloadingdetail/:id/:id2/:id3', /*add*/
                    component: EndorsementloadingdetailComponent
                },
                {
                    path: 'endorsementloadingdetail/:id/:id2', /*update*/
                    component: EndorsementloadingdetailComponent
                },
            ]
        },
        /*end maintenence*/

        //paymentrenewal
        {
            path: 'subpaymentrenewallist',
            component: PaymentrenewallistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'paymentrenewaldetail', /*add*/
                    component: PaymentrenewaldetailComponent
                },
                {
                    path: 'paymentrenewaldetail/:id', /*update*/
                    component: PaymentrenewaldetailComponent
                },
            ]
        },
        //paymentrenewal

        //policy approval
        {
            path: 'policyapproval/:id',
            component: PolicyApprovalComponent
        },
        //policy approval


    ]
}];
