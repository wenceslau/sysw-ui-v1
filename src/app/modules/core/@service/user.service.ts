import { Injectable } from '@angular/core';
import {  AppService, ServiceParameter } from '../../../@suite/@services/app.service';
import {User, UserFilter} from '../../core/@model/core-model'


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private path = '/user';

  constructor(private service: AppService) { }

  listResume(block = true): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listResume';
    return this.service.list(pars, block);
  }

  filter(filter: UserFilter): Promise<any> {

    const pars = new ServiceParameter();
    pars.path = this.path + '/filter';

    if (filter) {
      if (filter.code)
        pars.addParameter('code', filter.code.toString());

      if (filter.status)
        pars.addParameter('status', filter.status + '')

      if (filter.orderBy) {
        pars.addParameter('orderBy', filter.orderBy);
      }
      if (filter.name)
        pars.addParameter('name', filter.name);

      if (filter.email)
        pars.addParameter('email', filter.email);

      if (filter.username)
        pars.addParameter('username', filter.username);

      if (filter.profile)
        pars.addParameter('codProfile', filter.profile.code.toString());

      if (filter.sector)
        pars.addParameter('codSector', filter.sector.code.toString());

      if (filter.businessUnit)
        pars.addParameter('codBusinessUnit', filter.businessUnit.code.toString());
    }
    return this.service.filterByGet(pars, true);
  }

  save(object: User): Promise<User> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    ////console.log('User to save ' + JSON.stringify(object));
    return this.service.save(pars);
  }

  edit(object: User): Promise<User> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    pars.code = object.code;
    return this.service.edit(pars);
  }

  findByCode(code: number, block = true): Promise<User> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.findByCode(pars, code, block);
  }

  changeByValue(oldp: string, newp: string): Promise<void> {
    const pars = new ServiceParameter();
    pars.object = this.service.handler.share.auth.rsa.encrypt(oldp + ',' + newp);
    return this.service.post(pars, this.path + '/changeByValue');
  }

  resetByEmail(email: string): Promise<void> {
    const pars = new ServiceParameter();
    pars.object = email;
    return this.service.post(pars, this.path + '/resetByEmail');
  }

  resetByCode(code: number, type: number): Promise<any> {
    return this.service.put(this.path + '/resetByCode/' + code + '/' +type);
  }

  changeReceiveNotify(code: number): Promise<void> {
    return this.service.put(this.path + '/changeReceiveNotify?code=' + code);
  }
}
