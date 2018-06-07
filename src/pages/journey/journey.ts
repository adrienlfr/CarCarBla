import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {Journey, JOURNEY_PATH} from "../../models/journey";
import * as firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;
import {FirestoreService} from "../../services/firestore.service";
import moment from 'moment';
import {TabsPage} from "../tabs/tabs";

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
              private alertCtrl: AlertController, public navParams: NavParams) {
    this.date = moment().format();
    this.journey.passengerNb = 1;
    this.isSearch = this.navParams.get("isSearch");
  }

  searchOrAddJourney() {
    this.setJourneyDate();
    if(this.isSearch){
      let result = TabsPage.journeys.filter(j =>
        j.departure == this.journey.departure &&
        j.arrival == this.journey.arrival &&
        moment(j.date).isAfter(moment(this.journey.date.toMillis())) &&
        moment(j.date).isBefore(moment(this.journey.date.toMillis() + 86400000)) );

      console.log(result);

    } else {
      this.firestore.addDocument(JOURNEY_PATH, this.journey)
        .then(() => this.navCtrl.pop())
        .catch((e) => {
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

  private setJourneyDate() {
    this.journey.date = Timestamp.fromMillis(parseInt(moment(this.date).format('x'), 10));
  }
}
