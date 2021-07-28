import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeNGConfig, SelectItem } from 'primeng/api';
import { basecomponent } from '../../@base/basecomponent';

import { HandlerService } from '../../@services/handler.service';

import { ProductService } from './productservice';
import { FunctionService } from '../../@services/function.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home-menu-cards',
  templateUrl: './home-menu-cards.component.html',
  styleUrls: ['./home-menu-cards.component.scss']
})
export class HomeMenuCardsComponent extends basecomponent implements OnInit {

  menus: any[];

  products: MenuItem[];                //Menu itens for home and favorite vertical menu

  sortOptions: SelectItem[];

  sortOrder: number;


  sortField: string;

  iconFilterCards: string;

  selectedObjeto: any;
  selectedMenu: MenuItem;



  constructor(
    private functionService: FunctionService,
    public handler: HandlerService) {
    super(handler)
  }

  ngOnInit() {
    //this.productService.getProducts().then(data => this.products = data);
    //this.primengConfig.ripple = true;
    this.iconFilterCards = 'fal fa-star fa-2x c-color-transparent';

  }

  ngAfterViewInit() {
    this.loadMenus();
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  blockedDvCards: boolean = false;

  loadMenus() {

  }

  unlock() {
    setTimeout(() => {
      this.blockedDvCards = false;
    }, 0);
  }

  filterFavorite() {
    if (this.iconFilterCards === 'fas fa-star fa-2x c-color-yellow')
      this.iconFilterCards = 'fas fa-star fa-2x c-color-lightgray'
    else if (this.iconFilterCards === 'fas fa-star fa-2x c-color-lightgray')
      this.iconFilterCards = 'fal fa-star fa-2x c-color-transparent'
    else if (this.iconFilterCards === 'fal fa-star fa-2x c-color-transparent')
      this.iconFilterCards = 'fas fa-star fa-2x c-color-yellow'

    this.applyFilterFavorite();
  }

  private applyFilterFavorite() {
    if (this.iconFilterCards === 'fas fa-star fa-2x c-color-yellow') {
      this.products = this.menus.filter(x => x.object.favorite === true);
    } else if (this.iconFilterCards === 'fas fa-star fa-2x c-color-lightgray') {
      this.products = this.menus.filter(x => x.object.favorite === false);
    } else {
      this.products = this.menus;
    }
  }

  classIconObject(object: any) {
    return object.icon + ' fa-5x c-primary-color'
  }

  classIconFavorite(object: any) {

    if (object.favorite)
      return 'fas fa-star fa-2x c-color-yellow';
    else
      return 'fas fa-star fa-2x c-color-lightgray';
  }

  showHome(source): boolean {
    if (environment.home === source)
      return true;
    return false;
  }

  changeFavorite(object: any) {

  }

  windowInnerHeightSroll() {
    return (window.innerHeight - 293) + 'px';
  }

  windowInnerHeightSrollCropLife() {
    return (window.innerHeight - 450) + 'px';
  }

  windowInnerHeightScrolDetail() {
    return (window.innerHeight - 393) + 'px';
  }

  windowInnerHeight() {
    return (window.innerHeight - 298) + 'px';
  }

  
  windowInnerHeightCropLife() {
    return (window.innerHeight - 450) + 'px';
  }


  objetoInfo: any;
  blockedPanel: boolean = false;

  click1(menu) {

  }

  click2(menu) {
    console.log('2');
    this.selectedObjeto = menu.object;
    this.selectedMenu = menu;
    this.handler.share.navigation = menu.title;
    this.handler.share.navigationIcon = menu.icon;
    this.handler.router.navigate([menu.routerLink]);
  }

  objetoValue() {
    this.handler.router.navigate([this.selectedMenu.routerLink]);
  }

  importValue() {
    this.handler.share.openImportValue = true;
    this.handler.router.navigate([this.selectedMenu.routerLink]);
  }

  editObjeto() {
    this.handler.router.navigate(['/objeto', { id: this.selectedObjeto.code }]);
  }

  newObjeto() {
    this.handler.router.navigate(['/objeto', { id: -1 }]);
  }

  attribute() {
    this.handler.share.SysMonkeycodeSelectedObjetoPages = this.selectedObjeto.code;
    this.handler.router.navigate(['/attribute']);
  }

  displayRelationship: boolean;
  showComponentObjetoRelated() {
    this.displayRelationship = true;
  }

  hideComponentObjetoRelated(event: Event) {
    this.displayRelationship = false;
  }

  displaySqlViewer: boolean;
  showComponentSqlViewer() {
    this.displaySqlViewer = true;
  }

  hideComponentSqlViewer(event: Event) {
    this.displaySqlViewer = false;
  }

  showComponentHistory() {
    this.descriptionObject = this.selectedObjeto.description;
    this.nameObject = 'Objeto';
    this.idRecord = this.selectedObjeto.code;
    this.hashObject = null
    this.displayHistory = true;
  }

  hideComponentHistoryEvent(event: Event) {
    this.displayHistory = false;
  }

  codObjSelc: string;

  colorCard(menu) {
    if (this.selectedObjeto && this.selectedObjeto.name === menu.title)
      return '#EFF3F8';
    else
      return 'transparent'
  }
}
