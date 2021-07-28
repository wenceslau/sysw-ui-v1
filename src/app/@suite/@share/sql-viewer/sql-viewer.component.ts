import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { base } from '../../@base/base';
import { HandlerService } from '../../@services/handler.service';

@Component({
  selector: 'app-sql-viewer',
  templateUrl: './sql-viewer.component.html',
  styleUrls: ['./sql-viewer.component.scss']
})
export class SqlViewerComponent extends base implements OnInit {

  options: any = { maxLines: 1000, printMargin: false };
  displaySqlViewer: boolean;
  query: string;

  @Output() hideComponentSqlViewer = new EventEmitter();
  @Input() nameObject: string;
  @Input() codeObject: number;

  constructor(
    public handler: HandlerService,
  ) {
    super(handler);
  }

  ngOnInit(): void {
    this.showQueryTable();
  }

  onHideDialog(event: Event) {
    this.hideComponentSqlViewer.emit('');
  }

  /**
   * Exibe a tela query da consulta SQL
   * @param code 
   * @param name 
   */
  private showQueryTable() {

  }

}
