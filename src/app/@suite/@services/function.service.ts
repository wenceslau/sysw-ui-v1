import { Injectable } from '@angular/core';
import { PermissionService } from 'src/app/modules/core/@service/permission.service';
import { HandlerService } from '../../@suite/@services/handler.service';
import { WebsocketService } from '../../@suite/@services/websocket.service';

import { base } from '../@base/base';
import { InfoService } from './info.service';


@Injectable({
  providedIn: 'root'
})
export class FunctionService extends base {

  constructor(
    private permissionService: PermissionService,
    private websocketService: WebsocketService,
    public infoService: InfoService,
    public handler: HandlerService) {
    super(handler);
  }

  /**
 * Login realizado na troca de setor
 * @param value 
 */
  login(username: string, value: string, sectorCode: string, language: string, subscriber, block = true) {

    if (this.isUndefined(subscriber))
      this.handler.showToastError('subscriber undefined')

    if (block)
      this.handler.block();
    //Envia o usuario, o setor e a linguagem
    //A linguagem eh neessario pq o back precisa saber qual linguagem o user
    //Logou para devolver as msg no idioma certo
    if (value && value.length < 50)
      value = this.handler.share.auth.rsa.encrypt(value);

    this.handler.share.auth.set(username, value, sectorCode, language)
      .then(() => {

        this.handler.share.infoUser = undefined
        if (this.handler.share.saveValue)
          this.handler.share.value = value;
        else
          this.handler.share.value = '';

        //Reconecta o wsocket com o novo setor
        this.connectWebsocket();

        console.log('OK');
        subscriber.next('loadmenu');
        subscriber.next('changerouter');
      })
      .catch(err => {
        subscriber.error(err);
      });
  }

  loadMenus(subscriber, block = true) {

    this.handler.share.itensMenuBar = [];
    this.handler.share.itensMegaMenu = [];

    let lang = this.handler.share.language;
    this.permissionService.menuItemsHorizontal(lang, false)
      .then(result => {
        this.handler.share.itensMegaMenu = result[0].items;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });

    this.permissionService.menuItemsVertical('/home', lang, block)
      .then(result => {
        this.handler.share.itensMenuBar = result;

        let item = this.handler.share.itensMenuBar.find(x => x.routerLink === '/objeto');
        if (item)
          this.handler.share.iconObjeto = item.icon;

        item = this.handler.share.itensMenuBar.find(x => x.routerLink === '/attribute');
        if (item)
          this.handler.share.iconAttribute = item.icon;

        item = this.handler.share.itensMenuBar.find(x => x.routerLink === '/objetoValue');
        if (item)
          this.handler.share.iconObjetoValue = item.icon;

        //Recuper os menus do os objtos favoritos
        this.loadMenusFavoritoVertical();
        if (subscriber)
          subscriber.complete();
      })
      .catch(erro => {
        if (subscriber)
          subscriber.erro();
        this.handler.handleError(erro);
      });
  }

  loadMenusFavoritoVertical() {
    // let lang = this.handler.share.language;
    // this.objetoService.menuObjectFavoriteVertical(lang)
    //   .then(result => {
    //     this.handler.share.itemsMenuHome = result;
    //   })
    //   .catch(erro => { console.error(erro) });
  }

  loadLanguage(lang: string) {
    if (this.handler.share.laguages && this.handler.share.laguages.length !== 0) {
      console.log('Languages already exist ' + this.handler.share.laguages.length);
      return;
    }
    console.log('Language not exist yet')
    this.infoService.infoStart1(lang, false)
      .then(result => {
        this.handler.share.laguages = result.languages;
        this.handler.share.infoSystem = result.infoSystem;
        console.log('Languages receive exist 1 ' + this.handler.share.laguages.length);
      })
      .catch(error => {
        //Try again!
        this.infoService.infoStart1(lang, false)
          .then(result => {
            this.handler.share.laguages = result.languages;
            this.handler.share.infoSystem = result.infoSystem;
            console.log('Languages receive exist 2 ' + this.handler.share.laguages.length);
          })
          .catch(error => {
            this.handler.unblock();
            console.error(error)
          });
      });
    //}
  }

  loadUserSectors(username: string, subscriber, block = true) {
    this.infoService.infoStart2(username, block)
      .then(result => {
        this.handler.share.sectors = result;
        subscriber.complete()
      })
      .catch(err => {
        subscriber.error(err);
      });
  }

  connectWebsocket() {
    //Connecta ao websocket
    if (this.isDefaultSector)
      this.websocketService.connect(0, this.handler.share.userNameLogged);
    else
      this.websocketService.connect(this.handler.share.sectorCode, this.handler.share.userNameLogged);
  }

  disconnectWebsocket() {
    this.websocketService.disconnect();
  }

  isRouterLogged(): boolean {
    return this.handler.router.url !== '/login' && this.handler.router.url !== '/';
  }
}
