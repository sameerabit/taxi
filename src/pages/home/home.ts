import { Component,ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';

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

  ionViewDidEnter() {
      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer;
      this.geolocation.getCurrentPosition(this.locationOptions).then((pos : Geoposition) => {
          this.currentPosition = pos;
          this.origin = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
          this.map = new google.maps.Map(this.mapElement.nativeElement,{
              center: this.origin,
              zoom: 50,
              mapTypeId: google.maps.MapTypeId.ROADMAP
          });
          this.addMarker();
          this.initMap();
      },(err : PositionError)=>{
          console.log("error : " + err.message);
      });



      this.geolocation.watchPosition()
          .filter((p) => p.coords !== undefined) //Filter Out Errors
          .subscribe(position => {
              this.currentPosition = position;
              this.origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              this.addMarker();
          });
      }

      addMarker(){

          let marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
          });

          marker.setPosition(new google.maps.LatLng(
              this.currentPosition.coords.latitude,
              this.currentPosition.coords.longitude));

          let content = "<h4>Information!</h4>";

          this.addInfoWindow(marker, content);
      }

    addInfoWindow(marker, content){

        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });

    }
     


  // setUserLocation(){
  //   this.locationOptions = {
  //       enableHighAccuracy : false
  //   }
  //   this.geolocation.getCurrentPosition(this.locationOptions).then((pos : Geoposition) => {
  //       this.currentPosition = pos;
  //       this.origin = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
  //       this.initMap();
	// //setTimeout(this.setUserLocation(),300);
  //   },(err : PositionError)=>{
  //       console.log("error : " + err.message);
  //   })
  //
  // }

  initMap(){
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
