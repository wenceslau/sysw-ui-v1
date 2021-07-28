import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscriber } from 'rxjs';

import { basecomponent } from '../../../../@suite/@base/basecomponent';
import { HandlerService } from '../../../../@suite/@services/handler.service';

import { BusinessUnitModel, User, UserGroup } from '../../@model/core-model';
import { BusinessUnitService } from '../../@service/business-unit.service';
import { UserGroupService } from '../../@service/user-group.service'
import { UserService } from '../../@service/user.service';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.scss']
})
export class UserGroupComponent extends basecomponent implements OnInit {


  formInput: FormGroup;
  formFilter: FormGroup;
  userGroups: UserGroup[];
  resumeUsers: User[];
  resumeUsersTarger: User[] = [];
  resumeBusinessUnities: BusinessUnitModel[]
  selectedUsers: User[];
  numSource: number;         // Numero de registro da lista de origem 
  numTarget: number;         // Numero de registro da lista da destino

  constructor(
    private formBuilder: FormBuilder,
    private businessUnitService: BusinessUnitService,
    private userService: UserService,
    private userGroupService: UserGroupService,
    public handler: HandlerService,
  ) {
    super(handler)
  }

  ngOnInit(): void {
    this.prepareForm();
    this.initListAll();
  }

  initListAll() {
    this.applyPaginator(this.totalRecords);
    this.filterUserGroup(this.formFilter.value);
    this.listBusinessUnit();
  }

  filter() {
    this.filterUserGroup(this.formFilter.value);
  }

  clearFilter() {
    this.formFilter.reset();
    this.filter();
  }

  subscriber: Subscriber<number>;

  showDialogInput(code: number) {
    this.resetForm();
    this.saved = false;
    this.resumeUsersTarger = [];
    this.resumeUsers = [];

    let observable = new Observable(obs => {
      this.subscriber = obs;
      this.handler.block();
      console.log('Exe List user');
      this.listUser();
    });
    observable.subscribe({
      next: (value) => {
        console.log('Call receive. Number' + value);
        if (value == 1) {
          if (code) {
            this.findByCode(code);
          } else {
            this.subscriber.complete();
          }
        } else if (value == 2) {
          this.prepareListSourceUser();
        }
      },
      complete: () => {
        this.displayInput = true;
        this.numSource = this.resumeUsers.length;
        this.numTarget = 0;
        let listUserGroup = this.formInput.get('users').value;
        if (listUserGroup)
          this.numTarget = listUserGroup.length;
        this.handler.unblock();
      },
      error: (err) => {
        this.handler.handleError(err);
      }

    });
  }

  saveUserGroup() {
    ;
    this.formInput.get('users').setValue(this.resumeUsersTarger);
    if (this.editing)
      this.edit();
    else
      this.add();


    this.saved = true;
  }

  setUsers(users: User[]) {
    this.selectedUsers = users;
  }

  disableSaveGroup() {

    if (this.numTarget == 0)
      return true;

    if (!this.formInput.value.name) {
      return true;
    }

    if (!this.formInput.value.description) {
      return true;
    }
    return false;
  }

  //Evento pickList
  onMoveTo() {
    this.numSource = this.resumeUsers.length;
    this.numTarget = this.resumeUsersTarger.length;
  }

  //Evento pickList
  onSourceFilter(event) {
    this.numSource = event.value.length;
  }

  //Evento pickList
  onTargetFilter(event) {
    this.numTarget = event.value.length;
  }

  get editing() {
    console.log(this.formInput.get('code').value);
    console.log(JSON.stringify(this.formInput.value));
    return Boolean(this.formInput.get('code').value);
  }

  private prepareListSourceUser() {
    for (let index = 0; index < this.resumeUsersTarger.length; index++)
      this.resumeUsers = this.resumeUsers.filter(x => x.code !== this.resumeUsersTarger[index].code);

    //this.resumeUsers = this.resumeUsers.sort((one, two) => (one.username.toLowerCase() < two.username.toLowerCase() ? -1 : 1))

    this.subscriber.complete();
  }

  private findByCode(code) {
    this.userGroupService.findByCode(code, false)
      .then(result => {
        this.selectedRowMainTable = result;
        this.resumeUsersTarger = result.users;
        //this.resumeUsersTarger = this.resumeUsersTarger.sort((one, two) => (one.username.toLowerCase() < two.username.toLowerCase() ? -1 : 1))
        this.formInput.patchValue(result);
        console.log('Calling next, number 2');
        this.subscriber.next(2);
      })
      .catch(err => {
        this.subscriber.error(err);
      });
  }

  private filterUserGroup(filter: any) {
    this.userGroupService.filter(filter)
      .then(result => {
        this.userGroups = result;
        this.totalRecords = this.userGroups.length;
        this.applyPaginator(this.totalRecords);
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listUser() {
    this.userService.listResume(false)
      .then(result => {
        this.resumeUsers = result;
        this.resumeUsers = this.resumeUsers.filter(x => x.username !== this.handler.share.userNameLogged);
        console.log('Calling next, number 1');
        this.subscriber.next(1);
      })
      .catch(err => {
        this.subscriber.error(err);
      });
  }

  private listBusinessUnit() {
    this.businessUnitService.listResume()
      .then(result => {
        this.resumeBusinessUnities = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private add() {
    this.userGroupService.save(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.filterUserGroup(this.formFilter.value);
        this.hidenDialogInput();
        if (result.message)
          this.handler.showToastWarn(result.message)
        else
          this.addGrowlInsert();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private edit() {
    this.userGroupService.edit(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.filterUserGroup(this.formFilter.value);
        this.hidenDialogInput();
        if (result.message)
          this.handler.showToastWarn(result.message)
        else
          this.addGrowlUpdate();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private prepareForm() {
    this.formFilter = this.formBuilder.group({
      code: [],
      status: [],
      orderBy: [],
      name: [],
      username: []
    });
    this.formInput = this.formBuilder.group({
      code: [],
      status: [],
      name: [],
      description: [],
      businessUnit: [],
      users: []
    });
  }

  private resetForm() {
    this.formInput.reset();
    this.formInput.get('code').setValue(undefined);
    this.formInput.get('status').setValue(true);
  }
}
