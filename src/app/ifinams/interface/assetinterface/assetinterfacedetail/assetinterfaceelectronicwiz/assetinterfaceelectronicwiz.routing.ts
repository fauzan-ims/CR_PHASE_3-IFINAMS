import { Routes } from '@angular/router';
import { AssetInterfaceElectronicWizdetailComponent } from './assetinterfaceelectronicwizdetail/assetinterfaceelectronicwizdetail.component';

export const AssetInterfaceElectronic: Routes = [{
    path: '',
    children: [
        {
            path: 'assetinterfaceelectronicdetail/:id',
            component: AssetInterfaceElectronicWizdetailComponent
        },
        {
            path: 'assetinterfaceelectronicdetail/:id/:id2',
            component: AssetInterfaceElectronicWizdetailComponent
        }
    ]
}];
