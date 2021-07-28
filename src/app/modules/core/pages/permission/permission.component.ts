import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { basecomponent } from '../../../../@suite/@base/basecomponent';
import { HandlerService } from '../../../../@suite/@services/handler.service';

import { ApplicationModel, PermissionModel, PermissionFilter } from '../../@model/core-model';
import { PermissionService } from '../../@service/permission.service'
import { DataListService } from '../../@service/data-list.service';
import { ApplicationService } from '../../@service/application.service';
import { LazyLoadEvent } from 'primeng/api';


@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent extends basecomponent implements OnInit {


  modules = [];
  roles = [];
  types = [];
  components = [];
  applications: ApplicationModel[];

  orderBy = [
    { label: 'Sequencia', value: 'sequence' },
    { label: 'Permissão', value: 'role' },
    { label: 'Modulo', value: 'module' },
    { label: 'Componente', value: 'component' },
    { label: 'Root', value: 'root' },
    { label: 'Toolbar', value: 'toolbar' },
    { label: 'Status', value: 'status' },
  ];

  permissions: PermissionModel[];
  predecessorPermisions = [];

  formFilter: FormGroup;
  formInput: FormGroup;

  currentPage: number;
  totalRecords: number;         // Numero de registro da lista

  constructor(
    private formBuilder: FormBuilder,
    private permissionService: PermissionService,
    private applicationService: ApplicationService,
    public datalistService: DataListService,

    public handler: HandlerService,

  ) {
    super(handler)
  }

  ngOnInit() {
    this.currentPage = 0
    this.prepareForm();
    this.listApplication();
    this.listAll();
    this.listItemDataListRoles();
    this.listItemDataListType();
    this.listItemDataListComponent();    // Metodo initListPermission nao precisa ser chamado no onInit
    // pq o onChangePage do table dispara na criacao do table
  }

  filter() {
    this.filtered = true;
    this.listPermissions(this.formFilter.value);
  }

  showDialogInput(code: number) {
    this.resetForm();

    if (code) {
      this.permissionService.findByCode(code)
        .then(result => {
          this.selectedRowMainTable = result;
          this.listPermissionModule(result.application.name)

          this.formInput.patchValue(result);
          if (result.predecessorPermission) {
            this.formInput.get('predecessorPermission').setValue(result.predecessorPermission.split(','));
          }
          this.displayInput = true;
          this.onChangeComponent();
          this.onChangeRole();
        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {
      this.displayInput = true;
    }
    this.saved = false;
  }

  // Limpar a ultima pesquisa
  listAll() {
    this.applyPaginator(this.totalRecords);
    this.filter();
  }

  clearFilter() {
    this.formFilter.reset();
    this.filter();
  }

  savePermission() {

    if (this.formInput.get('predecessorPermission').value) {

      let apps = '';
      this.formInput.get('predecessorPermission').value.forEach(element => {
        apps += element + ',';
      });

      if (apps.length > 1) {
        apps = apps.slice(0, apps.length - 1);
      }
      this.formInput.get('predecessorPermission').setValue(apps);
    }

    if (this.editing) {
      this.editPermission();
    } else {
      this.addPermission();
    }
    this.saved = true;
  }

  onChangePage(event: LazyLoadEvent) {
  }

  onChangeFilter() {
    this.filter();
  }

  onChangeComponent() {
    if (this.formInput.get('component').value === 'MENU') {
      this.formInput.get('label').enable();
      this.formInput.get('root').enable();
      this.formInput.get('sequenceRoot').enable();
      this.formInput.get('router').enable();
      this.formInput.get('icon').enable();
      this.formInput.get('sequence').enable();
      this.formInput.get('toolbar').enable();
      this.formInput.get('rootToolbar').enable();
    } else {
      this.formInput.get('root').disable();
      this.formInput.get('sequenceRoot').disable();
      this.formInput.get('label').disable();
      this.formInput.get('icon').disable();
      this.formInput.get('router').disable();
      this.formInput.get('sequence').disable();
      this.formInput.get('toolbar').disable();
      this.formInput.get('rootToolbar').disable();
      this.formInput.get('rootToolbar').setValue(false);
    }
  }

  onChangeRole() {

    if (!this.formInput.get('role').value || this.formInput.get('role').value === 'LIST') {
      this.formInput.get('predecessorPermission').disable();
      this.formInput.get('predecessorPermission').setValue(null);
    } else {
      this.formInput.get('predecessorPermission').enable();
    }
  }

  onChangeApplication() {
    console.log('app ' + this.formInput.get('application').value.name);
    this.listPermissionModule(this.formInput.get('application').value.name)
  }

  descriptionTypePermission(code: number) {
    if (this.types) {
      let type = this.types.filter(x => x.value === code)[0]
      if (type)
        return type.label;
    }
  }

  apllyRulesPermissionProfile() {

    this.permissionService.apllyRulesPermissionProfile()
      .then(result => {
        this, this.handler.showToastSuccess('Regras Permissões aplicadas com sucesso');
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  get editing() {
    return Boolean(this.formInput.get('code').value);
  }

  private listPermissionModule(group: string) {
    this.datalistService.allItemEnableByDataListNameAndGroup('PERMISSION_MODULE', group)
      .then(result => {
        this.modules = result
          .map(idl => ({ label: idl.labelItem, value: idl.valueItem }));
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listApplication() {
    this.applicationService.filter()
      .then(result => {
        this.applications = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listPermissions(filter: PermissionFilter) {
    this.permissionService.filter(filter)
      .then(result => {
        this.permissions = result;
        let predPermission = result.filter(p => p.status);
        if (!this.predecessorPermisions || this.predecessorPermisions.length === 0) {
          this.predecessorPermisions = predPermission.map(r => ({ label: r.display, value: r.code + '' }));
        }
        this.totalRecords = this.permissions.length;
        this.applyPaginator(this.totalRecords);
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listItemDataListRoles() {
    this.datalistService.allItemEnableByDataListName('PERMISSION_ROLE')
      .then(result => {
        this.roles = result.map(idl => ({ label: idl.labelItem, value: idl.valueItem }));
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listItemDataListType() {
    this.datalistService.allItemEnableByDataListName('PERMISSION_TYPE')
      .then(result => {
        this.types = result.map(idl => ({ label: idl.labelItem, value: Number(idl.valueItem) }));
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listItemDataListComponent() {
    this.datalistService.allItemEnableByDataListName('PERMISSION_COMPONENT')
      .then(result => {
        this.components = result.map(idl => ({ label: idl.labelItem, value: idl.valueItem }));
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  // Adiciona o objeto na API
  private addPermission() {
    this.permissionService.save(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.listPermissions(this.formFilter.value);
        this.hidenDialogInput();
        this.addGrowlInsert();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  // Edita o objeto na API
  private editPermission() {
    this.permissionService.edit(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.listPermissions(this.formFilter.value);
        this.formInput.patchValue(result);
        this.hidenDialogInput();
        this.addGrowlUpdate();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private prepareForm() {
    this.formFilter = this.formBuilder.group({
      code: [],
      status: [],
      orderBy: [],
      role: [],
      application: [],
      strApplication: [],
      module: [],
      description: [],
      component: [],
      label: [],
      root: []
    });
    this.formInput = this.formBuilder.group({
      code: [],
      status: [],
      type: [],
      application: [],
      role: [],
      module: [],
      description: [],
      predecessorPermission: [],
      component: [],
      label: [],
      root: [],
      router: [],
      icon: [],
      sequence: [],
      sequenceRoot: [],
      toolbar: [],
      rootToolbar: [],
      key: []
    });
  }

  private resetForm() {
    this.formInput.reset();
    this.formInput.get('status').setValue(true);
    this.formInput.get('toolbar').setValue(false);
    this.onChangeComponent();
    this.onChangeRole();
  }

}
