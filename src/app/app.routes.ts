import { Routes } from '@angular/router';
import { LcDashboard } from './modules/dashboard/lc-dashboard/lc-dashboard';
import { LdDashboard } from './modules/dashboard/ld-dashboard/ld-dashboard';
import { LdNewRequest } from './modules/requests/ld-new-request/ld-new-request';
import { LcNewRequest } from './modules/requests/lc-new-request/lc-new-request';
import { LdViewEventComponent } from './modules/events/ld-view-event/ld-view-event';
import { LdEditEventComponent } from './modules/events/ld-edit-event/ld-edit-event';
import { LdEvents } from './modules/events/ld-events/ld-events';
import { LdAddEvent } from './modules/events/ld-add-event/ld-add-event';
import { LdDeleteEvent } from './modules/events/ld-delete-event/ld-delete-event';
import { LdEditRequest } from './modules/requests/ld-edit-request/ld-edit-request';
import { LdViewRequest } from './modules/requests/ld-view-request/ld-view-request';
import { LdDeleteRequest } from './modules/requests/ld-delete-request/ld-delete-request';

export const routes: Routes = [
    { path :'dashboard/lc/:id',component:LcDashboard},
    { path :'dashboard/ld/:id',component:LdDashboard},
    { path: 'dashboard/lc/:id/create', component: LcNewRequest },
    { path: 'dashboard/ld/:id/create', component: LdNewRequest },
    {path:'ld-events',component: LdEvents},
    {path:'ld-add-event', component: LdAddEvent},
    { path: 'events/view/:id', component: LdViewEventComponent },
    { path: 'events/edit/:id', component: LdEditEventComponent },
    { path: 'events/delete/:id', component: LdDeleteEvent },
    { path: 'requests/edit/:id', component: LdEditRequest },
    { path: 'requests/view/:id', component: LdViewRequest },
    { path: 'requests/delete/:id', component: LdDeleteRequest },
    { path: '', redirectTo: 'dashboard/lc/16', pathMatch: 'full' }
];