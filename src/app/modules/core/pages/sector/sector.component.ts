import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscriber } from 'rxjs';
import { FunctionService } from 'src/app/@suite/@services/function.service';
import { basecomponent } from '../../../../@suite/@base/basecomponent';
import { HandlerService } from '../../../../@suite/@services/handler.service';

import { ApplicationModel, BusinessUnitModel, DataService, DataServiceFilter, LanguageModel, Sector, SectorFilter } from '../../@model/core-model';
import { ApplicationService } from '../../@service/application.service';
import { BusinessUnitService } from '../../@service/business-unit.service';
import { DataServiceService } from '../../@service/data-service.service';
import { SectorService } from '../../@service/sector.service'

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.scss']
})
export class SectorComponent extends basecomponent implements OnInit {


  resumeBusinessUnities: BusinessUnitModel[]
  resumeApplications: ApplicationModel[];
  resumeDataServices: DataService[];

  sectors: Sector[];

  formInput: FormGroup;
  formFilter: FormGroup;

  readonlyDataService: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private businessUnitService: BusinessUnitService,
    private dataServiceSevice: DataServiceService,
    private sectorService: SectorService,
    private applicationService: ApplicationService,
    private functionService: FunctionService,
    public handler: HandlerService
  ) {
    super(handler);
  }

  ngOnInit() {
    //this.share.navigation = this.handler.moduleLabel('SECTOR');
    this.prepareForm();
    this.listAll();

    this.totalRecords = 0;
  }

  listAll() {
    this.applyPaginator(this.totalRecords);
    this.listBusinessUnit();
    this.listDataService();
    this.filter();
    this.listApplication(0);
  }

  filter() {
    this.listSectors(this.formFilter.value);
  }

  clearFilter() {
    this.formFilter.reset();
    this.filter();
  }

  showDialogInput(code: number) {
    this.resetForm();
    this.readonlyDataService = false;


    if (code) {
      this.findByCode(code);
    } else {
      this.formInput.get('requiredDb').setValue(false);
      this.onChangerequiredDb();
      this.displayInput = true;
    }

    this.saved = false;
  }

  saveSector() {
    if (this.editingSector) {
      this.editSector();
    } else {
      this.addSector();
    }
    this.saved = true;
  }

  onChangeBusinessUnit() {
    let bu = this.formInput.get('businessUnit').value
    this.listDataServiceByBusinesUnit(bu.code);
    this.listApplication(bu.code);
  }

  onChangeApplication() {

    let app = this.formInput.get('application').value

    if (app && app.name === 'AAAA') {
      this.formInput.get('requiredDb').setValue(true);
      this.onChangerequiredDb();
    } else {
      this.formInput.get('requiredDb').setValue(false);
      this.onChangerequiredDb();
    }
  }

  onChangerequiredDb() {

    if (this.formInput.get('requiredDb').value) {
      this.formInput.get('dataService').setValidators(Validators.required);
      this.formInput.get('nameExternalDatabase').setValidators(Validators.required);

    } else {
      this.formInput.get('dataService').clearValidators();
      this.formInput.get('dataService').setValue(undefined);
      this.formInput.get('dataService').updateValueAndValidity();

      this.formInput.get('nameExternalDatabase').clearValidators();
      this.formInput.get('nameExternalDatabase').setValue(undefined);
      this.formInput.get('nameExternalDatabase').updateValueAndValidity();

    }
  }



  get sectorRequiredDb() {
    return this.formInput.get('requiredDb').value
  }

  get editingSector() {
    return Boolean(this.formInput.get('code').value);
  }

  get readonlyNameDatabase(): boolean {
    return Boolean(this.formInput.get('dateCreateDatabase').value);
  }

  private reloatListUsersSectors() {

    if (this.isUndefinedOrEmpty(this.handler.share.userNameLogged))
      return;

    let subscriber: Subscriber<string>;
    let observable = new Observable(obs => {
      this.handler.block();
      subscriber = obs;
      this.functionService.loadUserSectors(this.handler.share.userNameLogged, subscriber);
    });

    observable.subscribe({
      complete: () => {
        this.handler.unblock();
        console.log(this.handler.share.sectorCode);
        this.handler.share.sector = this.handler.share.sectors.find(x => x.code === this.handler.share.sectorCode);
      },
      error: (err) => {
        this.handler.unblock();
        if (err.status === 412) {
          this.handler.messageInline = [{ severity: 'warn', summary: '', detail: err.error.message }];
        } else {
          this.handler.handleError(err);
        }
      }
    });
  }

  private findByCode(code: number) {
    this.sectorService.findByCode(code)
      .then(result => {
        this.selectedRowMainTable = result;
        //Se a BU requer q o setor precise de DB, mostra os campos
        if (result.requiredDb) {
          if (result.dataService) {
            if (!result.dateCreateDatabase) {
            } else {
              this.readonlyDataService = true;
            }
          }
        }
        this.formInput.patchValue(result);
        this.onChangeBusinessUnit();
        this.onChangerequiredDb();
        this.displayInput = true;
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private listDataService() {
    let filter = new DataServiceFilter();
    filter.type = 'DATABASE';
    filter.scope = 'DATASERVICE';
    filter.status = true;
    //O filter somente traz dados da bu logada, com excecao se for o setor default
    this.dataServiceSevice.filterResume(filter)
      .then(result => {
        this.resumeDataServices = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listDataServiceByBusinesUnit(buCode: number) {
    let filter = new DataServiceFilter();
    filter.type = 'DATABASE';
    filter.scope = 'DATASERVICE';
    filter.status = true;
    filter.codBusinessUnit = buCode;
    //O filter somente traz dados da bu logada, com excecao se for o setor default
    this.dataServiceSevice.filterResume(filter)
      .then(result => {
        this.resumeDataServices = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }


  private listApplication(code: number) {

    //se o codigo for 0 e setor for default vai trazer vazio, se nao vai trazer do setor logado 
    this.applicationService.listByBusinessUnitOrSectorLogged(code)
      .then(result => {
        this.resumeApplications = result;

      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }


  private listSectors(filter: SectorFilter) {

    //filter.orderBy = "code"
    this.sectorService.filter(filter)
      .then(result => {
        this.sectors = result;
        //Remove sector default
        //this.sectors = this.sectors.filter(obj => obj.code !== 1);
        this.totalRecords = this.sectors.length;
        this.applyPaginator(this.totalRecords);
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listBusinessUnit() {

    this.businessUnitService.listResume()
      .then(result => {
        this.resumeBusinessUnities = result;
        //Mostra apenas os ativos
        this.resumeBusinessUnities = this.resumeBusinessUnities.filter(obj => obj.status);
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private addSector() {

    this.sectorService.save(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.listSectors(this.formFilter.value);
        this.formInput.patchValue(result);
        this.reloatListUsersSectors();
        this.addGrowlInsert();
        this.hidenDialogInput();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private editSector() {

    if (this.formInput.value.status === false) {
      if (this.formInput.value.code === this.handler.share.sectorCode) {
        this.handler.showToastWarn('Action not permitted');
        return;
      }
    }

    this.sectorService.edit(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.listSectors(this.formFilter.value);
        this.formInput.patchValue(result);
        this.reloatListUsersSectors();
        //console.log('dateCreateDatabase ' + result.dateCreateDatabase);
        //console.log('result.dataService ' + result.dataService);
        // if (result.dataService && !result.dateCreateDatabase) {
        //   this.confirmation.confirm({
        //     message: 'Deseja criar a base de dados de objetos desse setor?',
        //     accept: () => {
        //       this.createDataBase();
        //     },
        //     reject: () => {
        //       this.addMessageUpdate();
        //       this.hidenDialogInput();
        //     }
        //   });
        // } else {
        this.addGrowlUpdate();
        this.hidenDialogInput();
        // }

      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private prepareForm() {
    this.formFilter = this.formBuilder.group({
      code: [],
      status: [],
      orderBy: [],
      name: []
    });
    this.formInput = this.formBuilder.group({
      code: [],
      status: [],
      name: [],
      description: [],
      uniqueId: [],
      businessUnit: [],
      application: [],
      dataService: [],
      nameExternalDatabase: [],
      dateCreateDatabase: [],
      requiredDb: []
    });
  }

  private resetForm() {
    this.formInput.reset();
    this.formInput.get('status').setValue(true);
    this.formInput.get('requiredDb').setValue(true);
  }

}
