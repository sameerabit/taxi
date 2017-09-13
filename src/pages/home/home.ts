import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  map: GoogleMap;
  mapElement: HTMLElement;
  isMapReady: Boolean = false;
  userLocation :any;

  constructor(
    public navCtrl: NavController,
    private googleMaps: GoogleMaps,
    private geolocation: Geolocation) {  }
    
  // this will trigger as soon as the view is ready
  ionViewDidLoad(){
    this.initMap();
  }

  initMap(){
    this.mapElement = document.getElementById('map');
    this.updateUserLocation();
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: this.userLocation,
        zoom: 18,
        tilt: 30
      }
    };

    this.map = this.googleMaps.create(this.mapElement, mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');
        this.isMapReady = true;
      });
  }

  showUserLocation(){
    this.updateUserLocation();
    this.addMarker(this.userLocation);  
  }
  updateUserLocation(){    
    if (navigator.geolocation) {
      var options = {
        enableHighAccuracy: true
      };

      navigator.geolocation.getCurrentPosition(position=> {
        console.info('using navigator');
        let latitude = position.coords.latitude; 
        let longitude = position.coords.longitude
        console.info(latitude);
        console.info(longitude);
        this.userLocation = {
          lat: latitude,
          lng: longitude
        };
      }, error => {
        console.log(error);
      }, options);
    }
  }

  addMarker(location){
    this.map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            position: location
          })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
    });
  }

}
