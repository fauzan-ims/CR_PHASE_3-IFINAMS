import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { RegionPlateWizRoutes } from './regionplatwiz.routing';
import { RegionplatlistComponent } from './regionplatlist/regionplatlist.component';
import { RegionplatdetailComponent } from './regionplatdetail/regionplatdetail.component';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(RegionPlateWizRoutes),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule
    ],
    declarations: [
        RegionplatlistComponent,
        RegionplatdetailComponent,
    ],
    providers: [
        DALService
    ]
})

export class RegionPlateWizModule { }
