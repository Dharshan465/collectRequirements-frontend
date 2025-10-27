import { Routes } from '@angular/router';
import { LcDashboard } from './modules/dashboard/lc-dashboard/lc-dashboard';
import { LdDashboard } from './modules/dashboard/ld-dashboard/ld-dashboard';

export const routes: Routes = [
    { path :'lc-dashboard',component:LcDashboard},
    {path:'ld-dashboard', component:LdDashboard},
    { path: '', redirectTo: 'lc-dashboard', pathMatch: 'full' }
];