import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HandlerService } from '../../../../@suite/@services/handler.service';
import { DataListService } from '../../@service/data-list.service';
import { basecomponent } from '../../../../@suite/@base/basecomponent';
import { BusinessUnitModel, DataService, Property } from '../../@model/core-model';
import { BusinessUnitService } from '../../@service/business-unit.service';
import { DataServiceService } from '../../@service/data-service.service';

@Component({
  selector: 'app-data-service',
  templateUrl: './data-service.component.html',
  styleUrls: ['./data-service.component.scss']
})
export class DataServiceComponent extends basecomponent implements OnInit {


  selecteddDataService: DataService;
  resumeBusinessUnities: BusinessUnitModel[]
  dataServices: DataService[];
  properties: Property[];
  propertyIndex: number;
  editProperty: boolean;
  formInput: FormGroup;
  formFilter: FormGroup;
  formPropertyInput: FormGroup;
  displayPropertyInput: boolean;
  strBusinessUnities = [];
  serviceTypes = [];
  providers = [];
  dataType = [
    { label: 'TEXT', value: 'TEXT' },
    { label: 'PASSWORD', value: 'PASSWORD' },
  ];
  dataTypeSelected = 'text';



  /**CONTRUTOR E INIT**/

  constructor(
    private formBuilder: FormBuilder,
    private dataserviceService: DataServiceService,
    private businessUnitService: BusinessUnitService,
    public datalistService: DataListService,
    public handler: HandlerService   

  ) {
    super(handler)
  }

  ngOnInit() {
    //this.share.navigation = this.handler.moduleLabel('DATA_SERVICE');
    this.prepareForm();
    this.listDataServiceType();
    this.listDataServiceProvider();
    this.listAll();
  }

  listAll() {
    //console.log('listAll');
    this.applyPaginator(this.totalRecords, 11);
    this.listBusinessUnit();
    this.filter();
  }

  /**SHOW DIALOGS**/
  
  showDialogInput(code: number) {
    //console.log('showDialogInput');
    this.resetForm();
    this.cloning = false;;

    if (code) {
      this.dataserviceService.findByCode(code)
        .then(result => {
          this.selectedRowMainTable = result;
          this.properties = result.properties;
          this.formInput.patchValue(result);
          this.displayInput = true;
        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {
      if (!this.isSa){

        let ds = this.dataServices.filter(x=>x.type === 'DATABASE')[0];
        if (ds){

          let newDs = new DataService();

          newDs.code = undefined;
          newDs.type = ds.type;
          newDs.status = false;
          newDs.name = undefined;
          newDs.identifier = undefined;
          newDs.scope = undefined;
          newDs.description = undefined;
          newDs.businessUnit = undefined;
          newDs.properties = [];

          ds.properties.forEach(element => {
            newDs.properties.push(new Property(undefined, element.dataType, element.name, '', element.description))
          });

          this.properties = newDs.properties;
          this.formInput.patchValue(newDs);

        }
      }
      this.displayInput = true;
    }

    this.saved = false;
  }

  hidenDialogInput() {
    if (this.selectedRowMainTable){
      let reg = this.dataServices.find(x=>x.code == this.selectedRowMainTable.code);
      if (reg)
        this.properties = reg.properties;
    }
    super.hidenDialogInput();
  }

  /**ACOES DE BOTOES E SUBMITS**/

  filter() {
    //console.log('filter');
    this.listDataService();
  }

  saveDataService() {
    //console.log('saveDataService');

    if (this.isUndefined(this.properties)){
      this.handler.showToastWarn('Propridades são obrigatórias');
      return;
    }

    for (let index = 0; index < this.properties.length; index++) {
      const element: Property = this.properties[index];
      if (element.name !== 'DATABASE_INSTANCE' && (element.value === undefined || element.value === '')){
        this.handler.showToastWarn(element.name + ' é obrigatoria(o)');
        return;
      }
    }

    this.formInput.get('properties').setValue(this.properties);

    if (this.editing) {
      this.editDataService();
    } else {
      this.addDataService();
    }
    this.saved = true;
  }

  cloning: boolean;
  cloneDataService(ds: DataService) {
    //console.log('cloneDataService');
    this.selecteddDataService = ds
    this.handler.confirmService.confirm({
      message: 'Deseja clonar o Serviço de Dados código: ' + ds.code + '?',
      accept: () => {
        this.dataserviceService.clone(ds.code)
          .then((result) => {
            //this.listDataService();
            this.properties = result.properties;
            this.formInput.patchValue(result);
            this.displayInput = true;
            this.cloning = true;
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

  preparerEditProperty(property: Property, index: number) {
    this.formPropertyInput.patchValue(property);
    this.onChangeDataType();
    this.displayPropertyInput = true;
    this.editProperty = true;
    this.propertyIndex = index;
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

  /**VALORES BOLEANOS**/

  canDisableAddPropertie(role: string) {
    //Nao tem tipo de objeto selecionado, desabilta, tem segue a permissao
    if (!this.editing) {
      return true;
    }
    return this.canDisable(role);
  }

  /**DESCRICAO PARA VIEW**/

  descriptionType(value: string) {
    return this.descriptionItemDataList(value, this.serviceTypes);
    // if (this.serviceTypes && value != undefined && value != null) {
    //   let item = this.serviceTypes.find(x => x.value === value)
    //   if (item)
    //     return item.label;
    // }
  }

  descriptionProvider(value: string) {
    return this.descriptionItemDataList(value, this.providers);
    // if (this.providers && value != undefined && value != null) {
    //   let item = this.providers.find(x => x.value === value)
    //   if (item)
    //     return item.label;
    // }
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
    //console.log('onChangePage')
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

  private listDataService() {

    this.formFilter.get('scope').setValue('DATASERVICE');
    this.dataserviceService.filterDataService(this.formFilter.value)
      .then(result => {
        this.dataServices = result;
        this.totalRecords = this.dataServices.length;
        this.applyPaginator(this.totalRecords, 11);
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
    //console.log('addDataService');
    this.dataserviceService.save(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.properties = result.properties;
        //if (this.cloning){
          //this.handler.showToastInfo('Serviço de dados clonado com sucesso, para que as configurações tenham sucesso, defina a senha.');
        //}else{
          this.addGrowlInsert();
        //}
        this.listDataService();
        this.hidenDialogInput();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private editDataService() {
    this.dataserviceService.edit(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.properties = result.properties;
        this.formInput.patchValue(result);
        this.addGrowlUpdate();
        this.listDataService();
        this.hidenDialogInput();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  /**PRIVATES**/

  private cloneProperty(property: Property): Property {
    return new Property(property.code, property.dataType,
      property.name, property.value, property.description);
  }

  private checkRule(dataservice: DataService, property: Property): boolean {

    //console.log('Editando prop ' + this.editProperty);
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
      properties: []
    });

  }

  private resetForm() {
    //console.log('resetForm');
    this.resetFormProperty();
    this.formInput.reset();
    this.formInput.get('scope').setValue('DATASERVICE');
    this.formInput.get('status').setValue(true);

    if (!this.handler.share.isSa) {
      this.formInput.get('scope').setValue('USER');
    }
  }

  private resetFormProperty() {
    //console.log('resetFormProperty');
    this.properties = null;
    this.formPropertyInput.reset();
    this.formPropertyInput.get('status').setValue(true);
  }

  // removeProperty(index: number) {
  //   this.properties.splice(index, 1);
  // }

}
