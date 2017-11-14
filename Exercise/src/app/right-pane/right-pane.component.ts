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
	//Exercise 3

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
    debugger;
    this.onCitySelected.emit(selectedCity);
  }


  onCityAttributeSelected(piVisionUrl: string) {
    this.mapPane.applySelectedProperty(piVisionUrl);
  }

  ngOnInit() {
  }
}
