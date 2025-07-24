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
import { Sellanddisposal } from './sellanddisposal.routing';
import { PricingrequestlistComponent } from './pricingrequest/pricingrequestlist/pricingrequestlist.component';
import { PricingrequestdetailComponent } from './pricingrequest/pricingrequestdetail/pricingrequestdetail.component';
import { PricingrequestdetaildetailComponent } from './pricingrequest/pricingrequestdetail/pricingrequestdetaildetail/pricingrequestdetaildetail.component';
import { SellpermitlistComponent } from './sellpermit/sellpermitlist/sellpermitlist.component';
import { SellpermitdetailComponent } from './sellpermit/sellpermitdetail/sellpermitdetail.component';
import { InquirylistComponent } from './inqury/inqurylist/inquirylist.component';
import { InquirydetailComponent } from './inqury/inqurydetail/inquirydetail.component';
import { InquiryAssetVehiclewizdetailComponent } from './inqury/inqurydetail/inquirydetailassetvehiclewiz/inquirydetailassetvehiclewizlist/inquirydetailassetvehiclewizlist.component';
import { InquiryAssetElectronicwizdetailComponent } from './inqury/inqurydetail/inquirydetailassetelectronicwiz/inquirydetailassetelectronicwizlist/inquirydetailassetelectronicwizlist.component';
import { InquiryAssetMachinewizdetailComponent } from './inqury/inqurydetail/inquirydetailassetmachinewiz/inquirydetailassetmachinewizlist/inquirydetailassetmachinewizlist.component';
import { InquiryAssetFurniturewizdetailComponent } from './inqury/inqurydetail/inquirydetailassetfurniturewiz/inquirydetailassetfurniturewizlist/inquirydetailassetfurniturewizlist.component';
import { SellPermitAssetElectronicwizdetailComponent } from './sellpermit/sellpermitdetail/salepermitdetailassetelectronicwiz/salepermitdetailassetelectronicwizlist/salepermitdetailassetelectronicwizlist.component';
import { SellPermitAssetFurniturewizdetailComponent } from './sellpermit/sellpermitdetail/salepermitdetailassetfurniturewiz/salepermitdetailassetfurniturewizlist/salepermitdetailassetfurniturewizlist.component';
import { SellPermitAssetMachinewizdetailComponent } from './sellpermit/sellpermitdetail/salepermitdetailassetmachinewiz/salepermitdetailassetmachinewizlist/salepermitdetailassetmachinewizlist.component';
import { SellPermitAssetVehiclewizdetailComponent } from './sellpermit/sellpermitdetail/salepermitdetailassetvehiclewiz/salepermitdetailassetvehiclewizlist/salepermitdetailassetvehiclewizlist.component';
import { inquiryAssetPropertywizdetailComponent } from './inqury/inqurydetail/inquirydetailassetpropertywiz/inquirydetailassetpropertywizlist/inquirydetailassetpropertywizlist.component';
import { SellPermitAssetPropertywizdetailComponent } from './sellpermit/sellpermitdetail/sellpermitdetailassetpropertywiz/sellpermitdetailassetpropertywizlist/sellpermitdetailassetpropertywizlist.component';
import { DisposedListComponent } from './disposed/disposedlist/disposedlist.component';
import { DisposedDetailComponent } from './disposed/disposeddetail/disposeddetail.component';
import { DisposedDetailAssetwizlistComponent } from './disposed/disposeddetail/disposeddetailassetwiz/disposeddetailassetwizlist/disposeddetailassetwizlist.component';
import { SoldRequestListComponent } from './soldrequest/soldrequestlist/soldrequestlist.component';
import { SoldRequestdetailComponent } from './soldrequest/soldrequestdetail/soldrequestdetail.component';
import { SoldRequestDetailwizlistComponent } from './soldrequest/soldrequestdetail/soldrequestassetwiz/soldrequestassetwizlist/soldrequestwizlist.component';
import { SoldSettlementListComponent } from './soldsettlement/soldsettlementlist/soldsettlementlist.component';
import { SoldSettlementdetailComponent } from './soldsettlement/soldsettlementdetail/soldsettlementdetail.component';
import { SoldSettlementDetailFeewizlistComponent } from './soldsettlement/soldsettlementdetail/soldsettlementdetailfeewiz/soldsettlementdetailfeewizlist/soldsettlementdetailfeewizlist.component';
import { DisposedApprovalComponent } from './disposed/disposalapproval/disposalapproval.component';
import { SoldRequestApprovalComponent } from './soldrequest/soldrequestapproval/soldrequestapproval.component';
import { SoldRequestAttachmentWizlistComponent } from './soldrequest/soldrequestdetail/soldrequestattachmentwiz/soldrequestattachmentwizlist/soldrequestattachmentwizlist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Sellanddisposal),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        PricingrequestlistComponent,
        PricingrequestdetailComponent,
        PricingrequestdetaildetailComponent,
        SellpermitlistComponent,
        SellpermitdetailComponent,
        InquirylistComponent,
        InquirydetailComponent,
        InquiryAssetVehiclewizdetailComponent,
        InquiryAssetElectronicwizdetailComponent,
        InquiryAssetMachinewizdetailComponent,
        InquiryAssetFurniturewizdetailComponent,
        SellPermitAssetElectronicwizdetailComponent,
        SellPermitAssetFurniturewizdetailComponent,
        SellPermitAssetMachinewizdetailComponent,
        SellPermitAssetVehiclewizdetailComponent,
        inquiryAssetPropertywizdetailComponent,
        SellPermitAssetPropertywizdetailComponent,
        DisposedListComponent,
        DisposedDetailComponent,
        DisposedDetailAssetwizlistComponent,
        SoldRequestListComponent,
        SoldRequestdetailComponent,
        SoldRequestDetailwizlistComponent,
        SoldSettlementListComponent,
        SoldSettlementdetailComponent,
        SoldSettlementDetailFeewizlistComponent,
        DisposedApprovalComponent,
        SoldRequestApprovalComponent,
        SoldRequestAttachmentWizlistComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
