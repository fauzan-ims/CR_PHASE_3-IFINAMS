import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { IframelayoutComponent } from './layouts/iframe/iframe-layout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'main',
        // redirectTo: '/pages/login',
        pathMatch: 'full',
    }, {
        path: '',
        component: AdminLayoutComponent,
        children: [{
            path: 'dashboard',
            loadChildren: './dashboard/dashboard.module#DashboardModule'
        },
        {
            path: 'systemsetting',
            loadChildren: './ifinams/systemsetting/systemsetting.module#SettingModule'
        },
        {
            path: 'transaction',
            loadChildren: './ifinams/transaction/transaction.module#SettingModule'
        },
        {
            path: 'birojasa',
            loadChildren: './ifinams/birojasa/birojasa.module#SettingModule'
        },
        {
            path: 'payment',
            loadChildren: './ifinams/payment/payment.module#SettingModule'
        },
        {
            path: 'interface',
            loadChildren: './ifinams/interface/interface.module#SettingModule'
        },
        {
            path: 'help',
            loadChildren: './ifinams/help/help.module#SettingModule'
        },
        {
            path: 'controlpanel',
            loadChildren: './ifinams/controlpanel/controlpanel.module#SettingModule'
        },
        {
            path: 'report',
            loadChildren: './ifinams/report/report.module#SettingModule'
        },
        {
            path: 'inquiry',
            loadChildren: './ifinams/inquiry/inquiry.module#SettingModule'
        },
        {
            path: 'registration',
            loadChildren: './ifinams/registration/registration.module#SettingModule'
        },
        {
            path: '',
            loadChildren: './userpage/user.module#UserModule'
        },
        {
            path: 'sellanddisposal',
            loadChildren: './ifinams/sellanddisposal/sellanddisposal.module#SettingModule'
        },
        {
            path: 'settlement',
            loadChildren: './ifinams/settlement/settlement.module#SettingModule'
        },
        ]
    }, {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'main',
                loadChildren: './mainframe/mainframe.module#MainFrameModule'
            },
            {
                path: 'pages',
                loadChildren: './pages/pages.module#PagesModule'
            }
        ]
    },
    {
        path: '',
        component: IframelayoutComponent,
        children: [
            {
                path: 'objectinfodisposal',
                loadChildren: './ifinams/sellanddisposal/sellanddisposal.module#SettingModule'
            },
            {
                path: 'objectinfoordertobureau',
                loadChildren: './ifinams/birojasa/birojasa.module#SettingModule'
            },
            {
                path: 'objectinforealizationapproval',
                loadChildren: './ifinams/birojasa/birojasa.module#SettingModule'
            },
            {
                path: 'objectinfoinsurancepolicy',
                loadChildren: './ifinams/registration/registration.module#SettingModule'
            },
            {
                path: 'objectinfoworkorderapproval',
                loadChildren: './ifinams/transaction/transaction.module#SettingModule'
            },
            {
                path: 'objectinfopaymentapproval',
                loadChildren: './ifinams/payment/payment.module#SettingModule'
            },
            {
                path: 'objectinfosoldrequest',
                loadChildren: './ifinams/sellanddisposal/sellanddisposal.module#SettingModule'
            },
            {
                path: 'objecinfoassetasstock',
                loadChildren: './ifinams/transaction/transaction.module#SettingModule'
            },
            {
                path: 'objectinfomaintenance',
                loadChildren: './ifinams/transaction/transaction.module#SettingModule'
            },
            {
                path: 'objectinfomaintenancereturn',
                loadChildren: './ifinams/transaction/transaction.module#SettingModule'
            },
        ]
    }

];
