import { Injectable } from '@angular/core';
import {  AppService, ServiceParameter } from '../../../@suite/@services/app.service';
import {ItemDataList} from '../../core/@model/core-model'

@Injectable({
  providedIn: 'root'
})
export class DataListService {

  private path = '/datalist';

  constructor(private service: AppService) { }

  listDataList(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.list(pars);
  }

  allItemByDataListName(name: string): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/allItemByDataListName/' + name;
    return this.service.list(pars, true);
  }

  allItemEnableByDataListName(name: string): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/allItemEnableByDataListName/'+ name;
    return this.service.list(pars);
  }

  allItemEnableByDataListNameAndGroup(name: string, group: string): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/allItemEnableByDataListNameAndGroup/'+name+'/'+ group;
    return this.service.list(pars);
  }


  findItemDataListByCode(code: number): Promise<ItemDataList> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }


  saveItemDataList(object: ItemDataList): Promise<ItemDataList> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  editItemDataList(object: ItemDataList): Promise<ItemDataList> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    pars.code = object.code;
    return this.service.edit(pars);
  }
}
