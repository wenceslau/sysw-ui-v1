import { Injectable } from '@angular/core';
import { ServiceParameter, AppService } from './app.service';

import { InfoUser, InfoEnviorment, InfoSystem } from '../@base/modelbase';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  private path = '/info';

  constructor(
    private service: AppService) { }

  logged(block = false): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/logged';
    return this.service.list(pars, block);
  }

  userInfo(code: number, block = true): Promise<InfoUser> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/user';
    return this.service.findByCode(pars, code, block);
  }

  infoEnviorment(code: number, block = true): Promise<InfoEnviorment> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/enviroment';
    return this.service.findByCode(pars, code, block);
  }

  infoStart1(lang: string, block = true): Promise<any> {
    lang = this.service.handler.share.auth.rsa.encrypt(lang);
    const pars = new ServiceParameter();
     pars.object = lang;
     return this.service.post(pars, this.path + '/infoStart1', block);
  }

  infoStart2(username: string, block = true): Promise<any> {
    username = this.service.handler.share.auth.rsa.encrypt(username);
    const pars = new ServiceParameter();
    pars.object = username;
    return this.service.post(pars,this.path+'/infoStart2', block);
  }

  infoStart3(email: string): Promise<void> {
    email = this.service.handler.share.auth.rsa.encrypt(email);
    const pars = new ServiceParameter();
    pars.object = email;
    return this.service.post(pars, this.path + '/infoStart3');
  }

  infoStart4(sectorCode: number, username: string, sysmonkey: string): Promise<void> {
    const pars = new ServiceParameter();
    pars.object = sectorCode + ';' + username + ';' + sysmonkey;
    return this.service.post(pars, this.path + '/infoStart4');
  }

  infoSystem(code: number, block = true): Promise<InfoSystem> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/system';
    return this.service.findByCode(pars, code, block);
  }

  infoModel(entity: string, router: string, module: string, block = false): Promise<any> {
    let localPath = this.path;
    if (module === 'CORE')
      localPath = '/info';
      
    return this.service.get(localPath + '/model/' + entity + '/' + router, block);
  }

  infoConnection(block = true): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/connection';
    return this.service.list(pars);
  }

  closeConnection(key: string, block = true): Promise<any> {
    const pars = new ServiceParameter();
    return this.service.post(pars, this.path + '/connection/close/' + key)
  }

  roolbackConnection(key: string, block = true): Promise<any> {
    const pars = new ServiceParameter();
    return this.service.post(pars, this.path + '/connection/roolback/' + key)

  }
}
