import { Injectable } from '@angular/core';
import { AppService, ServiceParameter } from '../../../@suite/@services/app.service';
import { Profile, ProfileFilter } from '../../core/@model/core-model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  private path = '/profile';

  constructor(private service: AppService) { }

  listResume(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listResume';
    return this.service.list(pars);
  }

  filter(filter: ProfileFilter): Promise<any> {

    const pars = new ServiceParameter(filter);
    pars.path = this.path + '/filter';

    if (filter) {
      if (filter.name) {
        pars.addParameter('name', filter.name);
      }
      if (filter.codPermissions) {
        pars.addParameter('codPermissions', filter.codPermissions.toString());
      }

      if (filter.businessUnitProfile) {
        pars.addParameter('codBusinessUnitProfile', filter.businessUnitProfile.code.toString());
      }

    }
    return this.service.list(pars, true);
  }
   
  listResumebyBusinessUnit(code: number): Promise<any> {
    return this.service.get(this.path+'/listResumebyBusinessUnit/'+code);
  }
  
  save(object: Profile): Promise<Profile> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Profile): Promise<Profile> {

    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    pars.code = object.code;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<Profile> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }

}
