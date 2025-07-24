import { Routes } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { AuthGuard } from '../../../auth.guard';
// import { AssetbarcodehsitorywizlistComponent } from './asset/assetdetail/assetbarcodehistorywiz/assetbarcodehistorywizlist/assetbarcodehistorywizlist.component';
// import { AssetdetailComponent } from './asset/assetdetail/assetdetail.component';
// import { AssetDocumentlistComponent } from './asset/assetdetail/assetdocumentwiz/assetdocumentwizlist/assetdocumentwizlist.component';
// import { AssetelectronicwizdetailComponent } from './asset/assetdetail/assetelectronicwiz/assetelectronicdetailwiz/assetelectronicdetailwiz.component';
// import { AssetFurniturewizdetailComponent } from './asset/assetdetail/assetfurniturewiz/assetfurniturewizdetail/assetfurniturewizdetail.component';
// import { AssetMachinewizdetailComponent } from './asset/assetdetail/assetmachinewiz/assetmachinewizdetail/assetmachinewizdetail.component';
// import { AssetmaintenancewizlistComponent } from './asset/assetdetail/assetmaintenancewiz/assetmaintenancewizlist/assetmaintenancewizlist.component';
// import { AssetMutationHistorywizlistComponent } from './asset/assetdetail/assetmutationhistorywiz/assetmutationhistorywizlist/assetmutationhistorywizlist.component';
// import { AssetOtherwizdetailComponent } from './asset/assetdetail/assetotherwiz/assetotherwizdetail/assetotherwizdetail.component';
// import { AssetPropertywizdetailComponent } from './asset/assetdetail/assetpropertywiz/assetpropertywizdetail/assetpropertywizdetail.component';
// import { AssetVehiclewizdetailComponent } from './asset/assetdetail/assetvehiclewiz/assetvehicledetailwiz/assetvehicledetailwiz.component';
// import { AssetlistComponent } from './asset/assetlist/assetlist.component';
// import { AssetListWizComponent } from './asset/assetlistwiz/assetlistwiz.component';
// import { AssetUplaodListComponent } from './asset/assetlistwiz/assetuploadlist/assetuploadlistlist/assetuploadlistlist.component';
// import { AssetDetailBarcodeHistoryWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailbarcodehistorywiz/assetdetailbarcodehistorywizlist/assetdetailbarcodehistorywizlist.component';
// import { AssetDetailDocumentWizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetaildocumentwiz/assetdetaildocumentwizlist/assetdetaildocumentwizlist.component';
// import { AssetDetailElectronicwizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailelectronicwiz/assetdetailelectronicwizdetail/assetdetailelectronicwizdetail.component';
// import { AssetDetailFurniturewizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailfurniturewiz/assetdetailfurniturewizdetail/assetdetailfurniturewizdetail.component';
// import { AssetDetailMachinewizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailmachinewiz/assetdetailmachinewizdetail/assetdetailmachinewizdetail.component';
// import { AssetDetailMaintenanceWizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailmaintenancewiz/assetdetailmaintenancewizlist/assetdetailmaintenancewizlist.component';
// import { AssetDetailMutationHistorywizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailmutationhistorywiz/assetdetailmutationhistorywizlist/assetdetailmutationhistorywizlist.component';
// import { AssetDetailOtherwizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailotherswiz/assetdetailotherswizdetail/assetdetailotherswizdetail.component';
// import { AssetDetailPropertywizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailpropertywiz/assetdetailpropertywizdetail/assetdetailpropertywizdetail.component';
// import { AssetDetailVehiclewizdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdetailvehiclewiz/assetdetailvehiclewizdetail/assetdetailvehiclewizdetail.component';
// import { AssetwizlistdetailComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetwizlistdetail.component';
// import { AssetWizListListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistlist/assetwizlistlist.component';
// import { listassetdepretiationlistComponent } from './assetdepreciation/assetdepreciationlist/assetdepretiationlist.component';
// import { ChangecategorydetailComponent } from './changecategory/changecategorydetail/changecategorydetail.component';
// import { ChangeCategoryListComponent } from './changecategory/changecategoryhistorylist/changecategoryhistorylist.component';
// import { DisposaldetailComponent } from './disposalhistory/disposalhistorydetail/disposalhistorydetail.component';
// import { DisposalDetailDetailwizlistComponent } from './disposalhistory/disposalhistorydetail/disposaldetailhistorydetailwiz/disposaldetailhistorydetailwizlist/disposaldetailhistorydetailwizlist.component';
// import { DisposalDocumentlistComponent } from './disposalhistory/disposalhistorydetail/disposalhistorydocumentwiz/disposaldocumenthistorywizlist/disposaldocumenthistorywizlist.component';
// import { DisposalListComponent } from './disposalhistory/disposalhistorylist/disposalhistorylist.component';
import { MaintenanceHistoryDetailComponent } from './maintenancehistory/maintenancehistorydetail/maintenancehistorydetail.component';
import { MaintenanceHistoryListComponent } from './maintenancehistory/maintenancehistorylist/maintenancehistorylist.component';
// import { MutationDetailComponent } from './mutationhistory/mutationhistorydetail/mutationdetail.component';
// import { MutationDetailDetailwizlistComponent } from './mutationhistory/mutationhistorydetail/mutationdetailhistorydetailwiz/mutationdetailhistorydetailwizlist/mutationdetailhistorydetailwizlist.component';
// import { MutationDocumentwizlistComponent } from './mutationhistory/mutationhistorydetail/mutationdocumenthistorywiz/mutationdocumenthistorywizlist/mutationdocumenthistorywizlist.component';
// import { MutationHistoryListComponent } from './mutationhistory/mutationhistorylist/mutationhistorylist.component';
// import { MutationReceiveDetailComponent } from './mutationreceive/mutationreceivedetail/mutationreceivedetail.component';
// import { MutationReceiveListComponent } from './mutationreceive/mutationreceivelist/mutationreceivelist.component';
// import { OpnamedetailComponent } from './opname/opnamedetail/opnamedetail.component';
// import { OpnameListComponent } from './opname/opnamelist/opnamelist.component';
// import { OpnameHistoryListComponent } from './opnamehistory/opnamehistorylist/opnamehistorylist.component';
import { ReverseDisposalHistorydetailComponent } from './reversedisposalhistory/reversedisposalhistorydetail/reversedisposalhistorydetail.component';
import { ReverseDisposalDetailHistorywizlistComponent } from './reversedisposalhistory/reversedisposalhistorydetail/reversedisposaldetailhistorywiz/reversedisposaldetailhistorywizlist/reversedisposaldetailhistorywizlist.component';
import { DisposalDocumentReverseHistoryWizListComponent } from './reversedisposalhistory/reversedisposalhistorydetail/reversedisposaldocumenthistorywiz/reversedisposaldocumenthistorywizlist/disposaldocumenthistorywiz/disposaldocumenthistorywiz.component';
import { ReverseDisposalDocumentHistoryWizListComponent } from './reversedisposalhistory/reversedisposalhistorydetail/reversedisposaldocumenthistorywiz/reversedisposaldocumenthistorywizlist/reversedisposaldocumenthistorywizlist.component';
import { ReverseDocumentDisposalHistoryWizListComponent } from './reversedisposalhistory/reversedisposalhistorydetail/reversedisposaldocumenthistorywiz/reversedisposaldocumenthistorywizlist/reversedocumentdisposalhistorywizlist/reversedocumentdisposalhistorywizlist.component';
import { ReverseDisposalHistoryListComponent } from './reversedisposalhistory/reversedisposalhistorylist/reversedisposalhistorylist.component';
// import { ReverseSaledetailComponent } from './reversesale/reversesaledetail/reversesaledetail.component';
// import { ReverseSaleDetailwizlistComponent } from './reversesale/reversesaledetail/reversesaledetailwiz/reversesaledetailwizlist/reversesaledetailwizlist.component';
// import { ReverseDocumentWizListComponent } from './reversesale/reversesaledetail/reversesaledocumentwiz/reversesaledocumentwizlist/reversedocumentwizlist/reversedocumentwizlist.component';
// import { ReversesaleDocumentWizListComponent } from './reversesale/reversesaledetail/reversesaledocumentwiz/reversesaledocumentwizlist/reversesaledocumentwizlist.component';
// import { SaleDocumentReverseWizListComponent } from './reversesale/reversesaledetail/reversesaledocumentwiz/reversesaledocumentwizlist/saledocumentreversewizlist/saledocumentreversewizlist.component';
import { ReverseSaleHistoryListComponent } from './reversesalehistory/reversesalehistorylist/reversesalehistorylist.component';
import { SaleBiddingHistoryDetailComponent } from './salehistory/salehistorydetail/salebiddinghistorywiz/salebiddinghistorywizdetail/salebiddinghistorydetail/salebiddinghistorydetail.component';
import { SaleBiddingHistoryWizDetailComponent } from './salehistory/salehistorydetail/salebiddinghistorywiz/salebiddinghistorywizdetail/salebiddinghistorywizdetail.component';
import { SaleBiddingHistorywizlistComponent } from './salehistory/salehistorydetail/salebiddinghistorywiz/salebiddinghistorywizlist/salebiddinghistorywizlist.component';
import { SaleHistoryDetailComponent } from './salehistory/salehistorydetail/salehistorydetail.component';
import { SaleDetailHistoryDetailwizlistComponent } from './salehistory/salehistorydetail/saledetailhistorydetailwiz/saledetailhistorydetailwizlist/saledetailhistorydetailwizlist.component';
import { SaleDocumentHistorywizlistComponent } from './salehistory/salehistorydetail/saledocumenthistorywiz/saledocumenthistorywizlist/saledocumenthistorywizlist.component';
import { SaleHistoryListComponent } from './salehistory/salehistorylist/salehistorylist.component';
// import { WorkOrderDetailComponent } from './workorder/workorderdetail/workorderdetail.component';
// import { WorkOrderListComponent } from './workorder/workorderlist/workorderlist.component';
import { AdjustmentHistoryListComponent } from './adjustmenthistory/adjustmenthistorylist/adjustmenthistorylist.component';
import { AdjustmentHistorydetailComponent } from './adjustmenthistory/adjustmenthistorydetail/adjustmenthistorydetail.component';
import { AdjustmentdocumentHistorywizlistComponent } from './adjustmenthistory/adjustmenthistorydetail/adjustmentdocumenthistorywiz/adjustmentdocumenthistorywizlist/adjustmentdocumenthistorywizlist.component';
import { AdjustmentdetailhistorydetailwizlistComponent } from './adjustmenthistory/adjustmenthistorydetail/adjustmentdetailhistorydetailwiz/adjustmentdetailhistorydetailwizlist/adjustmentdetailhistorydetailwizlist.component';
// import { AssetDepreciationWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdepreciationwiz/assetdepreciationwizlist/asssetdepreciationwizlist.component';
// import { AssetDepreCommWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdepreciationwiz/assetdepreciationwizlist/assetdepreciationcommwizlist/assetdepreciationcommwizlist.component';
// import { AssetDepreFiscalWizListComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetdepreciationwiz/assetdepreciationwizlist/assetdepreciationfiscalwizlist/assetdepreciationfiscalwizlist.component';
// import { AssetadjustmenthistorywizlistComponent } from './asset/assetlistwiz/assetwizlist/assetwizlistdetail/assetadjustmenthistorywiz/assetadjustmenthistorywizlist/assetadjustmenthistorywizlist.component';
// import { ChangeItemTypeListComponent } from './changeitemtypehistory/changitemtypehistorylist/changeitemtypehistorylist.component';
import { ChangeItemTypeHistoryDetailComponent } from './changeitemtypehistory/changeitemtypehistorydetail/changeitemtypehistorydetail.component';
import { ChangeItemTypeHistoryListComponent } from './changeitemtypehistory/changitemtypehistorylist/changeitemtypehistorylist.component';
import { ChangeCategoryHistoryListComponent } from './changecategoryhistory/changecategoryhistorylist/changecategoryhistorylist.component';
import { ChangeCategoryHistoryDetailComponent } from './changecategoryhistory/changecategoryhistorydetail/changecategoryhistorydetail.component';
import { OpnameHistoryListComponent } from './opnamehistory/opnamehistorylist/opnamehistorylist.component';
import { OpnameHistoryDetailComponent } from './opnamehistory/opnamehistorydetail/opnamehistorydetail.component';
import { DisposalHistoryListComponent } from './disposalhistory/disposalhistorylist/disposalhistorylist.component';
import { DisposalHistorydetailComponent } from './disposalhistory/disposalhistorydetail/disposalhistorydetail.component';
import { DisposalDetailHistoryDetailwizlistComponent } from './disposalhistory/disposalhistorydetail/disposaldetailhistorydetailwiz/disposaldetailhistorydetailwizlist/disposaldetailhistorydetailwizlist.component';
import { DisposalDocumentHistorylistComponent } from './disposalhistory/disposalhistorydetail/disposaldocumenthistorywiz/disposaldocumenthistorywizlist/disposaldocumenthistorywizlist.component';

import { MutationHistoryDetailComponent } from './mutationhistory/mutationhistorydetail/mutationhistorydetail.component';
import { MutationDetailHistoryDetailwizlistComponent } from './mutationhistory/mutationhistorydetail/mutationdetailhistorydetailwiz/mutationdetailhistorydetailwizlist/mutationdetailhistorydetailwizlist.component';
import { MutationDocumentHistorywizlistComponent } from './mutationhistory/mutationhistorydetail/mutationdocumenthistorywiz/mutationdocumenthistorywizlist/mutationdocumenthistorywizlist.component';
import { ReverseSaleHistorydetailComponent } from './reversesalehistory/reversesalehistorydetail/reversesalehistorydetail.component';
import { MutationHistoryListComponent } from './mutationhistory/mutationhistorylist/mutationhistorylist.component';
// import { ReverseSaleDetailHistorywizlistComponent } from './reversesalehistory/reversesalehistorydetail/reversesaledetailhistorywiz/reversesaledetailhistorywizlist/reversesaledetailhistorywizlist.component';
//import { ReverseSaleDocumentHistoryWizListComponent } from './reversesalehistory/reversesalehistorydetail/reversesaledocumenthistorywiz/reversesaledocumenthistorywizlist/reversesaledocumenthistorywizlist.component';
// import { SaleDocumentReverseHistoryWizListComponent } from './reversesalehistory/reversesalehistorydetail/reversesaledocumenthistorywiz/reversesaledocumenthistorywizlist/saledocumentreversehistorywizlist/saledocumentreversehistorywizlist.component';
// import { ReverseDocumentHistoryWizListComponent } from './reversesalehistory/reversesalehistorydetail/reversesaledocumenthistorywiz/reversesaledocumenthistorywizlist/reversedocumenthistorywizlist/reversedocumenthistorywizlist.component';

export const Inquiry: Routes = [{
    path: '',
    children: [
        
        /*disposal*/
        {
            path: 'subdisposalhistorylist',
            component: DisposalHistoryListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'disposalhistorydetail',
                    component: DisposalHistorydetailComponent
                },
                {
                    path: 'disposalhistorydetail/:id',
                    component: DisposalHistorydetailComponent,
                    children: [
                        {
                            path: 'disposaldetailhistorylist/:id',
                            component: DisposalDetailHistoryDetailwizlistComponent,
                        },
                        {
                            path: 'disposaldocumenthistorylist/:id',
                            component: DisposalDocumentHistorylistComponent
                        }
                    ]
                }
            ]
        },
        /*disposal*/
        /*reverse disposal*/
        {
            path: 'subreversedisposalhistorylist',
            component: ReverseDisposalHistoryListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'reversedisposalhistorydetail',
                    component: ReverseDisposalHistorydetailComponent
                },
                {
                    path: 'reversedisposalhistorydetail/:id',
                    component: ReverseDisposalHistorydetailComponent,
                    children: [
                        {
                            path: 'reversedisposaldetailhistorylist/:id',
                            component: ReverseDisposalDetailHistorywizlistComponent
                        },
                        {
                            path: 'reversedisposaldocumenthistorylist/:id/:id2',
                            component: ReverseDisposalDocumentHistoryWizListComponent,
                            children: [
                                {
                                    path: 'disposaldocumenthistorylist/:id/:id2',
                                    component: DisposalDocumentReverseHistoryWizListComponent
                                },
                                {
                                    path: 'reversedisposaldocumenthistorylist/:id',
                                    component: ReverseDocumentDisposalHistoryWizListComponent
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
            path: 'submutationhistorylist',
            component: MutationHistoryListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'mutationghistorydetail',
                    component: MutationHistoryDetailComponent
                },
                {
                    path: 'mutationhistorydetail/:id',
                    component: MutationHistoryDetailComponent,
                    children: [
                        {
                            path: 'mutationdetailhistorylist/:id',
                            component: MutationDetailHistoryDetailwizlistComponent,
                        },
                        {
                            path: 'mutationdocumenthistorylist/:id',
                            component: MutationDocumentHistorywizlistComponent
                        }
                    ]
                }
            ]
        },
        /*mutation*/
        /*sale*/
        {
            path: 'subsalehistorylist',
            component: SaleHistoryListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'salehistorydetail',
                    component: SaleHistoryDetailComponent
                },
                {
                    path: 'salehistorydetail/:id',
                    component: SaleHistoryDetailComponent,
                    children: [
                        {
                            path: 'salehistorydetaillist/:id',
                            component: SaleDetailHistoryDetailwizlistComponent,
                        },
                        {
                            path: 'saledocumenthistorylist/:id',
                            component: SaleDocumentHistorywizlistComponent,
                        },
                        {
                            path: 'salebiddinghistorylist/:id',
                            component: SaleBiddingHistorywizlistComponent,
                            children: [
                                {
                                    path: 'salebiddinghistorydetail/:id',
                                    component: SaleBiddingHistoryWizDetailComponent
                                },
                                {
                                    path: 'salebiddinghistorydetail/:id/:id2',
                                    component: SaleBiddingHistoryWizDetailComponent
                                },
                                {
                                    path: 'salebiddingdetailhistorydetail/:id/:id2',
                                    component: SaleBiddingHistoryDetailComponent
                                },
                                {
                                    path: 'salebiddingdetailhistorydetail/:id/:id2/:id3',
                                    component: SaleBiddingHistoryDetailComponent
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
            path: 'subreversesalehistorylist',
            component: ReverseSaleHistoryListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'reversesalehistorydetail',
                    component: ReverseSaleHistorydetailComponent
                },
                {
                    path: 'reversesalehistorydetail/:id',
                    component: ReverseSaleHistorydetailComponent,
                    children: [
                        // {
                        //     path: 'reversesaledetailhistorylist/:id',
                        //     component: ReverseSaleDetailHistorywizlistComponent,
                        // },
                        // {
                        //     path: 'reversesaledocumenthistorylist/:id/:id2',
                        //     component: ReverseSaleDocumentHistoryWizListComponent,
                        //     children: [
                        //         {
                        //             path: 'saledocumentreversehistorylist/:id/:id2',
                        //             component: SaleDocumentReverseHistoryWizListComponent
                        //         },
                        //         {
                        //             path: 'reversedocumenthistorylist/:id',
                        //             component: ReverseDocumentHistoryWizListComponent
                        //         }
                        //     ]
                        // }
                    ]
                }
            ]
        },
        /*reverse sale*/
        /*maintenance*/
        {
            path: 'submaintenancehistorylist',
            component: MaintenanceHistoryListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'maintenancehistorydetail',
                    component: MaintenanceHistoryDetailComponent
                },
                {
                    path: 'maintenancehistorydetail/:id',
                    component: MaintenanceHistoryDetailComponent
                }
            ]
        },
        /*maintenance*/
        // /*opname*/
        {
            path: 'subopnamehistorylist',
            component: OpnameHistoryListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'opnamehistorydetail',
                    component: OpnameHistoryDetailComponent
                },
                {
                    path: 'opnamehistorydetail/:id',
                    component: OpnameHistoryDetailComponent
                }
            ]
        },
        // /*opname*/

        /*opname history*/
        {
            path: 'subopnamehistory',
            component: OpnameHistoryListComponent,
            canActivate: [AuthGuard],
        },
        /*opname history*/
        /*mutation receive*/
        // {
        //     path: 'submutationreceive',
        //     component: MutationReceiveListComponent,
        //     canActivate: [AuthGuard],
        //     children: [
        //         {
        //             path: 'opnamedetail/:id',
        //             component: MutationReceiveDetailComponent
        //         }
        //     ]
        // },
        /*mutation receive*/
        /*asset depretiation*/
        // {
        //     path: 'subassetdepreciation',
        //     component: listassetdepretiationlistComponent,
        //     canActivate: [AuthGuard],
        // },
        /*asset depretiation*/
        /*work order*/
        // {
        //     path: 'subworkorderlist',
        //     component: WorkOrderListComponent,
        //     canActivate: [AuthGuard],
        //     children: [
        //         {
        //             path: 'workorderdetail',
        //             component: WorkOrderDetailComponent
        //         },
        //         {
        //             path: 'workorderdetail/:id',
        //             component: WorkOrderDetailComponent
        //         }
        //     ]
        // },
        /*work order*/
        /*change category*/
        {
            path: 'subchangecategoryhistorylist',
            component: ChangeCategoryHistoryListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'changecategoryhistorydetail',
                    component: ChangeCategoryHistoryDetailComponent
                },
                {
                    path: 'changecategoryhistorydetail/:id',
                    component: ChangeCategoryHistoryDetailComponent
                }
            ]
        },
        /*change category*/

        /*Adjustment*/
        {
            path: 'subadjustmenthistorylist',
            component: AdjustmentHistoryListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'adjustmenthistorydetail',
                    component: AdjustmentHistorydetailComponent
                },
                {
                    path: 'adjustmenthistorydetail/:id',
                    component: AdjustmentHistorydetailComponent,
                    children: [
                        {
                            path: 'adjustmentdetailhistorylist/:id',
                            component: AdjustmentdetailhistorydetailwizlistComponent,
                        },
                        {
                            path: 'adjustmentdocumenthistorylist/:id',
                            component: AdjustmentdocumentHistorywizlistComponent
                        }
                    ]
                }
            ]
        },
        /*Adjustment*/

        /*change item type*/
        {
            path: 'subchangeitemtypehistorylist',
            component: ChangeItemTypeHistoryListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'changeitemtypehistorydetail',
                    component: ChangeItemTypeHistoryDetailComponent
                },
                {
                    path: 'changeitemtypedetail/:id',
                    component: ChangeItemTypeHistoryDetailComponent
                }
            ]
        },
        /*change item type*/
    ]
}];
