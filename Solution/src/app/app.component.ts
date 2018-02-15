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
	//TODO: Exercise 2
    this.piWebAPIService.streamSet.getValuesAdHoc(webIds).subscribe(data => {
      let count = 0;
      for (let city of cities)
        {
          city.latitude = this.getGeolocationValue(city, data.Items, 'Latitude');
          city.longitude = this.getGeolocationValue(city, data.Items, 'Longitude');
          count++; 
        }
        this.cities = cities;
    })
	//TODO: Exercise 2
  }



  getDataNoBatch() {
	//TODO: Exercise 1
    this.piWebAPIService.assetDatabase.getByPath('\\\\PISRV01\\Weather', "webId").subscribe(piAssetDatabase => {
      Observable.forkJoin(
        this.piWebAPIService.assetDatabase.getElements(piAssetDatabase.WebId, null, null, null, null, null, null, "items.webId;items.name;items.path"),
        this.piWebAPIService.assetDatabase.findElementAttributes(piAssetDatabase.WebId, null, null, "Latitude", null, null, null, null, null, null, null, null, "items.webId;items.name;items.path"),
        this.piWebAPIService.assetDatabase.findElementAttributes(piAssetDatabase.WebId, null, null, "Longitude", null, null, null, null, null, null, null, null, "items.webId;items.name;items.path"))
        .subscribe(res => this.processResponses(res));

    }, error => {
        console.log(error.json());
    });
	//TODO: Exercise 1
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
	//TODO: Exercise 5	
    globalRequest['1'] = new PIRequest();
    globalRequest['1'].Method = "GET";
    globalRequest['1'].Resource = baseUrl + "assetdatabases?path=\\\\PISRV01\\Weather&selectedFields=webId";
    globalRequest['2'] = new PIRequest();
    globalRequest['2'].Method = "GET";
    globalRequest['2'].Resource = baseUrl + "assetdatabases/{0}/elements?selectedFields=items.webId;items.name;items.path";
    globalRequest['2'].Parameters = ["$.1.Content.WebId"];
    globalRequest['2'].ParentIds = ["1"];
    globalRequest['3'] = new PIRequest();
    globalRequest['3'].Method = "GET";
    globalRequest['3'].Resource = baseUrl + "assetdatabases/{0}/elementattributes?attributeNameFilter=*Latitude*&selectedFields=items.webId;items.name;items.path";
    globalRequest['3'].Parameters = ["$.1.Content.WebId"];
    globalRequest['3'].ParentIds = ["1"];
    globalRequest['4'] = new PIRequest();
    globalRequest['4'].Method = "GET";
    globalRequest['4'].Resource = baseUrl + "assetdatabases/{0}/elementattributes?attributeNameFilter=*Longitude*&selectedFields=items.webId;items.name;items.path";
    globalRequest['4'].Parameters = ["$.1.Content.WebId"],
    globalRequest['4'].ParentIds = ["1"];
    globalRequest['5'] = new PIRequest();
    globalRequest['5'].Method = "GET";
    globalRequest['5'].Parameters = ["$.3.Content.Items[*].WebId"];
    globalRequest['5'].ParentIds = ["3"];
    globalRequest['5'].RequestTemplate = {
      Resource: baseUrl + "streams/{0}/value"
    };
    globalRequest['6'] = new PIRequest();
    globalRequest['6'].Method = "GET";
    globalRequest['6'].Parameters = ["$.4.Content.Items[*].WebId"];
    globalRequest['6'].ParentIds = ["4"];
    globalRequest['6'].RequestTemplate = {
      Resource: baseUrl + "streams/{0}/value"
    };
	//TODO: Exercise 5	
    this.piWebAPIService.batch.execute(globalRequest).subscribe(res => {
         this.processResponseWithBatch(res);
      }, error => {
        console.log(error.json());
    });
     
  }

  ngOnInit() {
    this.piWebAPIService.configureInstance("https://pisrv01.pischool.int/piwebapi/", true);
	//For Exercise 1
    this.getDataNoBatch();
	
	//For Exercise 5 (Batch)
    //this.getDataWithBatch();

  }

  onCitySelectedFromLeftPane(selectedCity: City){
    this.rightPane.applySelectCity(selectedCity);
  }

  onCitySelectedFromRightPane(selectedCity: City) {
    this.leftPane.applySelectCity(selectedCity);
  }
}
