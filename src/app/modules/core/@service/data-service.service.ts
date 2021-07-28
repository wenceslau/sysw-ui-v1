import { Injectable } from '@angular/core';
import {  AppService, ServiceParameter } from '../../../@suite/@services/app.service';
import {Bool, DataService, DataServiceFilter} from '../../core/@model/core-model'

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private path = '/dataservice';

  constructor(private service: AppService) { }

  listResume(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listResume';
    return this.service.list(pars);
  }


  filterResume(filter: DataServiceFilter): Promise<any> {

    const pars = new ServiceParameter();
    pars.path = this.path + '/filterResume';

    if (filter) {
      if (filter.page) {
        pars.addParameter('page', filter.page.toString());
      }
      if (filter.rowsPerPage) {
        pars.addParameter('size', filter.rowsPerPage.toString());
      }
      if (filter.code) {
        pars.addParameter('code', filter.code.toString());
      }
      if (filter.status) {
        pars.addParameter('status', filter.status + '')
      }
      if (filter.orderBy) {
        pars.addParameter('orderBy', filter.orderBy);
      }
      if (filter.name) {
        pars.addParameter('key', filter.name);
      }
      if (filter.scope) {
        pars.addParameter('scope', filter.scope);
      }
      if (filter.type) {
        pars.addParameter('type', filter.type);
      }
      if (filter.codBusinessUnit) {
        pars.addParameter('codBusinessUnit', filter.codBusinessUnit.toString());
      }
    }
    return this.service.list(pars, true);
  }

  filterDataService(filter: DataServiceFilter): Promise<any> {

    const pars = new ServiceParameter();
    pars.path = this.path + '/filterDataService';

    if (filter) {
      if (filter.page) {
        pars.addParameter('page', filter.page.toString());
      }
      if (filter.rowsPerPage) {
        pars.addParameter('size', filter.rowsPerPage.toString());
      }
      if (filter.code) {
        pars.addParameter('code', filter.code.toString());
      }
      if (filter.status) {
        pars.addParameter('status', filter.status + '')
      }
      if (filter.orderBy) {
        pars.addParameter('orderBy', filter.orderBy);
      }
      if (filter.name) {
        pars.addParameter('key', filter.name);
      }
      if (filter.scope) {
        pars.addParameter('scope', filter.scope);
      }
      if (filter.type) {
        pars.addParameter('type', filter.type);
      }
      if (filter.codBusinessUnit) {
        pars.addParameter('codBusinessUnit', filter.codBusinessUnit.toString());
      }
    }
    return this.service.list(pars, true);
  }

  filterDataTask(filter: DataServiceFilter): Promise<any> {

    const pars = new ServiceParameter();
    pars.path = this.path + '/filterDataTask';

    if (filter) {
      if (filter.page) {
        pars.addParameter('page', filter.page.toString());
      }
      if (filter.rowsPerPage) {
        pars.addParameter('size', filter.rowsPerPage.toString());
      }
      if (filter.code) {
        pars.addParameter('code', filter.code.toString());
      }
      if (filter.status) {
        pars.addParameter('status', filter.status + '')
      }
      if (filter.orderBy) {
        pars.addParameter('orderBy', filter.orderBy);
      }
      if (filter.name) {
        pars.addParameter('key', filter.name);
      }
      if (filter.scope) {
        pars.addParameter('scope', filter.scope);
      }
      if (filter.type) {
        pars.addParameter('type', filter.type);
      }
      if (filter.codBusinessUnit) {
        pars.addParameter('codBusinessUnit', filter.codBusinessUnit.toString());
      }
    }
    return this.service.list(pars, true);
  }

  filterDataServiceExternalObjeto(filter: DataServiceFilter): Promise<any> {

    const pars = new ServiceParameter();
    pars.path = this.path + '/filterDataServiceExternalObjeto';

    if (filter) {
      if (filter.code) {
        pars.addParameter('code', filter.code.toString());
      }
      if (filter.status) {
        pars.addParameter('status', filter.status + '')
      }
      if (filter.orderBy) {
        pars.addParameter('orderBy', filter.orderBy);
      }
      if (filter.name) {
        pars.addParameter('key', filter.name);
      }
      if (filter.scope) {
        pars.addParameter('scope', filter.scope);
      }
      if (filter.type) {
        pars.addParameter('type', filter.type);
      }
      if (filter.codBusinessUnit) {
        pars.addParameter('codBusinessUnit', filter.codBusinessUnit.toString());
      }
    }
    return this.service.list(pars, true);
  }

  save(object: DataService): Promise<DataService> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    console.log('Status: ' + object.status);
    return this.service.save(pars);
  }

  edit(object: DataService): Promise<DataService> {

    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    pars.code = object.code;
    console.log('Status: ' + object.status);
    return this.service.edit(pars);
  }

  clone(code: number): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + "/clone";
    return this.service.clone(pars, code);
  }

  cloneTemplate(dataServiceType: string): Promise<any> {
    return this.service.get(this.path + '/cloneTemplate/' + dataServiceType);
  }

  testConnection(code: number): Promise<Bool> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.post(pars, this.path + '/testDataService/' + code)
  }

  findByCode(code: number): Promise<DataService> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }

}
