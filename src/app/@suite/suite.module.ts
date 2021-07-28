import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import {ConfirmationService} from 'primeng/api';

import { HandlerService } from './@services/handler.service';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { HomeComponent } from './pages/home/home.component';
import { EmptyComponent } from './pages/empty/empty.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';
import { AccordionModule } from 'primeng/accordion';
import { MultiSelectModule } from 'primeng/multiselect';
import { KeyFilterModule } from 'primeng/keyfilter';
import { CalendarModule } from 'primeng/calendar';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {PickListModule} from 'primeng/picklist';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {BlockUIModule} from 'primeng/blockui';
import {ListboxModule} from 'primeng/listbox';
import {OrderListModule} from 'primeng/orderlist';
import {ContextMenuModule} from 'primeng/contextmenu';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {FileUploadModule} from 'primeng/fileupload';
import {TreeModule} from 'primeng/tree';
import {FieldsetModule} from 'primeng/fieldset';
import {MenuModule} from 'primeng/menu';
import {DataViewModule} from 'primeng/dataview';
import {RatingModule} from 'primeng/rating';
import {RippleModule} from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';

import { AceEditorModule } from 'ng2-ace-editor';

import {InputNumberModule} from 'primeng/inputnumber';


import { AppRoutingModule } from '../app-routing.module';
import { AppService } from './@services/app.service';
import { InfoModelComponent } from './components/info-model/info-model.component';
import { UserActionComponent } from './components/user-action/user-action.component';
import { NotificationComponent } from './components/notification/notification.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashSystemComponent } from './components/dash-system/dash-system.component';
import { HomeMenuCardsComponent } from './components/home-menu-cards/home-menu-cards.component';
import { SqlViewerComponent } from './@share/sql-viewer/sql-viewer.component';
import { ObjetoRelatedComponent } from './@share/objeto-related/objeto-related.component';

@NgModule({
  declarations: [
    HeaderBarComponent,
    FooterBarComponent,
    HomeComponent,
    EmptyComponent,
    MenuBarComponent,
    NavBarComponent,
    InfoModelComponent,
    UserActionComponent,
    NotificationComponent,
    DashboardComponent,
    DashSystemComponent,
    HomeMenuCardsComponent,
    SqlViewerComponent,
    ObjetoRelatedComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    AppRoutingModule,

    //Modulos primeng
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    DropdownModule,
    InputTextModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    TooltipModule,
    OverlayPanelModule,
    CheckboxModule,
    ProgressBarModule,
    CardModule,
    TableModule,
    ToastModule,
    TabViewModule,
    PanelModule,
    ChartModule,
    AccordionModule,
    MultiSelectModule,
    KeyFilterModule,
    CalendarModule,
    ConfirmDialogModule,
    ScrollPanelModule,
    BlockUIModule,
    ListboxModule,
    OrderListModule,
    ContextMenuModule,
    AutoCompleteModule,
    FileUploadModule,
    TreeModule,
    FieldsetModule,
    MenuModule,
    DataViewModule,
    RatingModule,
    RippleModule,
    SidebarModule,

    AceEditorModule,

    InputNumberModule,
  ],
  exports: [
    HeaderBarComponent,
    FooterBarComponent,
    NavBarComponent,
    HomeComponent,
    EmptyComponent,
    InfoModelComponent,
    UserActionComponent,
    DashboardComponent,
    SqlViewerComponent,
    ObjetoRelatedComponent,

    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    //Modulos primeng para ser usados em outros modulos da suite
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    DropdownModule,
    InputTextModule,
    MessagesModule,
    MessageModule,
    DialogModule,
    TooltipModule,
    OverlayPanelModule,
    CheckboxModule,
    ProgressBarModule,
    CardModule,
    TableModule,
    ToastModule,
    TabViewModule,
    PanelModule,
    ChartModule,
    AccordionModule,
    MultiSelectModule,
    KeyFilterModule,
    CalendarModule,
    ConfirmDialogModule,
    PickListModule,
    ScrollPanelModule,
    BlockUIModule,
    ListboxModule,
    OrderListModule,
    ContextMenuModule,
    AutoCompleteModule,
    FileUploadModule,
    TreeModule,
    FieldsetModule,
    MenuModule,
    DataViewModule,
    RatingModule,
    RippleModule,
    SidebarModule,
    
    AceEditorModule,

    InputNumberModule,

  ],
  providers: [
    //Prove para toda a aplicacao o uso dos service abaixo
    MessageService,
    ConfirmationService,
    HandlerService,
    AppService,
  ]
})
export class SuiteModule { }
