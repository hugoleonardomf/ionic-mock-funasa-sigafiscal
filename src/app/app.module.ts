import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { DatePipe } from '@angular/common';

import { FiscalProvider } from '../providers/fiscal/fiscal';

import { EditPastaPage } from '../pages/edit-pasta/edit-pasta';
import { ArquivosPage } from '../pages/arquivos/arquivos';
import { ConfirmaImagemPage } from '../pages/confirma-imagem/confirma-imagem';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EditPastaPage,
    ArquivosPage,
    ConfirmaImagemPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      mode: 'md'
    }),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EditPastaPage,
    ArquivosPage,
    ConfirmaImagemPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClientModule,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Camera,
    DatePipe,
    FiscalProvider
  ]
})
export class AppModule { }
