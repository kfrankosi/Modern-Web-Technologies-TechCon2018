import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PIElement, PIItemsStreamValue, PIStreamValue, PIStreamValues } from 'angular-piwebapi';
import { City } from '../city'
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-details-pane',
  templateUrl: './details-pane.component.html',
  styleUrls: ['./details-pane.component.css']
})

export class DetailsPaneComponent implements OnInit {
  city : City;
  selectedCity : City;

  @Output() onCityAttributeSelected = new EventEmitter<string>();

  constructor(private ref: ChangeDetectorRef) {
    this.city = new City();
    setInterval(() => {
      if ((this.selectedCity!=null) && (this.city!= null) &&(this.city.name!= this.selectedCity.name))
      {
        this.city = this.selectedCity;
        this.ref.markForCheck();
      }
    }, 100);
  }

  ngOnInit() {
  }

  //TODO: Exercise 3

  openPIVision(cityName : string, propertyName : string)
  {
	//TODO: Exercise 4
	let url = ""
	//TODO: Exercise 4
	this.onCityAttributeSelected.emit(url);  
  }
}
