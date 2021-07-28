import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HandlerService } from '../../../../@suite/@services/handler.service';
import { DataListService } from '../../@service/data-list.service';
import { basecomponent } from '../../../../@suite/@base/basecomponent';
import { DataList, ItemDataList } from '../../@model/core-model';


@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent extends basecomponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private listaService: DataListService,
    public handler: HandlerService
  ) {
    super(handler)
  }

  listaDataList: DataList[];
  listaItemDataList: ItemDataList[];
  selectedDataList: DataList;
  formInput: FormGroup;

  ngOnInit() {
    //this.share.navigation = this.handler.moduleLabel('DATA_LIST');
    this.prepareForm();
    this.listDataList();
  }

  /**
   * Exibe a tela de input
   * @param code Null para insert e valor para edit
   */
  showDialogInput(code: number) {
    this.resetForm();
    if (code) {
      this.listaService.findItemDataListByCode(code)
        .then(result => {
          this.selectedRowMainTable = result;
          this.formInput.patchValue(result);
          this.displayInput = true;
        })
        .catch(erro => { this.handler.handleError(erro); });
    } else {
      this.displayInput = true;
    }
  }

  onChangeLista() {
    console.log('selectedDataList' + this.selectedDataList);
    if (this.selectedDataList) {
      this.listDataItemList();
    }
    else {
      this.listaItemDataList = [];
    }
  }

  /**
   * Insere ou edita o registro
   * chamado pelo botao salvar da tela
   */
  saveLista() {
    if (this.editing) {
      this.editItem();
    } else {
      this.formInput.get("dataList").setValue(this.selectedDataList);
      this.addItem();
    }
    this.saved = true;
  }

  /**
   * Verifica se eh edicao ou insert
   */
  get editing() {
    return Boolean(this.formInput.get('code').value);
  }

  get scrollHeightTabl(): string {
    return window.innerHeight - 255 + 'px';
  }

  private listDataList() {
    this.listaService.listDataList()
      .then(result => {
        this.listaDataList = result;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private listDataItemList() {
    if (!this.selectedDataList)
      return;
    this.listaService.allItemByDataListName(this.selectedDataList.name)
      .then(result => {
        this.listaItemDataList = result;
        this.totalRecords = this.listaItemDataList.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private addItem() {
    this.listaService.saveItemDataList(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.hidenDialogInput();
        this.addGrowlInsert();
        this.listDataItemList();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private editItem() {
    this.listaService.editItemDataList(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.hidenDialogInput();
        this.addGrowlUpdate();
        this.listDataItemList();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  /**
 * Inicializa o form builder
 */
  private prepareForm() {
    this.formInput = this.formBuilder.group({
      code: [],
      status: [],
      group: [],
      labelItem: [],
      valueItem: [],
      description: [],
      dataList: [],
    });
  }

  /**
 * Reseta o form input e define valores padrao
 */
  private resetForm() {
    this.formInput.reset();
    this.formInput.get('status').setValue(true);
  }

}
