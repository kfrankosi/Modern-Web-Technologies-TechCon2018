import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { PIElement, PIItemsElement, PIWebAPIService } from 'angular-piwebapi';
import { City} from '../city'


@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.css']
})
export class LeftPaneComponent implements OnInit {

  @Output() onCitySelected = new EventEmitter<City>();

  @Input()
  public cities : City[] = null;

  selectedCity : City = null;

  
  constructor(private piWebAPIService : PIWebAPIService ) { 
    this.cities = new Array();
  }

  ngOnInit() {

  }

  getCSSClasses(city: City) {

    if ((city == null) || (this.selectedCity == null))
    {
      return '';
    }

    if (city.name == this.selectedCity.name)
    {
        return 'selected';
    }
    else
    {
      return '';
    }
  }

  applySelectCity(city: City) {
    this.selectedCity = city;
    var el = document.getElementById(city.name);
    el.focus();
  }

  selectCityFromButton(city: City) {
    this.selectedCity = city;
    this.onCitySelected.emit(city);
  }
}
