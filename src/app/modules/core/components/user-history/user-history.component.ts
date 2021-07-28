import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { base } from 'src/app/@suite/@base/base';
import { HandlerService } from 'src/app/@suite/@services/handler.service';
import { UserActionService } from 'src/app/@suite/@services/user-action.service';
import { UserAction, UserActionFilter, UserLogonHistory, UserLogonHistoryFilter } from '../../@model/core-model';
import { UserLogonHistoryService } from '../../@service/user-logon-history.service';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss']
})
export class UserHistoryComponent extends base implements OnInit {

  userActionFilter: UserActionFilter = new UserActionFilter();
  userLogonHistoryFilter: UserLogonHistoryFilter = new UserLogonHistoryFilter();
  
  userActions: UserAction[];
  userLogonHistories: UserLogonHistory[];
  display: boolean;

  @Input() inputUserCode: number;
  @Input() inputUsername: string;
  @Output() hideComponentUserHistory = new EventEmitter();

  constructor(private userActionService: UserActionService, 
    private userLogonHistoryService: UserLogonHistoryService,
    public handler: HandlerService) {
    super(handler)
  }

  ngOnInit() {
    this.display = true;
    this.listUserLogonHistory();
    this.listUserAction();
  }

  ngOnDestroy() {
  }

  onHideDialog(event: Event) {
    //console.log('onHideDialog');
    this.ngOnDestroy();
    this.hideComponentUserHistory.emit('');
  }

  private listUserAction() {
    //console.log('listUserAction');

    this.userActionFilter.codUserRecord = this.inputUserCode;
    this.userActionFilter.orderBy = 'dateRecord';
    this.userActionFilter.desc = true;
    this.userActionFilter.page = 0;
    this.userActionFilter.rowsPerPage = 100;
    this.userActionFilter.resume = true;

    this.userActionService.filter(this.userActionFilter, 'CORE')
      .then(result => {
        this.userActions = result.content;
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private listUserLogonHistory() {
    this.userLogonHistoryFilter.userLogon = this.inputUsername;
    this.userLogonHistoryFilter.orderBy = 'code';
    this.userLogonHistoryFilter.desc = true;
    this.userLogonHistoryFilter.page = 0;
    this.userLogonHistoryFilter.rowsPerPage = 100;

    this.userLogonHistoryService.filter(this.userLogonHistoryFilter)
      .then(result => {
        this.userLogonHistories = result.content;
      })
      .catch(erro => { this.handler.handleError(erro); });

  }

}
