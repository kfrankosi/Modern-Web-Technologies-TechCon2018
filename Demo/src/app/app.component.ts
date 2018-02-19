import { Component } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private items : any;
  constructor(private http: Http) {
  }

  ngOnInit() { 
    let piWebApiBaseUrl = "https://pisrv01.pischool.int/piwebapi";
    let options = ({ withCredentials: true });
    this.http.get(piWebApiBaseUrl + '/points?path=\\\\pisrv01\\sinusoid', options).subscribe(res => {
      let webId = res.json().WebId;
      this.http.get(piWebApiBaseUrl + '/streams/' + webId + '/recorded', options).subscribe(res => {
        this.items = res.json().Items;
      }, error => {
        console.log(error.json());  
      });     
    },
    error => {
      console.log(error.json()); }); 
    }
}

