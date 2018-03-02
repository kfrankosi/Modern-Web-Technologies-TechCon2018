import { PIElement, PIItemsStreamValue, PIWebAPIService } from 'angular-piwebapi';
import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapPaneComponent } from '../map-pane/map-pane.component'
import { DetailsPaneComponent } from '../details-pane/details-pane.component'
import { City } from '../city'


@Component({
  selector: 'app-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['./right-pane.component.css']
})
export class RightPaneComponent implements OnInit {
  @Output() onCitySelected = new EventEmitter<City>();

  private startMode : boolean = false;

  @ViewChild(MapPaneComponent) 
  private mapPane : MapPaneComponent

  @ViewChild(DetailsPaneComponent) 
  private detailsPane : DetailsPaneComponent

  @Input()
  cities : City[] = null;


  constructor(private piWebAPIService : PIWebAPIService ) { 
    this.cities = new Array(1);
    this.cities[0] = new City();
    this.startMode = false;
  }

  applySelectCity(selectedCity : City)
  {
    this.startMode = true;
	//TODO: Exercise 3	
    this.piWebAPIService.streamSet.getValues(selectedCity.webId, null, null, null, "items.webid;items.value.value;items.name").subscribe(cityValues => {  
      this.detailsPane.showValues(selectedCity, cityValues);
      this.piWebAPIService.stream.getSummary(selectedCity.temperatureWebId, null, "*", null, null, null, null, "*-1d", null, ["Average", "Minimum", "Maximum"]).subscribe(values => {
        this.detailsPane.showTemperatureRange(values);
      });  
     
    }, error => {
        console.log(error.json());
    });
	//TODO: Exercise 3	
    this.mapPane.applySelectCity(selectedCity);

  }

  getCSSClasses()
   {    
        if (this.startMode == false)
        {
          return 'nocitiesselected';
        }
        else
        {
          return '';
        }
  }
    


  onCitySelectedFromMap(selectedCity: City) {
    this.applySelectCity(selectedCity);
    this.onCitySelected.emit(selectedCity);
  }


  onCityAttributeSelected(piVisionUrl: string) {
    this.mapPane.applySelectedProperty(piVisionUrl);
  }

  ngOnInit() {
  }
}
