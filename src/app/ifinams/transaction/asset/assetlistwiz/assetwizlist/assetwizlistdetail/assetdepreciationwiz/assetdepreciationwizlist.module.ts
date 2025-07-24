import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../../../spinner-ui/spinner/spinner.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AssetDepreciationWizListComponent } from './assetdepreciationwizlist/asssetdepreciationwizlist.component';
import { AssetDepreciation } from './assetdepreciationwizlist.routing';
import { AssetDepreCommWizListComponent } from './assetdepreciationwizlist/assetdepreciationcommwizlist/assetdepreciationcommwizlist.component';
import { AssetDepreFiscalWizListComponent } from './assetdepreciationwizlist/assetdepreciationfiscalwizlist/assetdepreciationfiscalwizlist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AssetDepreciation),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        AssetDepreciationWizListComponent,
        AssetDepreCommWizListComponent,
        AssetDepreFiscalWizListComponent
    ],
    providers: [
        DALService
    ]
})

export class AssetDepreciationModule { }
