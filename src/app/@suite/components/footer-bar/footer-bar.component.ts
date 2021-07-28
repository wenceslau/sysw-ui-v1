import { Component, OnInit } from '@angular/core';
import { basecomponent } from '../../@base/basecomponent';
import { HandlerService } from '../../@services/handler.service';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent extends basecomponent implements OnInit {

  version: string;

  constructor(
    public handler: HandlerService,
  ) {
    super(handler)
  }
  ngOnInit() {
    this.version = environment.version;

  }
}

