import { Component, OnInit } from '@angular/core';
import { PermissionService } from 'src/app/modules/core/@service/permission.service';
import { basecomponent } from '../../@base/basecomponent';
import { FunctionService } from '../../@services/function.service';
import { HandlerService } from '../../@services/handler.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent extends basecomponent implements OnInit {

  test: string;

  constructor(
    private functionService: FunctionService,
    public handler: HandlerService
  ) {
    super(handler)
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    console.log(this.handler.router.url);

    this.functionService.loadMenus(undefined, true)
  }

  classIconFavorito(icon) {
    return icon + ' c-color-yellow'
  }

}
