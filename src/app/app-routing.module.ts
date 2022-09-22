import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonsList } from "./components";

const routes: Routes = [
  {
    path: '',
    component: PersonsList
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
