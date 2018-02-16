import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FiscalProvider, Pasta } from '../../providers/fiscal/fiscal';

@IonicPage()
@Component({
  selector: 'page-edit-pasta',
  templateUrl: 'edit-pasta.html',
})
export class EditPastaPage {

  model: Pasta;
  key: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fiscalProvider: FiscalProvider, private toast: ToastController) {
    if (this.navParams.data.pasta && this.navParams.data.key) {
      this.model = this.navParams.data.pasta;
      this.key = this.navParams.data.key;
    } else {
      this.model = new Pasta();
    }
  }

  save() {
    this.savePasta()
      .then(() => {
        this.toast.create({ message: 'Item salvo com sucesso.', duration: 3000, position: 'botton' }).present();
        this.navCtrl.pop();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao salvar o item.', duration: 3000, position: 'botton' }).present();
      });
  }

  private savePasta() {
    if (this.key) {
      return this.fiscalProvider.updatePasta(this.key, this.model);
    } else {
      return this.fiscalProvider.insertPasta(this.model);
    }
  }

}
