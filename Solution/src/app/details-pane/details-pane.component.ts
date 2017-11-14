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

  showValues(selectedCity : City, cityValues : PIItemsStreamValue)
  {
    for (let item of cityValues.Items)
    {
      if (item.Name == "Wikipedia Description")
      {
        selectedCity.wikipediaDescription = item.Value.Value;
      }
      else if (item.Name == "Wikipedia Title")
      {
        selectedCity.wikipediaTitle = item.Value.Value;
      }
      else if (item.Name == "Wikipedia Thumbnail Url")
      {
        selectedCity.imageUrl = item.Value.Value;
      }
      else if (item.Name == "Cloud Cover")
      {
        selectedCity.cloudCover  = item.Value.Value;
      }
      else if (item.Name == "Humidity")
      {
        selectedCity.humidity = item.Value.Value;
      }
      else if (item.Name == "Temperature")
      {
        selectedCity.temperature = item.Value.Value;
      }  
      else if (item.Name == "Pressure")
      {
        selectedCity.pressure = item.Value.Value;
      } 
      else if (item.Name == "Wind Speed")
      {
        selectedCity.windSpeed = item.Value.Value;
      }    
    }
    this.selectedCity = selectedCity;
  }

  openPIVision(cityName : string, propertyName : string)
  {
    let url = "https://marc-web-sql.marc.net/PIVision/#/Displays/AdHoc?DataItems=%5C%5CMARC-PI2016%5CWeather%5C" + cityName.replace(" ", "%20") + "%7C" + propertyName.replace(" ", "%20") + "&mode=kiosk";
    this.onCityAttributeSelected.emit(url);  
  }
}
