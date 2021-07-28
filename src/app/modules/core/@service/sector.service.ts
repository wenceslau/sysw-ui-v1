import { Injectable } from '@angular/core';
import { AppService, ServiceParameter } from '../../../@suite/@services/app.service';
import { Sector, SectorFilter } from '../../core/@model/core-model';

@Injectable({
  providedIn: 'root'
})
export class SectorService {


  private path = '/sector';

  constructor(private service: AppService) { }

  listResume(): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listResume';
    return this.service.list(pars);
  }

  listResumeByBusinessUnit(code: number): Promise<any> {
    return this.service.get(this.path + '/listResumeByBusinessUnit/' + code);
  }

  filter(filter: SectorFilter): Promise<any> {

    const pars = new ServiceParameter();
    pars.path = this.path + '/filter';

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
      if (filter.status != null) {
        pars.addParameter('status', filter.status + '')
      }
      if (filter.orderBy) {
        pars.addParameter('orderBy', filter.orderBy);
      }
      if (filter.name) {
        pars.addParameter('name', filter.name);
      }
      if (filter.codBusinessUnit) {
        pars.addParameter('codBusinessUnit', filter.codBusinessUnit.toString());
      }
      if (filter.onlySectorFromAppLogged != null) {
        pars.addParameter('onlySectorFromAppLogged', filter.onlySectorFromAppLogged + '')
      }

    }
    return this.service.list(pars, true);
  }

  save(object: Sector): Promise<Sector> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: Sector): Promise<Sector> {

    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    pars.code = object.code;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<Sector> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }

  createDatabase(code: number): Promise<any> {
    return this.service.put(this.path + '/createDatabase/' + code);
  }

  existDatabase(code: number): Promise<any> {
    return this.service.get(this.path + '/existDataBase/' + code);
  }

}
