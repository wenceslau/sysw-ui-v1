import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HandlerService } from '../../../../@suite/@services/handler.service';
import { Parameter } from '../../@model/core-model';
import { ParameterService } from '../../@service/parameter.service';
import { basecomponent } from '../../../../@suite/@base/basecomponent';


@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.scss']
})
export class ParameterComponent extends basecomponent implements OnInit {

  parameters: Parameter[]
  formInput: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ParameterService: ParameterService,
    public handler: HandlerService,

  ) {
    super(handler)
  }

  ngOnInit() {
    this.prepareForm();
    this.initListParameter();
  }

  filter() {
    this.listParameters();
  }

  showDialogInput(code: number) {
    this.resetForm();

    if (code) {
      this.ParameterService.findByCode(code)
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

  initListParameter() {
    this.listParameters();
  }

  saveParameter() {
    if (this.editing) {
      this.editParameter();
    } else {
      this.addParameter();
    }
    this.saved = true;
  }

  get editing() {
    return Boolean(this.formInput.get('code').value);
  }

  get scrollHeightTable(): string {
    return window.innerHeight - 250 + 'px';
  }

  private listParameters() {
    this.ParameterService.filter(null)
      .then(result => {
        // Listas pageables, o retorno esta dentro do content
        this.parameters = result;
        this.totalRecords = this.parameters.length;
      })
      .catch(erro => {
        this.handler.handleError(erro);
      });
  }

  private addParameter() {
    this.ParameterService.save(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.addGrowlInsert();
        this.listParameters();
        this.hidenDialogInput();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private editParameter() {
    this.ParameterService.edit(this.formInput.value)
      .then(result => {
        this.selectedRowMainTable = result;
        this.addGrowlUpdate();
        this.formInput.patchValue(result);
        this.listParameters();
        this.hidenDialogInput();
      })
      .catch(erro => { this.handler.handleError(erro, true); });
  }

  private prepareForm() {
    this.formInput = this.formBuilder.group({
      code: [],
      status: [],
      group: [],
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
