import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HandlerService } from '../../../../@suite/@services/handler.service';
import { DataListService } from '../../@service/data-list.service';
import { basecomponent } from '../../../../@suite/@base/basecomponent';
import { BusinessUnitModel, DataService, Property, Sector, SectorFilter } from '../../@model/core-model';
import { BusinessUnitService } from '../../@service/business-unit.service';
import { DataServiceService } from '../../@service/data-service.service';
import { SectorService } from '../../@service/sector.service';

@Component({
  selector: 'app-data-task',
  templateUrl: './data-task.component.html',
  styleUrls: ['./data-task.component.scss']
})
export class DataTaskComponent extends basecomponent implements OnInit {

  dataTypeSelected = 'text';
  selecteddDataService: DataService;
  resumeBusinessUnities: BusinessUnitModel[]
  selectedUserSectors: Sector[];
  sectors: [{ label: '', value: '' }];
  dataServices: DataService[];
  dataServiceSector: DataService[];

  properties: Property[];
  propertyIndex: number;
  editProperty: boolean;
  formInput: FormGroup;
  formFilter: FormGroup;
  formPropertyInput: FormGroup;
  displayPropertyInput: boolean;
  namesSector: string[] = [];
  strBusinessUnities = [];
  serviceTypes = [];
  providers = [];
  dataType = [
    { label: 'TEXT', value: 'TEXT' },
    { label: 'PASSWORD', value: 'PASSWORD' },
  ];

  /**CONTRUTOR E INIT**/

  constructor(
    private formBuilder: FormBuilder,
    private dataserviceService: DataServiceService,
    private businessUnitService: BusinessUnitService,
    private sectorService: SectorService,
    public datalistService: DataListService,
    public handler: HandlerService
  ) {
    super(handler)
  }

  rowsSub: number = 12;
  ngOnInit() {
    this.prepareForm();
    this.listDataServiceType();
    this.listSector();
    this.listAll();
  }

  listAll() {
    this.applyPaginator(this.totalRecords, this.rowsSub);
    this.listBusinessUnit();
    this.listDataServiceProvider();
    this.filter();
  }

  /**SHOW DIALOGS**/

  codSectorsDataTask = '';
  showDialogInput(code: number) {
    this.resetForm();
    this.cloning = false;;

    if (code) {
      this.dataserviceService.findByCode(code)
        .then(result => {
          this.selectedRowMainTable = result;
          this.properties = result.properties;
          this.formInput.patchValue(result);
          this.codSectorsDataTask = result.codSectorsDataTask;
          if (this.codSectorsDataTask)
            this.formInput.get('codSectorsDataTask').setValue(this.codSectorsDataTask.split(','));

          this.displayInput = true;
        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {

      this.dataserviceService.cloneTemplate(this.formInput.get('type').value)
        .then(result => {
          this.properties = result.properties;
          this.formInput.patchValue(result);
          if (result.codSectorsDataTask)
            this.formInput.get('codSectorsDataTask').setValue(result.codSectorsDataTask.split(','));

          this.displayInput = true;
        })
        .catch(erro => { this.handler.handleError(erro); });

      this.displayInput = true;
    }

    this.saved = false;
  }


  hidenDialogInput() {
    if (this.selectedRowMainTable) {
      let reg = this.dataServices.find(x => x.code == this.selectedRowMainTable.code);
      if (reg)
        this.properties = reg.properties;
    }
    super.hidenDialogInput();
  }

  /**ACOES DE BOTOES E SUBMITS**/

  filter() {
    this.listDataService();
  }

  saveDataService() {

    if (this.isUndefined(this.properties)) {
      this.handler.showToastWarn('Propridades são obrigatórias');
      return;
    }

    for (let index = 0; index < this.properties.length; index++) {
      const element: Property = this.properties[index];
      if (element.name !== 'DATABASE_INSTANCE' && (element.value === undefined || element.value === '')) {
        this.handler.showToastWarn(element.name + ' é obrigatoria(o)');
        return;
      }
    }

    this.formInput.get('properties').setValue(this.properties);
    this.formInput.get('scope').setValue('DATATASK');

    let sects = '';

    let codSectorsDataTask = this.formInput.get('codSectorsDataTask').value;
    if (codSectorsDataTask) {

      codSectorsDataTask.forEach(element => {
        if (element && element + ''.length !== 0)
          sects += element + ',';
      });

      if (sects.length > 1) {
        sects = sects.slice(0, sects.length - 1);
      }
    }
    this.formInput.get('codSectorsDataTask').setValue(sects);

    if (this.editing) {
      this.editDataService();
    } else {
      this.addDataService();
    }
    this.saved = true;
  }

  cloning: boolean
  cloneDataService(ds: DataService) {
    this.selecteddDataService = ds
    this.handler.confirmService.confirm({
      message: 'Deseja clonar o Serviço de Dados código: ' + ds.code + '?',
      accept: () => {
        this.resetForm();
        this.dataserviceService.clone(ds.code)
          .then((result) => {
            this.cloning = true;
            //this.listDataService();
            this.properties = result.properties;
            this.formInput.patchValue(result);
            if (result.codSectorsDataTask)
              this.formInput.get('codSectorsDataTask').setValue(result.codSectorsDataTask.split(','));

            this.displayInput = true;
            //this.handler.showToast('info', 'Os Dados do objeto foi clonado', false);
            //this.addGrowl(, 'infoxxxx');
          }).catch(erro => { this.handler.handleError(erro); });
      }
    });
  }

  testConnection(code: number) {
    this.dataserviceService.testConnection(code)
      .then(result => {
        this.handler.showToastInfo(result.message);
      })
      .catch(erro => {
        let err = this.handler.extractMsgError(erro);
        this.handler.showToastError(err);
        this.handler.unblock();
      });
  }

  preparerNewProperty() {
    this.formPropertyInput.reset();
    this.displayPropertyInput = true;
    this.editProperty = false;
    this.propertyIndex = this.properties.length;
  }

  propertyBeforeSave: Property
  indexPropertyBefore: number;

  preparerEditProperty(property: Property, index: number) {

    this.indexPropertyBefore = index;
    this.propertyBeforeSave = new Property(property.code, property.dataType, property.name, property.value, property.description);

    this.formPropertyInput.patchValue(property);
    this.onChangeDataType();
    this.displayPropertyInput = true;
    this.editProperty = true;
    this.propertyIndex = index;
  }

  closeHialogPropertyByButton() {
    this.properties[this.indexPropertyBefore] = this.propertyBeforeSave;
    this.displayPropertyInput = false
  }

  confirmProperty() {

    if (this.checkRule(this.formInput.value, this.formPropertyInput.value)) {
      this.handler.showToastWarn(this.label('lbl_ja_existe_uma_p_c_e_n'));
      return;
    }

    this.properties[this.propertyIndex] = this.cloneProperty(this.formPropertyInput.value);
    this.displayPropertyInput = false;
    this.formPropertyInput.reset();
  }

  cloneProperty(property: Property): Property {
    return new Property(property.code, property.dataType,
      property.name, property.value, property.description);
  }

  setSectorForDescription(value: string) {
    this.namesSector = [];
    let values = [] = value.split(',');
    values.forEach(element => {
      let sector = this.sectors.find(x => x.value === element);
      if (sector)
        this.namesSector.push(sector.label);
    });
  }

  /**VALORES BOLEANOS**/

  canDisableAddPropertie(role: string) {
    //Nao tem tipo de objeto selecionado, desabilta, tem segue a permissao
    if (!this.editing) {
      return true;
    }
    return this.canDisable(role);
  }

  canDisableEdit(dataservice: DataService) {

    if (dataservice.identifier == 'LOCKED000000000') {
      if (this.isSa)
        return false;
      else
        return true;
    }
    return false;
  }

  canDisableEditProperty() {
    var identifier = this.formInput.get('identifier').value;
    if (identifier == 'LOCKED000000000') {
      if (this.isSa)
        return false;
      else
        return true;
    }

    return this.canDisable('CORE_DATA_TASK_UPDATE');
  }

  canDisableEditField() {
    var identifier = this.formInput.get('identifier').value;
    if (identifier == 'LOCKED000000000')
      return true;

    return false;
  }

  /**DESCRICAO PARA VIEW**/

  descriptionType(value: string) {
    return this.descriptionItemDataList(value, this.serviceTypes);
  }

  descriptionProvider(value: string) {
    return this.descriptionItemDataList(value, this.providers);
  }

  descriptionSector(value: string) {
    var count: number = 0;
    if (this.sectors) {

      let values = [] = value.split(',');

      let sector;

      values.forEach(element => {
        sector = this.sectors.find(x => x.value === element);
        if (sector)
          count++;
      });
    }
    return count + ' ' + (count == 1 ? this.label('lbl_setor') : this.label('lbl_setores'));
  }

  /**EVENTOS**/

  onChangeDataType() {
    if (this.formPropertyInput.get('dataType').value === 'PASSWORD') {
      this.dataTypeSelected = 'password';
    }
    else {
      this.dataTypeSelected = 'text';
    }
  }

  onChangeFilter() {
    this.filter();
    this.onRowUnselect(null);
  }

  onRowSelect(event) {
    this.properties = event.data.properties;
  }

  onRowUnselect(event) {
    this.properties = null;
  }

  onChangePage(event: Event) {
    this.onRowUnselect(null);
  }

  /**MTODOS SOBRECARREGADOS DO BASECOMPONENT**/

  // applyPaginator(num: number) {
  //   this.innerHeight = window.innerHeight

  //   this.paginator = false;

  //   if (this.innerHeight <= 580) {
  //     this.rows = 3;

  //   } else if (this.innerHeight <= 630) {
  //     this.rows = 4;

  //   } else if (this.innerHeight <= 660) {
  //     this.rows = 5;

  //   } else if (this.innerHeight <= 725) {
  //     this.rows = 6;
  //   }
  //   else if (this.innerHeight <= 755) {
  //     this.rows = 8;

  //   } else if (this.innerHeight <= 885) {
  //     this.rows = 11;

  //   } else if (this.innerHeight <= 915) {
  //     this.rows = 12;

  //   } else {
  //     this.rows = 15;
  //   }

  //   if (num > this.rows) {
  //     this.paginator = true;
  //   }
  // }

  /**GETS**/

  get editing() {
    return Boolean(this.formInput.get('code').value);
  }

  get showDropdowProvider() {

    if (this.formInput.get('name'))
      return Boolean(this.formPropertyInput.get('name').value === 'DATABASE_PROVIDER');

    return false;
  }

  get scrollHeightTable(): string {
    return window.innerHeight - 800 + 'px';
  }

  /**PRIVATES LIST**/

  /**
   * Retorna a lista de setor para o dropdown
   */
  private listSector() {
    let sf = new SectorFilter();
    sf.status = true;
    sf.onlySectorFromAppLogged = true;

    this.sectorService.filter(sf)
      .then(result => {
        //this.sectors = result;
        this.sectors = result.map(r => ({ label: r.name, value: r.code + '' }));
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  private listDataService() {

    this.formFilter.get('scope').setValue('DATATASK');
   // this.formFilter.get('orderBy').setValue('status');

    this.dataserviceService.filterDataTask(this.formFilter.value)
      .then(result => {
        this.dataServices = result.filter(x => x.codSectorDataTaskParent !== this.handler.share.sectorCode);
        this.dataServiceSector = result.filter(x => x.codSectorDataTaskParent === this.handler.share.sectorCode);
        this.totalRecords = this.dataServices.length;
        this.applyPaginator(this.totalRecords, this.rowsSub);
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listBusinessUnit() {

    this.businessUnitService.listResume()
      .then(result => {
        this.resumeBusinessUnities = result;
        this.strBusinessUnities = this.resumeBusinessUnities.map(r => ({ label: r.name, value: r.code }));
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listDataServiceType() {
    this.datalistService.allItemEnableByDataListName('DATASERVICE_TYPE')
      .then(result => {
        this.serviceTypes = result
          .map(idl => ({ label: idl.labelItem, value: idl.valueItem }));
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listDataServiceProvider() {
    this.datalistService.allItemEnableByDataListName('DATASERVICE_PROVIDER')
      .then(result => {
        this.providers = result
          .map(idl => ({ label: idl.labelItem, value: idl.valueItem }));
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  /**PRIVATES ADD EDIT DELETE**/

  private addDataService() {

    let codSectorsDataTask = this.formInput.value.codSectorsDataTask;

    this.dataserviceService.save(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.properties = result.properties;
        //if (this.cloning) {
        //this.handler.showToastInfo('Tarefa de dados clonada com sucesso, para que as configurações tenham sucesso, defina a senha.');
        //} else {
        this.addGrowlInsert();
        //} 
        this.listDataService();
        this.hidenDialogInput();
      })
      .catch(erro => {
        this.handler.handleError(erro, true);

        this.formInput.get('codSectorsDataTask').reset();
        // //Reajusta multiSelect
        if (codSectorsDataTask)
          this.formInput.get('codSectorsDataTask').setValue(codSectorsDataTask.split(','));
      });
  }

  private editDataService() {
    let codSectorsDataTask = this.formInput.value.codSectorsDataTask;

    this.dataserviceService.edit(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.properties = result.properties;
        this.formInput.patchValue(result);
        this.addGrowlUpdate();
        this.listDataService();
        this.hidenDialogInput();
      })
      .catch(erro => {

        //this.formInput.get('codSectorsDataTask').reset();
        // //Reajusta multiSelect
        if (codSectorsDataTask)
          this.formInput.get('codSectorsDataTask').setValue(codSectorsDataTask.split(','));

        this.handler.handleError(erro, true);
      });
  }

  /**PRIVATES**/

  private checkRule(dataservice: DataService, property: Property): boolean {

    if (this.editProperty) {
      return false;
    }

    let pr;

    let realName = dataservice.type.trim() + '_' + property.name.trim();
    pr = dataservice.properties.find(x => x.name == realName && x.code != property.code);

    if (!pr) {
      pr = dataservice.properties.find(x => x.name.trim() == property.name.trim());
    }


    if (pr) {
      return true;
    }

    return false;

  }

  private prepareForm() {
    this.formFilter = this.formBuilder.group({
      code: [],
      status: [],
      orderBy: [],
      name: [],
      type: [],
      scope: [],
      codBusinessUnit: []
    });
    this.formPropertyInput = this.formBuilder.group({
      code: [],
      dataType: [],
      status: [],
      name: [],
      value: [],
      description: [],
    });
    this.formInput = this.formBuilder.group({
      code: [],
      type: [],
      status: [],
      name: [],
      identifier: [],
      scope: [],
      description: [],
      businessUnit: [],
      properties: [],
      codSectorsDataTask: []
    });

  }

  private resetForm() {
    this.resetFormProperty();
    this.formInput.reset();
    this.formInput.get('type').setValue('DATABASE');
    this.formInput.get('scope').setValue('DATATASK');
    let arr = [];
    this.formInput.get('codSectorsDataTask').setValue(arr);
    this.formInput.get('status').setValue(true);

    if (!this.handler.share.isSa) {
      this.formInput.get('scope').setValue('USER');
    }
  }

  private resetFormProperty() {
    this.properties = null;
    this.formPropertyInput.reset();
    this.formPropertyInput.get('status').setValue(true);
  }

}
