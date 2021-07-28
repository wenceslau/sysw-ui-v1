import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { basecomponent } from '../../../../@suite/@base/basecomponent';
import { HandlerService } from '../../../../@suite/@services/handler.service';

import { LanguageModel } from '../../@model/core-model';
import { LanguageService } from '../../@service/language.service'

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent extends basecomponent implements OnInit {

  languages: LanguageModel[]
  formInput: FormGroup;
  formFilter: FormGroup;

  orderBy = [
    { label: 'Chave', value: 'key' },
    { label: 'Portugues', value: 'portugues' },
    { label: 'Ingles', value: 'english' },
    { label: 'Espanhol', value: 'spanish' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public handler: HandlerService,
    public languageService: LanguageService
  ) {
    super(handler)
  }

  ngOnInit() {
    this.prepareForm();
    this.listAll();
  }

  listAll() {
    this.applyPaginator(this.totalRecords);
    this.filter();
  }

  filter() {
    this.filterLanguage();
  }

  clearFilter() {
    this.formFilter.reset();
    this.filter();
  }


  showDialogInput(code: number) {
    this.resetForm();

    if (code) {
      this.languageService.findByCode(code)
        .then(result => {
          this.selectedRowMainTable = result;
          this.formInput.patchValue(result);
          this.displayInput = true;
        })
        .catch(erro => { this.handler.handleError(erro); });

    } else {
      this.displayInput = true;
    }

    this.saved = false;
  }

  saveLanguage() {
    if (this.editing) {
      this.editLanguage();
    } else {
      this.addLanguage();
    }
    this.saved = true;
  }

  /**
 * Evento dos objetos do form de filter
 */
  onChangeFilter() {
    this.filter();
  }

  /**
 * Evento de mudanca de pagina para carregamento sobre demanda dos dados
 * @param event 
 */
  onChangePage(event: LazyLoadEvent) {
    this.currentPage = event.first / event.rows;
    this.filterLanguage();
  }

  get editing() {
    return Boolean(this.formInput.get('code').value);
  }

  private filterLanguage() {
    this.formFilter.get('rowsPerPage').setValue(this.rows);
    this.formFilter.get('page').setValue(this.currentPage);
    this.languageService.filter(this.formFilter.value)
      .then(result => {
        this.languages = result.content;
        this.totalRecords = result.totalElements;
        this.applyPaginator(this.totalRecords);
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private addLanguage() {
    this.languageService.save(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.addGrowlInsert();
        this.filterLanguage();
        this.hidenDialogInput();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private editLanguage() {
    this.languageService.edit(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.addGrowlUpdate();
        this.formInput.patchValue(result);
        this.filterLanguage();
        this.hidenDialogInput();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private prepareForm() {
    this.formFilter = this.formBuilder.group({
      code: [],
      status: [],
      orderBy: [],
      key: [],
      portugues: [],
      english: [],
      spanish: [],
      rowsPerPage: [],
      page: []
    });
    this.formInput = this.formBuilder.group({
      code: [],
      status: [],
      key: [],
      description: [],
      portugues: [],
      english: [],
      spanish: [],
      dateRecord: [],
      dateUpdate: [],
    });

  }

  private resetForm() {
    this.formInput.reset();
    this.formInput.get('status').setValue(true);
  }



}
