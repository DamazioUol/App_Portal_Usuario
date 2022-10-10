import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Paginacao } from 'src/app/models/paginacao.model';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.css']
})
export class UsuarioListaComponent implements OnInit {
  displayedColumns = [
    "nome", "sobrenome",
    "dtNasc", "escolaridade", "email",
    "alter", "delete",
  ]

  listaEscolaridade = [
    { valor: null, texto: "Todos" },
    { valor: 0, texto: "Infantil" },
    { valor: 1, texto: "Fundamental" },
    { valor: 2, texto: "Médio" },
    { valor: 3, texto: "Superior" },
  ]

  lista: Paginacao<Usuario> = {
    itens: [],
    paginaQuantidade: 10,
    pagina: 1,
    total: 0
  };

  formFiltro = this._formBuilder.group({
    nome: new FormControl(''),
    sobrenome: new FormControl(''),
    email: new FormControl(''),
    escolaridade: new FormControl(null)
  });

  carregandoLista: boolean = false;

  constructor(
    private usuarioSrv: UsuarioService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.obterListaUsuario();
  }

  obterListaUsuario() {
    this.carregandoLista = true;
    this.lista.itens = [];

    this.usuarioSrv.obterUsuariosPaginado(
      this.lista.pagina, this.lista.paginaQuantidade,
      this.formFiltro.value.nome,
      this.formFiltro.value.sobrenome,
      this.formFiltro.value.email,
      this.formFiltro.value.escolaridade,
    ).subscribe((paginacao) => {
      this.carregandoLista = false;
      this.lista = paginacao;
    }, err => {
      this.carregandoLista = false;
      console.error("Falha ao buscar lista de usuários", err);
      this._snackBar.open("Falha ao buscar lista de usuários", "Fechar", {
        duration: 3000
      })
    })
  }

  paginar(event: any) {
    console.log(event);

    if (this.lista.paginaQuantidade == event.pageSize) {
      if (event.pageIndex > event.previousPageIndex) {
        this.lista.pagina++;
      } else {
        this.lista.pagina--;
      }
    }

    this.lista.paginaQuantidade = event.pageSize;
    this.obterListaUsuario();
  }

  excluirUsuario(id: number) {
    this.carregandoLista = false;

    this.usuarioSrv.excluirUsuario(id).subscribe(res => {
      this.obterListaUsuario();
    }, err => {
      this.carregandoLista = false;
      console.error("Falha ao excluir usuário", err);
      this._snackBar.open("Falha ao excluir usuário", "Fechar", {
        duration: 3000
      })
    })
  }

  obterDescricaoEscolaridade(escolaridade: number) {
    switch (escolaridade) {
      case 0:
        return "Infantil";
      case 1:
        return "Fundamental";
      case 2:
        return "Médio";
      case 3:
        return "Superior";
      default:
        return "Não encontrado";
    }
  }

  pesquisar() {
    this.lista.pagina = 1;
    this.lista.paginaQuantidade = 10;
    this.obterListaUsuario();
  }

}
