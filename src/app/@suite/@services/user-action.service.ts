import { Injectable } from '@angular/core';
import { ServiceParameter, AppService } from './app.service';
import { UserActionFilter } from '../../modules/core/@model/core-model'

@Injectable({
  providedIn: 'root'
})
export class UserActionService {

  private path = '/userAction';

  constructor(private service: AppService) { }

  filter(filter: UserActionFilter, module: string): Promise<any> {
    const pars = new ServiceParameter(filter);
    if (filter) {
      if (filter.dateRecordEnd) {
        //pars.addParameter('dateRecordEnd', filter.dateRecordEnd);
      }
      if (filter.dateRecordStart) {
        //pars.addParameter('dateRecordStart', filter.dateRecordStart);
      }
      if (filter.action)
        pars.addParameter('action', filter.action);

      if (filter.nameObject)
        pars.addParameter('nameObject', filter.nameObject);

      if (filter.idRecord)
        pars.addParameter('idRecord', filter.idRecord.toString());

      if (filter.hashObject)
        pars.addParameter('hashObject', filter.hashObject.toString());

      if (filter.idObject)
        pars.addParameter('idObject', filter.idObject.toString());

      if (filter.codUserRecord)
        pars.addParameter('codUserRecord', filter.codUserRecord.toString());

      if (filter.resume)
        pars.addParameter('resume', filter.resume + '');

    }

    let localPath = this.path;
    if (module === 'CORE') {
      localPath = '/userAction';

    } else if (module === 'JOB') {
      localPath = '/userActionJob';

    } 

    pars.path = localPath + "/filter";

    if (pars.isPageable())
      pars.path = pars.path + '/pageable';


    return this.service.list(pars, true);
  }

}
