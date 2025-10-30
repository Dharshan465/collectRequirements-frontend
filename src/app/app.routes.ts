import { Routes } from '@angular/router';
import { LcDashboard } from './modules/dashboard/lc-dashboard/lc-dashboard';
import { LdDashboard } from './modules/dashboard/ld-dashboard/ld-dashboard';
import { LdNewRequest } from './modules/requests/ld-new-request/ld-new-request';
import { LcNewRequest } from './modules/requests/lc-new-request/lc-new-request';

export const routes: Routes = [
    { path :'dashboard/lc/:id',component:LcDashboard},
    { path :'dashboard/ld/:id',component:LdDashboard},
    { path: 'dashboard/lc/:id/create', component: LcNewRequest },
    { path: 'dashboard/ld/:id/create', component: LdNewRequest },
    { path: '', redirectTo: 'dashboard/lc/16', pathMatch: 'full' }
];