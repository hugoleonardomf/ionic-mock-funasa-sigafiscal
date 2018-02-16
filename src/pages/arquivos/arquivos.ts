import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public platform: Platform) {
    this.pastaList = this.navParams.get('pastaList');
  }

  ionViewDidEnter() {
    this.arquivos = this.pastaList.pasta.arquivos;
  }

  itemSelected(item: Arquivo) {
    this.navCtrl.push(ConfirmaImagemPage, { arquivo: item, pastaList: this.pastaList });
  }

  takePicture() {
    if (this.platform.is('core')) {
      this.base64Image = "data:image/jpeg;base64," + "TESTE";
      this.navCtrl.push(ConfirmaImagemPage, { base64Image: this.base64Image, pastaList: this.pastaList });
    }
    else {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
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

}
