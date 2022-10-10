import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnumTipoEscolaridade } from '../models/enums/escolaridade.enum';
import { Paginacao } from '../models/paginacao.model';
import { Usuario } from '../models/usuario.model';
import { environment as Config } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  readonly urlApiUsuario = Config.URL_API_PORTAL_USUARIO + "usuario/";

  constructor(
    private httpClient: HttpClient
  ) { }

  obterUsuariosPaginado(
    pagina: number, paginaQuantidade: number,
    nome: string | null | undefined,
    sobrenome: string | null | undefined,
    email: string | null | undefined,
    escolaridade?: EnumTipoEscolaridade | string | null | undefined
  ) {
    let urlApi = this.urlApiUsuario + `?pagina=${pagina}&paginaQuantidade=${paginaQuantidade}`;
    if (nome) {
      urlApi += `&nome=${nome}`
    }
    if (sobrenome) {
      urlApi += `&sobrenome=${sobrenome}`
    }
    if (email) {
      urlApi += `&email=${email}`
    }
    if (escolaridade != null) {
      urlApi += `&escolaridade=${escolaridade}`
    }

    return this.httpClient.get<Paginacao<Usuario>>(urlApi);
  }

  obterUsuarioPorId(id: number) {
    return this.httpClient.get<Usuario>(this.urlApiUsuario + `${id}`);
  }

  cadastrarUsuario(model: Usuario) {
    return this.httpClient.post<Usuario>(this.urlApiUsuario, model);
  }

  alterarUsuario(model: Usuario) {
    return this.httpClient.put<Usuario>(this.urlApiUsuario, model);
  }

  excluirUsuario(id: number) {
    return this.httpClient.delete<boolean>(this.urlApiUsuario + `${id}`);
  }
}
