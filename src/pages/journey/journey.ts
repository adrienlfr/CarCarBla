import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {Journey, JOURNEY_PATH} from "../../models/journey";
import * as firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;
import {FirestoreService} from "../../services/firestore.service";
import {AuthService} from "../../services/auth.service";
import {Observable} from "rxjs/Observable";

/**
 * Generated class for the JourneyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google: any;

@Component({
  selector: 'page-journey',
  templateUrl: 'journey.html',
})
export class JourneyPage {

  @ViewChild('departureInput', { read: ElementRef }) inputStart: ElementRef;
  @ViewChild('arrivalInput', { read: ElementRef }) inputArrival: ElementRef;

  inputStartElem: any;
  inputArrivalElem: any;

  journey = {} as Journey;
  date: string;
  hour: string;
  isSearch: boolean;
  allJourneys: Journey[];

  constructor(public navCtrl: NavController, private firestore: FirestoreService, private alertCtrl: AlertController, public navParams: NavParams) {
    this.date = new Date().toISOString();
    this.hour = new Date().toISOString();
    this.journey.passengerNb = 1;
    this.isSearch = this.navParams.get("isSearch");
    if (this.isSearch){
      this.firestore.getAllDocuments(JOURNEY_PATH)
        .then((result) => this.allJourneys = result)
        .catch((e) => console.error(e));
    }
  }

  ionViewDidEnter() {
    // because we have to wait until the page is fully loaded for access html tag element.
    this.initAutocomplete();
  }
  initAutocomplete() {
    this.inputStartElem = this.inputStart.nativeElement.querySelector('input');
    this.inputArrivalElem = this.inputArrival.nativeElement.querySelector('input');

    this.createAutocomplete(this.inputStartElem, 0).subscribe((location) => {
      console.log('start data :', this.journey.departure);
    });
    this.createAutocomplete(this.inputArrivalElem, 1).subscribe((location) => {
      console.log("arrival data : ", this.journey.arrival);
    })
  }

  createAutocomplete(address: HTMLInputElement, choice: number): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(address);

    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();

        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete returned place with no geometry'
          });
        } else {
          if(choice === 0){
            this.journey.departure = place.formatted_address;
          }else if(choice === 1){
            this.journey.arrival = place.formatted_address;
          }
          sub.next(place.geometry.location);
        }
      });
    });
  }

  searchOrAddJourney() {
    this.setJourneyDate();
    if(this.isSearch){
      let date = new Date(this.date);
      let hour = new Date(this.hour);
      //let result = this.allJourneys.filter(j => j.departure == this.journey.departure && j.arrival == this.journey.arrival && j.date > this.journey.date && j.date < (Timestamp) date.getDate());

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
    let d = new Date(this.date);
    let h = new Date(this.hour);
    let date = new Date(d.getFullYear(), d.getMonth(), d.getDay(), h.getHours(), h.getMinutes());
    this.journey.date = Timestamp.fromDate(date);
  }

}
