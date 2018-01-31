import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PIWebAPIService } from 'angular-piwebapi';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { LeftPaneComponent } from './left-pane/left-pane.component';
import { RightPaneComponent } from './right-pane/right-pane.component';
import { MapPaneComponent } from './map-pane/map-pane.component';
import { DetailsPaneComponent } from './details-pane/details-pane.component';

@NgModule({
  declarations: [
    AppComponent,
    LeftPaneComponent,
    RightPaneComponent,
    MapPaneComponent,
    DetailsPaneComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [PIWebAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
