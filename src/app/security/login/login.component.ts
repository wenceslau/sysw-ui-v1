import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { basecomponent } from 'src/app/@suite/@base/basecomponent';
import { HandlerService } from 'src/app/@suite/@services/handler.service';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { InfoService } from 'src/app/@suite/@services/info.service';
import { FunctionService } from 'src/app/@suite/@services/function.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends basecomponent implements OnInit {

  blockedPanel: boolean = false;

  msgsAuth: Message[] = [];
  msgsReset: Message[] = [];

  displayLicense: boolean;
  displayResetByEmail: boolean;
  licenseSuccess: boolean;

  username: any;

  unName: string;
  appNames: string;
  msgReset: string;
  msgsLicense: string;

  constructor(
    private functionService: FunctionService,
    private infoService: InfoService,
    private router: Router,
    public handler: HandlerService) {
    super(handler)
    this.handler.share.urlDomain = document.location.hostname;
  }

  ngOnInit(): void {
    this.handler.share.auth.clearToken();
    this.handler.share.infoUser = undefined
  }

  showResetByEmail() {
    this.displayResetByEmail = true;
    this.msgReset = '';
  }

  onChangeSector(event) {
    this.nameUNAndApp();
  }

  set(value1: string, value2: string) {

    if (this.isUndefinedOrEmpty(value1))
      return;

    if (this.isUndefinedOrEmpty(value2))
      return;

    // if (this.isUndefined(this.handler.share.sector))
    //   return;

    console.log('login: ' + value1 + ', xxxx, ' + this.handler.share.sector)

    this.msgsAuth = [];    
    this.reset();
    //this.handler.block();
    this.blockedPanel = true;

    value2 = this.handler.share.auth.rsa.encrypt(value2);
    let sectorCode = '0';// this.handler.share.sector.code + '';
    let language = this.handler.share.language;

    let subscriber: Subscriber<number>;
    let observable = new Observable(obs => {
      //this.handler.block();
      subscriber = obs;
      this.functionService.login(value1, value2, sectorCode, language, subscriber, false);
    });

    observable.subscribe({
      next: (value) => {
        console.log('value: ' + value)
        if (value == 'changerouter') {
          subscriber.complete();
          this.handler.share.saveValue = true;
          this.handler.share.value = value2
          this.router.navigate(['/home']);
        }
      },
      complete: () => {
        // this.handler.unblock();
        this.blockedPanel = false;
        this.handler.share.sector = this.handler.share.sectors.find(x => x.code === this.handler.share.sectorCode);
      },
      error: (err) => {
        // this.handler.unblock();
        this.blockedPanel = false;
        console.error(err)
     ;


        if (err.error && err.error.error_description === 'locked') {          
          this.handler.messageLogin = [{ severity: 'warn', summary: '', detail: this.label('lbl_usuario_bloqueado') }];

        } else if (err.error && err.error.error_description === 'breached') {
          this.handler.messageLogin = [{ severity: 'warn', summary: '', detail: this.label('lbl_este usuario_foi_violado') }]; //This user has been breached

        } else if (err.status === 400 && err.error.error === 'invalid_grant') {
          this.handler.messageLogin = [{ severity: 'error', summary: '', detail: this.label('lbl_usuario_ou_senha_i') }];

        } else if (err.status === 401 && err.error.error === 'unauthorized') {
          if (err.error && err.error.error_description == 'licenca_expirada') {
            this.msgsLicense = '';
            this.licenseSuccess = false;
            this.displayLicense = true;

          } else {
            this.handler.messageLogin = [{ severity: 'error', summary: '', detail: this.label('lbl_usuario_ou_senha_i') }];
          }

        }
        else {
          this.handler.messageLogin = [{ severity: 'error', summary: '', detail: 'Unreachable server' }];

        }
      }
    });

  }

  setD(lang: string) {
    console.log('login-getLanguage')
    localStorage.removeItem('language');
    localStorage.setItem('language', lang);

    this.handler.share.laguages = [];
    this.functionService.loadLanguage(lang);
  }

  setC() {

    if (this.isUndefinedOrEmpty(this.username))
      return;

    this.handler.messageLogin = [];
    this.handler.share.auth.clearToken();
    this.handler.share.sectors = null;
    this.handler.share.sector = null;
    this.appNames = '';
    this.unName = '';

    let subscriber: Subscriber<string>;
    let observable = new Observable(obs => {
      //this.handler.block();
      subscriber = obs;
      this.functionService.loadUserSectors(this.username, subscriber, false);
    });

    observable.subscribe({
      complete: () => {
        this.handler.unblock();
        this.handler.share.sector = this.handler.share.sectors[0];
        this.nameUNAndApp();

      },
      error: (err) => {
        this.handler.unblock();
        if (err.status === 412) {
          this.handler.messageLogin = [{ severity: 'warn', summary: '', detail: err.error.message }];
        } else {
          this.handler.handleError(err);
        }
      }
    });

  }

  setB(email: string) {
    this.msgsReset = [];

    if (!email || email.length < 4)
      return;

    this.infoService.infoStart3(email)
      .then(() => {
        this.msgsReset = [{ severity: 'info', summary: '', detail: this.label('lbl_sua_senha_foi_e_p_o_e') + " " + email }];
      })
      .catch(error => {
        this.handler.unblock();
        this.msgsReset = [{ severity: 'error', summary: '', detail: error.error.message }];
      });
  }

  setA(user: string, sysmonkey: string) {
    this.msgsLicense = '';
    this.infoService.infoStart4(this.handler.share.sector.code, user, sysmonkey)
      .then(() => {
        this.licenseSuccess = true;
        this.msgsLicense = this.label('lbl_licenca_aplicada_com_s');
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

  private nameUNAndApp() {
    this.appNames = '';
    this.unName = '';
    if (this.handler.share.sector) {
      this.unName = this.label('lbl_unidade_de_negocio', 'Business Unit') + ': ' + this.handler.share.sector.bussinesName;
      this.appNames = this.handler.share.sector.appsName
    }
  }

}
