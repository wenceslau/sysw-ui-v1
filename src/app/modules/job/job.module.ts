import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiteModule } from '../../@suite/suite.module';
import { JobRouterModule } from './job-routing.module';
import { TaskComponent } from './pages/task/task.component';


@NgModule({
  declarations: [TaskComponent],
  imports: [
    CommonModule,
    SuiteModule,
    JobRouterModule
  ]
})
export class JobModule { }
