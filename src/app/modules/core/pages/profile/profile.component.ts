import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { basecomponent } from '../../../../@suite/@base/basecomponent';
import { HandlerService } from '../../../../@suite/@services/handler.service';

import { BusinessUnitModel, PermissionModel, Profile, } from '../../@model/core-model';
import { BusinessUnitService } from '../../@service/business-unit.service';
import { PermissionService } from '../../@service/permission.service';
import { ProfileService } from '../../@service/profile.service'


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends basecomponent implements OnInit {


  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private permissionService: PermissionService,
    private businessUnitService: BusinessUnitService,
    public handler: HandlerService
  ) {
    super(handler)
  }

  resumeBusinessUnities: BusinessUnitModel[]

  profiles: Profile[];
  permissions: PermissionModel[];

  permissionsTarget: PermissionModel[];
  permissionsSource: PermissionModel[];

  selectedProfilePermissions: PermissionModel[];

  selectedCodPermissions = [];

  strPermissions = [];      //Str de pemsisson para o filter

  formFilter: FormGroup;
  formInput: FormGroup;

  numSource: number;         // Numero de registro da lista de origem 
  numTarget: number;         // Numero de registro da lista da destino

  typeProfile: number;

  buAll = new BusinessUnitModel();

  ngOnInit() {
    //this.share.navigation = this.handler.moduleLabel('PROFILE');
    this.permissionsTarget = [];
    this.buAll.code = -1;
    this.buAll.status = true;
    this.buAll.name = '(Todas)';
    this.prepareForm();
    this.listAll();
  }

  /**
   * Usando para carregar todos os dados da tela
   * eh chamado no init e pelo botal refresh da tela 
   */
  listAll() {
    this.applyPaginator(this.totalRecords);
    this.listBusinessUnit();
    this.listStrPermission();
    this.filter();
  }

  /**
   * Filtra a lista de perfil para o grip
   */
  filter() {

    //Reset a propriedade
    this.formFilter.get('codPermissions').setValue(undefined);

    //Covert lista de string em uma string seprada por ;
    let arrPerms = [] = this.selectedCodPermissions;

    if (arrPerms && arrPerms.length > 0) {
      let perms = '';
      arrPerms.forEach(element => {
        perms += element + ',';
      });
      if (perms.length > 1) {
        perms = perms.slice(0, perms.length - 1);
      }

      this.formFilter.get('codPermissions').setValue(perms);
    }

    this.filterProfile();
  }

  /**
   * Reseta os fitros e recarrega a tela
   * Eh chamado pelo botao clear filter da tela
   */
  clearFilter() {
    this.formFilter.reset();
    this.selectedCodPermissions = [];
    this.filter();
  }

  /**
   * Exibe a tela de input
   * @param code 
   * @param pickListPermSourceTarget 
   */
  showDialogInput(code: number, pickListPermSourceTarget: any) {
    //Reseta o filtro aplicado na pickList de permissoes
    pickListPermSourceTarget.resetFilter();

    //Se nao for o setor Default todo perfil é customizado tipo 5
    //Se for Default aguarda a selecao da BU para definir o tipo
    if (!this.isDefaultSector)
      this.typeProfile = 5;

    this.resetForm();

    //O get do perfil na api acontece dentro do listPermissionToAssociate
    this.listPermissionToAssociate(code);
  }

  /**
   * Salva ou edita o registro
   * Chamado no botao salvar da janela de input
   */
  saveProfile() {
    //Define no form input as permissoes recebidas na lista target
    this.formInput.get('permissions').setValue(this.permissionsTarget);

    //Verifica se existe BU selecionada, se existir e for a buAll
    //seta null, pq a buAll existe apenas para ter o label (Todas)  
    if (this.formInput.get('businessUnit').value) {
      if (this.formInput.get('businessUnit').value.code === -1) {
        this.formInput.get('businessUnit').setValue(null);
      }
    }

    if (this.editing)
      this.editProfile();
    else
      this.addProfile();

    this.saved = true;
  }

  /**
   * Evento dos objetos do form de filter
   */
  onChangeFilter() {
    this.filter();
  }

  /**
   * Evento de mudanca do BusinessUnit
   * define se o perfil eh 4 ou 5, nativo ou customizado
   */
  onChangeBusinessUnit() {
    this.typeProfile = -1;
    //Eh o default e tem valor da BU no form
    if (this.isDefaultSector && this.formInput.get('businessUnit').value)
      //Se a BU for -1 (todas), o tipo perfil eh 4 nativo
      if (this.formInput.get('businessUnit').value.code === -1)
        this.typeProfile = 4; //nativo
      else
        this.typeProfile = 5; //customizado

    this.formInput.get('type').setValue(this.typeProfile);
  }

  /**
   * Evento on moveTo dispara quando se move o registro
   * de um lado para o outro no pickList
   * usado para atualizar o label de numero de registros 
   * de cada ladoo
   */
  onMoveTo() {
    this.numSource = this.permissionsSource.length;
    this.numTarget = this.permissionsTarget.length;
  }

  /**
   * Evento quando ocorre filtro na source
   * Nao esta disponivel no primeng 6.1, apenas no 7
   * @param event 
   */
  onSourceFilter(event) {
    this.numSource = event.value.length;
  }

  /**
   * Evento quando ocorre filtro na target
   * Nao esta disponivel no primeng 6.1, apenas no 7
   * @param event 
   */
  onTargetFilter(event) {
    this.numTarget = event.value.length;
  }

  /**
   * Aplica regra que permite editar im perfil
   * @param valid Status do formInput
   */
  disableSaveProfile(valid: boolean) {
    if (this.permissionsTarget.length === 0)
      return true;

    //Se o form for valido, verifica se o perfil pode ser editado
    if (valid) {
      //Se for SA, verifica o tipo de perfil
      //Perfis 1 2 e 3 nao podem ser editados mesmo pelo SA
      //Mais detalhes ver regras detalhadas na API
      // O Perfil 4 pode ser editado se o SA estiver no setor default
      if (this.isSa && this.isDefaultSector)
        return (this.typeProfile < 4);

      //Se nao for o SA perfil 1, 2, 3 e 4 nao pode ser editados
      return (this.typeProfile < 5);
    } else
      return true;
  }

  /**
   * Retorna descricao do perfil para os objetos do grid
   * @param code codigo do perfil
   */
  descriptioTypeProfile(code: number) {
    if (!code)
      return "";

    switch (code) {
      case 1:
        return 'Super Admin';
      case 2:
        return 'UN Admin';
      case 3:
        return 'Admin';
      case 4:
        return 'Nativo';
      case 5:
        return 'Customizado';
      default:
        return 'Indefinido';
    }
  }

  /**
 * Seta as pemisssoes de um perfil selecionado na tela na variavel
 * Varivel usada para exibir as permissoes
 */
  setPermission(permissions: PermissionModel[]) {
    this.selectedProfilePermissions = permissions;
  }

  /**
   * Verifica se esta editando o registro
   */
  get editing() {
    return Boolean(this.formInput.get('code').value);
  }

  /**
   * Filtra os perfis para mostrar no grid
   */
  private filterProfile() {
    this.profileService.filter(this.formFilter.value)
      .then(result => {
        this.profiles = result;
        // O User logado nao eh o SA
        if (!this.isSa) {
          //Mostra somente os perfils maior 2
          this.profiles = this.profiles.filter(obj => obj.type > 2);
        }
        this.totalRecords = this.profiles.length;
        this.applyPaginator(this.totalRecords);
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  /**
   * Lista de permissoes para serem atribuidas aos perfil
   * @param code 
   */
  private listPermissionToAssociate(code: number) {
    this.permissionService.listAllEnabledToAssociate()
      .then(result => {
        this.permissions = result;

        //Todas as permissoes com tipo 0, exclusiva SA nao podem ser atribuidas, mesmo pelo SA
        //JA FOI FILTRADO NA API REMOVIDO 30-09-2019
        //this.permissions = this.permissions.filter(obj => obj.type != 0);

        //Recupera o objeto para realizar o patch no form e popular 
        //as listas de source e target
        this.fillObjectProfile(code);
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  /**
   * Recupera o objeto da API e aplica regras para idenfiticar 
   * as permissoes do source e target do pickList
   * @param code codigo do objeto a recuperar da API
   */
  private fillObjectProfile(code: number) {
    this.permissionsTarget = [];
    this.permissionsSource = [];

    if (code) {
      this.profileService.findByCode(code)
        .then(result => {
          this.selectedRowMainTable = result;
          console.log(result.permissions.length)

          //Se nao tiver bu, define a buAll como lebal (todas)
          if (result.businessUnit === null)
            result.businessUnit = this.buAll;

          this.typeProfile = result.type;
          this.formInput.patchValue(result);

          //Inicialmente source eh vazio
          this.permissionsSource = [];
          //As permissoes do perfil vao para o target
          this.permissionsTarget = result.permissions;

          //Se for SA e o perfil for nativo ou customizado, adiciona   
          //no source as permissoes que nao estao adicionada ao user
          if (this.isSa && result.type >= 4) {
            //Varre as permissoes do server e se nao existir 
            //no perfil disponibiliza ela no source
            this.permissions.forEach(element => {
              console.log('Server: ' + element.key)
              let exist = this.permissionsTarget.filter(x => x.key === element.key)[0];
              if (!exist)
                this.permissionsSource.push(element);
            });
            //Se nao for SA e o perfil for customizado
          } else if (result.type >= 5) {
            //Varre as permissoes do server e se nao existir 
            //no perfil disponibiliza ela no source
            this.permissions.forEach(element => {
              console.log('Server: ' + element.key)
              let exist = this.permissionsTarget.filter(x => x.key === element.key)[0];
              if (!exist)
                this.permissionsSource.push(element);
            });
          }

          this.numSource = this.permissionsSource.length;
          this.numTarget = this.permissionsTarget.length;

          this.displayInput = true;
        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {
      //Eh um input a permissoes vao para o source
      this.permissionsSource = this.permissions;
      this.numSource = this.permissions.length;
      this.numTarget = 0;
      this.displayInput = true;
      this.sortList();
    }

    this.saved = false;
  }

  private sortList() {
    if (this.permissionsSource) {
      this.permissionsSource = this.permissionsSource.sort((obj1, obj2) => {
        if (obj1.code > obj2.code) {
          return 1;
        }
        return 0;
      });
    }

    if (this.permissionsTarget) {
      this.permissionsTarget = this.permissionsTarget.sort((obj1, obj2) => {
        if (obj1.code > obj2.code) {
          return 1;
        }
        return 0;
      });
    }
  }

  /**
   * Lista de unidade de negocio para o dropdown
   */
  private listBusinessUnit() {
    this.businessUnitService.listResume()
      .then(result => {
        this.resumeBusinessUnities = result;
        this.resumeBusinessUnities.unshift(this.buAll);
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  /**
   * Lista de string pemissoes para o filtro do form input
   */
  private listStrPermission() {
    this.permissionService.listAllEnabled()
      .then(result => {
        this.strPermissions = result.map(r => ({ label: r.display, value: r.code }));
      })
      .catch(erro => { this.handler.handleError(erro); });
  }

  /**
   * Adiciona o registro na API
   */
  private addProfile() {
    this.profileService.save(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.addGrowlInsert();
        this.filterProfile();
        this.hidenDialogInput();
        if (result.message) {
          this.handler.showDialogInfo(result.message);
        }
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  /**
   * Edita p objeto na API
   */
  private editProfile() {
    this.profileService.edit(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.addGrowlUpdate();
        this.filterProfile();
        this.hidenDialogInput();
        if (result.message)
          this.handler.showDialogInfo(result.message);

      })
      .catch(erro => {
        //Caso ocorra erro, reaplica a buAll, se ela nao existir
        //For removiida no save do objeto
        if (this.formInput.get('businessUnit').value === null)
          this.formInput.get('businessUnit').setValue(this.buAll);

        this.handler.handleError(erro, true);
      });
  }

  /**
   * Prepra os form input e filter
   */
  private prepareForm() {
    this.formFilter = this.formBuilder.group({
      code: [],
      status: [],
      orderBy: [],
      name: [],
      codPermissions: [],
      businessUnitProfile: []
    });
    this.formInput = this.formBuilder.group({
      code: [],
      status: [],
      name: [],
      businessUnit: [],
      permissions: [],
      type: []
    });
  }

  /**
   * Reseta o form e define valores padrao
   */
  private resetForm() {
    this.formInput.reset();
    this.formInput.get('status').setValue(true);
  }

}
