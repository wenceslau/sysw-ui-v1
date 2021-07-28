import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HandlerService } from '../../../../@suite/@services/handler.service';
import { basecomponent } from '../../../../@suite/@base/basecomponent';
import { ApplicationModel, AppLicense, BusinessUnitModel, BusinessUnitParameterModel, License } from '../../@model/core-model';
import { BusinessUnitService } from '../../@service/business-unit.service';
import { ApplicationService } from '../../@service/application.service';

@Component({
  selector: 'app-business-unit',
  templateUrl: './business-unit.component.html',
  styleUrls: ['./business-unit.component.scss']
})
export class BusinessUnitComponent extends basecomponent implements OnInit {

  businessUnities: BusinessUnitModel[];
  resumeApplications: ApplicationModel[];

  formInput: FormGroup;

  formParameterInput: FormGroup;

  disableCreate: boolean;

  readonlyBu: boolean;

  buParameters: BusinessUnitParameterModel[];
  buParameterIndex: number;
  editBuParameter: boolean;
  displayBuParameterInput: boolean;

  license: License = new License();
  appLicense: AppLicense = new AppLicense();
  application: ApplicationModel;
  applications: ApplicationModel[];
  displayLicencse: boolean;
  displayInputKey: boolean;
  numberLicense: number;
  unitBusinesName: string;
  businessUnit: BusinessUnitModel;

  faixas = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
  ];

  sysmonkey: string;

  constructor(
    private formBuilder: FormBuilder,
    private businessUnitService: BusinessUnitService,
    private applicationService: ApplicationService,
    public handler: HandlerService,
  ) {
    super(handler)
  }

  ngOnInit() {
    //this.share.navigation = this.handler.moduleLabel('BUSINESS_UNIT');
    this.prepareForm();
    this.initListBusinessUnit();
  }

  filter() {
    this.listBusinessUnit();
  }

  showOverlayPanel(businessUnit: BusinessUnitModel) {
    this.displayInputKey = true;
    this.sysmonkey = "";
    this.unitBusinesName = businessUnit.name;
    this.license = new License();
    this.license.appLicences = [];
    this.appLicense = new AppLicense();
    this.license.businesUniqueId = businessUnit.uniqueId;
    this.applications = businessUnit.applications;
  }

  onChangeApplication() {
    this.appLicense = new AppLicense();
    this.appLicense.applicationName = this.application.name;
    this.appLicense.applicationUniqueId = this.application.licence; //no obj Application o uniqueId é o licence;    
    this.numberLicense = 0;
  }

  onChangeLicenseNumber() {
    this.appLicense.applicationName = this.application.name;
    this.appLicense.applicationUniqueId = this.application.licence; //no obj Application o uniqueId é o licence;  

    if (this.appLicense.applicationName === 'CORE') {
      this.appLicense.detailLicenseNumber = 'user=' + this.appLicense.licenceNumber;
    } 
  }

  addAppLicense() {
    if (this.appLicense.applicationName &&
      this.appLicense.applicationUniqueId &&
      this.appLicense.detailLicenseNumber &&
      this.appLicense.expiration &&
      this.appLicense.licenceNumber) {
      this.license.appLicences.push(this.appLicense);
      this.appLicense = new AppLicense();
    }
  }

  clearAppLicense() {
    this.appLicense = new AppLicense();
    this.license.appLicences = [];
    this.application = undefined;
  }

  generate() {
    if (this.license.appLicences.length > 0) {
      this.businessUnitService.sysmonkey(this.license)
        .then(result => {
          this.sysmonkey = result.object;
        })
        .catch(erro => { this.handler.handleError(erro, true); });
    }
  }

  keyValue: string;
  
  key() {

    if (this.keyValue === 'WENCESLAU' || this.keyValue === 'ZORZETO') {
      this.keyValue = '';
      this.displayInputKey = false;
      this.displayLicencse = true;
    }
    else {
      this.keyValue = '';
      this.handler.showToastError('Incorret......!','PHEEEENNN');
    }
  }

  showDialogInput(code: number) {
    this.readonlyBu = false;
    this.resetForm();

    if (code) {
      this.businessUnitService.findByCode(code)
        .then(result => {
          this.selectedRowMainTable = result;
          this.formInput.patchValue(result);
          this.buParameters = result.businessUnitParameters

          this.displayInput = true;
          //Se a BU for a padrao do sistema, nao pode ser editada
          if (this.formInput.get('name').value === 'DEFAULT') {
            this.readonlyBu = true;
          }
        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {
      this.buParameters = [];
      this.displayInput = true;
    }

    this.saved = false;
  }

  initListBusinessUnit() {
    this.listApplication();
    this.listBusinessUnit();
  }

  saveBusinessUnit() {

    this.formInput.get('businessUnitParameters').setValue(this.buParameters);

    if (this.editing) {
      this.editBusinessUnit();
    } else {
      this.addBusinessUnit();
    }
    this.saved = true;
  }


  preparerNewBuParameter() {
    this.formParameterInput.reset();
    this.displayBuParameterInput = true;
    this.editBuParameter = false;
    this.buParameterIndex = this.buParameters.length;
  }

  preparerEditBuParameter(buParameter: BusinessUnitParameterModel, index: number) {
    this.formParameterInput.patchValue(buParameter);
    this.displayBuParameterInput = true;
    this.editBuParameter = true;
    this.buParameterIndex = index;
  }

  confirmBuParameter() {

    if (this.checkRule(this.formInput.value, this.formParameterInput.value)) {
      this.handler.showToastWarn(this.label('lbl_ja_existe_um_p_c_e_c'));
      return;
    }

    this.buParameters[this.buParameterIndex] = this.cloneBuParameter(this.formParameterInput.value);
    this.displayBuParameterInput = false;
    this.formParameterInput.reset();
  }

  cloneBuParameter(buParameter: BusinessUnitParameterModel): BusinessUnitParameterModel {
    return new BusinessUnitParameterModel(buParameter.code, buParameter.application,
      buParameter.key, buParameter.value, buParameter.description);
  }

  get editing() {
    return Boolean(this.formInput.get('code').value);
  }

  isSysDisable(key: string) {

    if (key.startsWith('SYS_') === false) {
      return false;
    }

    var bup = this.buParameters.find(x => x.key === 'SYS_NUMERO_OBJETOS');
    if (bup) {
      if (bup.value === '0') {
        return false;
      }
    }
    return true;
  }

  private listBusinessUnit() {
    this.businessUnitService.filter()
      .then(result => {
        // Listas pageables, o retorno esta dentro do content
        this.businessUnities = result;
        this.totalRecords = this.businessUnities.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listApplication() {
    this.applicationService.filter(false)
      .then(result => {
        this.resumeApplications = result;
        //.map(c => ({ label: c, value: c }));
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private addBusinessUnit() {
    this.businessUnitService.save(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.listBusinessUnit();
        this.addGrowlInsert();
        this.hidenDialogInput();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private editBusinessUnit() {
    this.businessUnitService.edit(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.listBusinessUnit();
        this.formInput.patchValue(result);
        this.addGrowlUpdate();
        this.hidenDialogInput();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private checkRule(businessUnit: BusinessUnitModel, buPar: BusinessUnitParameterModel): boolean {

    //console.log('Editando prop ' + this.editProperty);
    if (this.editBuParameter) {
      return false;
    }

    let pr;

    pr = businessUnit.businessUnitParameters.find(x => x.key == buPar.key);

    if (pr) {
      return true;
    }

    return false;

  }

  private prepareForm() {
    this.formInput = this.formBuilder.group({
      code: [],
      status: [],
      name: [],
      description: [],
      applications: [],
      businessUnitParameters: [],
      uniqueId: [],
      license: [],
      image: [],
    });
    this.formParameterInput = this.formBuilder.group({
      code: [],
      application: [],
      status: [],
      key: [],
      value: [],
      description: [],
    });
  }

  private resetForm() {
    this.formInput.reset();
    this.formInput.get('status').setValue(true);
  }
}
