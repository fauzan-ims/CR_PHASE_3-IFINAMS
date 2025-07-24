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
import { Report } from './report.routing';
import { GenerateCustomReportListComponent } from './generatecustomreport/generatecustomreportlist/generatecustomreportlist.component';
import { ResearchList } from './research/researchlist.component';
import { ReportlistComponent } from './reports/reportlist/reportlist.component';
import { ReportAssetList } from './reports/reportassetlist/reportassetlist.component';
import { ReportMutationAsset } from './reports/reportmutationasset/reportmutationasset.component';
import { ReportMaintenanceAsset } from './reports/reportmaintenanceasset/reportmaintenanceasset.component';
import { Reportkeuntungankerugian } from './reports/reportkeuntungankerugian/reportkeuntungankerugian.component';
import { Reportpenjualanpemutihan } from './reports/reportpenjualanpemutihan/reportpenjualanpemutihan.component';
import { Reportperubahankategori } from './reports/reportperubahankategori/reportperubahankategori.component';
import { Reportjournaldepreciation } from './reports/reportjournaldepreciation/reportjournaldepreciation.component';
import { Reportnilaiwajartanah } from './reports/reportnilaiwajartanah/reportnilaiwajartanah.component';
import { ReportAsetMutasi } from './reports/reportasetmutasi/reportasetmutasi.component';
import { ReportDepreciationAsset } from './reports/reportdepreciationasset/reportdepreciationasset.component';
import { ReportExchangeAsset } from './reports/reportassetexchange/reportassetexchange.component';
import { ReportAssetTetap } from './reports/reportassettetap/reportassettetap.component';
import { ReportBeritaAcaraStockOpname } from './reports/reportberitaacarastockopname/reportberitaacarastockopname.component';
import { Reportprofitability } from './reports/reportprofitability/reportprofitability.component';
import { Reportphysicalchecking } from './reports/reportphysicalchecking/reportphysicalchecking.component';
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

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Report),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        ReportsettinglistComponent,
        GenerateCustomReportListComponent,
        ResearchList,
        ReportlistComponent,
        ReportAssetList,
        ReportMutationAsset,
        ReportMaintenanceAsset,
        Reportkeuntungankerugian,
        Reportpenjualanpemutihan,
        Reportperubahankategori,
        Reportjournaldepreciation,
        Reportnilaiwajartanah,
        ReportAsetMutasi,
        ReportDepreciationAsset,
        ReportExchangeAsset,
        ReportAssetTetap,
        ReportBeritaAcaraStockOpname,
        Reportprofitability,
        Reportphysicalchecking,
        Reportcontrolcardmaintenance,
        Reportasset,
        Reporthandover,
        Reportperunit,
        Reportpercustomer,
        Reportassetactivity,
        Reportstatuspengajuanbirojasa,
        Reportmonitoringpayment,
        Reportdeliveryunit,
        Reportdeliveryvehiclebast,
        Reportdeliverycollectorder,
        Reportbastunitreport,
        Reportdailybpkbreleasedreport,
        Reportbpkbborrowreport,
        Reportstnkandkeur,
        Reportvendoropl,
        Reportvendoroplui,
        Reportpaymentstnkkeur,
        Reportstockutilization,
        Reportutilizationreplacementcar,
        Reportstockmonthly,
        Reportdataasset,
        Reportexpenseasset,
        Reportprofitlossasset,
        Reportreceivedadhcollateral,
        ReportPenjualanAsset,
        Reportassetactivityprepaid,
        ReportpemakaianjasavendorstnkComponent,
        ReportdefferedinsuranceregistrationComponent,
        ReportreplacementcarcontrolComponent,
        ReportassetdepreciationComponent,
        ReportassetprepaidComponent,
        ReportdepreciationfixedassetComponent,
        ReportammortizeprepaidfixedassetComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
