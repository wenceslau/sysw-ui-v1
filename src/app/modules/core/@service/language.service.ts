import { Injectable } from '@angular/core';
import {  AppService, ServiceParameter } from '../../../@suite/@services/app.service';
import { LanguageModel, LanguageFilter } from '../../core/@model/core-model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private path = '/language';

  constructor(private service: AppService) { }

  filter(filter: LanguageFilter): Promise<any> {

    const pars = new ServiceParameter(filter);

    if (filter) {

      if (filter.key)
        pars.addParameter('key', filter.key);

      if (filter.portugues)
        pars.addParameter('portugues', filter.portugues);

      if (filter.english)
        pars.addParameter('english', filter.english);

      if (filter.spanish)
        pars.addParameter('spanish', filter.spanish);

    }
    pars.path = this.path + '/filter';

    if (pars.isPageable()) {
      pars.path = this.path + '/filter/pageable';
    }


    console.log( pars.path);

    return this.service.list(pars, true);
  }

  save(object: LanguageModel): Promise<LanguageModel> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    return this.service.save(pars);
  }

  edit(object: LanguageModel): Promise<LanguageModel> {

    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = object;
    pars.code = object.code;
    return this.service.edit(pars);
  }

  findByCode(code: number): Promise<LanguageModel> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.findByCode(pars, code);
  }
}
