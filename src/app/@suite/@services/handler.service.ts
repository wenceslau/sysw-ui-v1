import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { PermissionService } from 'src/app/modules/core/@service/permission.service';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root'
})
export class HandlerService {

  messageBotton: Message[] = [];
  messageInline: Message[] = [];
  messageLogin: Message[] = [];

  //messageInlineDialog: Message[] = [];

  // Propriedade alert 
  title: string;
  message: string;
  stack: string[];
  stacks = [];
  showError: boolean;
  showWarn: boolean;
  showInfo: boolean;

  //TODO verificar e migrar para o share
  notify: any;
  notifyShow: boolean;
  notifyStyle: string;

  //Usada em qq momento de uso da variaval
  infoMessage = '';

  //spiiner que mostra que existe uma chamada na api em curso
  showSpinner: boolean = false;

  // Usada pada bloquear o DOM html em situacao de espera
  blockedDocument: Boolean = false;

  //Mensagem que eh exibida duramdo o bloqueio do DOM html
  messageWait: string = '';

  type: string;

  constructor(
    public messageService: MessageService,
    public confirmService: ConfirmationService,
    public share: ShareService,
    public router: Router
  ) { }

  handleError(anyError: any, showInDialog = false) {

    this.type = 'error';
    let value = '';
    let stacks = [];
    if (anyError instanceof HttpErrorResponse) {

      if (anyError.status !== 0) {

        // Erro http 412, a exececao warning 
        if (anyError.status === 412) {
          this.type = 'warn';
        }

        if (anyError.status === 417) {
          this.type = 'frindly';
        }

        if (anyError.status === 400) {
          this.type = 'error';
          value = 'O servidor de aplicação não está acessível';
        }

        value = this.errorHttp(anyError, value, stacks);

      } else {
        this.type = 'warnDetail';
        value = 'O servidor de aplicação não está acessível';
        stacks.push(anyError.message);
      }

    } else if (typeof anyError === 'string') {
      value = anyError;

    } else {
      stacks.push(anyError);
      value = "Ocorreu um erro nao identificado. Verifique a console do navegador para mais detalhes. " + anyError;

    }

    this.finally(value, stacks, showInDialog);
  }

  extractMsgError(err: any): string {
    let msg = 'unknown';
    if (err && err.error) {
      msg = '';
      if (err.error.message)
        msg += err.error.message + ' ';

      if (err.error.error)
        msg += err.error.error + ' ';

      if (err.error.error_description)
        msg += err.error.error_description + ' ';

    }
    return msg;
  }

  block(block = true) {
    setTimeout(() => {
      this.messageWait = '';
      this.showSpinner = true;
      if (block)
        this.blockedDocument = true;
    }, 1);
  }

  unblock(unblock = true) {

    setTimeout(() => {
      this.showSpinner = false;
      if (unblock)
        this.blockedDocument = false;
      this.messageWait = '';
    }, 1);

  }

  clearAllMessages() {
    this.messageInline = [];
    this.messageService.clear();
  }

  showDialogError(message: string, stacks: string[]) {
    this.showToastError(message);
    //this.title = 'ERROR';
    // this.message = message;
    // this.stack = stacks;
    // setTimeout(() => {
    //   this.showError = true;
    // }, 50);
  }

  showDialogWarn(message: string, stacks: string[]) {
    this.showToastWarn(message);
    // this.title = 'WARN';
    // this.message = message;
    // this.stack = stacks;
    // setTimeout(() => {
    //   this.showWarn = true;
    // }, 50);

  }

  showDialogInfo(message: string) {
    this.showToastInfo(message);
    // this.title = 'INFO';
    // this.message = message;
    // this.stack = [];
    // setTimeout(() => {
    //   this.showInfo = true;
    // }, 50);
  }

  showToastInfo(message: string, summary = this.share.getLabel('lbl_lbl_aviso'), life = 15000) {
    this.showToast('custom', message, summary, life);
  }

  showToastWarn(message: string, summary = this.share.getLabel('lbl_lbl_atencao'), life = 15000) {
    this.showToast('warn', message, summary, life);
  }

  showToastError(message: string, summary = this.share.getLabel('lbl_lbl_falha'), life = 15000) {
    this.showToast('error', message, summary, life);
  }

  showToastSuccess(message: string, summary = this.share.getLabel('lbl_lbl_sucesso'), life = 15000) {
    this.showToast('success', message, summary, life);
  }

  private showToast(type: string, message: string, sumary: string = '', life) {

    // this.clearAllMessages();

    //if (showInDialog)
    //this.messageInlineDialog = [{ severity: type, summary: sumary, detail: message }];
    //else{
    //this.messageService.add({ severity: type, summary: sumary, detail: message })
    let key = new Date().getTime() + "";
    this.messageInline = [{ key: key, severity: type, summary: sumary, detail: message }];
    setTimeout(() => {
      if (this.messageInline.find(x => x.key === key))
        this.messageInline = []
    }, life);
    //}
    //this.autoClose(autoClose);
  }

  private errorHttp(anyError: any, value: string, stacks: string[]) {

    value = 'Error HTTP ' + anyError.status;

    try {
      stacks.push('url: ' + anyError.url)

      // tem o campo stack, erro personalizado
      if (anyError.error && anyError.error.stacks) {
        value = this.personalError(anyError, value, stacks);

      } else { // Erro convencional
        value = this.conventionalError(anyError, value, stacks);
      }
    } catch (e) {
      value = anyError.toString();
    }

    return value;
  }

  private conventionalError(anyError: any, value: string, stacks: string[]) {
    stacks.push('status: ' + anyError.status);

    value = this.extractMsgError(anyError);

    if (value.indexOf('invalid_token') !== -1) {
      this.share.refresToken();
      value = this.share.getLabel('lbl_voce_nao_esta_l_o_s_s_e_r_n_l', 'You’re either not logged in or your session has expired. Try logging in again.') //'Você não esta logado ou sua sessão expirou. Realize novo login';
      console.log(value);
      // this.router.navigate(['/login']);
      return null;
    }

    return value;
  }

  private personalError(anyError: any, value: string, stacks: string[]) {
    value = this.extractMsgError(anyError);
    value += ' ' + anyError.error.field;
    anyError.error.stacks.forEach(element => {
      stacks.push(element)
    });
    return value;
  }

  private finally(value: string, stack: string[], showInDialog: boolean) {
    console.error(this.type.toUpperCase() + '- ' + value + ' - ' + stack);

    this.unblock();
    if (value === null)
      return;

    let msg = value.toLocaleLowerCase().trim();
    let ms1 = 'access is denied';
    let ms2 = 'acesso negado';
    if (msg === ms1 || msg === ms2)
      return;
    
    if (this.type === "warn") {
      this.showToastWarn(value);
    } else if (this.type === "frindly") {
      this.showToastWarn(value);
    } else if (this.type === "warnDetail") {
      this.showDialogWarn(value, stack);
    } else {
      this.showToastError(value);
    }
  }
}
