import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Components } from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonService } from './components/person/service/person.service';
import { HttpClientModule } from '@angular/common/http';
import { SharedComponents } from './shared/components';
import { ToastService } from './shared/service';

@NgModule({
  declarations: [
    AppComponent,
    Components,
    SharedComponents
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    PersonService,
    ToastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
