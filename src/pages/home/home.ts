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
    let latlng = new google.maps.LatLng(lat, lng);
    let mapOption = {
      zoom: 15,
      center: { lat: lat, lng: lng },

      mapTypeId: 'roadmap'
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOption);
    this.addMarker(lat, lng);

    this.addMarkerCluster();
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

  addMarkerCluster() {
    let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let contentString = this.contentString;
    var markers = this.locations.map(function (location, i) {
      var marker =  new google.maps.Marker({
        position: location,
        label: labels[i % labels.length],
      });

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      marker.addListener('click', function () {
        infowindow.open(this.map, marker);
      });

      return marker;
    });

    

    var markerCluster = new MarkerClusterer(this.map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
  }
}