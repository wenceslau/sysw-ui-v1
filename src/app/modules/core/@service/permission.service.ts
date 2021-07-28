import { Injectable } from '@angular/core';
import {  AppService, ServiceParameter } from '../../../@suite/@services/app.service';
import { PermissionModel, PermissionFilter } from '../@model/core-model';



@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private path = '/permission';

  constructor(private service: AppService) { }

  filter(filter: PermissionFilter): Promise<any> {

    const pars = new ServiceParameter(filter);
    pars.path = this.path + '/filter';

    if (filter) {

      if (filter.description) {
        pars.addParameter('description', filter.description);
      }
      if (filter.strApplication) {
        pars.addParameter('strApplication', filter.strApplication);
      }
      if (filter.module) {
        pars.addParameter('module', filter.module);
      }
      if (filter.component) {
        pars.addParameter('component', filter.component);
      }
      if (filter.role) {
        pars.addParameter('role', filter.role);
      }
      if (filter.root) {
        pars.addParameter('root', filter.root);
      }
    }

    return this.service.list(pars, true);
  }

  listAllEnabledToAssociate(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listAllEnabledToAssociate';
    return this.service.list(pars);
  }

  listAllEnabled(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listAllEnabled';
    return this.service.list(pars);
  }

  menuItemsHorizontal(lang: string, block = true): Promise<any> {
    return this.service.get(this.path + '/menuItemsHorizontal/'+lang, block);
  }

  menuItemsVertical(router: string,lang: string, block = true): Promise<any> {
    //O router ja vem com barra, por isso a url nao tem ela
    return this.service.get(this.path + '/menuItemsVertical' + router+'/'+lang, block);
  }

  save(object: PermissionModel): Promise<PermissionModel> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: PermissionModel): Promise<PermissionModel> {

    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    pars.code = object.code;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<PermissionModel> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }

  listModule(): Promise<any> {
    return this.service.get(this.path + '/module');
  }

  listRole(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.get(this.path + '/role');
  }

  listApplication(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.get(this.path + '/application');
  }

  listApplicationBusinessUnit(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.get(this.path + '/applicationBusinessUnit');
  }

  findByRouter(router: string): Promise<PermissionModel> {
    const pars = new ServiceParameter();
    pars.object = router;
    return this.service.post(pars, this.path + '/findByRouter');
  }

  icon(router: string): Promise<any> {
    return this.service.get(this.path + '/icon/'+ router);
  }

  apllyRulesPermissionProfile(): Promise<PermissionModel> {
    return this.service.patch(this.path + '/apllyRulesPermissionProfile')
  }

}
