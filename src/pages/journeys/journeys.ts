import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Journey} from "../../models/journey";
import * as firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'page-journeys',
  templateUrl: 'journeys.html'
})
export class JourneysPage {

  tab: Journey[];


  constructor(public navCtrl: NavController) {
    this.tab = [
      {arrival: 'Clermont-Ferrand', date: Timestamp.fromDate(new Date()), departure: "Rodez", passengerNb: 3, nbPlacesAvailable: 3, price: 5},
      {arrival: 'Loin', date: Timestamp.fromDate(new Date()), departure: "Putier-Sur-Marne", passengerNb: 2, nbPlacesAvailable: 1, price: 15},
      {arrival: 'Oui', date: Timestamp.fromDate(new Date()), departure: "Poop", passengerNb: 2, nbPlacesAvailable: 0, price: 4}
    ]
  }

}
