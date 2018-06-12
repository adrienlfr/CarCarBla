import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Journey, JOURNEY_PATH} from "../../models/journey";
import * as firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;
import {FirestoreService} from "../../services/firestore.service";
import moment from 'moment';
import {TabsPage} from "../tabs/tabs";
import {JourneysPage} from "../journeys/journeys";

/**
 * Generated class for the JourneyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-journey',
  templateUrl: 'journey.html',
})
export class JourneyPage {

  journey = {} as Journey;
  date: string;
  isSearch: boolean;

  constructor(public navCtrl: NavController, private firestore: FirestoreService,
              private alertCtrl: AlertController, public navParams: NavParams, private loadingCtrl: LoadingController) {
    this.date = moment().format();
    this.journey.passengerNb = 1;
    this.isSearch = this.navParams.get("isSearch");
  }

  searchOrAddJourney() {
    console.log();
    this.setJourney();
    if(this.isSearch){
      this.navCtrl.push(JourneysPage, {departure: this.journey.departure, arrival: this.journey.arrival, date: this.journey.date, nbPassengers: this.journey.passengerNb, isSearch: this.isSearch});
    } else {
      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent',
        content: ''
      });
      loadingPopup.present();

      this.firestore.addDocument(JOURNEY_PATH, this.journey)
        .then(() => {
          this.navCtrl.pop();
          loadingPopup.dismiss();
        })
        .catch((e) => {
          loadingPopup.dismiss();
          console.error(e);
          let alert = this.alertCtrl.create({
            title: 'Erreur',
            subTitle: 'Impossible d\'ajouter le trajet.',
            buttons: ['Ok']
          });
          alert.present();
        })
    }
  }

  private setJourney() {
    this.journey.date = Timestamp.fromMillis(parseInt(moment(this.date).format('x'), 10));
    this.journey.driver = TabsPage.userId;
    this.journey.nbPlacesAvailable = this.journey.passengerNb;
  }
}
