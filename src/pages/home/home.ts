import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';

import { FiscalProvider, PastaList } from '../../providers/fiscal/fiscal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  pastas: PastaList[];

  constructor(public navCtrl: NavController, private fiscalProvider: FiscalProvider, private toast: ToastController, private alertCtrl: AlertController) {
    //
  }

  ionViewDidEnter() {
    this.fiscalProvider.getAllPastas()
      .then((result) => {
        this.pastas = result;
      });
    console.log(this.pastas);
  }

  selectItem(item: PastaList) {
    this.navCtrl.push('ArquivosPage', { key: item.key, contact: item.pasta });
  }

  add() {
    this.navCtrl.push('EditPastaPage');
  }

  edit(item: PastaList) {
    this.navCtrl.push('EditPastaPage', { key: item.key, contact: item.pasta });
  }

  remove(item: PastaList) {
    this.fiscalProvider.removePasta(item.key)
      .then(() => {
        // Removendo do array de items
        var index = this.pastas.indexOf(item);
        this.pastas.splice(index, 1);
        this.toast.create({ message: 'Item removido com sucesso.', duration: 3000, position: 'botton' }).present();
      })
  }

  confirmRemove(item: PastaList) {
    let alert = this.alertCtrl.create({
      title: 'Deseja excluir ' + item.pasta.descricao + '?',
      message: 'Os arquivos também serão excluídos!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            //
          }
        },
        {
          text: 'Excluir',
          handler: () => {
            this.remove(item);
          }
        }
      ]
    });
    alert.present();
  }

}
