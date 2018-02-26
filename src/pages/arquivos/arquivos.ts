import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams, LoadingController, Platform, ActionSheetController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
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

  // modo sync
  modoSelecao: boolean;
  qtdSelecao: number;

  constructor(public navCtrl: NavController, private toast: ToastController, public navParams: NavParams, private camera: Camera, public loadingCtrl: LoadingController, public platform: Platform, public actionSheetCtrl: ActionSheetController, private geolocation: Geolocation) {
    this.modoSelecao = false;
    this.pastaList = this.navParams.get('pastaList');
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
    let arquivo = new Arquivo();
    //current position
    this.geolocation.getCurrentPosition().then((resp) => {
      arquivo.lat = resp.coords.latitude + '';
      arquivo.long = resp.coords.longitude + '';
    }).catch((error) => { console.log('Error getting location', error); });
    console.log(this.platform.platforms());
    if (this.platform.is('mobileweb') || this.platform.is('core')) {
      console.log('browser');
      arquivo.imagem = "data:image/jpg;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7";
      this.navCtrl.push(ConfirmaImagemPage, { arquivo: arquivo, pastaList: this.pastaList });
    }
    else {
      console.log('device');
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        quality: 100,
        allowEdit: false
      }).then((imageData) => {
        arquivo.imagem = "data:image/jpeg;base64," + imageData;
        this.navCtrl.push(ConfirmaImagemPage, { arquivo: arquivo, pastaList: this.pastaList });
      }, (err) => { console.log(err); });
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
    if (item.selecao) {
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
    this.toast.create({ message: 'Selecione os items para sincronizar.', duration: 3000, position: 'bottom' }).present();
  }

  sync() {
    this.modoSelecao = false;
    //enviar arquivos
  }

}
