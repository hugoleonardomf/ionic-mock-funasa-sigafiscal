import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/map';

@Injectable()
export class FiscalProvider {

  constructor(public http: HttpClient, private storage: Storage, private datepipe: DatePipe) { }

  //PASTAS
  public insertPasta(pasta: Pasta) {
    let key = this.datepipe.transform(new Date(), "ddMMyyyyHHmmss");
    pasta.criacao = new Date();
    pasta.arquivos = new Array<any>();
    return this.savePasta(key, pasta);
  }

  public updatePasta(key: string, pasta: Pasta) {
    return this.savePasta(key, pasta);
  }

  private savePasta(key: string, pasta: Pasta) {
    pasta.descricao = pasta.descricao.toUpperCase();
    return this.storage.set(key, pasta);
  }

  public removePasta(key: string) {
    return this.storage.remove(key);
  }

  public getAllPastas() {
    let pastas: PastaList[] = [];
    return this.storage.forEach((value: Pasta, key: string, iterationNumber: Number) => {
      let pasta = new PastaList();
      pasta.key = key;
      pasta.pasta = value;
      pastas.push(pasta);
    })
      .then(() => {
        pastas.reverse();
        return Promise.resolve(pastas);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
}

export class Pasta {
  descricao: string;
  criacao: Date;
  arquivos: Arquivo[];
}

export class PastaList {
  key: string;
  pasta: Pasta;
}

export class Arquivo {
  id: string;
  imagem: string;
  descricao: string;
  criacao: Date;
  selecao: boolean;
}
