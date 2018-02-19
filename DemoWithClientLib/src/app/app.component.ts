import { Component } from '@angular/core';
import { PITimedValue, PIWebAPIService } from 'angular-piwebapi'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private items : PITimedValue[];
  constructor(private piWebApiHttpService: PIWebAPIService) {
  }
  ngOnInit() { 
    this.piWebApiHttpService.configureInstance("https://pisrv01.pischool.int/piwebapi", true);
    this.piWebApiHttpService.point.getByPath("\\\\pisrv01\\sinusoid").subscribe(res => {
      this.piWebApiHttpService.stream.getRecorded(res.WebId).subscribe(res => {
        this.items = res.Items;
      });
    });  
  }
}