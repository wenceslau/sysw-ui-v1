import { Component, OnInit, Input } from '@angular/core';
import { InfoModel } from 'src/app/modules/core/@model/core-model';
import { base } from '../../@base/base';
import { HandlerService } from '../../@services/handler.service';
import { InfoService } from '../../@services/info.service';

@Component({
  selector: 'app-info-model',
  templateUrl: './info-model.component.html',
  styleUrls: ['./info-model.component.scss']
})
export class InfoModelComponent extends base implements OnInit {

  @Input() inputEntity: string;
  @Input() inputModule: string;
  @Input() inputTotalRecords: number;

  infoModel: InfoModel;

  constructor(private infoService: InfoService, public handler: HandlerService) {
    super(handler)
  }

  ngOnInit() {
    this.getInfoModel(this.inputEntity, this.handler.router.url.replace('/', ''));
  }

  classIcon5X(icon: string) {
    return icon + ' fa-5x c-primary-color';
  }

  private getInfoModel(entity: string, router: string) {
    this.loadingInfo = false;
    this.infoService.infoModel(entity, router, this.inputModule, false)
      .then(result => {
        this.infoModel = result;
        if (this.infoModel.numRecords)
          this.inputTotalRecords = this.infoModel.numRecords;
      })
      .catch(erro => {
        console.error(erro);
      })
      .finally(() =>
        this.loadingInfo = false
      );
  }
}
