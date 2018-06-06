import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {Journey, JOURNEY_PATH} from "../../models/journey";
import * as firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;
import {FirestoreService} from "../../services/firestore.service";
import {AuthService} from "../../services/auth.service";

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
  hour: string;

  constructor(private auth: AuthService, public navCtrl: NavController, private firestore: FirestoreService, private alertCtrl: AlertController) {
    console.log(auth.user);
    this.date = new Date().toISOString();
    this.hour = new Date().toISOString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JourneyPage');
  }

  saveJourney() {


    this.setJourneyDate();
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

  private setJourneyDate() {
    let d = new Date(this.date);
    let h = new Date(this.hour);
    let date = new Date(d.getFullYear(), d.getMonth(), d.getDay(), h.getHours(), h.getMinutes());
    this.journey.date = Timestamp.fromDate(date);
  }

}
