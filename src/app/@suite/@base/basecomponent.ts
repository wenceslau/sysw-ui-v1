
import { Table } from "primeng/table";
import { ViewChild, Directive } from "@angular/core";

import { HandlerService } from "../@services/handler.service";
import { base } from './base';


/**
 * Classe ussada como ancestral para todo componente
 */
@Directive()
export class basecomponent extends base {

    @ViewChild('table') table: Table;
    selectedRowMainTable: any;

    innerHeight: number;            // Tamaho do screem interno do browser
    paginator: boolean;             // Paginacao do grid principal
    paginatorSec: boolean;          // Paginacao do grid secundario
    rows: number;                   // Numeros de linhas para paginacao do grid principal
    currentPage: number             // Pagina corrente em que o usuario esta, ao inserir ou atualizar volta pra mesma pagina
    totalRecords: number;           // total de registros do grid principal
    listPageable: boolean = true;   // Define se a lista do grid eh paginada ou nao

    blockSpace: RegExp = /[^\s]/;   // Regex paa Bloquear espacos

    displayInput: boolean;          // Exibe o dialog de input
    saved: boolean;                 // Usada para emitir msg de fechamento sem salvar

    displayHistory: boolean;        // Exibte a tela de historico do registro
    descriptionObject: string;      // Descricao do objeto ser passado para tela de historico
    nameObject: string;             // nome do objeto className do java
    idRecord: number;               // ID, code do registro
    hashObject: string;               // ID, code do registro

    filtered: boolean;               // Usada para emitir msg de fechamento sem salvar

    status = [
        { label: this.label('lbl_ativo'), value: true },
        { label: this.label('lbl_inativo'), value: false },
    ];

    ptCalendar = {
        firstDayOfWeek: 0,
        dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
        dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
        dayNamesMin: ["Do", "2ª", "3ª", "4ª", "5ª", "6ª", "Sa"],
        monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        today: 'Hoje',
        clear: 'Limpar',
        dateFormat: 'dd/mm/yy',
        weekHeader: 'Wk'
    };

    constructor(public handler: HandlerService) {
        super(handler);
        this.rows = 0;
        this.currentPage = 0;
        this.totalRecords = 0;
        this.paginator = false;
    }

    reset() {
        this.currentPage = 0;
        this.totalRecords = 0;
    }

    /**
     * Exibe o componene de historico do registro
     * @param code codigo do registro
     * @param descriptionObject descricao a ser mostrada no dialog
     * @param nameObject nome do objeto, classe java para filtro do historico
     */
    showComponentHistory(row: any, code: number, descriptionObject: string, nameObject: string, hashObject = null) {
        console.log('showComponentHistory ' + nameObject);
        console.log('showComponentHistory ' + descriptionObject);
        console.log('showComponentHistory ' + code);
        this.descriptionObject = descriptionObject;
        this.nameObject = nameObject;
        this.idRecord = code;
        this.hashObject = hashObject
        this.displayHistory = true;
        this.selectedRowMainTable = row;
    }

    /**
     * Evento disparado no close do dialog do componente history para fechar
     * @param event 
     */
    hideComponentHistoryEvent(event: Event) {
        this.displayHistory = false;
    }

    /**
     * chamado pelo botao fechar das telas de input
     */
    hidenDialogInput() {
        setTimeout(() => {
            this.displayInput = false;
        }, 100);
    }

    /**
     * Evento disparado quando fechado as telas de input
     * o evento eh disparado quando definido a variavel displayInput para false
     * @param event 
     */
    onHideDialogInput(event: Event) {

    }

    /**
     * Retorna true ou false para a role informada
     * Verifica no authorizer no jwtpayload se a role 
     * existe para o usuario logado
     * @param role 
     */
    canDisable(role: string) {
        if (this.handler.share.auth)
            return !this.handler.share.auth.hasPermission(role);
    }

    /**
     * Aplica ou nao paginacao no grid baseado no numero de linhas
     * @param numberRows 
     * @param subtractOnRows 
     */
    applyPaginator(numberRows: number, subtractHeight = 0, subtractOnRows = 0) {
        //console.log('applyPaginator');
        this.innerHeight = window.innerHeight
        this.paginator = false;
        subtractOnRows = this.numRowsSub(subtractHeight) + subtractOnRows;
        //Calcula a qtd de linhas necessaria para paginar o grid
        this.rows = this.calculePaginator(innerHeight, subtractOnRows);
        if (numberRows > this.rows)
            this.paginator = true;

        console.log('InnerHeight: ' + innerHeight + ', SubtractHeight: ' + subtractHeight + ', SubtractOnRows: ' + subtractOnRows + ', Rows: ' + this.rows)
    }

    /**
     * Calcula a quantidade de linhas por pagina necessaria para paginar 
     * o grid baseado no tamanho da tela interna no browser
     * @param subtractOnRows
     */
    calculePaginator(height, subtractOnRows): number {
        this.innerHeight = window.innerHeight
        let rows;

        //console.log( this.innerHeight);
        //subtractOnRows = subtractOnRows - 1;

        if (this.isBetween(height, 100, 344))
            rows = (2 - subtractOnRows);

        else if (this.isBetween(height, 344, 374))
            rows = (3 - subtractOnRows);

        else if (this.isBetween(height, 374, 404))
            rows = (3 - subtractOnRows);

        else if (this.isBetween(height, 404, 434))
            rows = (4 - subtractOnRows);

        else if (this.isBetween(height, 434, 464)) // 600/0
            rows = (5 - subtractOnRows);

        else if (this.isBetween(height, 464, 494)) // 600/1
            rows = (6 - subtractOnRows);

        else if (this.isBetween(height, 494, 524))
            rows = (7 - subtractOnRows);

        else if (this.isBetween(height, 524, 554))
            rows = (7 - subtractOnRows);

        else if (this.isBetween(height, 554, 584)) // 720/0
            rows = (8 - subtractOnRows);

        else if (this.isBetween(height, 584, 614)) // 720/1
            rows = (9 - subtractOnRows);

        else if (this.isBetween(height, 614, 644)) // 768/0
            rows = (10 - subtractOnRows);

        else if (this.isBetween(height, 644, 673)) // 768/1 e 800/0
            rows = (11 - subtractOnRows);

        else if (this.isBetween(height, 673, 707)) // 800/1
            rows = (12 - subtractOnRows);

        else if (this.isBetween(height, 707, 732)) // 721/0
            rows = (12 - subtractOnRows);

        else if (this.isBetween(height, 732, 760)) // 864/1 e 900/0
            rows = (13 - subtractOnRows);

        else if (this.isBetween(height, 760, 791)) // 900/1
            rows = (14 - subtractOnRows);

        else if (this.isBetween(height, 791, 818)) // 960/0
            rows = (15 - subtractOnRows);

        else if (this.isBetween(height, 818, 843))
            rows = (15 - subtractOnRows);

        else if (this.isBetween(height, 843, 856)) // 960/1
            rows = (16 - subtractOnRows);

        else if (this.isBetween(height, 856, 883)) // 1024/0
            rows = (17 - subtractOnRows);

        else if (this.isBetween(height, 883, 913)) // 1050/0
            rows = (17 - subtractOnRows);

        else if (this.isBetween(height, 913, 943)) // 1024/1 e 1050/1 e 1080/0
            rows = (18 - subtractOnRows);

        else if (this.isBetween(height, 943, 973)) // 1080/1
            rows = (19 - subtractOnRows);

        else if (this.isBetween(height, 973, 1003))
            rows = (20 - subtractOnRows);

        else if (this.isBetween(height, 1003, 1033))
            rows = (21 - subtractOnRows);

        else if (this.isBetween(height, 1033, 1063))
            rows = (22 - subtractOnRows);

        else if (this.isBetween(height, 1063, 1093))
            rows = (23 - subtractOnRows);

        else if (this.isBetween(height, 1093, 1123))
            rows = (24 - subtractOnRows);

        else if (this.isBetween(height, 1123, 1153))
            rows = (25 - subtractOnRows);

        else if (this.isBetween(height, 1153, 1183))
            rows = (26 - subtractOnRows);

        else if (this.isBetween(height, 1183, 1213))
            rows = (27 - subtractOnRows);

        else
            rows = (28 - subtractOnRows);

        return rows;
    }

    /**
     * Retorna uma classe ou uma sequencia de classes CSS
     * para formatar o input de um campo readonly
     * Por um bug nao identificado, quando se passa a string literal 'true'
     * o inout mante as classes ja existentes, quando passado uma variavel
     * que contenha true, o input perde as classes. Assin o tipo eh usado para
     * concatenar ou nao as classes ja existentes
     * @param value Valor boleado que define se o input deve ou nao ser formatado
     * @param type tipo 1 concatena classes existente, 2 define apenas classe de disable
     */
    classReadonlyInput(value: boolean, type: number): string {

        let classes = 'ng-untouched ng-pristine ui-inputtext ui-corner-all ui-state-default ui-widget ng-valid ui-state-filled';
        if (value) {
            if (type === 1)
                return 'readonlyInput ' + classes;
            else
                return 'disableInput';  //classe defininda no arquivo style.css
        }
        return classes;
    }

    classRowInactive(classAppend: string, value: boolean): string {
        //Se o ststus for false
        if (!value)
            return classAppend + ' c-grid-row-inactive';
        return classAppend;
    }

    classLinkInactive(status: boolean): string {
        //Se o ststus for false
        if (!status)
            return 'linkInactive';

        return 'linkActive';
    }

    classLinkInactiveValidity(endValidity: any, status: boolean): string {
        //Se o ststus for false
        if (!status)
            return 'c-grid-row-link-Inactive';

        if (endValidity)
            return 'c-grid-row-end-validity';

        return '';
    }

    descriptionItemDataList(value: string, list: any[]): string {

        if (list && value != undefined && value != null) {
            let item = list.find(x => x.value === value)
            if (item)
                return item.label;
        }
        return 'unknow';
    }

    private numRowsSub(subtractHeight): number {

        if (subtractHeight == 0)
            return 0;

        if (this.isBetween(subtractHeight, 38, 93)) {
            return 1;
        } else if (this.isBetween(subtractHeight, 94, 129)) {
            return 2;
        } else if (this.isBetween(subtractHeight, 129, 165)) {
            return 3;
        } else if (this.isBetween(subtractHeight, 165, 202)) {
            return 4;
        } else if (this.isBetween(subtractHeight, 202, 238)) {
            return 5;
        }

        return 0;
    }

    private isBetween(height: number, n1: number, n2: number) {
        //return (this.innerHeight >= n1 && this.innerHeight < n2);
        if (height >= n1 && height < n2) {
            console.log('isBetween: N1: ' + n1 + ' N2: ' + n2);
            return true;
        }
        return false;
    }

    public isNumber(event) {
        if (event.target.value.length < 9)
            return ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode == 13)
        else
            return false;
    }

    public isLetter(event) {
        return ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || event.keyCode == 13)
    }

    windowInnerHeightForScrool() {
        return (window.innerHeight - 150) + 'px';
    }

    windowInnerHeightContainerPageContaint() {
        return (window.innerHeight - 97) + 'px';
    }

}



