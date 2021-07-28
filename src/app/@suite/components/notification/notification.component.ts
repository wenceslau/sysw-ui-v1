import { Component, Input, OnInit } from '@angular/core';
import { Notify } from 'src/app/modules/core/@model/core-model';
import { base } from '../../@base/base';
import { HandlerService } from '../../@services/handler.service';
import { NotificationService } from '../../@services/notification.service';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent extends base implements OnInit {

  constructor(private notificationService: NotificationService, public handler: HandlerService) {
    super(handler)
  }

  notifications: Notify[];

  @Input() scrollHeight: string;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.listNotify();
  }
  private listNotify() {

    this.notificationService.listNotify(false)
      .then(result => {
        this.notifications = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

}
