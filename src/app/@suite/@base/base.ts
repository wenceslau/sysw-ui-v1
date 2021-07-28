
import { Directive } from "@angular/core";

import { HandlerService } from "../@services/handler.service";

/**
 * Classe base usada como ancestral para qualquer arquivo .ts
 */
@Directive()
export class base {

    loadingTable: boolean;
    loadingList: boolean;
    loadingInfo: boolean;
    loadingInput: boolean;

    // 2 sinal de igual valida o conteudo
    // 3 sinal de igual valida o conteudo e o tipo

    // let a = 10;
    // a == 10                 //true
    // a == '10'               //true

    // let a = 10;
    // a === 10               //true
    // a === '10'             //false

    constructor(public handler: HandlerService) {
    }

    label(key: string, dft = undefined): string {
        return this.handler.share.getLabel(key, dft);
    }

    /**
     * Retorna se o user logafo tem perfil tipo SA
     */
    get isDefaultSector(): boolean {
        return this.handler.share.isSectorDefault;
    }

    /**
     * Retorna se o user logafo tem perfil tipo SA
     */
    get isSa(): boolean {
        return this.handler.share.isSa;
    }

    /**
     * Retorna se o user logado tem perfi tipo UA
     */
    get isUa(): boolean {
        return this.handler.share.isUa;
    }

    /**
     * Retorna se o user logado tem perfil tipo ADM
     */
    get isAdm(): boolean {
        return this.handler.share.isAdm;
    }

    get innerWidth(): number {
        return window.innerWidth
    }

    isEmpty(value: any) {
        return (value == '')
    }

    isUndefined(value: any) {
        return (value === undefined || value === null)
    }

    isUndefinedOrEmpty(value: any) {
        return (value === undefined || value === null || value == '')
    }

    classDisableInput(value: boolean): string {

        let classes = 'ng-pristine ng-invalid ui-inputtext ui-corner-all ui-state-default ui-widget ng-touched';
        if (value) {
            return classes + ' disableInput';  //classe defininda no arquivo style.css
        }
        return classes;
    }


    classReadonlyDropdow(value: boolean): string {
        if (value)
            return 'readonlyInput';

        return '';
    }



    /**
     * Exibe uma msg no growl espcifico para update
     */
    addGrowlUpdate() {
        this.handler.clearAllMessages();
        let value = this.label('lbl_dados_atualizado_com_s');
        let key = new Date().getTime() + "";
        this.handler.showToastInfo(value, this.label('lbl_sucesso'), 5000)
        //this.handler.messageService.add({ severity: 'custom', summary: '', detail: value, life: 5500 });
        // setTimeout(() => {
        //     this.handler.messageService.clear(key);
        // }, 5500);
    }

    /**
     * Exibe uma msg no growl espcifico para insert
     */
    addGrowlInsert() {
        this.handler.clearAllMessages();
        let value = this.label('lbl_dados_inserido_com_s');
        let key = new Date().getTime() + "";
        this.handler.showToastSuccess(value, this.label('lbl_sucesso'), 5000);
        //this.handler.messageService.add({severity: 'success', summary: '', detail: value, life: 5500 });        
        // setTimeout(() => {
        //     this.handler.messageService.clear(key);
        // }, 5500);
    }
}