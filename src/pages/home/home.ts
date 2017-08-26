import { Component,ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  options : GeolocationOptions;
  currentPos : Geoposition;	
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  places : Array<any> ;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;

  constructor(public navCtrl: NavController,private geolocation : Geolocation) {

  }

  ionViewDidEnter(){
    this.getUserPosition();
  }

  addMap(lat,long){

    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
    center: latLng,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      let directionsService = new google.maps.DirectionsService;
      let directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(this.map);
        directionsDisplay.setPanel(this.directionsPanel.nativeElement);

      this.startNavigating(lat,long,latLng,directionsService,directionsDisplay);
      this.map.addListener("click",(event)=>{
          this.startNavigating(lat,long,event.latLng,directionsService,directionsDisplay);
      });

   }


    startNavigating(lat,long,clickLatLong,directionsService,directionsDisplay){

           
        directionsService.route({
            origin: {lat: lat, lng: long},
            destination: clickLatLong, // 6.7092298,80.0768186
            travelMode: google.maps.TravelMode['DRIVING']
        }, (res, status) => {
            directionsDisplay.setDirections(null);
            if(status == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(res);
            } else {
                console.warn(status);
            }

        });

    }

  getUserPosition(){
    this.options = {
    enableHighAccuracy : false
    };
    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

        this.currentPos = pos;     

        console.log(pos);
        this.addMap(pos.coords.latitude,pos.coords.longitude);

    },(err : PositionError)=>{
        console.log("error : " + err.message);
    ;
    })
  }
}
