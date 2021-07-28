import { Injectable } from '@angular/core';
import { AppService, ServiceParameter } from '../../../@suite/@services/app.service'
import { TaskFilter } from '../@model/job-filter';
import { Task } from '../@model/job-model';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private path = '/task';

  constructor(private service: AppService) { }


  filter(filter: TaskFilter, block = true): Promise<any> {
    const pars = new ServiceParameter(filter);
    if (filter) {

      if (filter.name) {
        pars.addParameter('name', filter.name);
      }
      if (filter.description) {
        pars.addParameter('description', filter.description);
      }
    }

    pars.path = this.path + '/filter';
    if (pars.isPageable()) {
      pars.path += '/pageable';
    }

    return this.service.list(pars, block);
  }

  save(model: Task): Promise<Task> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = model;
    return this.service.save(pars);
  }

  edit(model: Task): Promise<Task> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    pars.object = model;
    pars.code = model.code;
    return this.service.edit(pars);
  }

  findByCode(code: number, block = true): Promise<Task> {
    const pars = new ServiceParameter();
    pars.path = this.path;
    return this.service.findByCode(pars, code, block);
  }

}
