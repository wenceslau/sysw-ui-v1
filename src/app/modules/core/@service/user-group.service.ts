import { Injectable } from '@angular/core';
import { AppService, ServiceParameter } from '../../../@suite/@services/app.service';
import { UserGroup, UserGroupFilter } from '../../core/@model/core-model';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {

  private path = '/usergroup';

  constructor(private service: AppService) { }


  listResume(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listResume';
    return this.service.list(pars);
  }

  filter(filter: UserGroupFilter, block = true): Promise<any> {

    const pars = new ServiceParameter();
    pars.path = this.path + '/filter';

    if (filter) {

      if (filter.page)
        pars.addParameter('page', filter.page.toString());

      if (filter.rowsPerPage)
        pars.addParameter('size', filter.rowsPerPage.toString());

      if (filter.code)
        pars.addParameter('code', filter.code.toString());

      if (filter.status != null)
        pars.addParameter('status', filter.status + '')

      if (filter.orderBy)
        pars.addParameter('orderBy', filter.orderBy);

      if (filter.name)
        pars.addParameter('name', filter.name);

      if (filter.description)
        pars.addParameter('description', filter.description);

      if (filter.username)
        pars.addParameter('username', filter.username);

    }
    return this.service.filterByGet(pars, block);
  }

  filterResume(filter: UserGroupFilter): Promise<any> {

    const pars = new ServiceParameter();
    pars.path = this.path + '/filterResume';

    if (filter) {

      if (filter.page)
        pars.addParameter('page', filter.page.toString());

      if (filter.rowsPerPage)
        pars.addParameter('size', filter.rowsPerPage.toString());

      if (filter.code)
        pars.addParameter('code', filter.code.toString());

      if (filter.status != null)
        pars.addParameter('status', filter.status + '')

      if (filter.orderBy)
        pars.addParameter('orderBy', filter.orderBy);

      if (filter.name)
        pars.addParameter('name', filter.name);

      if (filter.description)
        pars.addParameter('description', filter.description);

      if (filter.username)
        pars.addParameter('username', filter.username);

    }
    return this.service.filterByGet(pars, true);
  }

  save(object: UserGroup): Promise<UserGroup> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: UserGroup): Promise<UserGroup> {

    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    pars.code = object.code;
    return this.service.edit(pars);
  }

  findByCode(code: number, block = true): Promise<UserGroup> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.findByCode(pars, code, block);
  }

}
