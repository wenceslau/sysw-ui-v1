import { Injectable } from '@angular/core';
import { AppService, ServiceParameter } from '../../../@suite/@services/app.service';
import { Parameter, ParameterFilter } from '../../core/@model/core-model';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  private path = '/parameter';

  constructor(private service: AppService) { }

  list(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/list';
    return this.service.list(pars);
  }

  filter(filter: ParameterFilter): Promise<any> {

    const pars = new ServiceParameter();
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
      if (filter.key) {
        pars.addParameter('key', filter.key);
      }
      if (filter.group) {
        pars.addParameter('group', filter.group);
      }

    }
    pars.path = this.path;
    return this.service.list(pars, true);
  }

  save(object: Parameter): Promise<Parameter> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Parameter): Promise<Parameter> {

    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    pars.code = object.code;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<Parameter> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }

  findByKey(key: string): Promise<Parameter> {
    console.log
    const pars = new ServiceParameter();
    pars.object = key;
    return this.service.post(pars, this.path + '/byKey');
  }
}
