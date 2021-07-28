import { Injectable } from '@angular/core';
import { ServiceParameter, AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class StackErrorService {

  private path = '/stackError';

  constructor(private service: AppService) { }

  listFileLog(block = true): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listFileLog';
    return this.service.list(pars);
  }

  downloaFileLog(name: string): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/downloaFileLog/' + name;
    return this.service.download(pars);
  }

  chartErrorByDay(block: boolean): Promise<any> {
    return this.service.get(this.path+'/chartError', block);
  }

  list(block = true): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path + '/listError';
    return this.service.list(pars);
  }
}
