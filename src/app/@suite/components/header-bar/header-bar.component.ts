import { Component, OnInit, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { basecomponent } from '../../@base/basecomponent';
import { HandlerService } from '../../@services/handler.service';
import { FunctionService } from '../../@services/function.service';

import { Observable, Subscriber } from 'rxjs';
import { NavigationEnd } from '@angular/router';

import { UserService } from '../../../modules/core/@service/user.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent extends basecomponent implements OnInit {

  userActivity;
  userInactive: Subject<any> = new Subject();

  displayAuthenticator: boolean;
  displayChangePass: boolean;
  displayNotify: boolean;

  currentRouter: string;
  currentUsername: string;

  initiated: boolean = false

  constructor(
    private functionService: FunctionService,
    private userService: UserService,
    public handler: HandlerService) {
    super(handler);
    this.setTimeout();
    this.userInactive.subscribe(() => this.execute());
  }

  execute() {
    console.log('user has been inactive for 60m')
    this.logout();
  }

  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 60000 * 60);
  }

  @HostListener('window:mousemove')
  refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

  ngOnInit(): void {

    let lang = this.handler.share.language;
    this.functionService.loadLanguage(lang);

    //console.log('ngOnInit');
    //Assinatura dos eventos de mudanca de rota no sistema
    //Toda mudanca de rota dispara esse evento
    this.handler.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          this.currentRouter = this.handler.router.url;

          //Se nao estiver com rota logada
          if (this.isRouterLogged == true) {
            //Reconecta o wsocket com se houver refesh
            //No refresh do browser, os services sao reiniciados, recarrega os setores que estao no share
            if (this.isUndefined(this.handler.share.sectors) || this.handler.share.sectors.length === 0) {
              this.listUsersSectors();
              this.functionService.connectWebsocket();
            }
          }
        }
      }
    );

  }

  ngAfterViewInit() {
    this.initiated = true;
  }

  showDialogChangePass() {

    this.displayChangePass = true;
  }

  /**
 * Exibe a tela alterar senha
 */
  showNotify() {
    this.displayNotify = true;
    this.handler.share.numNotify = 0;
  }

  onChangeSector(event) {

    this.currentUsername = this.handler.share.userNameLogged;
    let value = this.handler.share.value;
    if (this.handler.share.saveValue && value)
      this.login(value);
    else
      this.displayAuthenticator = true;

  }

  onHideDialog(event: Event) {
    if (this.handler.share.sectors && this.handler.share.sectors.length != 0)
      this.handler.share.sector = this.handler.share.sectors.find(x => x.code === this.handler.share.sectorCode);
  }

  /**
   * Login realizado na troca de setor
   * @param value 
   */
  login(value: string) {

    let sectorCode = this.handler.share.sector.code + '';
    let language = this.handler.share.language;

    //Observer para exccutar as chamadas na api em cascata
    //Load menus somente depois de logado
    let subscriber: Subscriber<string>;
    let observable = new Observable(obs => {
      this.handler.block();
      subscriber = obs;
      this.functionService.login(this.currentUsername, value, sectorCode, language, subscriber);
    });

    observable.subscribe({
      next: (value) => {
        if (value == 'loadmenu')
          this.functionService.loadMenus(undefined, false);
        else if (value == 'changerouter')
          this.changeRouter(subscriber);
      },
      complete: () => {
        this.handler.unblock();
        this.displayAuthenticator = false;
        this.handler.share.sector = this.handler.share.sectors.find(x => x.code === this.handler.share.sectorCode);
      },
      error: (err) => {
        this.handler.unblock();
        if ((err.status === 400 || err.status === 401) && err.error.error === 'invalid_grant')
          this.handler.messageBotton = [{ severity: 'error', summary: '', detail: this.label('lbl_usuario_ou_senha_i') }];
        else
          this.handler.handleError(err);
      }
    });
  }

  logout() {
    this.functionService.disconnectWebsocket();
    this.handler.share.auth.clearToken();
    this.handler.share.clear();
    this.handler.router.navigate(['/login']);
  }

  change(oldp: string, newp: string, conf: string) {
    //console.log('change');
    if (conf != newp) {
      this.handler.showToastWarn(this.label('lbl_nova_senha_e_c_d_s_n_c'));
      return;
    }
    this.userService.changeByValue(oldp, newp)
      .then(result => {
        this.displayInput = false;
        this.handler.showToastSuccess(this.label('lbl_senha_alterada_com_s'))
      }).catch(erro => { this.handler.handleError(erro); });
  }

  numberNotify(): string {
    if (this.handler.share.numNotify)
      return this.handler.share.numNotify.toString();
    return '';
  }

  private listUsersSectors() {

    if (this.isUndefinedOrEmpty(this.handler.share.userNameLogged))
      return;

    let subscriber: Subscriber<string>;
    let observable = new Observable(obs => {
      this.handler.block();
      subscriber = obs;
      this.functionService.loadUserSectors(this.handler.share.userNameLogged, subscriber);
    });

    observable.subscribe({
      complete: () => {
        this.handler.unblock();
        console.log(this.handler.share.sectorCode);
        this.handler.share.sector = this.handler.share.sectors.find(x => x.code === this.handler.share.sectorCode);
      },
      error: (err) => {
        this.handler.unblock();
        if (err.status === 412) {
          this.handler.messageInline = [{ severity: 'warn', summary: '', detail: err.error.message }];
        } else {
          this.handler.handleError(err);
        }
      }
    });
  }

  private changeRouter(subscriber) {
    subscriber.complete();
    if (this.currentRouter) {
      //Remove paramtros se tiver
      var router = this.currentRouter.split(';');
      console.log('currentRouter: ' + this.currentRouter + ', router: ' + router[0]);

      if (router[0].startsWith('/custom-'))
        this.handler.router.navigate(['/home']);

      else
        this.handler.router.navigate(['/empty', router[0]]);
    }
  }

  get isRouterLogged(): boolean {
    return this.functionService.isRouterLogged();
  }

  get userBadge(): string {

    if (this.handler.share.auth.jwtPayload == null)
      return;

    let arr = [] = this.handler.share.auth.jwtPayload.displayName.split(" ");

    if (arr.length == 0)
      return;

    if (arr.length > 1)
      return arr[0].substring(0, 1) + arr[1].substring(0, 1);

    if (arr[0].length > 1)
      return this.handler.share.auth.jwtPayload.displayName.substring(0, 2).toUpperCase();

  }

}
