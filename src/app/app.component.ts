import { Component } from '@angular/core';
import { HandlerService } from './@suite/@services/handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cd-suite-ui';

  constructor(
    public handler: HandlerService,
  ) {
  }


  label(key: string): string {
    return this.handler.share.getLabel(key);
  }

}
