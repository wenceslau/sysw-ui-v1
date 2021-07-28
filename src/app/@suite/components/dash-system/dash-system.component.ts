import { Component, OnInit } from '@angular/core';
import { basecomponent } from '../../@base/basecomponent';
import { HandlerService } from '../../@services/handler.service';
import { InfoService } from '../../@services/info.service';

@Component({
  selector: 'app-dash-system',
  templateUrl: './dash-system.component.html',
  styleUrls: ['./dash-system.component.scss']
})
export class DashSystemComponent extends basecomponent implements OnInit {

  newSysMonkey: string = '';
  msgsLicense: string;
  licenseSuccess: boolean;
  displayLincese: boolean;

  constructor(
    private infoService: InfoService,
    public handler: HandlerService,
  ) {
    super(handler);
  }

  ngOnInit(): void {
    this.handler.share.navigationIcon = 'fad fa-home-lg';
    this.handler.share.navigation = this.label('lbl_pagina_inicial');
    this.getUserInfo();
    this.getSystemInfo();
    this.getEnviormentInfo();
  }

  sendSysMonkey() {
    this.msgsLicense = '';
    this.infoService.infoStart4(this.handler.share.sectorCode, this.handler.share.userNameLogged, this.newSysMonkey)
      .then(() => {
        this.licenseSuccess = true;
        this.msgsLicense = this.label('lbl_licenca_aplicada_com_s');
        this.getEnviormentInfo();
      })
      .catch(error => {
        if (error.status === 412) {
          console.log(error.error.message);
          this.handler.unblock();
          this.licenseSuccess = false;
          this.msgsLicense = error.error.message;
        } else {
          this.handler.handleError(error);
        }
      });
  }

  onHideDialog(event) {
    this.getEnviormentInfo();
  }

  private getUserInfo() {
    this.infoService.userInfo(this.handler.share.codeUserLogged, false)
      .then(result => {
        this.handler.share.infoUser = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });

  }

  private getEnviormentInfo() {
    this.infoService.infoEnviorment(this.handler.share.codeUserLogged, false)
      .then(result => {
        this.handler.share.infoEnviorment = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private getSystemInfo() {
    this.infoService.infoSystem(this.handler.share.codeUserLogged, true)
      .then(result => {
        this.handler.share.infoSystem = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }
}
