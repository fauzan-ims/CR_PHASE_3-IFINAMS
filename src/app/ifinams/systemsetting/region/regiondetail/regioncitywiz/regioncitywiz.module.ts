import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { RegionCityWizRoutes } from './regioncitywiz.routing';
import { RegioncitylistComponent } from './regioncitylist/regioncitylist.component';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(RegionCityWizRoutes),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule
    ],
    declarations: [
        RegioncitylistComponent,
    ],
    providers: [
        DALService
    ]
})

export class RegionCityWizModule { }
