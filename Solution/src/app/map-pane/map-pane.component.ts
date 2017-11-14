import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PIElement } from 'angular-piwebapi'
import { City } from '../city'
import { DomSanitizer,  SafeUrl } from '@angular/platform-browser';

declare var google: any;

@Component({
  selector: 'app-map-pane',
  templateUrl: './map-pane.component.html',
  styleUrls: ['./map-pane.component.css']
})
export class MapPaneComponent implements OnInit {

  @Output() onCitySelected = new EventEmitter<City>();
  selectedCity : City;
  lat: number = 40;
  lng: number = -100;
  zoom: number = 4;
  map: any;
  markers: any;
  showTrend : boolean;
  piVisionUrl: SafeUrl;

  private _cities : City[];

  @Input() set cities(value: City[]) {
    this._cities = value;
    if ((this._cities != null) && (this._cities.length >0))
    {
      var image = {
        url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        size: new google.maps.Size(20, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
      };



      for (let city of this._cities)
      {
        if ((city) && (city.latitude))
        {
       

          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(city.latitude, city.longitude),
            map: this.map,
            title: city.name,
            icon: image
          });

          google.maps.event.addListener(marker, 'click', (function(marker, city, onCitySelected) {
            return function() {
                this.map.panTo(new google.maps.LatLng(city.latitude, city.longitude));
                this.map.setZoom(6);
                var infowindow = new google.maps.InfoWindow({
                  content: city.name
                });
             
                infowindow.open(this.map, marker);
                onCitySelected.emit(city);
            }
          })(marker, city, this.onCitySelected));
     
          this.markers.push(marker);
        }
      }
    }
  }
  
  get cities(): City[] {
     return this._cities;
  }


  applySelectedProperty(url : string)
  {
    this.showTrend = true;
    this.piVisionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // piVisionSafeUrl.changingThisBreaksApplicationSecurity;
      //window.open(url);
  }

  constructor(private sanitizer: DomSanitizer ) { 
      this.markers = [];
      this.showTrend = false;
  }

  

public getSantizeUrl(url : string) {
  if (url ==null)
  {
    return null;
  }
  return this.sanitizer.bypassSecurityTrustUrl(url);
}


  ngOnInit() {
     this.initMap();
  }

  initMap() : void {
    var mapCanvas = document.getElementById("map");
    var mapOptions = {
      center: new google.maps.LatLng(this.lat, this.lng),
      zoom: this.zoom
    }
    this.map = new google.maps.Map(mapCanvas, mapOptions);
  }

  moveMap(city : City) {
    this.lat = city.latitude;
    this.lng = city.longitude;
    this.zoom = 6;
    this.map.panTo(new google.maps.LatLng(this.lat, this.lng));
    this.map.setZoom(this.zoom);
  }

  getCSSClasses()
  {    
       if (this.showTrend == false)
       {
         return '';
       }
       else
       {
         return 'with-trend';
       }
 }
   

  applySelectCity(selectedCity : City)
  {
    this.showTrend = false;
    this.selectedCity = selectedCity;
    for(let city of this.cities)
      {
         if (city.name == selectedCity.name)
          {
              this.moveMap(city);
          }
      }
  }
}
