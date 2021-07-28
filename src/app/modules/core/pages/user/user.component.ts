import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { basecomponent } from '../../../../@suite/@base/basecomponent';
import { HandlerService } from '../../../../@suite/@services/handler.service';

import { BusinessUnitModel, Profile, Sector, SectorTO, User, UserFilter, UserGroup, UserGroupFilter, UserLogonHistory, UserLogonHistoryFilter, } from '../../@model/core-model';
import { BusinessUnitService } from '../../@service/business-unit.service';
import { ProfileService } from '../../@service/profile.service'
import { SectorService } from '../../@service/sector.service';
import { UserGroupService } from '../../@service/user-group.service';
import { UserLogonHistoryService } from '../../@service/user-logon-history.service';
import { UserService } from '../../@service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends basecomponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private businessUnitService: BusinessUnitService,
    private userLogonHistoryService: UserLogonHistoryService,
    private profileService: ProfileService,
    private sectorService: SectorService,
    private userGroupService: UserGroupService,
    public handler: HandlerService
  ) {
    super(handler)
    this.userLogonHistoryFilter = new UserLogonHistoryFilter();
  }

  paginatorLogon: boolean;                    //Define paginacao do grid history logon
  rowsLogon: number;                          //Numero de linhas por pagina do grid de logon
  totalRecordsUserAllLogonHistories: number;  //Numero de linas total do grid de logon

  userLogonHistoryFilter: UserLogonHistoryFilter;
  userLogonHistories: UserLogonHistory[];
  usernameFilterLogon: string;

  //currentStatusUserEditing: boolean;

  users: User[];
  resumeBusinessUnities: BusinessUnitModel[]
  resumeSectors: SectorTO[];
  resumeProfiles: Profile[];
  profilesFilter: Profile[];

  formFilter: FormGroup;
  formInput: FormGroup;

  blockProfile: boolean;
  blockSector: boolean;
  typeProfileEditIsUA: boolean;

  selectedUserSectos: Sector[];

  buHasDomainControl: boolean;

  itemMenuContex: MenuItem[];
  displayUserHistory: boolean;


  ngOnInit() {
    this.prepareForm();
    this.listAll('onInit');

    this.itemMenuContex = [
      {
        label: this.label('lbl_editar'), icon: 'fad fa-pencil',
        command: () => this.showDialogInput(this.selectedRowMainTable.code)
      },
      {
        label: this.label('lbl_reset_senha'), icon: 'fad fa-lock',
        command: () => this.showDialogReset(this.selectedRowMainTable.code, this.selectedRowMainTable.name, this.selectedRowMainTable.email)
      },
      {
        label: this.label('lbl_grupos'), icon: 'fad fa-users',
        command: () => this.getGroups(this.selectedRowMainTable)
      },
      {
        label: this.label('lbl_historico_usuario'), icon: 'fad fa-book-user',
        command: () => this.showComponentUserHistory()
      },
      {
        label: this.label('lbl_historico_registro'), icon: 'fad fa-indent',
        command: () => this.showComponentHistory(this.selectedRowMainTable, this.selectedRowMainTable.code, this.selectedRowMainTable.name, 'User')
      },

    ];

    if (this.isDefaultSector) {
      this.buHasDomainControl = false;
    } else {
      this.buHasDomainControl = this.handler.share.sector.buHasDc;
    }

  }

  /**
   * Usando para carregar todos os dados da tela
   * eh chamado no init e pelo botal refresh da tela 
   */
  listAll(source = null) {
    this.applyPaginator(this.totalRecords);
    this.filterUser(this.formFilter.value);
    this.listBusinessUnit();
    this.listProfile();
    this.listSector();

    this.applyPaginatorLogon(this.totalRecordsUserAllLogonHistories);
    if (source != 'onInit') {
      this.filterUserAllLogonHistory();
    }
  }

  /**
 * Aplica o filtro na lista a ser recuperada da API
 * o filtro pode estar vazio, chamado pelo botal filter 
 * da tela ou pelo submit do form filter ou pelos 
 * eventos de change dos campos
 */
  filter() {
    this.filterUser(this.formFilter.value);
  }

  /**
   * Aplica o filtro na lista de user logon history
   */
  filterUserLogon(username: string) {
    this.usernameFilterLogon = username;
    this.filterUserAllLogonHistory();
  }

  /**
   * Reseta os fitros e recarrega a tela
   * Eh chamado pelo botao clear filter da tela
   */
  clearFilter() {
    this.formFilter.reset();
    this.filter();
    this.filterUserLogon('');
  }

  /**
   * Exibe a tela de input do registro
   * @param code Null para insert e valor para edit
   */
  showDialogInput(code: number) {

    if (this.canDisable('CORE_USER_UPDATE')) {
      this.handler.showToastWarn('lbl_acesso_nao_permitido_p_e_p')
      return;
    }

    this.resetForm();

    //Limpa os combos de setores para recarregar
    //qdo selecionar um BU
    if (this.isDefaultSector) {
      this.resumeSectors = [];
      this.resumeProfiles = [];
    }

    this.typeProfileEditIsUA = false;
    this.blockProfile = false;
    this.blockSector = false;

    if (code) {
      this.userService.findByCode(code)
        .then(result => {
          this.selectedRowMainTable = result;
          if (result.businessUnit) {
            //Carrega a lista de setor baseado na unidade de negocio do result
            this.listSectorBusinessUnit(result.businessUnit.code);

            //Carrega a lista de perfil baseado na unidade de negocio do result
            this.listProfileBusinessUnit(result.businessUnit.code);

            this.buHasDomainControl = result.businessUnit.hasDomainControl;
          }

          // Se estiver editando SA ou UA bloqueia perfil
          if (result.profile.type < 3)
            this.blockProfile = true;
          else {
            //se for o adm e editando a si mesmo, bloqueia o perfil
            if (this.isAdm && this.isEditYourSelf())
              this.blockProfile = true;
            else
              this.blockProfile = false;
          }
          //Recupera o status do registro
          //this.currentStatusUserEditing = result.status;

          //sleep para o carregamentno dos perfis e setor da BU do registro
          setTimeout(() => {
            //Popula o form input
            this.formInput.patchValue(result);
            let prf1 = this.resumeProfiles.find(x => x.code === result.profile.code);
            console.log(prf1);
            let prf2 = result.profile;
            console.log(prf2);

            this.formInput.get('profile').setValue(result.profile);
            //Aplica regras sobre o perfil
            this.onChangeProfile();
            this.displayInput = true;
          }, 100);

        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {
      this.displayInput = true;
    }

    this.saved = false;
  }

  /**
 * Exibe o componene de historico do registro
 * @param code codigo do registro
 * @param descriptionObject descricao a ser mostrada no dialog
 * @param nameObject nome do objeto, classe java para filtro do historico
 */
  showComponentUserHistory() {
    this.displayUserHistory = true;
  }


  /**
   * Evento disparado no close do dialog do componente history para fechar
   * @param event 
   */
  onHideComponentUserHistory(event: Event) {
    this.displayUserHistory = false;
  }

  /**
   * Salva ou edita o registro
   * Chamado no botao salvar da janela de input
   */
  saveUser() {
    if (this.editing)
      this.editUser();
    else
      this.addUser();

    this.saved = true;
  }


  code: number;
  name: string;
  email: string;
  showReset: boolean;

  showDialogReset(code: number, name: string, email: string) {

    if (this.canDisable('CORE_PASSWORD_RESET')) {
      this.handler.showToastWarn('lbl_acesso_nao_permitido_p_e_p')
      return;
    }

    this.code = code;
    this.name = name;
    this.email = name;
    this.showReset = true;
  }
  /**
   * Reseta a senha do usuaio na API
   * chamado no botal reset da tela
   * @param code 
   * @param name 
   */
  resetPassword(type: number) {
    this.userService.resetByCode(this.code, type)
      .then(result => {
        if (result.message)
          this.handler.showToastInfo(result.message);
        else
          this.handler.showToastError(this.label('lbl_ops_ocorreu_algum_p'));
        this.showReset = false;
      }).catch(erro => { this.handler.handleError(erro); });
  }

  /**
   * Evento de filtro disparado pelos dropdaow da tela
   */
  onChangeFilter() {
    this.filter();
  }

  /**
   * Ne selecao de um perfil na tela de input
   * define se o setor pode ou nao ser editdado de acordo 
   * com perfil que esta seleceionado
   */
  onChangeProfile() {
    //eh UA
    if (this.formInput.get('profile').value.type === 2)
      this.typeProfileEditIsUA = true;

    //Se estiver editando SA ou UA, bloqueia setor
    if (this.formInput.get('profile').value.type < 3) {
      this.blockSector = true;
      this.formInput.get('sectors').disable()
    } else {
      //se estiver editando ADM e editando a si mesmo, bloqueia o setor
      if (this.isAdm && this.isEditYourSelf()) {
        this.blockSector = true;
        this.formInput.get('sectors').disable();
      }
      else {
        this.blockSector = false;
        this.formInput.get('sectors').enable();
      }
    }
  }

  onChangeStatus(event) {

    if (this.isEditYourSelf()) {
      this.formInput.get('status').setValue(!event.checked);
    } else {
      if (this.readonlyInput()) {
        this.formInput.get('status').setValue(!event.checked);
      } else {
        //this.formInput.get('status').enable();
      }
    }
  }

  onChangeWindowsAutentication(event) {

    if (this.isEditYourSelf()) {
      this.formInput.get('windowsAutentication').setValue(!event.checked);
    } else {
      if (this.readonlyInput()) {
        this.formInput.get('windowsAutentication').setValue(!event.checked);
      } else {
        //this.formInput.get('status').enable();
      }
    }
    if (event.checked) {
      this.formInput.get('username').setValue('');
    }
  }


  /**
   * No evento de selecao de uma unidade de negocio
   * quando for o setor default logado, carrega os setores e os perfils
   * de acordo com BU selecionada
   */
  onChangeBusinessUnit() {
    //eh SA
    if (this.isDefaultSector) {
      this.formInput.get('sectors').setValue(undefined);
      this.formInput.get('profile').setValue(undefined);
      let code = this.formInput.get('businessUnit').value.code;
      this.listSectorBusinessUnit(code);
      this.listProfileBusinessUnit(code);
      this.buHasDomainControl = this.formInput.get('businessUnit').value.hasDomainControl;
    }
  }

  /**
   * Evento de change de pagina do grid de logon,
   * paginacao on demand
   * @param event 
   */
  onChangePageAllLogon(event: LazyLoadEvent) {
    const currentPage = event.first / event.rows;
    this.filterUserAllLogonHistory(currentPage);
  }

  /**
   * Verfica se exibe no grid apenas a contagem de setores
   * @param num 
   * @param cond 
   */
  showSectorCountGrid(num = 0, cond: number) {
    if (num > cond) {
      return true;
    }
    return false;
  }

  /**
   * Verifica se exbibe no grid os codigos dos setores
   * @param num 
   * @param cond 
   */
  showSectorGrid(num = 0, cond: number) {
    if (num <= cond) {
      return true;
    }
    return false;
  }

  /**
   * Define se o nome e usuario podem ser editados na tela
   */
  readonlyInput(): boolean {

    if (this.isSa) {
      return false;
    }

    if (this.typeProfileEditIsUA) {
      return true;
    }

    return false;
  }

  /**
   * Define se o perfil pode ou nao ser editado na tela
   */
  readonlyProfile(): boolean {
    if (this.editing) {
      return this.blockProfile;
    }
    return false;
  }

  /**
   * Define se o setor pode ou nao ser editado na tela
   */
  readonlySector(): boolean {
    //Se o usuario logado for do tipo 2 e o perfil do user a editar for BA
    return this.blockSector
  }


  setSectors(sectors: Sector[]) {
    this.selectedUserSectos = sectors;
  }

  blockedPanelUserGroup: boolean
  userGroups: UserGroup[] = [];
  showGroups: boolean;
  getGroups(user: User) {
    this.showGroups = true;
    this.blockedPanelUserGroup = true;
    let filter = new UserGroupFilter();
    filter.username = user.username
    this.filterGroup(filter);
  }

  secs: Sector[];
  get sectorSorted() {
    if (this.formInput.get('sectors').value) {
      this.secs = this.formInput.get('sectors').value;
      if (this.secs)
        this.secs = this.secs.sort((one, two) => (one.name.toUpperCase() < two.name.toUpperCase() ? -1 : 1));
      return this.secs
    }
    return []
  }

  /**
   * identifica se eh edicao ou insert
   */
  get editing() {
    return Boolean(this.formInput.get('code').value);
  }

  /**
   * Verifica se o usuario em edicao eh ele mesmo
   */
  private isEditYourSelf(): boolean {
    if (this.handler.share.codeUserLogged === this.formInput.get('code').value) {
      return true;
    }
    return false;
  }

  /**
   * Aplica regra para paginar o grid de acordo com 
   * o tamanho da tela
   * @param num
   */
  private applyPaginatorLogon(num: number) {
    this.innerHeight = window.innerHeight
    this.paginatorLogon = false;

    //calcula o numero de linhas da pagina do grid baseado no tamaho da tela
    this.rowsLogon =  this.calculePaginator(window.innerHeight, 0);

    if (num > this.rowsLogon)
      this.paginatorLogon = true;
  }

  /**
   * TODO efetuar uma anlise melhor nesse metodo
   */
  private applyRuleShowProfile() {
    //Mostra os perfis Type maior que 1 da lista para novos user
    //Ou seja nao mostra o perfil SA
    console.log()
    this.resumeProfiles = this.resumeProfiles.filter(obj => obj.type > 1);
    this.profilesFilter = this.resumeProfiles;

    //O usuario logado nao eh SA
    if (!this.isSa) {
      //Mostra os perfis Type maior que 2 da lista para novos user
      //Ou seja nao mostra os perfil SA e UA
      this.resumeProfiles = this.resumeProfiles.filter(obj => obj.type > 2);

      //O usuario logado nao eh UA, Remove da lista de filter o Perfil SA tambem
      if (!this.isUa)
        this.profilesFilter = this.resumeProfiles;
    }
  }

  /**
   * Retorna a lista filtrada de user logon
   * @param page 
   */
  private filterUserAllLogonHistory(page = 0) {
    this.userLogonHistoryFilter.page = page;
    this.userLogonHistoryFilter.rowsPerPage = this.rowsLogon;
    this.userLogonHistoryFilter.orderBy = 'code';
    this.userLogonHistoryFilter.desc = true;
    this.userLogonHistoryFilter.statusLogon = 'SUCCESS';
    this.userLogonHistoryFilter.userLogon = this.usernameFilterLogon;

    this.userLogonHistoryService.filter(this.userLogonHistoryFilter)
      .then(result => {
        this.userLogonHistories = result.content;
        this.totalRecordsUserAllLogonHistories = result.totalElements;
        this.applyPaginatorLogon(this.totalRecordsUserAllLogonHistories);
      })
      .catch(erro => { this.handler.handleError(erro); });

  }

  /**
   * Retorna a lista de user filtrada ou nao
   * @param filter 
   */
  private filterUser(filter: UserFilter) {
    this.userService.filter(filter)
      .then(result => {
        this.users = result;
        this.totalRecords = this.users.length;
        this.applyPaginator(this.totalRecords);
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  /**
   * Retorna a lista de setor para o dropdown
   */
  private listSector() {
    this.sectorService.listResume()
      .then(result => {
        this.resumeSectors = result;
        //Remove sector default
        this.resumeSectors = this.resumeSectors.filter(obj => obj.code !== 1);
      })
      .catch(erro => { this.handler.handleError(erro); });
  }


  /**
   * Retorna a lista de perfil, 
   * aplica regras para mostrar perfil de acordo
   * com o user tipo de usuario logado
   * cria um lista apenas par o perfil tb de acordo com o user logado 
   */
  private listProfile() {
    this.profileService.listResume()
      .then(result => {
        this.resumeProfiles = result;
        this.applyRuleShowProfile();
      })
      .catch(erro => { this.handler.handleError(erro); });
  }


  /**
   * Retorna a lista de setor baseado no BusinessUnit
   * do registro. Leitura acontece somente qunado o setor logado 
   * eh o default  
   */
  private listSectorBusinessUnit(codeBU: number) {
    if (this.isDefaultSector) {
      this.sectorService.listResumeByBusinessUnit(codeBU)
        .then(result => {
          this.resumeSectors = result;
          //Remove sector default e os inativos
          this.resumeSectors = this.resumeSectors.filter(obj => obj.code !== 1 && obj.status);
        })
        .catch(erro => { this.handler.handleError(erro); });
    }
  }

  /**
   * Retorna a lista de perfil baseado no busines Unit
   * do registro, processo tambem ocorre somente para o setor logado eh default
   */
  private listProfileBusinessUnit(codeBU: number) {
    if (this.isDefaultSector) {
      this.profileService.listResumebyBusinessUnit(codeBU)
        .then(result => {
          this.resumeProfiles = result;
          //Remove profile inativos
          this.resumeProfiles = this.resumeProfiles.filter(obj => obj.status);
          this.applyRuleShowProfile();
        })
        .catch(erro => { this.handler.handleError(erro); });
    }
  }

  /**
   * retorna a lista de unidade de  neogicio para o filtro e 
   * input quando o user logado for o SA
   */
  private listBusinessUnit() {
    this.businessUnitService.listResume()
      .then(result => {
        this.resumeBusinessUnities = result;
        //mostra apenas os ativos
        this.resumeBusinessUnities = this.resumeBusinessUnities.filter(obj => obj.status).sort((a, b) => {
          const A = a.name.toUpperCase();
          const B = b.name.toUpperCase();

          if (A > B) {
            return 1;
          } else if (A < B) {
            return -1;
          } else
            return 0;
        });
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  /**
   * Adiciona um user na API
   */
  private addUser() {
    let user = new User();
    user = this.formInput.value;

    this.userService.save(user)
      .then(result => {
        this.filterUser(this.formFilter.value);
        this.hidenDialogInput();
        if (result.message)
          this.handler.showToastWarn(result.message)
        else
          this.addGrowlInsert();
        this.selectedRowMainTable = result;
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  /**
   * 
   * Atualiza um user na API
   */
  private editUser() {
    let user = new User();
    user = this.formInput.value;

    this.userService.edit(user)
      .then(result => {
        this.filterUser(this.formFilter.value);
        this.hidenDialogInput();
        if (result.message)
          this.handler.showToastWarn(result.message)
        else
          this.addGrowlUpdate();

        this.selectedRowMainTable = result;
        console.log(result.message);
      })
      .catch(erro => {
        if (erro.status === 409) {
          this.handler.unblock();
          let err = this.handler.extractMsgError(erro);
          this.handler.confirmService.confirm({
            message: err,
            accept: () => {
              this.formInput.get('confirm').setValue(true);
              this.editUser();
            }
          });
        } else {
          this.handler.handleError(erro, true);
        }

      });
  }


  private filterGroup(filter: any) {

    this.userGroups = []
    // let ug = new UserGroup();
    // ug.name = '';
    // this.userGroups.push(ug);
    // this.userGroups.push(ug);

    this.userGroupService.filter(filter, false)
      .then(result => {
        this.userGroups = result;
        this.blockedPanelUserGroup = false;
      })
      .catch(err => {
        this.handler.handleError(err);
      });
  }


  /**
   * Prepara os form input e filter
   */
  private prepareForm() {
    this.formFilter = this.formBuilder.group({
      code: [],
      status: [],
      orderBy: [],
      name: [],
      username: [],
      email: [],
      profile: [],
      sector: [],
      businessUnit: []
    });
    this.formInput = this.formBuilder.group({
      code: [],
      status: [],
      name: [],
      username: [],
      email: [],
      profile: [],
      businessUnit: [],
      sectors: [],
      confirmAction: [],
      receiveNotify: [],
      sendNotify: [],
      viewNotify: [],
      windowsAutentication: [],
    });
  }

  /**
   * Reseta o form input e define valores padrao
   */
  private resetForm() {
    this.formInput.reset();
    this.formInput.get('status').setValue(true);
    this.formInput.get('receiveNotify').setValue(false);
    this.formInput.get('sendNotify').setValue(true);
    this.formInput.get('viewNotify').setValue(false);
    this.formInput.get('sectors').enable();
  }
}
