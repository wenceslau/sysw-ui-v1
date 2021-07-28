import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiteModule } from '../../@suite/suite.module';
import { LanguageComponent } from './pages/language/language.component';

import { CoreRouterModule } from './core-routing.module';
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
import { UserHistoryComponent } from './components/user-history/user-history.component';

@NgModule({
  declarations: [LanguageComponent, DataListComponent, ApplicationComponent, PermissionComponent, BusinessUnitComponent, ParameterComponent, DataServiceComponent, DataTaskComponent, SectorComponent, ProfileComponent, UserComponent, UserGroupComponent, UserHistoryComponent],
  imports: [
    CommonModule,
    SuiteModule,
    CoreRouterModule
  ]
})
export class CoreModule { }
