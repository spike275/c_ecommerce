import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { PhotoUploadComponent } from './components/home/home.component';
import { ContatcComponent } from './components/contatc/contatc.component';
import { TestComponent } from './components/test/test.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomerComponent } from './components/customer/customer.component';
import { TreatmentComponent } from './components/treatment/treatment.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ProductComponent } from './components/product/product.component';
@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    AppComponent,
    AboutComponent,
    PhotoUploadComponent,
    ContatcComponent,
    TestComponent,
    CustomerComponent,
    TreatmentComponent,
    AppointmentComponent,
    LogoutComponent,
    ProductComponent,
  ],
  imports: [CommonModule, BrowserModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
