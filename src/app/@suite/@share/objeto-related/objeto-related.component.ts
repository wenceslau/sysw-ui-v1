import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { base } from '../../@base/base';
import { HandlerService } from '../../@services/handler.service';

@Component({
  selector: 'app-objeto-related',
  templateUrl: './objeto-related.component.html',
  styleUrls: ['./objeto-related.component.scss']
})
export class ObjetoRelatedComponent extends base implements OnInit {

  @Input() codeObjeto: any;

  @Input() nameObjeto: any;

  @Input() source: string;


  @ViewChild('opData') overlayPanel: OverlayPanel;



  @Output() hideComponentObjetoRelated = new EventEmitter();


  constructor(public handler: HandlerService) {
    super(handler)
  }

  ngOnInit(): void {
    this.getRelationship();
    this.items = [
      { label: this.label('lbl_abrir'), command: (event) => this.goObjeto() },
      { label: this.label('lbl_detalhe'), command: (event) => this.displayDetail = true },
    ];
  }

  treeObjetosThatDepend: TreeNode[];
  treeObjetosWhichDepend: TreeNode[];
  selectedTree: TreeNode;
  displayTree: boolean;
  displayDetail: boolean;

  items: MenuItem[];          //Itens do menu de contexto     

  //objetosWichDepende: TreeNode[];

  /**
 * Exibe a tela de input
 * @param code Null para insert e valor para edit
 */
  getRelationship() {
  }

  onHideDialog(event: Event) {
    this.displayTree = false;
    this.hideComponentObjetoRelated.emit('');
  }

  goObjeto() {

    if (this.selectedTree && this.selectedTree.data && this.selectedTree.data.objectCode) {

      this.onHideDialog(undefined);

      switch (this.source) {
        case 'objeto':
          this.handler.router.navigate(['/empty/objeto', { id: this.selectedTree.data.objectCode }]);
          break;
        case 'attribute':
          this.handler.share.SysMonkeycodeSelectedObjetoPages = this.selectedTree.data.objectCode
          this.handler.router.navigate(['/empty/attribute']);
          break;
        case 'value':
          this.handler.router.navigate(['/empty/objetoValue', { id: this.selectedTree.data.objectCode }]);
          break;
        default:
          break;
      }
    }

  }

}
