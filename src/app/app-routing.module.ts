import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './@suite/pages/dashboard/dashboard.component';
import { EmptyComponent } from './@suite/pages/empty/empty.component';
import { HomeComponent } from './@suite/pages/home/home.component';
import { LoginComponent } from './security/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { roles: ['ROLE_HOME'] }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { roles: ['ROLE_HOME'] }
  },
  {
    path: 'home/:router',
    component: HomeComponent,
    data: { roles: ['ROLE_HOME'] }
  },
  {
    path: 'empty/:router',
    component: EmptyComponent,
    data: { roles: ['ROLE_HOME'] }
  },
  {
    path: 'empty/:router/:id',
    component: EmptyComponent,
    data: { roles: ['ROLE_HOME'] }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { roles: ['ROLE_HOME'] }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
