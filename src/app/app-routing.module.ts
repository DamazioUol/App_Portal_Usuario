import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioFormularioComponent } from './pages/usuario/usuario-formulario/usuario-formulario.component';
import { UsuarioListaComponent } from './pages/usuario/usuario-lista/usuario-lista.component';

const routes: Routes = [
  { path: "", component: UsuarioListaComponent, pathMatch: "full" },
  { path: "formulario", component: UsuarioFormularioComponent },
  { path: "formulario/:id", component: UsuarioFormularioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
