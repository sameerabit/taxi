import { Component,ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  
  map: any;
  origin: any;
  destination:any;
  currentPosition : Geoposition;	
  locationOptions : GeolocationOptions;
  places : Array<any> ;

  directionsService:any;
  directionsDisplay:any;

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;

  constructor(public navCtrl: NavController,private geolocation : Geolocation) {
  }

  ionViewDidEnter(){
      this.setUserLocation();
  }

  setUserLocation(){
    this.locationOptions = {
        enableHighAccuracy : false
    }
    this.geolocation.getCurrentPosition(this.locationOptions).then((pos : Geoposition) => {
        this.currentPosition = pos;
        this.origin = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
        this.initMap();
    },(err : PositionError)=>{
        console.log("error : " + err.message);
    })

  }

  initMap(){
      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer;
      let mapOptions =  {
          center: this.origin,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

      this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);
      this.directionsDisplay.setMap(this.map);
      this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);
      this.calculateAndDisplayRoute(this.origin,this.origin);
      this.map.addListener("click",(event)=>{
         this.destination = event.latLng;
         this.calculateAndDisplayRoute(this.origin,event.latLng);
      });
      
  }


  calculateAndDisplayRoute(origin,destination){
      this.directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode['DRIVING']
      },(response, status) => {
          if(status == google.maps.DirectionsStatus.OK){
              this.directionsDisplay.setDirections(response);
          } else {
              console.warn(status);
          }
      });
  }  
}
