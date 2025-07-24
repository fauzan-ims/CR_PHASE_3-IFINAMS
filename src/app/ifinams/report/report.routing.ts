import { Routes } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { AuthGuard } from '../../../auth.guard';
import { GenerateCustomReportListComponent } from './generatecustomreport/generatecustomreportlist/generatecustomreportlist.component';
import { ReportAsetMutasi } from './reports/reportasetmutasi/reportasetmutasi.component';
import { ReportExchangeAsset } from './reports/reportassetexchange/reportassetexchange.component';
import { ReportAssetList } from './reports/reportassetlist/reportassetlist.component';
import { ReportAssetTetap } from './reports/reportassettetap/reportassettetap.component';
import { ReportBeritaAcaraStockOpname } from './reports/reportberitaacarastockopname/reportberitaacarastockopname.component';
import { ReportDepreciationAsset } from './reports/reportdepreciationasset/reportdepreciationasset.component';
import { Reportjournaldepreciation } from './reports/reportjournaldepreciation/reportjournaldepreciation.component';
import { Reportkeuntungankerugian } from './reports/reportkeuntungankerugian/reportkeuntungankerugian.component';
import { ReportlistComponent } from './reports/reportlist/reportlist.component';
import { ReportMaintenanceAsset } from './reports/reportmaintenanceasset/reportmaintenanceasset.component';
import { ReportMutationAsset } from './reports/reportmutationasset/reportmutationasset.component';
import { Reportnilaiwajartanah } from './reports/reportnilaiwajartanah/reportnilaiwajartanah.component';
import { Reportpenjualanpemutihan } from './reports/reportpenjualanpemutihan/reportpenjualanpemutihan.component';
import { Reportperubahankategori } from './reports/reportperubahankategori/reportperubahankategori.component';
import { ResearchList } from './research/researchlist.component';
import { Reportphysicalchecking } from './reports/reportphysicalchecking/reportphysicalchecking.component';
import { Reportprofitability } from './reports/reportprofitability/reportprofitability.component';
import { Reportcontrolcardmaintenance } from './reports/reportcontrolcardmaintenance/reportcontrolcardmaintenance.component';
import { Reportasset } from './reports/reportasset/reportasset.component';
import { Reporthandover } from './reports/reporthandover/reporthandover.component';
import { Reportperunit } from './reports/reportperunit/reportperunit.component';
import { Reportpercustomer } from './reports/reportpercustomer/reportpercustomer.component';
import { Reportassetactivity } from './reports/reportassetactivity/reportassetactivity.component';
import { Reportstatuspengajuanbirojasa } from './reports/reportstatuspengajuanbirojasa/reportstatuspengajuanbirojasa.component';
import { Reportmonitoringpayment } from './reports/reportmonitoringpayment/reportmonitoringpayment.component';
import { Reportdeliveryunit } from './reports/reportdeliveryunit/reportdeliveryunit.component';
import { Reportdeliveryvehiclebast } from './reports/reportdeliveryvehiclebast/reportdeliveryvehiclebast.component';
import { Reportdeliverycollectorder } from './reports/reportdeliverycollectorder/reportdeliverycollectorder.component';
import { Reportbastunitreport } from './reports/reprotbastunitreport/reportbastunitreport.component';
import { Reportdailybpkbreleasedreport } from './reports/reportbpkbreleasedreport/reportdailybpkbreleasedreport.component';
import { Reportbpkbborrowreport } from './reports/reportbpkbborrowreport/reportbpkbborrowreport.component';
import { Reportstnkandkeur } from './reports/reportstnkandkeur/reportstnkandkeur.component';
import { Reportvendoropl } from './reports/reportvendoropl/reportvendoropl.component';
import { Reportvendoroplui } from './reports/reportvendoroplui/reportvendoroplui.component';
import { Reportpaymentstnkkeur } from './reports/reportpaymentstnkkeur/reportpaymentstnkkeur.component';
import { Reportstockutilization } from './reports/reportstockutilization/reportstockutilization.component';
import { Reportutilizationreplacementcar } from './reports/reportutilizationreplacementcar/reportutilizationreplacementcar.component';
import { Reportstockmonthly } from './reports/reportunitstockmonthly/reportunitstockmonthly.component';
import { Reportdataasset } from './reports/reportdataasset/reportdataasset.component';
import { Reportexpenseasset } from './reports/reportexpenseasset/reportexpenseasset.component';
import { Reportprofitlossasset } from './reports/reportprofitlossasset/reportprofitlossasset.component';
import { Reportreceivedadhcollateral } from './reports/reportreceivedadhcollateral/reportreceivedadhcollateral.component';
import { ReportPenjualanAsset } from './reports/reportpenjualanasset/reportpenjualanasset.component';
import { ReportsettinglistComponent } from './reportsettinglist/reportsettinglist.component';
import { Reportassetactivityprepaid } from './reports/reportassetactivityprepaid/reportassetactivityprepaid.component';
import { ReportpemakaianjasavendorstnkComponent } from './reports/reportpemakaianjasavendorstnk/reportpemakaianjasavendorstnk.component';
import { ReportdefferedinsuranceregistrationComponent } from './reports/reportdefferedinsuranceregistration/reportdefferedinsuranceregistration.component';
import { ReportreplacementcarcontrolComponent } from './reports/reportreplacementcarcontrol/reportreplacementcarcontrol.component';
import { ReportassetdepreciationComponent } from './reports/reportassetdepreciation/reportassetdepreciation.component';
import { ReportassetprepaidComponent } from './reports/reportassetprepaid/reportassetprepaid.component';
import { ReportdepreciationfixedassetComponent } from './reports/reportdepreciationfixedasset/reportdepreciationfixedasset.component';
import { ReportammortizeprepaidfixedassetComponent } from './reports/reportammortizeprepaidfixedasset/reportammortizeprepaidfixedasset.component';

export const Report: Routes = [{
    path: '',
    children: [
        {
            path: 'subgeneratecustomreport',
            component: GenerateCustomReportListComponent,
            canActivate: [AuthGuard]
        },
        {
            path: 'subresearchlist',
            component: ResearchList
        },
        {
            path: 'subreportmanagementlist',
            component: ReportlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'reportassetlist/:id/:page',
                    component: ReportAssetList
                },
                {
                    path: 'reportmutationasset/:id/:page',
                    component: ReportMutationAsset
                },
                {
                    path: 'reportmaintenanceasset/:id/:page',
                    component: ReportMaintenanceAsset
                },
                {
                    path: 'reportkeuntungankerugian/:id/:page',
                    component: Reportkeuntungankerugian
                },
                {
                    path: 'reportpenjualanpemutihan/:id/:page',
                    component: Reportpenjualanpemutihan
                },
                {
                    path: 'reportperubahankategori/:id/:page',
                    component: Reportperubahankategori
                },
                {
                    path: 'reportnilaiwajartanah/:id/:page',
                    component: Reportnilaiwajartanah
                },
                {
                    path: 'reportjournaldepreciation/:id/:page',
                    component: Reportjournaldepreciation
                },
                {
                    path: 'reportdepreciationasset/:id/:page',
                    component: ReportDepreciationAsset
                },
                {
                    path: 'reportassetexchange/:id/:page',
                    component: ReportExchangeAsset
                },
                {
                    path: 'reportasetmutasi/:id/:page',
                    component: ReportAsetMutasi
                },
                {
                    path: 'reportassettetap/:id/:page',
                    component: ReportAssetTetap
                },
                {
                    path: 'reportstockopname/:id/:page',
                    component: ReportBeritaAcaraStockOpname
                },
                {
                    path: 'reportphysicalchecking/:id/:page',
                    component: Reportphysicalchecking
                },
                {
                    path: 'reportprofitability/:id/:page',
                    component: Reportprofitability
                },
                {
                    path: 'reportcontrolmaintenance/:id/:page',
                    component: Reportcontrolcardmaintenance
                },
                {
                    path: 'reportasset/:id/:page',
                    component: Reportasset
                },
                {
                    path: 'reporthandover/:id/:page',
                    component: Reporthandover
                },
                {
                    path: 'reportperunit/:id/:page',
                    component: Reportperunit
                },
                {
                    path: 'reportpercustomer/:id/:page',
                    component: Reportpercustomer
                },
                {
                    path: 'reportassetactivity/:id/:page',
                    component: Reportassetactivity
                },
                {
                    path: 'reportassetactivityprepaid/:id/:page',
                    component: Reportassetactivityprepaid
                },
                {
                    path: 'reportstatuspengajuanbirojasa/:id/:page',
                    component: Reportstatuspengajuanbirojasa
                },
                {
                    path: 'reportmonitoringpayment/:id/:page',
                    component: Reportmonitoringpayment
                },
                {
                    path: 'reportdeliveryunit/:id/:page',
                    component: Reportdeliveryunit
                },
                {
                    path: 'reportdeliveryvehiclebast/:id/:page',
                    component: Reportdeliveryvehiclebast
                },
                {
                    path: 'reportdeliverycollectorder/:id/:page',
                    component: Reportdeliverycollectorder
                },
                {
                    path: 'reportbastunitreport/:id/:page',
                    component: Reportbastunitreport
                },
                {
                    path: 'reportdailybpkbreleasedreport/:id/:page',
                    component: Reportdailybpkbreleasedreport
                },
                {
                    path: 'reportbpkbborrowreport/:id/:page',
                    component: Reportbpkbborrowreport
                },
                {
                    path: 'reportstnkandkeur/:id/:page',
                    component: Reportstnkandkeur
                },
                {
                    path: 'reportvendoropl/:id/:page',
                    component: Reportvendoropl
                },
                {
                    path: 'reportvendoroplui/:id/:page',
                    component: Reportvendoroplui
                },
                {
                    path: 'reportpaymentstnkkeur/:id/:page',
                    component: Reportpaymentstnkkeur
                },
                {
                    path: 'reportstockutilization/:id/:page',
                    component: Reportstockutilization
                },
                {
                    path: 'reportutilizationreplacementcar/:id/:page',
                    component: Reportutilizationreplacementcar
                },
                {
                    path: 'reportstockmonthly/:id/:page',
                    component: Reportstockmonthly
                },
                {
                    path: 'reportdataasset/:id/:page',
                    component: Reportdataasset
                },
                {
                    path: 'reportexpenseasset/:id/:page',
                    component: Reportexpenseasset
                },
                {
                    path: 'reportprofitlossasset/:id/:page',
                    component: Reportprofitlossasset
                },
                {
                    path: 'reportreceivedadhcollateral/:id/:page',
                    component: Reportreceivedadhcollateral
                },
                {
                    path: 'reportpenjualanasset/:id/:page',
                    component: ReportPenjualanAsset
                },
            ]
        },

        {
            path: 'subreporttransactionlist',
            component: ReportlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'reportassetlist/:id/:page',
                    component: ReportAssetList
                },
                {
                    path: 'reportmutationasset/:id/:page',
                    component: ReportMutationAsset
                },
                {
                    path: 'reportmaintenanceasset/:id/:page',
                    component: ReportMaintenanceAsset
                },
                {
                    path: 'reportkeuntungankerugian/:id/:page',
                    component: Reportkeuntungankerugian
                },
                {
                    path: 'reportpenjualanpemutihan/:id/:page',
                    component: Reportpenjualanpemutihan
                },
                {
                    path: 'reportperubahankategori/:id/:page',
                    component: Reportperubahankategori
                },
                {
                    path: 'reportnilaiwajartanah/:id/:page',
                    component: Reportnilaiwajartanah
                },
                {
                    path: 'reportjournaldepreciation/:id/:page',
                    component: Reportjournaldepreciation
                },
                {
                    path: 'reportdepreciationasset/:id/:page',
                    component: ReportDepreciationAsset
                },
                {
                    path: 'reportassetexchange/:id/:page',
                    component: ReportExchangeAsset
                },
                {
                    path: 'reportasetmutasi/:id/:page',
                    component: ReportAsetMutasi
                },
                {
                    path: 'reportassettetap/:id/:page',
                    component: ReportAssetTetap
                },
                {
                    path: 'reportstockopname/:id/:page',
                    component: ReportBeritaAcaraStockOpname
                },
                {
                    path: 'reportphysicalchecking/:id/:page',
                    component: Reportphysicalchecking
                },
                {
                    path: 'reportprofitability/:id/:page',
                    component: Reportprofitability
                },
                {
                    path: 'reportcontrolmaintenance/:id/:page',
                    component: Reportcontrolcardmaintenance
                },
                {
                    path: 'reportasset/:id/:page',
                    component: Reportasset
                },
                {
                    path: 'reporthandover/:id/:page',
                    component: Reporthandover
                },
                {
                    path: 'reportperunit/:id/:page',
                    component: Reportperunit
                },
                {
                    path: 'reportpercustomer/:id/:page',
                    component: Reportpercustomer
                },
                {
                    path: 'reportassetactivity/:id/:page',
                    component: Reportassetactivity
                },
                {
                    path: 'reportassetactivityprepaid/:id/:page',
                    component: Reportassetactivityprepaid
                },
                {
                    path: 'reportstatuspengajuanbirojasa/:id/:page',
                    component: Reportstatuspengajuanbirojasa
                },
                {
                    path: 'reportmonitoringpayment/:id/:page',
                    component: Reportmonitoringpayment
                },
                {
                    path: 'reportdeliveryunit/:id/:page',
                    component: Reportdeliveryunit
                },
                {
                    path: 'reportdeliveryvehiclebast/:id/:page',
                    component: Reportdeliveryvehiclebast
                },
                {
                    path: 'reportdeliverycollectorder/:id/:page',
                    component: Reportdeliverycollectorder
                },
                {
                    path: 'reportbastunitreport/:id/:page',
                    component: Reportbastunitreport
                },
                {
                    path: 'reportdailybpkbreleasedreport/:id/:page',
                    component: Reportdailybpkbreleasedreport
                },
                {
                    path: 'reportbpkbborrowreport/:id/:page',
                    component: Reportbpkbborrowreport
                },
                {
                    path: 'reportstnkandkeur/:id/:page',
                    component: Reportstnkandkeur
                },
                {
                    path: 'reportvendoropl/:id/:page',
                    component: Reportvendoropl
                },
                {
                    path: 'reportvendoroplui/:id/:page',
                    component: Reportvendoroplui
                },
                {
                    path: 'reportpaymentstnkkeur/:id/:page',
                    component: Reportpaymentstnkkeur
                },
                {
                    path: 'reportstockutilization/:id/:page',
                    component: Reportstockutilization
                },
                {
                    path: 'reportutilizationreplacementcar/:id/:page',
                    component: Reportutilizationreplacementcar
                },
                {
                    path: 'reportstockmonthly/:id/:page',
                    component: Reportstockmonthly
                },
                {
                    path: 'reportdataasset/:id/:page',
                    component: Reportdataasset
                },
                {
                    path: 'reportexpenseasset/:id/:page',
                    component: Reportexpenseasset
                },
                {
                    path: 'reportprofitlossasset/:id/:page',
                    component: Reportprofitlossasset
                },
                {
                    path: 'reportreceivedadhcollateral/:id/:page',
                    component: Reportreceivedadhcollateral
                },
                {
                    path: 'reportpenjualanasset/:id/:page',
                    component: ReportPenjualanAsset
                },
                {
                    path: 'reportpemakaianjasavendorstnk/:id/:page',
                    component: ReportpemakaianjasavendorstnkComponent
                },
                {
                    path: 'reportdefferedinsuranceregistration/:id/:page',
                    component: ReportdefferedinsuranceregistrationComponent
                },
                {
                    path: 'reportreplacementcarcontrol/:id/:page',
                    component: ReportreplacementcarcontrolComponent
                },
                {
                    path: 'reportassetdepreciation/:id/:page',
                    component: ReportassetdepreciationComponent
                },
                {
                    path: 'reportassetprepaid/:id/:page',
                    component: ReportassetprepaidComponent
                },
                {
                    path: 'reportdepreciationfixedasset/:id/:page',
                    component: ReportdepreciationfixedassetComponent
                },
                {
                    path: 'reportammortizeprepaidfixedasset/:id/:page',
                    component: ReportammortizeprepaidfixedassetComponent
                },
            
            ]
        },

        {
            path: 'subreportsetting',
            component: ReportsettinglistComponent,
            canActivate: [AuthGuard],
        },
    ]
}];
