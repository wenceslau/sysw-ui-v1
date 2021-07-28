import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

import { HandlerService } from './handler.service';
import { ShareService } from './share.service';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private share: ShareService,
    private hander: HandlerService) { }

  websocket: any;
  messageReceived: string;
  serverUrl = environment.apuUrl;
  enable: boolean = true;

  connect(code: number, userName: string) {

    console.log('connecting...')
    this.disconnect();

    if (this.enable === false)
      return;

    let socket = new SockJS(this.serverUrl + '/socket'); //Para protocol http https
    this.websocket = Stomp.over(socket);

    //Referencia a classe a uma variavel para usar dentro das funcoes
    let that = this;

    this.websocket.connect({},
      //Conexao sucesso. Assina o canal para receber msg
      function (frame) {
        that.websocket.subscribe("/chat/" + code, function (message) {
          that.receiveMessage(message.body);
        });
        that.websocket.subscribe("/chat/" + userName, function (message) {
          that.receiveMessage(message.body);
        });
        that.websocket.subscribe("/logged/" + userName + '-' + code, function (message) {
          that.receiveMessage(message.body);
        });
      },
      //Conexao falhou ou interrompida
      function (error) {
        console.warn(error)
      });


    setTimeout(() => {
      this.sendMessage('Acabei de logar....');
    }, 2000);
  }

  disconnect() {
    if (this.websocket != null) {
      this.websocket.disconnect();
    }
  }

  sendMessage(message: string) {
    this.websocket.send("/app/send/message", {}, message);
  }

  receiveMessage(notify: string) {
    this.hander.notify = JSON.parse(notify);

    if (this.hander.notify.type === 'DEFAULT' && this.hander.notify.userCode === this.share.codeUserLogged)
      return;

    //Nao eh o SA, verifica se a notify eh do setor do user logado
    if (!this.share.isSa)
      if (this.hander.notify.sectorCode != this.share.sectorCode)
        return;

    //Verifica se pode receber notify
    if (!this.share.receiveNotify)
      return;

    //Se estiver marcado para silenciar nao notifica
    if (this.share.silenceNotify)
      return;

    let color = "#FFD740";
    if (this.hander.notify.type === 'INFO') {
      color = "#2AAAFF"
    } else if (this.hander.notify.type === 'ERROR') {
      color = "#FD2828"
    } else if (this.hander.notify.type === 'WARN') {
      color = "#FDA828"
    }

    this.hander.notifyStyle = "{''height'':''40px'',''margin-left'':''300px'',''margin-bottom'':''30px'',''padding-right'':''300px'',''background-color'': '''" + color + "''}";
    this.share.numNotify = this.share.numNotify + 1;

    this.hander.notifyShow = true;
    setTimeout(() => {
      this.hander.notifyShow = false;
    }, 10000);

  }
}
