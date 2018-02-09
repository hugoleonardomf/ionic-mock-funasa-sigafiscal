import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Pasta } from '../../providers/fiscal/fiscal';

@IonicPage()
@Component({
  selector: 'page-arquivos',
  templateUrl: 'arquivos.html',
})

export class ArquivosPage {

  pasta: Pasta;
  key: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pasta = { descricao: "TESTE MOCK", criacao: new Date() };
    //this.pasta = this.navParams.get('pasta');
    //this.key = this.navParams.get('key');
  }

}
