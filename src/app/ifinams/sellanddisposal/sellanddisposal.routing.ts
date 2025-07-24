import { Routes } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { AuthGuard } from '../../../auth.guard';
import { DisposedDetailComponent } from './disposed/disposeddetail/disposeddetail.component';
import { DisposedDetailAssetwizlistComponent } from './disposed/disposeddetail/disposeddetailassetwiz/disposeddetailassetwizlist/disposeddetailassetwizlist.component';
import { DisposedListComponent } from './disposed/disposedlist/disposedlist.component';
import { InquirydetailComponent } from './inqury/inqurydetail/inquirydetail.component';
import { InquiryAssetElectronicwizdetailComponent } from './inqury/inqurydetail/inquirydetailassetelectronicwiz/inquirydetailassetelectronicwizlist/inquirydetailassetelectronicwizlist.component';
import { InquiryAssetFurniturewizdetailComponent } from './inqury/inqurydetail/inquirydetailassetfurniturewiz/inquirydetailassetfurniturewizlist/inquirydetailassetfurniturewizlist.component';
import { InquiryAssetMachinewizdetailComponent } from './inqury/inqurydetail/inquirydetailassetmachinewiz/inquirydetailassetmachinewizlist/inquirydetailassetmachinewizlist.component';
import { inquiryAssetPropertywizdetailComponent } from './inqury/inqurydetail/inquirydetailassetpropertywiz/inquirydetailassetpropertywizlist/inquirydetailassetpropertywizlist.component';
import { InquiryAssetVehiclewizdetailComponent } from './inqury/inqurydetail/inquirydetailassetvehiclewiz/inquirydetailassetvehiclewizlist/inquirydetailassetvehiclewizlist.component';
import { InquirylistComponent } from './inqury/inqurylist/inquirylist.component';
import { PricingrequestdetailComponent } from './pricingrequest/pricingrequestdetail/pricingrequestdetail.component';
import { PricingrequestdetaildetailComponent } from './pricingrequest/pricingrequestdetail/pricingrequestdetaildetail/pricingrequestdetaildetail.component';
import { PricingrequestlistComponent } from './pricingrequest/pricingrequestlist/pricingrequestlist.component';
import { SellPermitAssetElectronicwizdetailComponent } from './sellpermit/sellpermitdetail/salepermitdetailassetelectronicwiz/salepermitdetailassetelectronicwizlist/salepermitdetailassetelectronicwizlist.component';
import { SellPermitAssetFurniturewizdetailComponent } from './sellpermit/sellpermitdetail/salepermitdetailassetfurniturewiz/salepermitdetailassetfurniturewizlist/salepermitdetailassetfurniturewizlist.component';
import { SellPermitAssetMachinewizdetailComponent } from './sellpermit/sellpermitdetail/salepermitdetailassetmachinewiz/salepermitdetailassetmachinewizlist/salepermitdetailassetmachinewizlist.component';
import { SellPermitAssetVehiclewizdetailComponent } from './sellpermit/sellpermitdetail/salepermitdetailassetvehiclewiz/salepermitdetailassetvehiclewizlist/salepermitdetailassetvehiclewizlist.component';
import { SellpermitdetailComponent } from './sellpermit/sellpermitdetail/sellpermitdetail.component';
import { SellPermitAssetPropertywizdetailComponent } from './sellpermit/sellpermitdetail/sellpermitdetailassetpropertywiz/sellpermitdetailassetpropertywizlist/sellpermitdetailassetpropertywizlist.component';
import { SellpermitlistComponent } from './sellpermit/sellpermitlist/sellpermitlist.component';
import { SoldRequestDetailwizlistComponent } from './soldrequest/soldrequestdetail/soldrequestassetwiz/soldrequestassetwizlist/soldrequestwizlist.component';
import { SoldRequestdetailComponent } from './soldrequest/soldrequestdetail/soldrequestdetail.component';
import { SoldRequestListComponent } from './soldrequest/soldrequestlist/soldrequestlist.component';
import { SoldSettlementdetailComponent } from './soldsettlement/soldsettlementdetail/soldsettlementdetail.component';
import { SoldSettlementDetailFeewizlistComponent } from './soldsettlement/soldsettlementdetail/soldsettlementdetailfeewiz/soldsettlementdetailfeewizlist/soldsettlementdetailfeewizlist.component';
import { SoldSettlementListComponent } from './soldsettlement/soldsettlementlist/soldsettlementlist.component';
import { DisposedApprovalComponent } from './disposed/disposalapproval/disposalapproval.component';
import { SoldRequestApprovalComponent } from './soldrequest/soldrequestapproval/soldrequestapproval.component';
import { SoldRequestAttachmentWizlistComponent } from './soldrequest/soldrequestdetail/soldrequestattachmentwiz/soldrequestattachmentwizlist/soldrequestattachmentwizlist.component';

export const Sellanddisposal: Routes = [{
    path: '',
    children: [
        {
            path: 'subpricingrequestlist',
            component : PricingrequestlistComponent,
            canActivate : [AuthGuard],
            children : [
                {
                    path : 'pricingrequestdetail', /*add*/
                    component : PricingrequestdetailComponent
                },
                {
                    path : 'pricingrequestdetail/:id', /*edit*/
                    component : PricingrequestdetailComponent
                },
                {
                    path: 'pricingrequestdetaildetail/:id', /*add*/
                    component: PricingrequestdetaildetailComponent
                },
                {
                    path: 'pricingrequestdetaildetail/:id/:id2',
                    component: PricingrequestdetaildetailComponent
                },
            ]
        },
        {
            path: 'subsellpermitlist',
            component: SellpermitlistComponent,
            canActivate: [AuthGuard],
            children : [
                {
                    path : 'sellpermitdetail/:id', /*edit*/
                    component : SellpermitdetailComponent,
                    children: [
                        {
                            path: 'salepermitassetelectronic/:id',
                            component: SellPermitAssetElectronicwizdetailComponent
                        },
                        {
                            path: 'salepermitassetfurniture/:id',
                            component: SellPermitAssetFurniturewizdetailComponent
                        },
                        {
                            path: 'salepermitassetmachine/:id',
                            component: SellPermitAssetMachinewizdetailComponent
                        },
                        {
                            path: 'salepermitassetvehicle/:id',
                            component: SellPermitAssetVehiclewizdetailComponent
                        },
                        {
                            path: 'salepermitassetproperty/:id',
                            component: SellPermitAssetPropertywizdetailComponent
                        }
                    ]
                }
            ]
        },
        {
            path: 'subinquirylist',
            component: InquirylistComponent,
            canActivate: [AuthGuard],
            children : [
                {
                    path : 'inquirydetail/:id', /*edit*/
                    component : InquirydetailComponent,
                    children: [
                        {
                            path: 'inquiryassetvehicle/:id',
                            component: InquiryAssetVehiclewizdetailComponent
                        },
                        {
                            path: 'inquiryassetelectronic/:id',
                            component: InquiryAssetElectronicwizdetailComponent
                        },
                        {
                            path: 'inquiryassetmachine/:id',
                            component: InquiryAssetMachinewizdetailComponent
                        },
                        {
                            path: 'inquiryassetfurniture/:id',
                            component: InquiryAssetFurniturewizdetailComponent
                        },
                        {
                            path: 'inquiryassetproperty/:id',
                            component: inquiryAssetPropertywizdetailComponent
                        }
                    ]
                }
            ]
        },
        {
            path: 'subdisposedlist',
            component: DisposedListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'disposaldetail',
                    component: DisposedDetailComponent
                },
                {
                    path: 'disposaldetail/:id',
                    component: DisposedDetailComponent,
                    children: [
                        {
                            path: 'disposaldetaillist/:id',
                            component: DisposedDetailAssetwizlistComponent
                        }
                    ]
                }
            ]
        },
        {
            path: 'subsoldrequestlist',
            component: SoldRequestListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'soldrequestdetail',
                    component: SoldRequestdetailComponent
                },
                {
                    path: 'soldrequestdetail/:id',
                    component: SoldRequestdetailComponent,
                    children: [
                        {
                            path: 'soldrequestassetlist/:id',
                            component: SoldRequestDetailwizlistComponent
                        },
                        {
                            path: 'soldrequestattachmentlist/:id',
                            component: SoldRequestAttachmentWizlistComponent
                        }
                    ]
                }
            ]
        },
        {
            path: 'subsoldsettlement',
            component: SoldSettlementListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'soldsettlementdetail',
                    component: SoldSettlementdetailComponent
                },
                {
                    path: 'soldsettlementdetail/:id',
                    component: SoldSettlementdetailComponent,
                    children: [
                        {
                            path: 'soldsettlement/:id',
                            component: SoldSettlementDetailFeewizlistComponent
                        }
                    ]
                }
            ]
        },
        {
            path: 'disposedapproval/:id',
            component: DisposedApprovalComponent
        },
        {
            path: 'soldrequestapproval/:id',
            component: SoldRequestApprovalComponent
        }
    ]
}];
