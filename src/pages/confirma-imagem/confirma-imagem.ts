import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FiscalProvider, PastaList, Arquivo } from '../../providers/fiscal/fiscal';
import { DatePipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-confirma-imagem',
  templateUrl: 'confirma-imagem.html',
})

export class ConfirmaImagemPage {

  model: Arquivo;
  pastaList: PastaList;
  base64Image: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fiscalProvider: FiscalProvider, private datepipe: DatePipe) {
    this.base64Image = this.navParams.get('base64Image');
    this.pastaList = this.navParams.get('pastaList');
    this.model = this.navParams.get('arquivo') ? this.model = this.navParams.get('arquivo') : new Arquivo();
  }

  save() {
    this.saveImagem()
      .then(() => {
        this.navCtrl.pop();
      })
      .catch(() => {
        console.log('erro');
      });
  }

  private saveImagem() {
    if (!this.model.id) { //update
      this.model.id = this.datepipe.transform(new Date(), "ddMMyyyyHHmmss");
      this.model.imagem = this.base64Image;
      this.model.criacao = new Date();
      this.pastaList.pasta.arquivos.push(this.model);
    }
    return this.fiscalProvider.updatePasta(this.pastaList.key, this.pastaList.pasta);
  }

}
