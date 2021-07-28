import { Injectable } from '@angular/core';
import { AppService, ServiceParameter } from '../../../@suite/@services/app.service';
import { UserLogonHistoryFilter } from '../../core/@model/core-model'

@Injectable({
  providedIn: 'root'
})
export class UserLogonHistoryService {

  private path = '/userLogonHistory';

  constructor(private service: AppService) { }

  filter(filter: UserLogonHistoryFilter): Promise<any> {
    const pars = new ServiceParameter(filter);
    if (filter) {
      if (filter.dateRecordEnd) {
        //pars.addParameter('dateRecordEnd', filter.dateRecordEnd);
      }
      if (filter.dateRecordStart) {
        //pars.addParameter('dateRecordStart', filter.dateRecordStart);
      }
      if (filter.ipAddress) {
        pars.addParameter('ipAddress', filter.ipAddress);
      }
      if (filter.statusLogon) {
        pars.addParameter('statusLogon', filter.statusLogon);
      }
      if (filter.userLogon) {
        pars.addParameter('userLogon', filter.userLogon);
      }
      if (filter.codUserRecord) {
        pars.addParameter('codUserRecord', filter.codUserRecord.toString());
      }

    }

    pars.path = this.path + "/filter";
    
    if (pars.isPageable())
      pars.path = pars.path + '/pageable';
    

    return this.service.list(pars);
  }


  chartLogonByDay(block: boolean): Promise<any> {
    return this.service.get(this.path + '/chartLogon', block);
  }
}
