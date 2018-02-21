import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, ActionSheetController, LoadingController } from 'ionic-angular';

import { FiscalProvider, PastaList } from '../../providers/fiscal/fiscal';
import { EditPastaPage } from '../edit-pasta/edit-pasta';
import { ArquivosPage } from '../arquivos/arquivos';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  pastas: PastaList[];

  constructor(public navCtrl: NavController, private fiscalProvider: FiscalProvider, private toast: ToastController, private alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController) {
    this.loadData();
  }

  ionViewDidEnter() {
    this.getData();
  }

  private loadData() {
    let loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();
    this.getData();
    loading.dismiss();
  }

  private getData() {
    this.fiscalProvider.getAllPastas()
      .then((result) => {
        this.pastas = result;
        this.sortPastas();
      });
  }

  private sortPastas() {
    this.pastas.sort((a, b) => new Date(b.pasta.criacao).getTime() - new Date(a.pasta.criacao).getTime());
  }

  itemSelected(item: PastaList) {
    item.pasta.arquivos.reverse();
    this.navCtrl.push(ArquivosPage, { pastaList: item });
  }

  addPasta() {
    this.navCtrl.push(EditPastaPage);
  }

  editPasta(item: PastaList) {
    this.navCtrl.push(EditPastaPage, { key: item.key, pasta: item.pasta });
  }

  removePasta(item: PastaList) {
    this.fiscalProvider.removePasta(item.key)
      .then(() => {
        // Removendo do array de items
        var index = this.pastas.indexOf(item);
        this.pastas.splice(index, 1);
        this.toast.create({ message: 'Item removido com sucesso.', duration: 3000, position: 'botton' }).present();
      })
  }

  confirmRemovePasta(item: PastaList) {
    let alert = this.alertCtrl.create({
      title: 'Deseja excluir ' + item.pasta.descricao + '?',
      message: 'Todos os arquivos também serão excluídos!',
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
            this.removePasta(item);
          }
        }
      ]
    });
    alert.present();
  }

  opcoesActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'O que deseja fazer?',
      buttons: [
        {
          text: 'Adicionar Pasta',
          handler: () => {
            this.addPasta();
          }
        },
        {
          text: 'Sobre o aplicativo',
          handler: () => {
            this.showAlert();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Sobre',
      subTitle: '...',
      buttons: ['OK']
    });
    alert.present();
  }  

}
