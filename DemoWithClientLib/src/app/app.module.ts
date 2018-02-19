import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { PIWebAPIService } from 'angular-piwebapi';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,   
    FormsModule,
    HttpModule
  ],
  providers: [PIWebAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
