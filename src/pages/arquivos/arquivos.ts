import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, LoadingController, Platform, ActionSheetController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Arquivo, PastaList } from '../../providers/fiscal/fiscal';
import { ConfirmaImagemPage } from '../confirma-imagem/confirma-imagem';

@IonicPage()
@Component({
  selector: 'page-arquivos',
  templateUrl: 'arquivos.html',
})

export class ArquivosPage {

  arquivos: Arquivo[];
  pastaList: PastaList;
  base64Image: string;

  modoSelecao: boolean;
  qtdSelecao: number;

  constructor(public navCtrl: NavController, private toast: ToastController, public navParams: NavParams, private camera: Camera, public loadingCtrl: LoadingController, public platform: Platform, public actionSheetCtrl: ActionSheetController) {
    this.modoSelecao = false;
    if (this.navParams.get('pastaList')) {
      this.pastaList = this.navParams.get('pastaList');
    }
    this.loadData();
  }

  ionViewDidEnter() {
    this.sortArquivos();
  }

  private loadData() {
    let loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();
    this.arquivos = this.pastaList.pasta.arquivos;
    loading.dismiss();
  }

  private sortArquivos() {
    this.arquivos.sort((a, b) => new Date(b.criacao).getTime() - new Date(a.criacao).getTime());
  }

  itemSelected(item: Arquivo) {
    this.navCtrl.push(ConfirmaImagemPage, { arquivo: item, pastaList: this.pastaList });
  }

  takePicture() {
    if (this.platform.is('mobileweb') || this.platform.is('core')) { //browser - ionic serve
      this.base64Image = "data:image/jpg;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7";
      this.navCtrl.push(ConfirmaImagemPage, { base64Image: this.base64Image, pastaList: this.pastaList });
    }
    else {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        quality: 100,
        allowEdit: false,
        //targetWidth: 1000,
        //targetHeight: 1000
      }).then((imageData) => {
        // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.navCtrl.push(ConfirmaImagemPage, { base64Image: this.base64Image, pastaList: this.pastaList });
      }, (err) => {
        console.log(err);
      });
    }
  }

  opcoesActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      //title: 'O que deseja fazer?',
      buttons: [
        {
          text: 'Adicionar Foto',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Sincronizar',
          handler: () => {
            this.preparaSync();
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

  setItemSync(item: Arquivo) {
    if(item.selecao) {
      item.selecao = false;
      this.qtdSelecao--;
    }
    else {
      item.selecao = true;
      this.qtdSelecao++;
    }
  }

  cancelarSync() {
    this.modoSelecao = false;
    //limpar lista seleção
  }

  preparaSync() {
    this.modoSelecao = true;
    this.qtdSelecao = 0;
    for (let i of this.arquivos) {
      i.selecao = false;
    }
    this.toast.create({ message: 'Selecione os items para sincronizar.', duration: 3000, position: 'top' }).present();
  }

  sync() {
    this.modoSelecao = false;
    //enviar arquivos
  }

}
