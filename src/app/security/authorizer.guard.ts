import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HandlerService } from '../@suite/@services/handler.service';

@Injectable({
  providedIn: 'root'
})

/**
 * AuthorizerGuard eh usado para interceptar
 * as navegacoes das rotas, podendo customizar a nevegacao
 */
export class AuthorizerGuard implements CanActivate {

  constructor(public handler: HandlerService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('next: ' + next);
    //this.handler.messageInline = [];
    return true;
  }
}
