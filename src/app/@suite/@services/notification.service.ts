import { Injectable } from '@angular/core';
import { ServiceParameter, AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private path = '/notify';

  constructor(private service: AppService) { }

  listNotify(block: boolean): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.list(pars, block);
  }

}
