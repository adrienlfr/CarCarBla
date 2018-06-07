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
      {arrival: 'Clermont-Ferrand', date: new Timestamp(), departure: "Rodez", passengerNb: 3},
      {arrival: 'Loin', date: 'December 17, 1995 03:24:00', departure: "Putier-Sur-Marne", passengerNb: 2},
      {arrival: 'Oui', date: 'December 17, 1995 03:24:00', departure: "Poop", passengerNb: 2}
    ]
  }

}
