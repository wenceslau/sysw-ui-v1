import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { base } from '../../@base/base';
import { basecomponent } from '../../@base/basecomponent';
import { FunctionService } from '../../@services/function.service';
import { HandlerService } from '../../@services/handler.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent extends base implements OnInit {

  @Input() title: string;
  @Input() displayIconFilter: boolean;
  @Input() totalRecords: string;
  @Input() value: string;
  @Input() selectValueText: string;
  @Input() listValues: any[];

  @Output() selectedValue = new EventEmitter();

  constructor(
    public handler: HandlerService) {
    super(handler)
  }

  ngOnInit(): void {
    console.log('ngOnInit')
    this.title = '';
    this.handler.messageInline = [];
  }

  onChangeSelectedValue(selected) {
    this.selectedValue.emit(selected.value)
  }

  get message(): string {
    if (this.totalRecords !== undefined)
      if (this.value)
        return this.totalRecords + ' ' + this.label('lbl_registro_s') + ' ' + this.value + ' ';
      else
        return this.totalRecords + ' ' + this.label('lbl_registro_s') + ' ';
    else
      return '';
  }

  get appName(): string {
    if (this.handler.share.sector)
      return this.label('lbl_aplicacao') + ': ' + this.handler.share.sector.appsName
    return '';
  }


}
