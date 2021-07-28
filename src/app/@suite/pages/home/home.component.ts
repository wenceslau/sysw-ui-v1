import { Component, OnInit } from '@angular/core';
import { basecomponent } from '../../@base/basecomponent';
import { HandlerService } from '../../@services/handler.service';
import { InfoService } from '../../@services/info.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends basecomponent implements OnInit {

  constructor(
    public handler: HandlerService
  ) {
    super(handler);
  }

  ngOnInit(): void {
    this.handler.share.navigationIcon = 'fad fa-home-lg';
    this.handler.share.navigation = this.label('lbl_pagina_inicial');
  }
  
  get showHomeAAA(): boolean {

    if (this.isDefaultSector)
      return false;

    if (this.handler.share.sector && this.handler.share.sector.appsName !== '')
      return false;

    return true;
  }

}
