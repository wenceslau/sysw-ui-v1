import { Component, OnInit } from '@angular/core';
import { basecomponent } from '../../@base/basecomponent';
import { HandlerService } from '../../@services/handler.service';
import { InfoService } from '../../@services/info.service';
import { StackErrorService } from '../../@services/stack-error.service';
import { UserLogonHistoryService } from '../../../modules/core/@service/user-logon-history.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  extends basecomponent implements OnInit {

 
  constructor(
    private infoService: InfoService,
    private stackErrorService: StackErrorService,
    private userLogonHistoryService: UserLogonHistoryService,
    public handler: HandlerService    
  ) {
    super(handler)
    //console.log('constructor');
    this.heightCarrosel = window.innerHeight - 340 + 'px';
  }
  filesProcess: any[]
  fileLogs: any[];

  errors: any[];


  connections: any[];

  //components: any[] = [];

  header: string = '';
  active: string = '';

  loggeds: any[];

  objetos: any[];
  data: any;
  blockedPanelLogged: boolean = false;

  dataChartError: any;


  heightCarrosel: string;

  stackError: string;
  showStack: boolean;

  ngOnInit() {
    this.handler.share.navigationIcon = 'fad fa-tachometer-alt';
    this.handler.share.navigation = this.label('lbl_dashboard');

    if (!this.canDisable('CORE_DASHBOARD_LOGON_VIEWER')) {
      this.chartLogonByDay();
      this.listLogged();
    }

    if (!this.canDisable('CORE_DASHBOARD_LOG_SUITE_VIEWER')) {
      this.listErros();
      this.listFileLogs();
      setTimeout(() => {
        this.chartErrorByDay();
      }, 500);
    }

    this.listConnection();
  }

  showStackError(stack) {
    this.showStack = true;
    this.stackError = stack;
  }

  onTabChange(event) {    
    if (event.index === 5)
      this.chartErrorByDay();
  }

  listLogged() {
    this.blockedPanelLogged = true;
    this.infoService.logged()
      .then(result => {
        this.loggeds = result;
        this.blockedPanelLogged = false;
      })
      .catch(erro => {
        console.error(erro);
      });
  }

  listObjeto() {

  }

  listConnection() {
    console.log('listConnection');
    this.infoService.infoConnection()
      .then(result => {
        this.connections = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  chartLogonByDay() {

    this.userLogonHistoryService.chartLogonByDay(false)
      .then(result => {
        this.data = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  chartErrorByDay() {

    this.stackErrorService.chartErrorByDay(false)
      .then(result => {
        this.dataChartError = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  listErros() {
    console.log('listErros');
    this.stackErrorService.list(false)
      .then(result => {
        this.errors = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  closeConnection(key: string) {
    console.log('closeConnection ' + key);
    this.infoService.closeConnection(key)
      .then(result => {
        this.listConnection();
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  roolbackConnection(key: string) {
    console.log('roolbackConnection ' + key);
    this.infoService.roolbackConnection(key)
      .then(result => {
        this.listConnection();
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  listFileLogs() {
    console.log('listFileLogs');
    this.stackErrorService.listFileLog()
      .then(result => {
        this.fileLogs = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  listFileProcess(block: boolean) {

  }

  classRow(status: string, numLineRejected: number): string {
    let value = 'grid-col-string';
    if (status === 'RUNNING')
      value += ' statusRun';

    if (numLineRejected > 0)
      value += ' c-grid-row-inactive';

    return value;
  }

  downloadFileLog(fileLog: any) {
    console.log('downloadFileLog ' + fileLog.name);

    this.stackErrorService.downloaFileLog(fileLog.name)
      .then(result => {
        var downloadURL = window.URL.createObjectURL(result);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = fileLog.name;
        link.click();
      })
      .catch(erro => {
        this.handler.showToastWarn(erro);
        this.handler.unblock();
      });
  }

  getTypeException(value: string){
    if (value)
      return value.split(':')[0];
  }

  get heightChart(): string {
    return (window.innerHeight - 500) + '';
  }

  get scrollHeightTableUserOnline(): string {
    return window.innerHeight - 450 + 'px';
  }

  get scrollHeightTableAlone(): string {
    return window.innerHeight - 260 + 'px';
  }

  get heightNotify(): string {
    return (window.innerHeight - 200) + '';
  }

}
