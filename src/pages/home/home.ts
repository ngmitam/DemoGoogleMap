import { HomePage } from './home';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;
declare var MarkerClusterer;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  lat: any;
  lng: any;
  map: any;
  err: Boolean;
  locations = [
    { lat: 10.030657, lng: 105.776006 },
    { lat: 10.028489, lng: 105.774554 },
    { lat: 10.029859, lng: 105.772360 },
    { lat: 10.024926, lng: 105.775028 },
    { lat: 10.032122, lng: 105.773738 }
  ];
  contentString = '<div id="content">' +
  '<div id="siteNotice">' +
  '</div>' +
  '<h1 id="firstHeading" class="firstHeading">Header</h1>' +
  '<div id="bodyContent">' +
  '<p>Content</p>' +
  '<p>Website: <a href="https://www.google.com">' +
  'Google</a></p>' +
  '</div>' +
  '</div>';

  content = '<h1>Are you here?</h1>';
  
  @ViewChild('map') mapElement;
  constructor(public navCtrl: NavController, public geo: Geolocation) {

  }

  ionViewCanEnter() {
    this.geo.getCurrentPosition().then((val) => {
      this.lat = val.coords.latitude;
      this.lng = val.coords.longitude;
      this.err = false;
    }).catch(err => {
      if (err != null) {
        this.err = true;
      }
    });
    this.loadMap(10.0309641, 105.76671);
  }

  setPosition(event) {
    if (this.err == true) {
      window.alert('Please return app and choose "Allow Location Access"');
    } else {
      this.loadMap(this.lat, this.lng);
    }
  }

  loadMap(lat: any, lng: any) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    let mapOption = {
      zoom: 15,
      center: { lat: lat, lng: lng },

      mapTypeId: 'roadmap'
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOption);
    this.addMarker(lat, lng);
    directionsDisplay.setMap(this.map);

    this.addMarkerCluster(directionsService, directionsDisplay, lat, lng);

  }

  addMarker(lat: any, lng: any) {
    var content = this.content;
    var marker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: this.map,
      label: '?',
      title: 'You are here?',
    });

    var infowindow = new google.maps.InfoWindow({
      content: content
    });

    marker.addListener('click', function () {
      infowindow.open(this.map, marker);
    });
  }

  addMarkerCluster(directionsService, directionsDisplay, lat, lng) {
    let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var position = { lat: lat, lng: lng };
    var markers = this.locations.map(function (location, i) {
      var marker =  new google.maps.Marker({
        position: location,
        label: labels[i % labels.length],
      });
      
      marker.addListener('click', function () {
        var content = HomePage.prototype.calculateAndDisplayRoute(directionsService, directionsDisplay, position, location, marker);
      });

      return marker;
    });

    var markerClusterer = new MarkerClusterer(this.map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination, marker) {
    directionsService.route({
      origin: origin,
      destination: destination,
      optimizeWaypoints: true,
      travelMode: 'DRIVING'
    }, function (response, status) { 
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
        var content = '<h1>From: ' + route.legs[0].start_address + '<br>To: ' + route.legs[0].end_address + '<br>Dis: ' + route.legs[0].distance.text +'</h1>';
        var infowindow = new google.maps.InfoWindow({
          content: content
        });
        infowindow.open(this.map, marker);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}