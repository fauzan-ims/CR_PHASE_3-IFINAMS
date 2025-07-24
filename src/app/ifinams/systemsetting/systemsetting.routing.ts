import { Routes } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { AuthGuard } from '../../../auth.guard';
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
import { MasterReportCustomColumnComponent } from './mastercustomreport/mastercustomreportdetail/mastercustomreportcolumnwiz/mastercustomreportcolumnwizlist/masterreportcustomcolumnwizlist.component';
import { MasterCustomReportConditionWizListComponent } from './mastercustomreport/mastercustomreportdetail/mastercustomreportconditionwiz/mastercustomreportconditionwizlist/mastercustomreportconditionwizlist.component';
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
import { InsuranceratenonlifelistComponent } from './insuranceratenonlife/insuranceratenonlifelist/insuranceratenonlifelist.component';
import { InsuranceratenonlifedetailComponent } from './insuranceratenonlife/insuranceratenonlifedetail/insuranceratenonlifedetail.component';
import { InsuranceratenonlifedetaildetailComponent } from './insuranceratenonlife/insuranceratenonlifedetail/insuranceratenonlifedetaildetail/insuranceratenonlifedetaildetail.component';
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
import { AssetchecklistlistComponent } from './assetchecklist/assetchecklistlist/assetchecklistlist.component';
import { AssetchecklistdetailComponent } from './assetchecklist/assetchecklistdetail/assetchecklistdetail.component';
import { MasterbastassetcheklistdetailComponent } from './assetchecklist/assetchecklistdetail/masterbastchecklistasset/masterbastchecklistassetdetail/masterbastassetchecklistdetail.component';
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

export const SystemSetting: Routes = [{
    path: '',
    children: [

        /* generalcode */
        {
            path: 'subgeneralcodelistsetting',
            component: GeneralcodelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'generalcodedetail', /*add*/
                    component: GeneralcodedetailComponent
                },
                {
                    path: 'generalcodedetail/:id', /*update*/
                    component: GeneralcodedetailComponent
                },
                {
                    path: 'generalsubcodedetail/:id', /*add*/
                    component: GeneralsubcodedetailComponent
                },
                {
                    path: 'generalsubcodedetail/:id/:id2', /*update*/
                    component: GeneralsubcodedetailComponent
                },
            ]
        },
        /* generalcode */
        /*master category*/
        {
            path: 'submastercategory',
            component: MastercategorylistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'mastercategorydetail',
                    component: MastercategorydetailComponent
                },
                {
                    path: 'mastercategorydetail/:id',
                    component: MastercategorydetailComponent
                }
            ]
        },
        /*master category*/
        /*master category fiscal*/
        {
            path: 'submasterdeprecategoryfiscal',
            component: MastercategoryfiscallistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'mastercategoryfiscal',
                    component: MastercategoryfiscaldetailComponent,
                },
                {
                    path: 'mastercategoryfiscal/:id',
                    component: MastercategoryfiscaldetailComponent
                }
            ]
        },
        /*master category fiscal*/
        /*master category commercial*/
        {
            path: 'submasterdeprecategorycommercial',
            component: MastercategorycommerciallistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'mastercategorycommercial',
                    component: MastercategorycommercialdetailComponent,
                },
                {
                    path: 'mastercategorycommercial/:id',
                    component: MastercategorycommercialdetailComponent
                }
            ]
        },
        /*master category commercial*/
        /*master location*/
        {
            path: 'submasterlocation',
            component: MasterlocationlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masterlocationdetail',
                    component: MasterlocationdetailComponent,
                },
                {
                    path: 'masterlocationdetail/:id',
                    component: MasterlocationdetailComponent
                }
            ]
        },
        /*master location*/
        /*master barcode*/
        {
            path: 'submasterbarcode',
            component: MasterbarcodelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masterbarcodedetail',
                    component: MasterbarcodedetailComponent,
                },
                {
                    path: 'masterbarcodedetail/:id',
                    component: MasterbarcodedetailComponent
                }
            ]
        },
        /*master barcode*/
        /*master custom report*/
        {
            path: 'submastercustomreportlist',
            component: MasterCustomReportListComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'mastercustomreportdetail',
                    component: MasterCustomReportDetailComponent
                },
                {
                    path: 'mastercustomreportdetail/:id',
                    component: MasterCustomReportDetailComponent,
                    children: [
                        {
                            path: 'masterreportcustomcolumn/:id',
                            component: MasterReportCustomColumnComponent
                        },
                        {
                            path: 'masterreportcustomcondition/:id',
                            component: MasterCustomReportConditionWizListComponent
                        }
                    ]
                }
            ]
        },
        /*master custom report*/

        {
            path: 'subparameterlist',
            component: ParameterlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'parameterdetail', /*add*/
                    component: ParameterdetailComponent
                },
                {
                    path: 'parameterdetail/:id', /*update*/
                    component: ParameterdetailComponent
                },
            ]
        },

        {
            path: 'subparametertransactionlist',
            component: ParametertransactionlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'parametertransactiondetail', /*add*/
                    component: ParametertransactiondetailComponent
                },
                {
                    path: 'parametertransactiondetail/:id', /*update*/
                    component: ParametertransactiondetailComponent
                },
                {
                    path: 'parametertransactiondetaildetail/:id', /*add*/
                    component: ParametertransactiondetaildetailComponent
                },
                {
                    path: 'parametertransactiondetaildetail/:id/:id2', /*update*/
                    component: ParametertransactiondetaildetailComponent
                },
            ]
        },

        /* gllink */
        {
            path: 'subgllinklist',
            component: GllinklistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'gllinkdetail', /*add*/
                    component: GllinkdetailComponent
                },
                {
                    path: 'gllinkdetail/:id', /*update*/
                    component: GllinkdetailComponent
                },
                {
                    path: 'costcenterdetail/:id', /*add*/
                    component: CostcenterdetailComponent
                },
                {
                    path: 'costcenterdetail/:id/:id2', /*update*/
                    component: CostcenterdetailComponent
                },
            ]
        },
        /* gllink */
        /*master dashboard*/
        {
            path: 'masterdashboardlist',
            component: MasterdashboardlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masterdashboarddetail',
                    component: MasterdashboarddetailComponent
                },
                {
                    path: 'masterdashboarddetail/:id',
                    component: MasterdashboarddetailComponent
                }
            ]
        },
        /*master dashboard*/
        /*master dashboard user*/
        {
            path: 'masterdashboarduserlist',
            component: MasterdashboarduserlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masterdashboarduserdetail',
                    component: MasterdashboarduserdetailComponent
                },
                {
                    path: 'masterdashboarduserdetail/:id',
                    component: MasterdashboarduserdetailComponent
                }
            ]
        },
        /*master dashboard user*/

        //report
        {
            path: 'subreportlist',
            component: ReportlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'reportsdetail', /*add*/
                    component: ReportdetailComponent
                },
                {
                    path: 'reportsdetail/:id', /*update*/
                    component: ReportdetailComponent
                },
            ]
        },
        //report
        /* master upload validation*/
        {
            path: 'submasteruploadvalidationlist',
            component: MasterUploadValidationlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masteruploadvalidationdetail', /*add*/
                    component: MasterUploadValidationdetailComponent
                },
                {
                    path: 'masteruploadvalidationdetail/:id', /*add*/
                    component: MasterUploadValidationdetailComponent
                },
            ]
        },
        /*end  master upload validation*/
        /* master upload table*/
        {
            path: 'submasteruploadtablelist',
            component: MasterUploadTablelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masteruploadtabledetail', /*add*/
                    component: MasterUploadTabledetailComponent
                },
                {
                    path: 'masteruploadtabledetail/:id', /*add*/
                    component: MasterUploadTabledetailComponent
                },
                {
                    path: 'masteruploadtabledetaildetail/:id/:id', /*add*/
                    component: MasterUploadTabledetaildetailComponent
                },
                {
                    path: 'masteruploadtabledetaildetail/:id/:id2/:id3', /*update*/
                    component: MasterUploadTabledetaildetailComponent
                },
            ]
        },
        /*end  master upload table*/
        /* public service*/
        {
            path: 'subpublicservice',
            component: PublicservicelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'publicservicedetail',
                    component: PublicservicedetailComponent
                },
                {
                    path: 'publicservicedetail/:id',
                    component: PublicservicedetailComponent,
                    children: [
                        {
                            path: 'publicserviceaddresslist/:id',
                            component: PublicserviceaddresslistComponent,
                            children: [
                                {
                                    path: 'publicserviceaddressdetail/:id',
                                    component: PublicserviceaddressdetailComponent
                                },
                                {
                                    path: 'publicserviceaddressdetail/:id/:id2',
                                    component: PublicserviceaddressdetailComponent
                                }
                            ]
                        },
                        {
                            path: 'publicservicebanklist/:id',
                            component: PublicservicebanklistComponent,
                            children: [
                                {
                                    path: 'publicservicebankdetail/:id',
                                    component: PublicservicebankdetailComponent
                                },
                                {
                                    path: 'publicservicebankdetail/:id/:id2',
                                    component: PublicservicebankdetailComponent
                                }
                            ]
                        },
                        {
                            path: 'publicservicebranchlist/:id',
                            component: PublicservicebranchlistComponent,
                            children: [
                                {
                                    path: 'publicservicebranchdetail/:id',
                                    component: PublicservicebranchdetailComponent
                                },
                                {
                                    path: 'publicservicebranchdetail/:id/:id2',
                                    component: PublicservicebranchdetailComponent
                                },
                                {
                                    path: 'publicservicebranchservicedetail/:id/:id2',
                                    component: PublicservicebranchservicedetailComponent
                                },
                                {
                                    path: 'publicservicebranchservicedetail/:id/:id2/:id3',
                                    component: PublicservicebranchservicedetailComponent
                                }
                            ]
                        },
                        {
                            path: 'publicservicedocumentlist/:id',
                            component: PublicservicedocumentlistComponent
                        }
                    ]
                }
            ]
        },
        /*end  public service*/

        /*general document*/
        {
            path: 'subgeneraldocumentlist',
            component: GeneraldocumentlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'generaldocumentdetail',
                    component: GeneraldocumentdetailComponent
                },
                {
                    path: 'generaldocumentdetail/:id',
                    component: GeneraldocumentdetailComponent
                }
            ]
        },
        /*end general document*/

        //occupation
        {
            path: 'suboccupationlist',
            component: OccupationlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'occupationdetail', /*add*/
                    component: OccupationdetailComponent
                },
                {
                    path: 'occupationdetail/:id', /*update*/
                    component: OccupationdetailComponent
                },
            ]
        },
        //occupation

        //region
        {
            path: 'subregionlist',
            component: RegionlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'regiondetail', /*add*/
                    component: RegiondetailComponent
                },
                {
                    path: 'regiondetail/:id', /*update*/
                    component: RegiondetailComponent,
                    children: [
                        {
                            path: 'regionplatlist/:id',
                            component: RegionplatlistComponent,
                            children: [
                                {
                                    path: 'regionplatdetail/:id',
                                    component: RegionplatdetailComponent
                                },
                                {
                                    path: 'regionplatdetail/:id/:id2',
                                    component: RegionplatdetailComponent
                                }
                            ]
                        },
                        {
                            path: 'regioncitylist/:id',
                            component: RegioncitylistComponent
                        }
                    ]
                },

            ]
        },
        //region

        //collateralcategory
        {
            path: 'subinsurancecollateralcategorylist',
            component: InsurancecollateralcategorylistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'insurancecollateralcategorydetail', /*add*/
                    component: InsurancecollateralcategorydetailComponent
                },
                {
                    path: 'insurancecollateralcategorydetail/:id', /*update*/
                    component: InsurancecollateralcategorydetailComponent
                },
            ]
        },
        //collateralcategory

        //#coverage
        {
            path: 'subcoveragelist',
            component: CoveragelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'coveragedetail', /*add*/
                    component: CoveragedetailComponent
                },
                {
                    path: 'coveragedetail/:id', /*update*/
                    component: CoveragedetailComponent
                },
            ]
        },
        //#endcoverage
        
        //ratenonlife
        {
            path: 'subinsuranceratenonlifelist',
            component: InsuranceratenonlifelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'insuranceratenonlifedetail', /*add*/
                    component: InsuranceratenonlifedetailComponent
                },
                {
                    path: 'insuranceratenonlifedetail/:id', /*update*/
                    component: InsuranceratenonlifedetailComponent
                },
                {
                    path: 'insuranceratenonlifedetaildetail/:id', /*add*/
                    component: InsuranceratenonlifedetaildetailComponent
                },
                {
                    path: 'insuranceratenonlifedetaildetail/:id/:id2', /*update*/
                    component: InsuranceratenonlifedetaildetailComponent
                },
            ]
        },
        //ratenonlife

        //depreciation
        {
            path: 'subinsurancedepreciationlist',
            component: InsurancedepreciationlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'insurancedepreciationdetail', /*add*/
                    component: InsurancedepreciationdetailComponent
                },
                {
                    path: 'insurancedepreciationdetail/:id', /*update*/
                    component: InsurancedepreciationdetailComponent
                },
                {
                    path: 'insurancedepreciationdetaildetail/:id', /*add*/
                    component: InsurancedepreciationdetaildetailComponent
                },
                {
                    path: 'insurancedepreciationdetaildetail/:id/:id2', /*update*/
                    component: InsurancedepreciationdetaildetailComponent
                },
            ]
        },
        //depreciation

        //insurancecompany
        {
            path: 'subinsurancecompanylist',
            component: InsurancecompanylistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'insurancecompanydetail', /*add*/
                    component: InsurancecompanydetailComponent
                },
                {
                    path: 'insurancecompanydetail/:id', /*update*/
                    component: InsurancecompanydetailComponent,
                    children: [
                        {
                            path: 'insurancecompanyfeelist/:id',
                            component: InsurancecompanyfeelistComponent,
                            children: [
                                {
                                    path: 'insurancecompanyfeedetail/:id',
                                    component: InsurancecompanyfeedetailComponent
                                }, {
                                    path: 'insurancecompanyfeedetail/:id/:id2',
                                    component: InsurancecompanyfeedetailComponent
                                }
                            ]
                        },
                        {
                            path: 'insurancecompanyaddresslist/:id',
                            component: InsurancecompanyaddresslistComponent,
                            children: [
                                {
                                    path: 'insurancecompanyaddressdetail/:id',
                                    component: InsurancecompanyaddressdetailComponent
                                }, {
                                    path: 'insurancecompanyaddressdetail/:id/:id2',
                                    component: InsurancecompanyaddressdetailComponent
                                }
                            ]
                        },
                        {
                            path: 'insurancecompanybanklist/:id',
                            component: InsurancecompanybanklistComponent,
                            children: [
                                {
                                    path: 'insurancecompanybankdetail/:id',
                                    component: InsurancecompanybankdetailComponent
                                }, {
                                    path: 'insurancecompanybankdetail/:id/:id2',
                                    component: InsurancecompanybankdetailComponent
                                }
                            ]
                        },
                        {
                            path: 'insurancecompanybranchlist/:id',
                            component: InsurancecompanybranchlistComponent
                        },
                        {
                            path: 'insurancecompanydepreciationlist/:id',
                            component: InsurancecompanydepreciationlistComponent,
                            children: [
                                {
                                    path: 'insurancecompanydepreciationdetail/:id',
                                    component: InsurancecompanydepreciationdetailComponent
                                }, {
                                    path: 'insurancecompanydepreciationdetail/:id/:id2',
                                    component: InsurancecompanydepreciationdetailComponent
                                }
                            ]
                        },
                        {
                            path: 'insurancecompanydocumentlist/:id',
                            component: InsurancecompanydocumentlistComponent
                        }
                    ]
                },
            ]
        },
        //insurancecompany

        //asset checklist
            {
                path: 'subassetchecklist',
                component: AssetchecklistlistComponent,
                canActivate: [AuthGuard],
                children: [
                    {
                        path: 'assetchecklistdetail',/* add */
                        component: AssetchecklistdetailComponent
                    },
                    {
                        path: 'assetchecklistdetail/:id', /**update */
                        component: AssetchecklistdetailComponent
                    },
                    {
                        path: 'bastassetchecklistdetail/:id', /**add */
                        component: MasterbastassetcheklistdetailComponent
                    },
                    {
                        path: 'bastassetchecklistdetail/:id/:code', /**update */
                        component: MasterbastassetcheklistdetailComponent
                    },
                ]
            },
        //asset checklist
        {
            path: 'submasterauctionfeelist',
            component: AuctionfeelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'auctionfeedetail',
                    component: AuctionfeedetailComponent
                },
                {
                    path: 'auctionfeedetail/:id',
                    component: AuctionfeedetailComponent
                }
            ]
        },
        //document group
        {
            path: 'subdocumentgroup',
            component: DocumentGrouplistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'documentgroupdetail', /**add */
                    component: DocumentGroupdetailComponent
                },
                {
                    path: 'documentgroupdetail/:id', /**update */
                    component: DocumentGroupdetailComponent
                }
            ]
        },
        //auction
        {
            path: 'subauctionlist',
            component: AuctionlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'auctiondetail', /*add*/
                    component: AuctiondetailComponent
                },
                {
                    path: 'auctiondetail/:id', /*update*/
                    component: AuctiondetailComponent,
                    children: [
                        //address
                        {
                            path: 'auctionaddresslist/:id',
                            component: AuctionaddresslistComponent,
                            children: [
                                {
                                    path: 'auctionaddressdetail/:id',
                                    component: AuctionAddressdetailComponent
                                }, {
                                    path: 'auctionaddressdetail/:id/:id2',
                                    component: AuctionAddressdetailComponent
                                }
                            ]
                        },

                        //bank
                        {
                            path: 'auctionbanklist/:id',
                            component: AuctionbanklistComponent,
                            children: [
                                {
                                    path: 'auctionbankdetail/:id',
                                    component: AuctionbankdetailComponent
                                }, {
                                    path: 'auctionbankdetail/:id/:id2',
                                    component: AuctionbankdetailComponent
                                }
                            ]
                        },

                        //branch
                        {
                            path: 'auctionbranchlist/:id',
                            component: AuctionbranchlistComponent,
                            children: [
                                {
                                    path: 'auctionbranchdetail/:id',
                                    component: AuctionbranchdetailComponent
                                }, {
                                    path: 'auctionbranchdetail/:id/:id2',
                                    component: AuctionbranchdetailComponent
                                }
                            ]
                        },

                        //document
                        {
                            path: 'auctiondocumentlist/:id',
                            component: AuctiondocumentlistComponent
                        },
                    ]
                },
            ]
        },
        {
            path: 'subdimensionlist',
            component: DimensionlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'dimensiondetail',
                    component: DimensiondetailComponent
                },
                {
                    path: 'dimensiondetail/:id',
                    component: DimensiondetailComponent
                },
                {
                    path: 'dimensiondetaildetail/:id', /*add*/
                    component: DimensiondetaildetailComponent
                },
                {
                    path: 'dimensiondetaildetail/:id/:id2', /*update*/
                    component: DimensiondetaildetailComponent
                },
            ]
        },
        {
            path: 'submasterapprovallist',
            component: MasterapprovallistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masterapprovaldetail',
                    component: MasterapprovaldetailComponent
                },
                {
                    path: 'masterapprovaldetail/:id',
                    component: MasterapprovaldetailComponent
                }
            ]
        },
        {
            path: 'submastersellingattachmentgroup',
            component: MasterSellingAttachtmentGrouplistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'mastersellingattachtmentgroupdetail',
                    component: MasterSellingAttachtmentGroupdetailComponent
                },
                {
                    path: 'mastersellingattachtmentgroupdetail/:id',
                    component: MasterSellingAttachtmentGroupdetailComponent
                }
            ]
        }
    ]
}];
