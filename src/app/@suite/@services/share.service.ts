import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthorizerService } from '../../security/authorizer.service';

import { InfoUser, InfoEnviorment, InfoSystem } from '../@base/modelbase';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  openImportValue: boolean;

  sortAttributes: any[];

  value: string = '';           //Pass user to keep autenticated
  saveValue: boolean;           //Value to define if the pass was save

  urlDomain = "";               //domain current url

  infoSystem: InfoSystem;
  infoUser: InfoUser = undefined;
  infoEnviorment: InfoEnviorment;

  navigation: string;           //String show on sitemap 
  navigationIcon: string;       //Icon show on sitemap

  numNotify: number = 0;        //Num notice on badge button notify 
  silenceNotify: Boolean;       //Silence receivement notice

  SysMonkeycodeSelectedObjetoPages: number;  //Codigo objeto compartilhado para abrir a pagina do objeto, definido no valor outr atributo
  rows: number;                         //Line numbers from calculate paginator grid, just use for view in footer home

  itensMegaMenu: MenuItem[] | MenuItem[][]; //Menu itens for megaMenu on NavbarComponent - Horizontal Menus
  itensMenuBar: MenuItem[];                 //Menu itens for bar - Vertical menus
  itemsMenuHome: MenuItem[];                //Menu itens for home and favorite vertical menu

  sectors: any[];             //Lista de setores do usuario logado, sera listado no dropdown do navbar, carregado no login
  sector: any;                //Setor logado definido pelo login ou troca depois de logado
  laguages: any[];            //Linguages do sistema, carregado no login 



  //CRIAR UM SHARE POR MODULO
  iconObjeto: string;
  iconAttribute: string = 'fad fa-columns';
  iconObjetoValue: string = 'fad fa-cube' ;
  
  constructor(public auth: AuthorizerService) { }

  clear() {
    this.navigation = null;
    this.SysMonkeycodeSelectedObjetoPages = null;
    this.itensMegaMenu = null;
    this.itensMenuBar = null;
    this.numNotify = 0;
    this.value = null;
    this.saveValue = null;
  }

  get typeProfileLogged(): number {
    if (this.auth && this.auth.jwtPayload) {
      return this.auth.jwtPayload.typeProfile;
    }
  }

  get codeUserLogged(): number {
    if (this.auth && this.auth.jwtPayload) {
      return this.auth.jwtPayload.codeUser;
    }
  }

  get userNameLogged(): string {
    if (this.auth && this.auth.jwtPayload) {
      return this.auth.jwtPayload.user_name;
    }
  }

  get sectorName(): string {
    if (this.auth && this.auth.jwtPayload) {
      return this.auth.jwtPayload.sectorName;
    }
  }

  get sectorCode(): number {
    if (this.auth && this.auth.jwtPayload) {
      return this.auth.jwtPayload.sectorCode;
    }
  }

  get businessUnitCode(): number {
    if (this.auth && this.auth.jwtPayload) {
      return this.auth.jwtPayload.businessUnitCode;
    }
  }

  get nameExternalDatabase(): string {
    if (this.auth && this.auth.jwtPayload) {
      return this.auth.jwtPayload.nameExternalDatabase;
    }
  }

  get applicationLogo(): string {
    if (this.auth && this.auth.jwtPayload) {
      if (this.auth.jwtPayload.imageBUnit)
        return this.auth.jwtPayload.imageBUnit;
    }
    return 'login_sysmonkey.png'
  }

  get receiveNotify(): boolean {
    if (this.auth && this.auth.jwtPayload) {
      return this.auth.jwtPayload.receiveNotify;
    }
  }

  get innerHeight(): number {
    return window.innerHeight;
  }

  get language(): string {
    let lang = localStorage.getItem('language');
    if (lang === undefined || lang === null || lang === 'undefined' || lang === 'null')
      lang = 'PT';
    return lang;
  }

  /**
  * Retorna se o user logafo tem perfil tipo SA
  */
  get isSa(): boolean {
    return this.typeProfileLogged === 1
  }

  /**
   * Retorna se o user logado tem perfi tipo UA
   */
  get isUa(): boolean {
    return this.typeProfileLogged === 2
  }

  /**
   * Retorna se o user logado tem perfil tipo ADM
   */
  get isAdm(): boolean {
    return this.typeProfileLogged === 3
  }

  get isSectorDefault(): boolean {
    return this.sectorName && this.sectorName.toLocaleUpperCase() === 'DEFAULT'
  }

  getLabel(key: string, dft = undefined): string {
    if (this.laguages) {
      //console.log(key);
      //console.log(this.laguages);
      
      let lang = this.laguages.find(x => x.key === key)
      if (lang && lang.value)
        return lang.value;
      //else
        //  console.log('without value')
        
    }
    //else{
      //console.log('without languages')
    //}

    if (dft)
      return dft;

    return key;
  }

  refresToken() {
    let val1 = this.userNameLogged;
    let val2 = this.value;
    let val3 = this.sectorCode+'';
    let val4 = this.language;

    if (val2 && val2.length < 50)
      val2 = this.auth.rsa.encrypt(val2);

    this.auth.set(val1, val2, val3, val4)
      .then(() => {
      })
      .catch(err => {
        console.error(err);
      });

  }

}
