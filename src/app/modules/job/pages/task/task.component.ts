import { Component, OnInit } from '@angular/core';
import { BusinessUnitLst } from 'src/app/modules/core/@model/core-model';
import { BusinessUnitService } from 'src/app/modules/core/@service/business-unit.service';
import { basecomponent } from '../../../../@suite/@base/basecomponent';
import { HandlerService } from '../../../../@suite/@services/handler.service';
import { TaskService } from '../../@services/task.service';
import { Task, TaskProperty } from '../../@model/job-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent extends basecomponent implements OnInit {

  formInput: FormGroup;
  formFilter: FormGroup;
  formPropertyInput: FormGroup;

  displayPropertyInput: boolean;
  propertyIndex: number;
  editProperty: boolean;

  frequecies: any[];
  schedulers: any[];
  states: any[];

  businessUnitLst: any[];
  tasks: Task[];
  taskProperties: TaskProperty[];

  constructor(
    private formBuilder: FormBuilder,
    private businessUnitService: BusinessUnitService,
    private taskService: TaskService,
    public handler: HandlerService
  ) {
    super(handler);
    this.prepareForm();
  }

  ngOnInit(): void {

    this.frequecies = [
      { label: 'INTERVAL', value: 'INTERVAL' },
      { label: 'EVERYDAY at:', value: 'EVERYDAY' },
      { label: 'EVERYWEEK at 1:30 AM on:', value: 'EVERYWEEK' },
      { label: 'EVERYMONTHLY at 1:30 AM on:', value: 'EVERYMONTHLY' },

    ];

    this.states = [
      { label: 'WAIT', value: 'WAIT' },
      { label: 'SLEEP', value: 'SLEEP' },
      { label: 'RUNNING', value: 'RUNNING' },
      { label: 'FAILURE', value: 'FAILURE' },
    ];

    this.listBusinessUnit();
    this.filterTask();
  }

  refreshAll() {
    this.applyPaginator(this.totalRecords, 11);
    this.listBusinessUnit();
    this.filterTask();
  }

  applyfilter() {
    this.filterTask();
  }

  clearFilter() {
    this.formFilter.reset();
    this.filterTask();
  }

  showDialogInput(code: number) {
    this.resetForm();

    if (code) {
      this.displayInput = true;
      this.taskService.findByCode(code)
        .then(result => {
          this.selectedRowMainTable = result;
          this.taskProperties = result.taskProperties;
          this.formInput.patchValue(result);
          this.onChangeFrequency(null);
        })
        .catch(erro => { this.handler.handleError(erro); })
        .finally(() => this.loadingInput = false);


    } else {
      this.displayInput = true;
    }

    this.saved = false;
  }


  preparerNewProperty() {
    this.formPropertyInput.reset();
    this.displayPropertyInput = true;
    this.editProperty = false;
    this.propertyIndex = this.taskProperties.length;
  }

  preparerEditProperty(property: TaskProperty, index: number) {
    this.formPropertyInput.patchValue(property);
    this.displayPropertyInput = true;
    this.editProperty = true;
    this.propertyIndex = index;
  }

  confirmProperty() {

    // if (this.checkRule(this.formInput.value, this.formPropertyInput.value)) {
    // this.handler.showToastWarn(this.label('lbl_ja_existe_uma_p_c_e_n'));
    //   return;
    // }

    this.taskProperties[this.propertyIndex] = this.cloneProperty(this.formPropertyInput.value);
    this.displayPropertyInput = false;
    this.formPropertyInput.reset();
  }


  save() {

    this.formInput.get('taskProperties').setValue(this.taskProperties);

    if (this.editing) {
      this.editTask();
    } else {
      this.addTask();
    }
    this.saved = true;
  }


  onChangeFrequency(event) {
    let freq;
    if (event)
      freq = event.value;
    else
      freq = this.formInput.value.frequency;

    switch (freq) {
      case 'INTERVAL':
        this.schedulers = [
          { label: '1 minute', value: '1minute' },
          { label: '5 minutes', value: '5minutes' },
          { label: '10 minutes', value: '10minutes' },
          { label: '30 minutes', value: '30minutes' },
          { label: '60 minutes', value: '60minutes' },
        ];
        break;
      case 'EVERYDAY':
        this.schedulers = [
          { label: 'Hour 0', value: 'hour0' },
          { label: 'Hour 1', value: 'hour1' },
          { label: 'Hour 2', value: 'hour2' },
          { label: 'Hour 3', value: 'hour3' },
          { label: 'Hour 4', value: 'hour4' },
          { label: 'Hour 5', value: 'hour5' },
          { label: 'Hour 6', value: 'hour6' },
          { label: 'Hour 7', value: 'hour7' },
          { label: 'Hour 8', value: 'hour8' },
          { label: 'Hour 9', value: 'hour9' },
          { label: 'Hour 10', value: 'hour10' },
          { label: 'Hour 11', value: 'hour11' },
          { label: 'Hour 12', value: 'hour12' },
          { label: 'Hour 13', value: 'hour13' },
          { label: 'Hour 14', value: 'hour14' },
          { label: 'Hour 15', value: 'hour15' },
          { label: 'Hour 16', value: 'hour16' },
          { label: 'Hour 17', value: 'hour17' },
          { label: 'Hour 18', value: 'hour18' },
          { label: 'Hour 19', value: 'hour19' },
          { label: 'Hour 20', value: 'hour20' },
          { label: 'Hour 21', value: 'hour21' },
          { label: 'Hour 22', value: 'hour22' },
          { label: 'Hour 23', value: 'hour23' },
        ];
        break;
      case 'EVERYWEEK':
        this.schedulers = [
          { label: 'SUNDAY', value: 'sunday' },
          { label: 'MONDAY', value: 'monday' },
          { label: 'TUESDAY', value: 'tusday' },
          { label: 'WEDNESDAY', value: 'wendnesday' },
          { label: 'THURDAY', value: 'thursday' },
          { label: 'FRIDAY', value: 'friday' },
          { label: 'SATURDAY', value: 'saturday' }
        ];
        break;
      case 'EVERYMONTHLY':
        this.schedulers = [
          { label: 'Day 1', value: 'day1' },
          { label: 'Day 5', value: 'day5' },
          { label: 'Day 10', value: 'day10' },
          { label: 'Day 15', value: 'day15' },
          { label: 'Day 20', value: 'day20' },
          { label: 'Day 25', value: 'day25' },
        ];
        break;
      default:
        break;
    }



  }

  get editing() {
    return Boolean(this.formInput.get('code').value);
  }

  private addTask() {
    //console.log('addDataService');
    this.taskService.save(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.addGrowlInsert();
        this.filterTask();
        this.hidenDialogInput();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private editTask() {
    this.taskService.edit(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.addGrowlUpdate();
        this.filterTask();
        this.hidenDialogInput();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private listBusinessUnit() {

    this.businessUnitService.listResume(false)
      .then(result => {
        this.businessUnitLst = result; //.map(bu => ({ name: bu.name, code: bu.code +'' }));
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private filterTask() {

    this.loading(true);
    this.taskService.filter(this.formFilter.value, false)
      .then(result => {
        this.tasks = result;
        this.totalRecords = this.tasks.length;
        this.applyPaginator(this.totalRecords);
      })
      .catch(erro => { this.handler.handleError(erro); })
      .finally(() => this.loading(false));
  }

  private prepareForm() {

    this.formFilter = this.formBuilder.group({
      name: [],
      status: [],
    });
    this.formPropertyInput = this.formBuilder.group({
      code: [],
      name: [],
      value: [],
      description: [],
    });
    this.formInput = this.formBuilder.group({
      code: [],
      status: [],
      name: [],
      description: [],
      frequency: [],
      scheduler: [],
      state: [],
      benRun: [],
      codeBusinessUnit: [],
      notify: [],
      taskProperties: []
    });

  }

  private resetForm() {
    //this.resetFormProperty();
    this.formInput.reset();
    this.formInput.get('status').setValue(true);
    this.formInput.get('notify').setValue(false);
  }

  private loading(bool) {
    this.loadingTable = bool;
  }

  private checkRule(task: Task, property: TaskProperty): boolean {

    if (this.editProperty)
      return false;

    let pr;
    let realName = 'TASK_' + property.name.trim();
    pr = task.taskProperties.find(x => x.name == realName && x.code != property.code);

    if (!pr)
      pr = task.taskProperties.find(x => x.name.trim() == property.name.trim());

    if (pr)
      return true;

    return false;

  }

  private cloneProperty(taskProp: TaskProperty): TaskProperty {
    let tp = new TaskProperty();
    tp.name = taskProp.name;
    tp.description = taskProp.description;
    tp.value = taskProp.value;
    return tp;
  }
}
