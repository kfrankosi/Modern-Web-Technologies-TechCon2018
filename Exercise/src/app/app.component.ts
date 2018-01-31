import { retry } from 'rxjs/operator/retry';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LeftPaneComponent } from './left-pane/left-pane.component'
import { RightPaneComponent } from './right-pane/right-pane.component'
import { Observable } from 'rxjs';
import {
    PIAssetDatabase,
    PIElement,
    PIItemsAttribute,
    PIItemsElement,
    PIStreamValue,
    PIWebAPIService,
    PIRequest,
    PIResponse,
} from 'angular-piwebapi';
import { City } from './city'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';
  @ViewChild(RightPaneComponent) 
  private rightPane : RightPaneComponent

  @ViewChild(LeftPaneComponent) 
  private leftPane : LeftPaneComponent


  cities : City[];


  constructor(private piWebAPIService : PIWebAPIService ) { 

  }


  findAttributeIndex(cityName : string, attributes :  PIItemsAttribute) : number
  {
    let count = 0;
    for (let attribute of attributes.Items)
    {
      if (attribute.Path.includes(cityName)==true)
      {
        return count;
      }
      count++;
    }
    return -1;
  }

  findAttributeWebId(cityName : string, attributes :  PIItemsAttribute) : string
  {

    for (let attribute of attributes.Items)
    {
      if (attribute.Path.includes(cityName)==true)
      {
        return attribute.WebId;
      }
    }
    return '';
  }


  getGeolocationValue(city : City, values : PIStreamValue[], paramter : string) : number  {

    for (let value of values)
    {
        if ((value.Name == paramter) && (value.Path.includes(city.path)))
        {
            return value.Value.Value;
        }
    }
    return 0;
  }

  processResponses(res : [PIItemsElement, PIItemsAttribute, PIItemsAttribute])
  {
    let webIds = [];
    let piItemsElement  = res[0];
    let latitudeAttributes = res[1];
    let longitudeAttributes = res[2];
    let count = 0;
    let cities = new Array(50);
    for (let item of piItemsElement.Items)
    {
      cities[count] = new City();
      cities[count].name = item.Name;
      cities[count].webId = item.WebId;
      cities[count].path = item.Path;
      cities[count].latitudeWebId = this.findAttributeWebId(cities[count].name, latitudeAttributes)
      cities[count].longitudeWebId = this.findAttributeWebId(cities[count].name, longitudeAttributes)
      webIds.push(cities[count].latitudeWebId);
      webIds.push(cities[count].longitudeWebId);
      count++;
      
    }
	//Exercise 2
  }



  getDataNoBatch() {
	//Exercise 1
  }







  processResponseWithBatch(res : { [key: string]: PIResponse; })
  {
    let db : PIAssetDatabase = res['1'].Content;
    let piItemsElement : PIItemsElement = res['2'].Content;
    let latitudeAttributes : PIItemsAttribute = res['3'].Content;
    let longitudeAttributes : PIItemsAttribute = res['4'].Content;
    let latitudeValues = res['5'].Content;
    let longitudeValues = res['6'].Content;
   
    let count = 0;
    let cities = new Array(50);
    for (let item of piItemsElement.Items)
    {
      let geoIndex = this.findAttributeIndex(item.Name, latitudeAttributes);
      cities[count] = new City();
      cities[count].name = item.Name;
      cities[count].webId = item.WebId;
      cities[count].path = item.Path;
      cities[count].latitudeWebId = this.findAttributeWebId(cities[count].name, latitudeAttributes);      
      cities[count].longitudeWebId = this.findAttributeWebId(cities[count].name, longitudeAttributes);  
      cities[count].latitude = latitudeValues.Items[geoIndex].Content.Value;
      cities[count].longitude =longitudeValues.Items[geoIndex].Content.Value;
      count++;
      
    }
    this.cities = cities;
  }



  getDataWithBatch() {

    let baseUrl = "https://pisrv01.pischool.int/piwebapi/";
    let globalRequest : { [key: string]: PIRequest; } = {};
   	//Exercise 5
    
    this.piWebAPIService.batch.execute(globalRequest).subscribe(res => {
         this.processResponseWithBatch(res);
      }, error => {
        console.log(error.json());
    });
     
  }

  ngOnInit() {
    this.piWebAPIService.configureInstance("https://pisrv01.pischool.int/piwebapi/", true);
    //this.getDataNoBatch();
    this.getDataWithBatch();

  }

  onCitySelectedFromLeftPane(selectedCity: City){
    this.rightPane.applySelectCity(selectedCity);
  }

  onCitySelectedFromRightPane(selectedCity: City) {
    this.leftPane.applySelectCity(selectedCity);
  }
}
