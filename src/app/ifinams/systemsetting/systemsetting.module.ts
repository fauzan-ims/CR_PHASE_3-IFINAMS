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
import { SystemSetting } from './systemsetting.routing';
import { GeneralsubcodedetailComponent } from './generalcode/generalcodedetail/generalsubcode/generalsubcodedetail/generalsubcodedetail.component';
import { GeneralcodelistComponent } from './generalcode/generalcodelist/generalcodelist.component';
import { GeneralcodedetailComponent } from './generalcode/generalcodedetail/generalcodedetail.component';
import { MastercategorylistComponent } from './mastercategory/mastercategorylist/mastercategorylist.component';
import { MastercategorydetailComponent } from './mastercategory/mastercategorydetail/mastercategorydetail.component';
import { MastercategoryfiscallistComponent } from './mastercategoryfiscal/mastercategoryfiscallist/mastercategoryfiscallist.component';
import { MastercategoryfiscaldetailComponent } from './mastercategoryfiscal/mastercategoryfiscaldetail/mastercategoryfiscaldetail.component';
import { MastercategorycommerciallistComponent } from './mastercategorycommercial/mastercategorycommerciallist/mastercategorycommerciallist.component';
import { MastercategorycommercialdetailComponent } from './mastercategorycommercial/mastercategorycommercialdetail/mastercategorycommercialdetail.component';
import { MasterlocationlistComponent } from './masterlocation/masterlocationlist/masterlocationlist.component';
import { MasterlocationdetailComponent } from './masterlocation/masterlocationdetail/masterlocationdetail.component';
import { MasterbarcodelistComponent } from './masterbarcode/masterbarcodelist/masterbarcodelist.component';
import { MasterbarcodedetailComponent } from './masterbarcode/masterbarcodedetail/masterbarcodedetail.component';
import { MasterCustomReportListComponent } from './mastercustomreport/mastercustomreportlist/mastercustomreportlist.component';
import { MasterCustomReportDetailComponent } from './mastercustomreport/mastercustomreportdetail/mastercustomreportdetail.component';
import { MasterReportCustomColumnWizModule } from './mastercustomreport/mastercustomreportdetail/mastercustomreportcolumnwiz/masterreportcustomcolumnwiz.module';
import { MasterReportCustomConditionWizModule } from './mastercustomreport/mastercustomreportdetail/mastercustomreportconditionwiz/mastercustomreportconditionwiz.module';
import { ParameterlistComponent } from './parameter/parameterlist/parameterlist.component';
import { ParameterdetailComponent } from './parameter/parameterdetail/parameterdetail.component';
import { ParametertransactionlistComponent } from './parametertransaction/parametertransactionlist/parametertransactionlist.component';
import { ParametertransactiondetailComponent } from './parametertransaction/parametertransactiondetail/parametertransactiondetail.component';
import { ParametertransactiondetaildetailComponent } from './parametertransaction/parametertransactiondetail/parametertransactiondetaildetail/parametertransactiondetaildetail.component';
import { GllinklistComponent } from './gllink/gllinklist/gllinklist.component';
import { GllinkdetailComponent } from './gllink/gllinkdetail/gllinkdetail.component';
import { MasterdashboardlistComponent } from './masterdashboard/masterdashboardlist/masterdashboardlist.component';
import { MasterdashboarddetailComponent } from './masterdashboard/masterdashboarddetail/masterdashboarddetail.component';
import { MasterdashboarduserlistComponent } from './masterdashboarduser/masterdashboarduserlist/masterdashboarduserlist.component';
import { MasterdashboarduserdetailComponent } from './masterdashboarduser/masterdashboarduserdetail/masterdashboarduserdetail.component';
import { ReportlistComponent } from './sysreport/reports/reportlist/reportlist.component';
import { ReportdetailComponent } from './sysreport/reports/reportdetail/reportdetail.component';
import { CostcenterdetailComponent } from './gllink/gllinkdetail/costcenterdetail/costcenterdetail.component';
import { MasterUploadValidationlistComponent } from './masteruploadvalidation/masteruploadvalidationlist/masteruploadvalidationlist.component';
import { MasterUploadValidationdetailComponent } from './masteruploadvalidation/masteruploadvalidationdetail/masteruploadvalidationdetail.component';
import { MasterUploadTablelistComponent } from './masteruploadtable/masteruploadtablelist/masteruploadtablelist.component';
import { MasterUploadTabledetailComponent } from './masteruploadtable/masteruploadtabledetail/masteruploadtabledetail.component';
import { MasterUploadTabledetaildetailComponent } from './masteruploadtable/masteruploadtabledetail/masteruploadtabledetaildetail/masteruploadtabledetaildetail.component';
import { PublicservicelistComponent } from './publicservice/publicservicelist/publicservicelist.component';
import { PublicservicedetailComponent } from './publicservice/publicservicedetail/publicservicedetail.component';
import { PublicserviceaddresslistComponent } from './publicservice/publicservicedetail/publicserviceaddresswiz/publicserviceaddresswizlist/publicserviceaddresswizlist.component';
import { PublicserviceaddressdetailComponent } from './publicservice/publicservicedetail/publicserviceaddresswiz/publicserviceaddresswizdetail/publicserviceaddresswizdetail.component';
import { PublicservicebanklistComponent } from './publicservice/publicservicedetail/publicservicebankwiz/publicservicebankwizlist/publicservicebankwizlist.component';
import { PublicservicebankdetailComponent } from './publicservice/publicservicedetail/publicservicebankwiz/publicservicebankwizdetail/publicservicebankwizdetail.component';
import { PublicservicebranchlistComponent } from './publicservice/publicservicedetail/publicservicebranchwiz/publicservicebranchwizlist/publicservicebranchwizlist.component';
import { PublicservicebranchdetailComponent } from './publicservice/publicservicedetail/publicservicebranchwiz/publicservicebranchwizdetail/publicservicebranchwizdetail.component';
import { PublicservicebranchservicedetailComponent } from './publicservice/publicservicedetail/publicservicebranchwiz/publicservicebranchwizdetail/publicservicebranchservicedetail/publicservicebranchservicedetail.component';
import { PublicservicedocumentlistComponent } from './publicservice/publicservicedetail/publicservicedocumentwiz/publicservicedocumentwizlist/publicservicedocumentwizlist.component';
import { GeneraldocumentlistComponent } from './generaldocument/generaldocumentlist/generaldocumentlist.component';
import { GeneraldocumentdetailComponent } from './generaldocument/generaldocumentdetail/generaldocumentdetail.component';
import { OccupationlistComponent } from './occupation/occupationlist/occupationlist.component';
import { OccupationdetailComponent } from './occupation/occupationdetail/occupationdetail.component';
import { RegionlistComponent } from './region/regionlist/regionlist.component';
import { RegiondetailComponent } from './region/regiondetail/regiondetail.component';
import { RegionplatlistComponent } from './region/regiondetail/regionplatwiz/regionplatlist/regionplatlist.component';
import { RegionplatdetailComponent } from './region/regiondetail/regionplatwiz/regionplatdetail/regionplatdetail.component';
import { RegioncitylistComponent } from './region/regiondetail/regioncitywiz/regioncitylist/regioncitylist.component';
import { InsurancecollateralcategorylistComponent } from './insurancecollateralcategory/insurancecollateralcategorylist/insurancecollateralcategorylist.component';
import { InsurancecollateralcategorydetailComponent } from './insurancecollateralcategory/insurancecollateralcategorydetail/insurancecollateralcategorydetail.component';
import { CoveragelistComponent } from './coverage/coveragelist/coveragelist.component';
import { CoveragedetailComponent } from './coverage/coveragedetail/coveragedetail.component';
import { InsurancedepreciationlistComponent } from './insurancedepreciation/insurancedepreciationlist/insurancedepreciationlist.component';
import { InsurancedepreciationdetailComponent } from './insurancedepreciation/insurancedepreciationdetail/insurancedepreciationdetail.component';
import { InsurancedepreciationdetaildetailComponent } from './insurancedepreciation/insurancedepreciationdetail/insurancedepreciationdetaildetail/insurancedepreciationdetaildetail.component';
import { InsurancecompanylistComponent } from './insurancecompany/insurancecompanylist/insurancecompanylist.component';
import { InsurancecompanydetailComponent } from './insurancecompany/insurancecompanydetail/insurancecompanydetail.component';
import { InsurancecompanyfeelistComponent } from './insurancecompany/insurancecompanydetail/insurancecompanyfeewiz/insurancecompanyfeelist/insurancecompanyfeelist.component';
import { InsurancecompanyfeedetailComponent } from './insurancecompany/insurancecompanydetail/insurancecompanyfeewiz/insurancecompanyfeedetail/insurancecompanyfeedetail.component';
import { InsurancecompanyaddresslistComponent } from './insurancecompany/insurancecompanydetail/insurancecompanyaddresswiz/insurancecompanyaddresslist/insurancecompanyaddresslist.component';
import { InsurancecompanyaddressdetailComponent } from './insurancecompany/insurancecompanydetail/insurancecompanyaddresswiz/insurancecompanyaddressdetail/insurancecompanyaddressdetail.component';
import { InsurancecompanybanklistComponent } from './insurancecompany/insurancecompanydetail/insurancecompanybankwiz/insurancecompanybanklist/insurancecompanybanklist.component';
import { InsurancecompanybankdetailComponent } from './insurancecompany/insurancecompanydetail/insurancecompanybankwiz/insurancecompanybankdetail/insurancecompanybankdetail.component';
import { InsurancecompanybranchlistComponent } from './insurancecompany/insurancecompanydetail/insurancecompanybranchwiz/insurancecompanybranchlist/insurancecompanybranchlist.component';
import { InsurancecompanydepreciationlistComponent } from './insurancecompany/insurancecompanydetail/insurancecompanydepreciationwiz/insurancecompanydepreciationlist/insurancecompanydepreciationlist.component';
import { InsurancecompanydepreciationdetailComponent } from './insurancecompany/insurancecompanydetail/insurancecompanydepreciationwiz/insurancecompanydepreciationdetail/insurancecompanydepreciationdetail.component';
import { InsurancecompanydocumentlistComponent } from './insurancecompany/insurancecompanydetail/insurancecompanydocumentwiz/insurancecompanydocumentlist/insurancecompanydocumentlist.component';
import { InsuranceratenonlifelistComponent } from './insuranceratenonlife/insuranceratenonlifelist/insuranceratenonlifelist.component';
import { InsuranceratenonlifedetailComponent } from './insuranceratenonlife/insuranceratenonlifedetail/insuranceratenonlifedetail.component';
import { InsuranceratenonlifedetaildetailComponent } from './insuranceratenonlife/insuranceratenonlifedetail/insuranceratenonlifedetaildetail/insuranceratenonlifedetaildetail.component';
import { AssetchecklistlistComponent } from './assetchecklist/assetchecklistlist/assetchecklistlist.component';
import { AssetchecklistdetailComponent } from './assetchecklist/assetchecklistdetail/assetchecklistdetail.component';
import { MasterbastassetcheklistdetailComponent } from './assetchecklist/assetchecklistdetail/masterbastchecklistasset/masterbastchecklistassetdetail/masterbastassetchecklistdetail.component';
import { RegionPlateWizModule } from './region/regiondetail/regionplatwiz/regionplatwiz.module';
import { RegionCityWizModule } from './region/regiondetail/regioncitywiz/regioncitywiz.module';
import { AuctionfeelistComponent } from './auctionfee/auctionfeelist/auctionfeelist.component';
import { AuctionfeedetailComponent } from './auctionfee/auctionfeedetail/auctionfeedetail.component';
import { DocumentGrouplistComponent } from './documentgroup/documentgrouplist/documentgrouplist.component';
import { DocumentGroupdetailComponent } from './documentgroup/documentgroupdetail/documentgroupdetail.component';
import { AuctionlistComponent } from './auction/auctionlist/auctionlist.component';
import { AuctiondetailComponent } from './auction/auctiondetail/auctiondetail.component';
import { AuctionaddresslistComponent } from './auction/auctiondetail/auctionaddresswiz/auctionaddresslist/auctionaddresslist.component';
import { AuctionAddressdetailComponent } from './auction/auctiondetail/auctionaddresswiz/auctionaddressdetail/auctionaddressdetail.component';
import { AuctionbanklistComponent } from './auction/auctiondetail/auctionbankwiz/auctionbanklist/auctionbanklist.component';
import { AuctionbankdetailComponent } from './auction/auctiondetail/auctionbankwiz/auctionbankdetail/auctionbankdetail.component';
import { AuctionbranchlistComponent } from './auction/auctiondetail/auctionbranchwiz/auctionbranchlist/auctionbranchlist.component';
import { AuctionbranchdetailComponent } from './auction/auctiondetail/auctionbranchwiz/auctionbranchdetail/auctionbranchdetail.component';
import { AuctiondocumentlistComponent } from './auction/auctiondetail/auctiondocumentwiz/auctiondocumentlist/auctiondocumentlist.component';
import { DimensionlistComponent } from './dimension/dimensionlist/dimensionlist.component';
import { DimensiondetailComponent } from './dimension/dimensiondetail/dimensiondetail.component';
import { DimensiondetaildetailComponent } from './dimension/dimensiondetail/dimensiondetaildetail/dimensiondetaildetail.component';
import { MasterapprovallistComponent } from './masterapproval/masterapprovallist/masterapprovallist.component';
import { MasterapprovaldetailComponent } from './masterapproval/masterapprovaldetail/masterapprovaldetail.component';
import { MasterSellingAttachtmentGrouplistComponent } from './mastersellingattacthmentgroup/mastersellingattachtmentgrouplist/mastersellingattachmentgrouplist.component';
import { MasterSellingAttachtmentGroupdetailComponent } from './mastersellingattacthmentgroup/mastersellingattachtmentgroupdetail/mastersellingattachtmentgroupdetail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SystemSetting),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
        MasterReportCustomColumnWizModule,
        MasterReportCustomConditionWizModule,
        RegionPlateWizModule,
        RegionCityWizModule
    ],
    declarations: [
        GeneralcodelistComponent,
        GeneralcodedetailComponent,
        GeneralsubcodedetailComponent,
        MastercategorylistComponent,
        MastercategorydetailComponent,
        MastercategoryfiscallistComponent,
        MastercategoryfiscaldetailComponent,
        MastercategorycommerciallistComponent,
        MastercategorycommercialdetailComponent,
        MasterlocationlistComponent,
        MasterlocationdetailComponent,
        MasterbarcodelistComponent,
        MasterbarcodedetailComponent,
        MasterCustomReportListComponent,
        MasterCustomReportDetailComponent,
        ParameterlistComponent,
        ParameterdetailComponent,
        ParametertransactionlistComponent,
        ParametertransactiondetailComponent,
        ParametertransactiondetaildetailComponent,
        GllinklistComponent,
        GllinkdetailComponent,
        CostcenterdetailComponent,
        MasterCustomReportDetailComponent,
        MasterCustomReportDetailComponent,
        MasterdashboardlistComponent,
        MasterdashboarddetailComponent,
        MasterdashboarduserlistComponent,
        MasterdashboarduserdetailComponent,
        ReportlistComponent,
        ReportdetailComponent,
        MasterUploadValidationlistComponent,
        MasterUploadValidationdetailComponent,
        MasterUploadTablelistComponent,
        MasterUploadTabledetailComponent,
        MasterUploadTabledetaildetailComponent,
        PublicservicelistComponent,
        PublicservicedetailComponent,
        PublicserviceaddresslistComponent,
        PublicserviceaddressdetailComponent,
        PublicservicebanklistComponent,
        PublicservicebankdetailComponent,
        PublicservicebranchlistComponent,
        PublicservicebranchdetailComponent,
        PublicservicebranchservicedetailComponent,
        PublicservicedocumentlistComponent,
        GeneraldocumentlistComponent,
        GeneraldocumentdetailComponent,
        OccupationlistComponent,
        OccupationdetailComponent,
        RegionlistComponent,
        RegiondetailComponent,
        InsurancecollateralcategorylistComponent,
        InsurancecollateralcategorydetailComponent,
        CoveragelistComponent,
        CoveragedetailComponent,
        InsurancedepreciationlistComponent,
        InsurancedepreciationdetailComponent,
        InsurancedepreciationdetaildetailComponent,
        InsurancecompanylistComponent,
        InsurancecompanydetailComponent,
        InsurancecompanyfeelistComponent,
        InsurancecompanyfeedetailComponent,
        InsurancecompanyaddresslistComponent,
        InsurancecompanyaddressdetailComponent,
        InsurancecompanybanklistComponent,
        InsurancecompanybankdetailComponent,
        InsurancecompanybranchlistComponent,
        InsurancecompanydepreciationlistComponent,
        InsurancecompanydepreciationdetailComponent,
        InsurancecompanydocumentlistComponent,
        InsuranceratenonlifelistComponent,
        InsuranceratenonlifedetailComponent,
        InsuranceratenonlifedetaildetailComponent,
        AssetchecklistlistComponent,
        AssetchecklistdetailComponent,
        MasterbastassetcheklistdetailComponent,
        AuctionfeelistComponent,
        AuctionfeedetailComponent,
        DocumentGrouplistComponent,
        DocumentGroupdetailComponent,
        AuctionlistComponent,
        AuctiondetailComponent,
        AuctionaddresslistComponent,
        AuctionAddressdetailComponent,
        AuctionbanklistComponent,
        AuctionbankdetailComponent,
        AuctionbranchlistComponent,
        AuctionbranchdetailComponent,
        AuctiondocumentlistComponent,
        DimensionlistComponent,
        DimensiondetailComponent,
        DimensiondetaildetailComponent,
        MasterapprovallistComponent,
        MasterapprovaldetailComponent,
        MasterSellingAttachtmentGrouplistComponent,
        MasterSellingAttachtmentGroupdetailComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
