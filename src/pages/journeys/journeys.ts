import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {Journey, JOURNEY_PATH} from "../../models/journey";
import { firestore } from "firebase";
import Timestamp = firestore.Timestamp;
import moment from 'moment';
import {FirestoreService} from "../../services/firestore.service";
import {TabsPage} from "../tabs/tabs";
import {DetailJourneyPage} from "../detail-journey/detail-journey";

@Component({
  selector: 'page-journeys',
  templateUrl: 'journeys.html'
})
export class JourneysPage {

  journeys: Journey[];

  private filterDeparture: string;
  private filterArrival: string;
  private filterDate: Timestamp;
  private filterNbPassengers: number;
  private isSearch: boolean;


  constructor(public navCtrl: NavController, private firestore: FirestoreService, public navParams: NavParams, private loadingCtrl: LoadingController) {
    this.filterDeparture = this.navParams.get('departure');
    this.filterArrival = this.navParams.get('arrival');
    this.filterDate = this.navParams.get('date');
    this.filterNbPassengers = this.navParams.get('nbPassengers');
    this.isSearch = this.navParams.get("isSearch");
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

    if (this.isSearch) {
      this.firestore.getDocuments(JOURNEY_PATH,
        ['departure', '==', this.filterDeparture],
        ['arrival', '==', this.filterArrival],
        ['date', '>', this.filterDate],
        ['date', '<', Timestamp.fromMillis(this.filterDate.toMillis() + 86400000)])
        .then((result) => {
          this.journeys = result.filter(journey => journey.nbPlacesAvailable >= this.filterNbPassengers);
          loadingPopup.dismiss();
        });
    } else {
      this.firestore.getDocuments(JOURNEY_PATH,
        ['driver', '==', TabsPage.userId])
        .then((result) => {
          this.journeys = result;
          loadingPopup.dismiss();
        })
    }
  }

  convertTimestampToString(date: any): string {
    return moment(Timestamp.fromDate(new Date(date)).toMillis()).format("DD MMM H:mm");
  }

  onCardClicked(idJourney: string) {
    this.navCtrl.push(DetailJourneyPage, {'idJourney': idJourney});
  }

}
