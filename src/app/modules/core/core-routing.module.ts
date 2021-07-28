import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthorizerGuard } from '../../security/authorizer.guard'

import { LanguageComponent } from './pages/language/language.component';
import { DataListComponent } from './pages/data-list/data-list.component';
import { ApplicationComponent } from './pages/application/application.component';
import { PermissionComponent } from './pages/permission/permission.component';
import { BusinessUnitComponent } from './pages/business-unit/business-unit.component';
import { ParameterComponent } from './pages/parameter/parameter.component';
import { DataServiceComponent } from './pages/data-service/data-service.component';
import { DataTaskComponent } from './pages/data-task/data-task.component';
import { SectorComponent } from './pages/sector/sector.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserComponent } from './pages/user/user.component';
import { UserGroupComponent } from './pages/user-group/user-group.component';

const routes: Routes = [
  {
    path: 'language',
    component: LanguageComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_HOME'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
  {
    path: 'datalist',
    component: DataListComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_HOME'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
  {
    path: 'application',
    component: ApplicationComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_HOME'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
  {
    path: 'permission',
    component: PermissionComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_HOME'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
  {
    path: 'businessUnit',
    component: BusinessUnitComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_HOME'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
  {
    path: 'parameter',
    component: ParameterComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_HOME'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
  {
    path: 'dataservice',
    component: DataServiceComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_HOME'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
  {
    path: 'sector',
    component: SectorComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_HOME_S'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
  {
    path: 'datatask',
    component: DataTaskComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_HOME'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_HOME'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_HOME'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
  {
    path: 'usergroup',
    component: UserGroupComponent,
    canActivate: [AuthorizerGuard],
    data: { roles: ['ROLE_HOME'] } // Pode-se usar esses dados no interceptador AuthorizerGuard
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes) // Aplica esse arquivo de rotas como filho
  ],
  exports: [
    RouterModule //Exporta para ser reconhecido pelo app.module
  ],
  declarations: []
})

export class CoreRouterModule { }
