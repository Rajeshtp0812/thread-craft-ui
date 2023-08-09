import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'main', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'utilities', loadChildren: () => import('./common/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'clients', loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule) },
                    { path: 'vendors', loadChildren: () => import('./vendors/vendors.module').then(m => m.VendorsModule) },
                    { path: 'configuration', loadChildren: () => import('./companies/companies.module').then(m => m.CompaniesModule) },
                ]
            },
            { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },

        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
