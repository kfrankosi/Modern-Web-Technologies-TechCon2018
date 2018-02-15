import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PIElement, PIItemsStreamValue, PIStreamValue, PIStreamValues, PIItemsSummaryValue } from 'angular-piwebapi';
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
  showTemperatureRange(values : PIItemsSummaryValue)
  {
    for (let item of values.Items)
    {
      if (item.Type == "Minimum")
      {
          this.selectedCity.min_temp = item.Value.Value;
      }
      if (item.Type == "Average")
      {
          this.selectedCity.avg_temp = item.Value.Value;
      }
      if (item.Type == "Maximum")
      {
          this.selectedCity.max_temp  = item.Value.Value;
      }
    }
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
        selectedCity.temperatureWebId = item.WebId;
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
  //TODO: Exercise 3
	
	
	
	
  openPIVision(cityName : string, propertyName : string)
  {
	//TODO: Exercise 4
    let url = "https://pisrv01.pischool.int/PIVision/#/Displays/AdHoc?DataItems=%5C%5CPISRV01%5CWeather%5C" + cityName.replace(" ", "%20") + "%7C" + propertyName.replace(" ", "%20") + "&mode=kiosk";
    //TODO: Exercise 4
    this.onCityAttributeSelected.emit(url);  
  }
}
