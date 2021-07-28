import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { JsonObject, UserAction, UserActionFilter } from 'src/app/modules/core/@model/core-model';
import { basecomponent } from '../../@base/basecomponent';
import { HandlerService } from '../../@services/handler.service';

import { UserActionService } from '../../@services/user-action.service'

@Component({
  selector: 'app-user-action',
  templateUrl: './user-action.component.html',
  styleUrls: ['./user-action.component.scss']
})
export class UserActionComponent extends basecomponent implements OnInit {

  userActionFilter: UserActionFilter = new UserActionFilter();
  userActions: UserAction[];
  jsonObject: JsonObject[];

  selectedUserAction: UserAction;

  totalRecordsUserAction: number;
  rowsPerPage: number;
  display: boolean;

  @Input() inputDescription: string;
  @Input() inputNameObject: string;
  @Input() inputIdtRecord: number;
  @Input() inputIdtObject: number;
  @Input() hashObject: string;
  @Input() inputModule: string;

  @Output() hideComponentHistory = new EventEmitter();

  constructor(private userActionService: UserActionService, public handler: HandlerService,) {
    super(handler)
  }

  ngOnInit() {
    this.rowsPerPage = 9;
    this.display = true;
  }

  ngOnDestroy() {
  }

  /**
   * Evento dispara no init da pagina e na mudanca de pagina
   * @param event 
   */
  onChangePageAction(event: LazyLoadEvent) {
    //console.log('onChangePageAction');
    const currentPage = event.first / event.rows;
    this.listUserAction(currentPage);
  }

  onRowSelect(event) {
    //console.log('onRowSelect');
    this.fillTable(event.data);

  }

  private fillTable(data: UserAction) {
    this.jsonObject = [];
    try {

      let json = JSON.parse(data.valueRecord);

      for (let prop in json) {
        if (prop === 'ID')
          continue;
        let val = json[prop];
        if (typeof val === 'object') {
          val = this.getValueProperity(val);
        }
        this.jsonObject.push({ column: prop, value: val });
      }

      this.jsonObject = this.jsonObject.sort((one, two) => (one.column.toUpperCase() < two.column.toUpperCase() ? -1 : 1));

    } catch (e) {
      //console.log('Catch:' + e);
      this.jsonObject.push({ column: 'Message', value: data.valueRecord });
    }
  }

  private listUserAction(page = 0) {
    //console.log('listUserAction');

    this.userActionFilter.nameObject = this.inputNameObject;
    this.userActionFilter.idRecord = this.inputIdtRecord;
    this.userActionFilter.idObject = this.inputIdtObject;
    this.userActionFilter.hashObject = this.hashObject;
    this.userActionFilter.page = page;
    this.userActionFilter.rowsPerPage = this.rowsPerPage;
    this.userActionFilter.orderBy = 'code';
    this.userActionFilter.desc = true;

    this.userActionService.filter(this.userActionFilter, this.inputModule)
      .then(result => {
        this.userActions = result.content;
        this.totalRecordsUserAction = result.totalElements;
        if (this.userActions.length != 0) {
          this.selectedUserAction = this.userActions[0]
          this.fillTable(this.selectedUserAction);
        }
      })
      .catch(erro => { this.handler.handleError(erro); });

  }

  onHideDialog(event: Event) {
    //console.log('onHideDialog');
    this.ngOnDestroy();
    this.hideComponentHistory.emit('');
  }

  getValueProperity(json: any) {
    if (json === null) {
      return '';
    }

    if (this.hasPropertie(json, 'code')) {
      return json['code'];
    }



    let prop = this.hasPropertieStartWith(json, 'id', 2)
    if (prop) {
      return json[prop];
    }

    prop = this.hasPropertieStartWith(json, 'nom', 3)
    if (prop) {
      return json[prop];
    }

    return this.getValueList(json);

  }

  hasPropertie(json: any, column: string): boolean {
    for (let prop in json) {
      if (prop === column) {
        if (json[prop] !== null) {
          return true;
        }
      }
    }
    return false;
  }

  hasPropertieStartWith(json: any, column: string, len: number): string {
    for (let prop in json) {
      if (prop.length >= len) {
        if (prop.substring(0, len) === column) {
          return prop;
        }
      }
    }
    return null;
  }

  getValueList(json: any): string {
    let value = [];
    value = json;
    let code = '';
    if (Array.isArray(value))
      value.forEach(element => {
        if (this.hasPropertie(element, 'code')) {
          code = code + ' ' + element['code'];
        }
        if (this.hasPropertie(element, 'idCategoria')) {
          code = code + ' ' + element['idCategoria'];
        }
      });
    return code;
  }
}
