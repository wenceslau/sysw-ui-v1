import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HandlerService } from '../../../../@suite/@services/handler.service';
import { ApplicationService } from '../../@service/application.service';
import { basecomponent } from '../../../../@suite/@base/basecomponent';
import { ApplicationModel } from '../../@model/core-model';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent  extends basecomponent implements OnInit {


  applications: ApplicationModel[]
  formInput: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ApplicationService: ApplicationService,
    public handler: HandlerService
  ) { 
    super(handler)
  }

  ngOnInit() {
    this.prepareForm();
    this.initListApplication();
  }

  applyfilter() {
    this.filterApplication();
  }

  showDialogInput(code: number) {
    this.resetForm();

    if (code) {
      this.ApplicationService.findByCode(code)
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

  initListApplication() {
    this.filterApplication();
  }

  saveApplication() {
    if (this.editing) {
      this.editApplication();
    } else {
      this.addApplication();
    }
    this.saved = true;
  }

  get editing() {
    return Boolean(this.formInput.get('code').value);
  }

  private filterApplication() {
    this.ApplicationService.filter()
      .then(result => {
        this.applications = result;
        this.totalRecords = this.applications.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private addApplication() {
    this.ApplicationService.save(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.addGrowlInsert();
        this.filterApplication();
        this.hidenDialogInput();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private editApplication() {
    this.ApplicationService.edit(this.formInput.value)
      .then(result => {  
        this.selectedRowMainTable = result;
        this.addGrowlUpdate();
        this.formInput.patchValue(result);
        this.filterApplication();
        this.hidenDialogInput();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private prepareForm() {
    this.formInput = this.formBuilder.group({
      code: [],
      status: [],
      name: [],
      displayName: [],
      nameModuleSource: [],
      image: [],
      mainColor: [],
      licence: [],
      dateInitializer: [],
      main: []
    });

  }

  private resetForm() {
    this.formInput.reset();
    this.formInput.get('status').setValue(true);
  }

}
