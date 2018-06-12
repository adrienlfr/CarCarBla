import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import {Journey, JOURNEY_PATH} from "../../models/journey";
import { firestore } from "firebase";
import Timestamp = firestore.Timestamp;
import moment from 'moment';
import {FirestoreService} from "../../services/firestore.service";

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
    }
  }

  convertTimestampToString(date: any): string {
    return moment(Timestamp.fromDate(new Date(date)).toMillis()).format("DD MMM H:mm");
  }

  getDriverPhotoURL(idDriver: string): string {
    // console.log('GetPhoto');
    /*this.firestore.getDocument(USER_PATH, idDriver)
      .then((result) => {
        if (result as User) {
          return (result as User).photoUrl;
        }
      })
      .catch((e) => console.error(e));*/
    return 'assets/imgs/default_avatar.png';
  }

}
