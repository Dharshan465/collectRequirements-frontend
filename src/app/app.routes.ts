import { Routes } from '@angular/router';
import { LcDashboard } from './modules/dashboard/lc-dashboard/lc-dashboard';
import { LdDashboard } from './modules/dashboard/ld-dashboard/ld-dashboard';
import { LdViewEventComponent } from './modules/events/ld-view-event/ld-view-event';
import { LdEditEventComponent } from './modules/events/ld-edit-event/ld-edit-event';

export const routes: Routes = [
    { path: 'lc-dashboard', component: LcDashboard },
    { path: 'ld-dashboard', component: LdDashboard },
    { path: 'events/view/:id', component: LdViewEventComponent },
    { path: 'events/edit/:id', component: LdEditEventComponent },
    { path: '', redirectTo: 'lc-dashboard', pathMatch: 'full' }
];