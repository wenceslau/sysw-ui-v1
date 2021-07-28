import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthorizerGuard } from '../../security/authorizer.guard'
import { TaskComponent } from './pages/task/task.component';

const routes: Routes = [
  {
    path: 'task',
    component: TaskComponent,
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

export class JobRouterModule { }
