import { Routes } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { AuthGuard } from '../../../auth.guard';
import { AssetUplaodListComponent } from './asset/assetlistwiz/assetuploadlist/assetuploadlistlist/assetuploadlistlist.component';
import { AssetDetailBarcodeHistoryWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailbarcodehistorywiz/assetdetailbarcodehistorywizlist/assetdetailbarcodehistorywizlist.component';
import { AssetDetailDocumentWizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetaildocumentwiz/assetdetaildocumentwizlist/assetdetaildocumentwizlist.component';
import { AssetDetailElectronicwizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailelectronicwiz/assetdetailelectronicwizdetail/assetdetailelectronicwizdetail.component';
import { AssetDetailFurniturewizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailfurniturewiz/assetdetailfurniturewizdetail/assetdetailfurniturewizdetail.component';
import { AssetDetailMachinewizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailmachinewiz/assetdetailmachinewizdetail/assetdetailmachinewizdetail.component';
import { AssetDetailMaintenanceWizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailmaintenancewiz/assetdetailmaintenancewizlist/assetdetailmaintenancewizlist.component';
import { AssetDetailMutationHistorywizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailmutationhistorywiz/assetdetailmutationhistorywizlist/assetdetailmutationhistorywizlist.component';
import { AssetDetailOtherwizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailotherswiz/assetdetailotherswizdetail/assetdetailotherswizdetail.component';
import { AssetDetailPropertywizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailpropertywiz/assetdetailpropertywizdetail/assetdetailpropertywizdetail.component';
import { AssetwizlistdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetwizlistdetail.component';
import { AssetWizListListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistlist/assetwizlistlist.component';
import { listassetdepretiationlistComponent } from './assetdepreciation/assetdepreciationlist/assetdepretiationlist.component';
import { ChangecategorydetailComponent } from './changecategory/changecategorydetail/changecategorydetail.component';
import { ChangeCategoryListComponent } from './changecategory/changecategorylist/changecategorylist.component';
import { DisposaldetailComponent } from './disposal/disposaldetail/disposaldetail.component';
import { DisposalDetailDetailwizlistComponent } from './disposal/disposaldetail/disposaldetaildetailwiz/disposaldetaildetailwizlist/disposaldetaildetailwizlist.component';
import { DisposalDocumentlistComponent } from './disposal/disposaldetail/disposaldocumentwiz/disposaldocumentwizlist/disposaldocumentwizlist.component';
import { DisposalListComponent } from './disposal/disposallist/disposallist.component';
import { MaintenanceDetailComponent } from './maintenance/maintenancedetail/maintenancedetail.component';
import { MaintenanceListComponent } from './maintenance/maintenancelist/maintenancelist.component';
import { MutationDetailComponent } from './mutation/mutationdetail/mutationdetail.component';
import { MutationDetailDetailwizlistComponent } from './mutation/mutationdetail/mutationdetaildetailwiz/mutationdetaildetailwizlist/mutationdetaildetailwizlist.component';
import { MutationDocumentwizlistComponent } from './mutation/mutationdetail/mutationdocumentwiz/mutationdocumentwizlist/mutationdocumentwizlist.component';
import { MutationlListComponent } from './mutation/mutationlist/mutationlist.component';
import { MutationReceiveDetailComponent } from './mutationreceive/mutationreceivedetail/mutationreceivedetail.component';
import { MutationReceiveListComponent } from './mutationreceive/mutationreceivelist/mutationreceivelist.component';
import { OpnamedetailComponent } from './opname/opnamedetail/opnamedetail.component';
import { OpnameListComponent } from './opname/opnamelist/opnamelist.component';
import { OpnameHistoryListComponent } from './opnamehistory/opnamehistorylist/opnamehistorylist.component';
import { ReverseDisposaldetailComponent } from './reversedisposal/reversedisposaldetail/reversedisposaldetail.component';
import { ReverseDisposalDetailwizlistComponent } from './reversedisposal/reversedisposaldetail/reversedisposaldetailwiz/reversedisposaldetailwizlist/reversedisposaldetailwizlist.component';
import { DisposalDocumentReverseWizListComponent } from './reversedisposal/reversedisposaldetail/reversedisposaldocumentwiz/reversedisposaldocumentwizlist/disposaldocumentwiz/disposaldocumentwiz.component';
import { ReverseDisposalDocumentWizListComponent } from './reversedisposal/reversedisposaldetail/reversedisposaldocumentwiz/reversedisposaldocumentwizlist/reversedisposaldocumentwizlist.component';
import { ReverseDocumentDisposalWizListComponent } from './reversedisposal/reversedisposaldetail/reversedisposaldocumentwiz/reversedisposaldocumentwizlist/reversedocumentdisposalwizlist/reversedocumentdisposalwizlist.component';
import { ReverseDisposalListComponent } from './reversedisposal/reversedisposallist/reversedisposallist.component';
import { ReverseSaledetailComponent } from './reversesale/reversesaledetail/reversesaledetail.component';
import { ReverseSaleDetailwizlistComponent } from './reversesale/reversesaledetail/reversesaledetailwiz/reversesaledetailwizlist/reversesaledetailwizlist.component';
import { ReverseDocumentWizListComponent } from './reversesale/reversesaledetail/reversesaledocumentwiz/reversesaledocumentwizlist/reversedocumentwizlist/reversedocumentwizlist.component';
import { ReversesaleDocumentWizListComponent } from './reversesale/reversesaledetail/reversesaledocumentwiz/reversesaledocumentwizlist/reversesaledocumentwizlist.component';
import { SaleDocumentReverseWizListComponent } from './reversesale/reversesaledetail/reversesaledocumentwiz/reversesaledocumentwizlist/saledocumentreversewizlist/saledocumentreversewizlist.component';
import { ReverseSaleListComponent } from './reversesale/reversesalelist/reversesalelist.component';
import { SaleBiddingDetailComponent } from './sale/saledetail/salebiddingwiz/salebiddingwizdetail/salebiddingdetail/salebiddingdetail.component';
import { SaleBiddingWizDetailComponent } from './sale/saledetail/salebiddingwiz/salebiddingwizdetail/salebiddingwizdetail.component';
import { SaleBiddingwizlistComponent } from './sale/saledetail/salebiddingwiz/salebiddingwizlist/salebiddingwizlist.component';
import { SaledetailComponent } from './sale/saledetail/saledetail.component';
import { SaleDetailDetailwizlistComponent } from './sale/saledetail/saledetaildetailwiz/saledetaildetailwizlist/saledetaildetailwizlist.component';
import { SaleDocumentwizlistComponent } from './sale/saledetail/saledocumentwiz/saledocumentwizlist/saledocumentwizlist.component';
import { SaleListComponent } from './sale/salelist/salelist.component';
import { WorkOrderDetailComponent } from './workorder/workorderdetail/workorderdetail.component';
import { WorkOrderListComponent } from './workorder/workorderlist/workorderlist.component';
import { AdjustmentListComponent } from './adjustment/adjustmentlist/adjustmentlist.component';
import { AdjustmentdetailComponent } from './adjustment/adjustmentdetail/adjustmentdetail.component';
import { AdjustmentDocumentModule } from './adjustment/adjustmentdetail/adjustmentdocumentwiz/adjustmentdocumentwiz.module';
import { AdjustmentdocumentwizlistComponent } from './adjustment/adjustmentdetail/adjustmentdocumentwiz/adjustmentdocumentwizlist/adjustmentdocumentwizlist.component';
import { AdjustmentdetaildetailwizlistComponent } from './adjustment/adjustmentdetail/adjustmentdetaildetailwiz/adjustmentdetaildetailwizlist/adjustmentdetaildetailwizlist.component';
import { AssetDepreciationWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdepreciationwiz/assetdepreciationwizlist/asssetdepreciationwizlist.component';
import { AssetDepreCommWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdepreciationwiz/assetdepreciationwizlist/assetdepreciationcommwizlist/assetdepreciationcommwizlist.component';
import { AssetDepreFiscalWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdepreciationwiz/assetdepreciationwizlist/assetdepreciationfiscalwizlist/assetdepreciationfiscalwizlist.component';
import { AssetadjustmenthistorywizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetadjustmenthistorywiz/assetadjustmenthistorywizlist/assetadjustmenthistorywizlist.component';
import { ChangeItemTypeListComponent } from './changeitemtype/changitemtypelist/changeitemtypelist.component';
import { ChangeitemtypedetailComponent } from './changeitemtype/changeitemtypedetail/changeitemtypedetail.component';
import { HandoverRequestlistComponent } from './handoverrequest/handoverrequestlist/handoverrequestlist.component';
import { HandoverListComponent } from './handover/handoverlist/handoverlist.component';
import { HandoverdetailComponent } from './handover/handoverdetail/handoverdetail.component';
import { HandoverchecklistwizlistComponent } from './handover/handoverdetail/handoverassetcheklistwiz/handoverassetchecklistwizlist/handoverchecklistwizlist.component';
import { HandoverdocumentwizlistComponent } from './handover/handoverdetail/handoverassetdocumentwiz/handoverassetdocumentwizlist/handoverassetdocumentwizlist.component';
import { AssetHandoverHistorywizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assethandoverhistorywiz/assethandoverhistorywizlist/assethandoverhistorywizlist.component';
import { AssetHandoverhistorydetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assethandoverhistorywiz/assethandoverhistorywizdetail/assethandoverhistorywizdetail.component';
// import { AssetHandoverHistoryAssetchecklistwizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assethandoverhistorywiz/assethandoverhistorywizdetail/assethandoverhistoryassetchecklistwiz/assethandoverhistoryassetchecklistwizlist/assethandoverhistoryassetchecklistwizlist.component';
// import { AssetHandoverHistorydocumentwizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assethandoverhistorywiz/assethandoverhistorywizdetail/assethandoverhistoryassetdocumentwiz/assethandoverhistoryassetdocumentwizlist/assethandoverhistoryassetdocumentwizlist.component';
import { AssetIncomeExpenseWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetincomeexpensewiz/assetincomeexpensewizlist/assetincomeexpensewizlist.component';
import { AssetDetailVehiclewizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailvehiclewiz/assetdetailvehiclewizlist/assetdetailvehiclewizlist.component';
import { RegisterlistComponent } from './register/registerlist/registerlist.component';
import { RegisterdetailComponent } from './register/registerdetail/registerdetail.component';
import { RegisterdetaillistComponent } from './register/registerdetail/registerdetailwiz/registerdetaillist/registerdetaillist.component';
import { RegisterdocumentlistComponent } from './register/registerdetail/registerdocumentwiz/registerdocumentlist/registerdocumentlist.component';
import { OrdertopublicservicelistComponent } from './ordertopublicservice/ordertopublicservicelist/ordertopublicservicelist.component';
import { OrdertopublicservicedetailComponent } from './ordertopublicservice/ordertopublicservicedetail/ordertopublicservicedetail.component';
import { RealizationlistComponent } from './realization/realizationlist/realizationlist.component';
import { RealizationdetailComponent } from './realization/realizationdetail/realizationdetail.component';
import { AssetpublicservicewizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetpublicservicewiz/assetpublicservicewizlist/assetpublicservicewizlist.component';
import { DeliveryresultlistComponent } from './deliveryresult/deliveryresultlist/deliveryresultlist.component';
import { DeliveryresultdetailComponent } from './deliveryresult/deliveryresultdetail/deliveryresultdetail.component';
import { AssetDetailHEwizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailhewiz/assetdetailhewizdetail/assetdetailhewizdetail.component';
import { MonitoringMaintenancelistComponent } from './monitoringmaintenance/monitoringmaintenancelist/monitoringmaintenancelist.component';
import { AssetExpendLedgerlistWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetincomeexpensewiz/assetincomeexpensewizlist/assetexpendledger/assetexpendledgerlist/assetexpendledgerlist.component';
import { AssetIncomeLedgerlistWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetincomeexpensewiz/assetincomeexpensewizlist/assetincomeledger/assetincomeledgerlist/assetincomeledgerlist.component';
import { AssetHandoverHistorydocumentwizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assethandoverhistorywiz/assethandoverhistorywizdetail/assethandoverhistoryassetdocumentwiz/assethandoverhistoryassetdocumentwizlist.component';
import { SpafassetlistComponent } from './spafasset/spafassetlist.component';
import { AssetAsStockApprovalComponent } from './asset/assetlistwiz/assetwizlist/assetasstockapproval/assetasstockapproval.component';
import { SpafClaimListComponent } from './spafclaim/spafclaimlist/spafclaimlist.component';
import { SpafClaimDetailComponent } from './spafclaim/spafclaimdetail/spafclaimdetail.component';
import { WorkOrderApprovalComponent } from './workorder/workorderapproval/workorderapproval.component';
import { AssetInsuranceDetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetinsurance/assetinsurancedetail.component';
import { AssethistoryinsurancewizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assethistoryinsurance/assethistoryinsurancewizlist/assethistoryinsurancewizlist.component';
import { AssetDetailLocationHistoryWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetaillocationhistorywiz/assetdetaillocationhistorywizlist/assetdetaillocationhistorywizlist.component';
import { MonitoringGpslistComponent } from './monitoringgps/monitoringgpslist/monitoringgpslist.component';
import { MonitoringGpsDetailComponent } from './monitoringgps/monitoringgpsdetail/monitoringgpsdetail.component';
import { UnsubscribeRequestGpsListComponent } from './unsubscriberequestgps/unsubscriberequestgpslist/unsubscriberequestgpslist.component';
import { RealizationSubscriptionGpsListComponent } from './realizationsubscriptiongps/realizationsubscriptiongpslist/realizationsubscriptiongpslist.component';
import { RealizationSubscriptionGpsDetailComponent } from './realizationsubscriptiongps/realizationsubscriptiongpsdetail/realizationsubscriptiongpsdetail.component';
import { MaintenanceApprovalComponent } from './maintenance/maintenanceapproval/maintenanceapproval.component';
import { MaintenanceReturnApprovalComponent } from './maintenance/maintenancereturnapproval/maintenancereturnapproval.component';

export const Transaction: Routes = [{
    path: '',
    children: [
        {
            path: 'subasset',
            component: AssetWizListListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'subassetwizlist',
                    component: AssetWizListListComponent,

                },
                {
                    path: 'assetwizlistdetail',
                    component: AssetwizlistdetailComponent
                },
                {
                    path: 'assetwizlistdetail/:id',
                    component: AssetwizlistdetailComponent,
                    children: [
                        {
                            path: 'assetdetailpropertydetail/:id',
                            component: AssetDetailPropertywizdetailComponent
                        },
                        {
                            path: 'assetdetaildocumentdetail/:id',
                            component: AssetDetailDocumentWizlistComponent
                        },
                        {
                            path: 'assetdetailmaintenancedetail/:id',
                            component: AssetDetailMaintenanceWizlistComponent
                        },
                        {
                            path: 'assetdetailbarcodehistorydetail/:id',
                            component: AssetDetailBarcodeHistoryWizListComponent
                        },
                        {
                            path: 'assetdetailmutationhistorydetail/:id',
                            component: AssetDetailMutationHistorywizlistComponent
                        },
                        {
                            path: 'assetdetailelectronicdetail/:id',
                            component: AssetDetailElectronicwizdetailComponent
                        },
                        {
                            path: 'assetdetailfurnituredetail/:id',
                            component: AssetDetailFurniturewizdetailComponent
                        },
                        {
                            path: 'assetdetailmachinedetail/:id',
                            component: AssetDetailMachinewizdetailComponent
                        },
                        {
                            path: 'assetdetailothersdetail/:id',
                            component: AssetDetailOtherwizdetailComponent
                        },
                        {
                            path: 'assetdetailvehicledetail/:id',
                            component: AssetDetailVehiclewizdetailComponent
                        },
                        {
                            path: 'assetdepreciationwizlist/:id',
                            component: AssetDepreciationWizListComponent,
                            children: [
                                {
                                    path: 'assetdepreciationcommwizlist/:id',
                                    component: AssetDepreCommWizListComponent
                                },
                                {
                                    path: 'assetdeprefiscalwizlist/:id',
                                    component: AssetDepreFiscalWizListComponent
                                }
                            ]
                        },
                        {
                            path: 'assetdetailadjustmenthistory/:id',
                            component: AssetadjustmenthistorywizlistComponent
                        },
                        {
                            path: 'assetdetailhandoverhistory/:id',
                            component: AssetHandoverHistorywizlistComponent,
                            children: [
                                {
                                    path: 'assetdetailhandoverhistorydetail/:id/:id2',
                                    component: AssetHandoverhistorydetailComponent,
                                    children: [
                                        {
                                            path: 'assetdetailhandoverhistorydocument/:id/:id2',
                                            component: AssetHandoverHistorydocumentwizlistComponent
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            path: 'assetincomeexpenselist/:id',
                            component: AssetIncomeExpenseWizListComponent,
                            children: [
                                {
                                    path: 'assetexpenseledgerlsit/:id',
                                    component: AssetExpendLedgerlistWizListComponent
                                },
                                {
                                    path: 'assetincomeledgerlsit/:id',
                                    component: AssetIncomeLedgerlistWizListComponent
                                }
                            ]
                        },
                        {
                            path: 'assetpublicservicelist/:id',
                            component: AssetpublicservicewizlistComponent
                        },
                        {
                            path: 'assetdetailhedetail/:id',
                            component: AssetDetailHEwizdetailComponent
                        },
                        {
                            path: 'assetinsurance/:id',
                            component: AssetInsuranceDetailComponent
                        },
                        {
                            path: 'assethistoryinsurance/:id',
                            component: AssethistoryinsurancewizlistComponent
                        },
                        {
                            path: 'assetdetaillocationhistory/:id',
                            component: AssetDetailLocationHistoryWizListComponent
                        },
                    ]
                },

            ]
        },

        /*asset*/
        /*disposal*/
        {
            path: 'subdisposal',
            component: DisposalListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'disposaldetail',
                    component: DisposaldetailComponent
                },
                {
                    path: 'disposaldetail/:id',
                    component: DisposaldetailComponent,
                    children: [
                        {
                            path: 'disposaldetaillist/:id',
                            component: DisposalDetailDetailwizlistComponent,
                        },
                        {
                            path: 'disposaldocumentlist/:id',
                            component: DisposalDocumentlistComponent
                        }
                    ]
                }
            ]
        },
        /*disposal*/
        /*reverse disposal*/
        {
            path: 'subreversedisposal',
            component: ReverseDisposalListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'reversedisposaldetail',
                    component: ReverseDisposaldetailComponent
                },
                {
                    path: 'reversedisposaldetail/:id',
                    component: ReverseDisposaldetailComponent,
                    children: [
                        {
                            path: 'reversedisposaldetaillist/:id',
                            component: ReverseDisposalDetailwizlistComponent
                        },
                        {
                            path: 'reversedisposaldocumentlist/:id/:id2',
                            component: ReverseDisposalDocumentWizListComponent,
                            children: [
                                {
                                    path: 'disposaldocumentlist/:id/:id2',
                                    component: DisposalDocumentReverseWizListComponent
                                },
                                {
                                    path: 'reversedisposaldocumentlist/:id',
                                    component: ReverseDocumentDisposalWizListComponent
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        /*reverse disposal*/
        /*mutation*/
        {
            path: 'submutation',
            component: MutationlListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'mutationdetail',
                    component: MutationDetailComponent
                },
                {
                    path: 'mutationdetail/:id',
                    component: MutationDetailComponent,
                    children: [
                        {
                            path: 'mutationdetaillist/:id',
                            component: MutationDetailDetailwizlistComponent,
                        },
                        {
                            path: 'mutationdocumentlist/:id',
                            component: MutationDocumentwizlistComponent
                        }
                    ]
                }
            ]
        },
        /*mutation*/
        /*sale*/
        {
            path: 'subsale',
            component: SaleListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'saledetail',
                    component: SaledetailComponent
                },
                {
                    path: 'saledetail/:id',
                    component: SaledetailComponent,
                    children: [
                        {
                            path: 'saledetaillist/:id',
                            component: SaleDetailDetailwizlistComponent,
                        },
                        {
                            path: 'saledocumentlist/:id',
                            component: SaleDocumentwizlistComponent
                        },
                        {
                            path: 'salebiddinglist/:id',
                            component: SaleBiddingwizlistComponent,
                            children: [
                                {
                                    path: 'salebiddingdetail/:id',
                                    component: SaleBiddingWizDetailComponent
                                },
                                {
                                    path: 'salebiddingdetail/:id/:id2',
                                    component: SaleBiddingWizDetailComponent
                                },
                                {
                                    path: 'salebiddingdetaildetail/:id/:id2',
                                    component: SaleBiddingDetailComponent
                                },
                                {
                                    path: 'salebiddingdetaildetail/:id/:id2/:id3',
                                    component: SaleBiddingDetailComponent
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        /*sale*/
        /*reverse sale*/
        {
            path: 'subreversesale',
            component: ReverseSaleListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'reversesaledetail',
                    component: ReverseSaledetailComponent
                },
                {
                    path: 'reversesaledetail/:id',
                    component: ReverseSaledetailComponent,
                    children: [
                        {
                            path: 'reversesaledetaillist/:id',
                            component: ReverseSaleDetailwizlistComponent,
                        },
                        {
                            path: 'reversesaledocumentlist/:id/:id2',
                            component: ReversesaleDocumentWizListComponent,
                            children: [
                                {
                                    path: 'saledocumentreverselist/:id/:id2',
                                    component: SaleDocumentReverseWizListComponent
                                },
                                {
                                    path: 'reversedocumentlist/:id',
                                    component: ReverseDocumentWizListComponent
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        /*reverse sale*/
        /*maintenance*/
        {
            path: 'submaintenance',
            component: MaintenanceListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'maintenancedetail',
                    component: MaintenanceDetailComponent
                },
                {
                    path: 'maintenancedetail/:id',
                    component: MaintenanceDetailComponent
                }
            ]
        },
        /*maintenance*/
        /*opname*/
        {
            path: 'subopname',
            component: OpnameListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'opnamedetail',
                    component: OpnamedetailComponent
                },
                {
                    path: 'opnamedetail/:id',
                    component: OpnamedetailComponent
                }
            ]
        },
        /*opname*/
        /*opname history*/
        {
            path: 'subopnamehistory',
            component: OpnameHistoryListComponent,
            canActivate: [AuthGuard],
        },
        /*opname history*/
        /*mutation receive*/
        {
            path: 'submutationreceive',
            component: MutationReceiveListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'opnamedetail/:id',
                    component: MutationReceiveDetailComponent
                }
            ]
        },
        /*mutation receive*/
        /*asset depretiation*/
        {
            path: 'subassetdepreciation',
            component: listassetdepretiationlistComponent,
            canActivate: [AuthGuard],
        },
        /*asset depretiation*/
        /*work order*/
        {
            path: 'subworkorderlist',
            component: WorkOrderListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'workorderdetail',
                    component: WorkOrderDetailComponent
                },
                {
                    path: 'workorderdetail/:id',
                    component: WorkOrderDetailComponent
                }
            ]
        },
        /*work order*/
        /*change category*/
        {
            path: 'subchangecategorylist',
            component: ChangeCategoryListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'changecategorydetail',
                    component: ChangecategorydetailComponent
                },
                {
                    path: 'changecategorydetail/:id',
                    component: ChangecategorydetailComponent
                }
            ]
        },
        /*change category*/

        /*Adjustment*/
        {
            path: 'subadjustmentlist',
            component: AdjustmentListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'adjustmentdetail',
                    component: AdjustmentdetailComponent
                },
                {
                    path: 'adjustmentdetail/:id',
                    component: AdjustmentdetailComponent,
                    children: [
                        {
                            path: 'adjustmentdetaillist/:id',
                            component: AdjustmentdetaildetailwizlistComponent,
                        },
                        {
                            path: 'adjustmentdocumentlist/:id',
                            component: AdjustmentdocumentwizlistComponent
                        }
                    ]
                }
            ]
        },
        /*Adjustment*/

        /*change item type*/
        {
            path: 'subchangeitemtypelist',
            component: ChangeItemTypeListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'changeitemtypedetail',
                    component: ChangeitemtypedetailComponent
                },
                {
                    path: 'changeitemtypedetail/:id',
                    component: ChangeitemtypedetailComponent
                }
            ]
        },
        /*change item type*/
        {
            path: 'subhandoverrequestlist',
            component: HandoverRequestlistComponent,
            canActivate: [AuthGuard]
        },
        {
            path: 'subhandoverlist',
            component: HandoverListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'handoverdetail',
                    component: HandoverdetailComponent
                },
                {
                    path: 'handoverdetail/:id',
                    component: HandoverdetailComponent,
                    children: [
                        {
                            path: 'handoverchecklist/:id',
                            component: HandoverchecklistwizlistComponent
                        },
                        {
                            path: 'handoverdocument/:id',
                            component: HandoverdocumentwizlistComponent
                        }
                    ]
                }
            ]
        },
        {
            path: 'subregisterbirojasalist',
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
            path: 'subordertobirojasalist',
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
            path: 'subrealizationlist',
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
            path: 'subdeliveryresultlist',
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
        {
            path: 'submonitoringmaintenance',
            component: MonitoringMaintenancelistComponent,
            canActivate: [AuthGuard],
        },
        {
            path: 'subspafassetlist',
            component: SpafassetlistComponent,
            canActivate: [AuthGuard],
        },
        {
            path: 'assetasstockapproval/:id',
            component: AssetAsStockApprovalComponent
        },
        {
            path: 'workorderapproval/:id',
            component: WorkOrderApprovalComponent
        },
        {
            path: 'maintenanceapproval/:id',
            component: MaintenanceApprovalComponent
        },
        {
            path: 'maintenancereturnapproval/:id',
            component: MaintenanceReturnApprovalComponent
        },
        {
            path: 'subspafclaimlist',
            component: SpafClaimListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'spafclaimdetail',
                    component: SpafClaimDetailComponent
                },
                {
                    path: 'spafclaimdetail/:id',
                    component: SpafClaimDetailComponent
                }
            ]
        },
        {
            path: 'submonitoringgpslist',
            component: MonitoringGpslistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'monitoringgpsdetail/:id',
                    component: MonitoringGpsDetailComponent
                }
            ]
        },
        {
            path: 'subunsubscriberequestgpslist',
            component: UnsubscribeRequestGpsListComponent,
            canActivate: [AuthGuard],
            children: []
        },
        {
            path: 'subrealizationsubscriptiongpslist',
            component: RealizationSubscriptionGpsListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'realizationsubscriptiongpsdetail/:id',
                    component: RealizationSubscriptionGpsDetailComponent
                }
            ]
        }

    ]
}];
