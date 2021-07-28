import { Injectable } from '@angular/core';
import { AppService, ServiceParameter } from '../../../@suite/@services/app.service';
import { Bool, BusinessUnitModel, License } from '../../core/@model/core-model'

@Injectable({
  providedIn: 'root'
})
export class BusinessUnitService {


  private path = '/businessUnit';

  constructor(private service: AppService) { }

  listResume(block = true): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listResume';;
    return this.service.list(pars, block);
  }

  filter(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/filter';;
    return this.service.list(pars, true);
  }

  save(object: BusinessUnitModel): Promise<BusinessUnitModel> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: BusinessUnitModel): Promise<BusinessUnitModel> {
    console.log(JSON.stringify(object));
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    pars.code = object.code;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<BusinessUnitModel> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }


  sysmonkey(object: License): Promise<Bool> {
    console.log(JSON.stringify(object));
    const pars = new ServiceParameter();
    pars.path = this.path + '/sysmonkey';
    pars.object = object;
    pars.code = 0;
    return this.service.edit(pars);
  }
}
