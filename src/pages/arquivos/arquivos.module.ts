import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArquivosPage } from './arquivos';

@NgModule({
  declarations: [
    ArquivosPage,
  ],
  imports: [
    IonicPageModule.forChild(ArquivosPage),
  ],
})
export class ArquivosPageModule {}
