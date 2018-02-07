import { Component } from '@angular/core';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { Geolocation } from '@ionic-native/geolocation';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  lastImage: string = null;

  location: any;
  lat: number = 0;
  lng: number = 0;

  lista: any = [];

  constructor(public navCtrl: NavController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, private geolocation: Geolocation, private sqlite: SQLite) {
    //
  }

  ionViewDidLoad() {
    this.getData();
  }

  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS pastas(rowid INTEGER PRIMARY KEY, descricao, date TEXT)', {})
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
      db.executeSql('INSERT INTO pastas(rowid, descricao, date) VALUES(10, "descricao", "data")', {})
        .then(res => console.log('Executed SQL 2'))
        .catch(e => console.log(e));
      db.executeSql('INSERT INTO pastas(rowid, descricao, date) VALUES(20, "descricao", "data")', {})
        .then(res => console.log('Executed SQL 2'))
        .catch(e => console.log(e));
      db.executeSql('SELECT * FROM pastas ORDER BY rowid DESC', {})
        .then(res => {
          this.lista = [];
          for (var i = 0; i < res.rows.length; i++) {
            this.lista.push({ rowid: res.rows.item(i).rowid, descricao: res.rows.item(i).descricao, date: res.rows.item(i).date })
          }
        })
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  onLocateUser() {
    this.geolocation.getCurrentPosition()
      .then(
      (location) => {
        console.log('position gotten: long:', location.coords.longitude, ' lat:', location.coords.latitude);
        this.location = location;
        this.lat = location.coords.latitude;
        this.lng = location.coords.longitude;
      }
      )
      .catch(
      (error) => {
        console.log('Error getting location', error);
      }
      )

  }

  clearAll() {
    this.lastImage = null;
    this.location = null;
    this.lat = 0;
    this.lng = 0;
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Selecionar fonte de imagem',
      buttons: [
        {
          text: 'Abrir da Biblioteca',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Usar Câmera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Geolocation
    this.onLocateUser();

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

}
