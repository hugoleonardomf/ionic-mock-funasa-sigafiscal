import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPastaPage } from './edit-pasta';

@NgModule({
  declarations: [
    EditPastaPage,
  ],
  imports: [
    IonicPageModule.forChild(EditPastaPage),
  ],
})
export class EditPastaPageModule {}
