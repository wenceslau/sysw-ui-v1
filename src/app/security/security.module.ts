import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';

import { LoginComponent } from './login/login.component';
import { SuiteModule } from '../@suite/suite.module';

import { AuthorizerService } from './authorizer.service';
import { environment } from '../../environments/environment';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SuiteModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter, //metodo que retorna o token
        whitelistedDomains: environment.tokenWhitelistedDomains, //dominios que tem que validar o token
        blacklistedRoutes: environment.tokenBlacklistedRoutes // dominios que nao tem que validar o token
      }
    }),
  ],
  providers: [
  ]
})
export class SecurityModule { }
