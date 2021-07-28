import { Injectable } from '@angular/core';
import { AppService, ServiceParameter } from '../../../@suite/@services/app.service';
import { ApplicationModel } from '../../core/@model/core-model'

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private path = '/application';

  constructor(private service: AppService) { }

  listResume(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listResume';
    return this.service.list(pars);
  }

  filter(block = true): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/filter';
    return this.service.list(pars, block);
  }

  listByBusinesUnitLogged(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listByBusinesUnitLogged';
    return this.service.list(pars);
  }

  listByBusinessUnitOrSectorLogged(codeBU: number): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listByBusinessUnitOrSectorLogged/' + codeBU;
    return this.service.list(pars);
  }

  listNameApplications(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listNameApplications';
    return this.service.list(pars);
  }


  save(object: ApplicationModel): Promise<ApplicationModel> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: ApplicationModel): Promise<ApplicationModel> {

    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    pars.code = object.code;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<ApplicationModel> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }
}
