import { Routes } from '@angular/router';
import { LcDashboard } from './modules/dashboard/lc-dashboard/lc-dashboard';
import { LdDashboard } from './modules/dashboard/ld-dashboard/ld-dashboard';
import { LdEvents } from './modules/events/ld-events/ld-events';
import { LdAddEvent } from './modules/events/ld-add-event/ld-add-event';

export const routes: Routes = [
    { path :'lc-dashboard',component:LcDashboard},
    {path:'ld-dashboard', component:LdDashboard},
    {path:'ld-events',component: LdEvents},
    {path:'ld-add-event', component: LdAddEvent},
    { path: '', redirectTo: 'lc-dashboard', pathMatch: 'full' }
];