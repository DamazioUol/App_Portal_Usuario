import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-usuario-formulario',
  templateUrl: './usuario-formulario.component.html',
  styleUrls: ['./usuario-formulario.component.css'],
  providers: [
    { provide: MY_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})

export class UsuarioFormularioComponent implements OnInit {
  textoBotao: string = "Salvar";

  listaEscolaridade = [
    { valor: 0, texto: "Infantil" },
    { valor: 1, texto: "Fundamental" },
    { valor: 2, texto: "Médio" },
    { valor: 3, texto: "Superior" },
  ];

  formularioUsuario = this._formBuilder.group({
    nome: new FormControl('', [Validators.required, Validators.minLength(5)]),
    sobrenome: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    dataNascimento: new FormControl("", [Validators.required]),
    escolaridade: new FormControl(0, [Validators.required]),
  });

  idUsuario: number = 0;
  carregandoUsuario: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    public location: Location,
    private usuarioSrv: UsuarioService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.idUsuario = params.id;
      if (this.idUsuario) {
        this.carregandoUsuario = true;
        this.textoBotao = "Alterar";
        this.obterUsuario();
      }
    });
  }

  obterUsuario() {
    this.usuarioSrv.obterUsuarioPorId(this.idUsuario).subscribe(usuario => {
      this.formularioUsuario.setValue({
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        dataNascimento: moment(usuario.dataNascimento).format(),
        email: usuario.email,
        escolaridade: usuario.escolaridade
      });
      this.carregandoUsuario = false;
    }, err => {
      this.carregandoUsuario = false;
      console.error("Falha ao buscar dados do usuários", err);
      this._snackBar.open("Falha ao buscar dados do usuários", "Fechar", {
        duration: 3000
      })
    });
  }

  operacao() {
    if (this.formularioUsuario.valid) {
      this.carregandoUsuario = true;

      if (this.textoBotao == "Salvar") {
        this.salvarCadastro();
      } else {
        this.alterarCadastro();
      }
    }
  }

  salvarCadastro() {
    this.usuarioSrv.cadastrarUsuario(this.obterModeloUsuario()).subscribe(res => {
      this.carregandoUsuario = false;
      this.location.back();
    }, err => {
      this.carregandoUsuario = false;
      let mensagemErro = "Falha ao cadastrar usuário";
      console.error(mensagemErro, err);

      if (err.error.length > 0) {
        mensagemErro = err.error[0].mensagem;
      }
      this._snackBar.open(mensagemErro, "Fechar", {
        duration: 3000
      })
    })
  }

  obterModeloUsuario(): Usuario {
    return {
      id: this.idUsuario,
      nome: this.formularioUsuario.value.nome || "",
      sobrenome: this.formularioUsuario.value.sobrenome || "",
      email: this.formularioUsuario.value.email || "",
      escolaridade: this.formularioUsuario.value.escolaridade || 0,
      dataNascimento: new Date(this.formularioUsuario.value.dataNascimento || new Date()),
    }
  }

  alterarCadastro() {
    this.usuarioSrv.alterarUsuario(this.obterModeloUsuario()).subscribe(res => {
      this.carregandoUsuario = false;
      this.location.back();
    }, err => {
      this.carregandoUsuario = false;
      let mensagemErro = "Falha ao alterar usuário";
      console.error(mensagemErro, err);

      if (err.error.length > 0) {
        mensagemErro = err.error[0].mensagem;
      }
      this._snackBar.open(mensagemErro, "Fechar", {
        duration: 3000
      })
    })
  }

  validarEmail(event: any) {
    const campoFormulario = this.formularioUsuario.get("email");
    if (campoFormulario?.value) {
      if (
        !(campoFormulario.value.includes("@") &&
          campoFormulario.value.includes(".com"))
      ) {
        campoFormulario?.setErrors({});
      }
    }
  }

  validarDataNascimento(event: any) {
    const campoFormulario = this.formularioUsuario.get("dataNascimento");

    if (campoFormulario?.value) {
      const dataInformada = new Date(campoFormulario?.value);
      if (dataInformada > new Date()) {
        campoFormulario?.setErrors({});
      }
    }
  }

  obterErroDataNascimento() {
    const campoFormulario = this.formularioUsuario.get("dataNascimento");
    if (campoFormulario?.value) {
      const dataInformada = new Date(campoFormulario?.value);
      if (dataInformada > new Date()) {
        return "Data não pode ser maior que a data atual"
      }
    }
    return "Data de nascimento inválida";
  }
}
