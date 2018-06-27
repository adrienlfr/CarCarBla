import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {Journey, JOURNEY_PATH} from "../../models/journey";
import * as firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp;
import {FirestoreService} from "../../services/firestore.service";
import moment from 'moment';
import {TabsPage} from "../tabs/tabs";
import {JourneysPage} from "../journeys/journeys";
import {Observable} from "rxjs/Observable";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {} from '@types/googlemaps';

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

  @ViewChild('departureInput', { read: ElementRef }) inputStart: ElementRef;
  @ViewChild('arrivalInput', { read: ElementRef }) inputArrival: ElementRef;

  inputStartElem: any;
  inputArrivalElem: any;
  journeyForm: FormGroup;
  journey = {} as Journey;
  date: string;
  isSearch: boolean;

  constructor(public navCtrl: NavController, private firestore: FirestoreService,
              private alertCtrl: AlertController, public navParams: NavParams, private loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
    this.date = moment().format();
    this.journey.passengerNb = 1;
    this.isSearch = this.navParams.get("isSearch");

    this.journeyForm = formBuilder.group({
      departure: ['', Validators.required],
      arrival: ['', Validators.required],
      price: [0, Validators.required]
    })
  }

  ionViewDidEnter() {
    // because we have to wait until the page is fully loaded for access html tag element.
    this.initAutocomplete();
  }
  initAutocomplete() {
    this.inputStartElem = this.inputStart.nativeElement.querySelector('input');
    this.inputArrivalElem = this.inputArrival.nativeElement.querySelector('input');

    this.createAutocomplete(this.inputStartElem, 0).subscribe((location) => {
      console.log('start data :', this.journeyForm.value.departure);
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
            this.journeyForm.value.departure = place.formatted_address;
            this.journey.departure = place.formatted_address;
          }else if(choice === 1){
            this.journeyForm.value.arrival = place.formatted_address;
            this.journey.arrival = place.formatted_address;
          }
          sub.next(place.geometry.location);
        }
      });
    });
  }

  searchOrAddJourney() {
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
    this.journey.price = this.journeyForm.value.price;
    this.journey.date = Timestamp.fromMillis(parseInt(moment(this.date).format('x'), 10));
    console.log( this.journey.date);
    this.journey.driver = TabsPage.userId;
    this.journey.nbPlacesAvailable = this.journey.passengerNb;
  }
}
