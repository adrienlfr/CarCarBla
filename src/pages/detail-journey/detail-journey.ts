import { Component } from '@angular/core';
import { AlertController, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Journey, JOURNEY_PATH } from "../../models/journey";
import { User, USER_PATH } from "../../models/user";
import {FirestoreService } from "../../services/firestore.service";
import moment from "moment";
import { TabsPage } from "../tabs/tabs";
import { Passenger, PASSENGER_PATH } from "../../models/passenger";

/**
 * Generated class for the DetailJourneyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detail-journey',
  templateUrl: 'detail-journey.html',
})
export class DetailJourneyPage {

  private idJourney: string;
  isDelete: boolean = true;
  textButton = 'Supprimer';
  journey = {} as Journey;
  dateFormatted : string;
  driver = {} as User;
  passengers : Passenger[] = [null, null, null, null];
  profilePassenger : User[] = [null, null, null, null];

  private loadingPopup: Loading;

  constructor(public navCtrl: NavController, private firestore: FirestoreService, public navParams: NavParams, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.loading();
    this.idJourney = this.navParams.get('idJourney');
    this.loadJourney();
  }

  onClickButtonDetailJourney() {
    this.loading();
    if (this.isDelete) {
      if (this.journey.driver == TabsPage.userId) {
        this.driverDeleteJourney();
      } else {
        this.passengerDeleteJourney(TabsPage.userId);
      }
    } else {
      this.passengerAddJourney(TabsPage.userId);
    }
  }

  private loading() {
    this.loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    this.loadingPopup.present();
  }

  private driverDeleteJourney() {
    this.firestore.deleteDocument(JOURNEY_PATH, this.idJourney)
      .then(() => this.showAlert('Trajet', 'Le trajet a bien été supprimé.', true))
      .catch(() => this.showAlert('Erreur', 'Impossible de supprimer le trajet.', false))
  }

  private passengerDeleteJourney(idUser: string) {
    this.firestore.deleteSecondDocument(JOURNEY_PATH, this.idJourney, PASSENGER_PATH, idUser)
      .then(() => {
        console.log('then');
        this.journey.nbPlacesAvailable += this.passengers.filter(user => user != null && user.id == idUser).length;
        this.firestore.updateDocument(JOURNEY_PATH, this.idJourney, this.journey);
        this.showAlert('Supression', 'La supression à bien été effectué.', true)
      })
      .catch((e) => {
        console.log(e);
        this.showAlert('Erreur', 'Impossible d\'effectuer la suppression.', false)
      })
  }

  private passengerAddJourney(idUser: string) {
    let alertRadio = this.alertCtrl.create({
      title: 'Nombre de passager',
      inputs: [
        {
          type: 'radio',
          label: '1 passager',
          value: '1',
          checked: true
        }],
      buttons: [
        { text: 'Annuler' },
        {
          text: 'Valider',
          handler: (data : string) => {
            let nbPlaceSelected = Number(data);
            this.firestore.setSecondDocument(JOURNEY_PATH, this.idJourney, PASSENGER_PATH, idUser, {id: idUser, nbPassenger: nbPlaceSelected} as Passenger)
              .then(() => this.showAlert('Reservation', 'La réservation a bien été effectué.', true))
              .catch((e) => {
                console.error(e);
                this.showAlert('Erreur', 'Impossible d\'ajouter le(s) passager(s).', false)
              });
            this.journey.nbPlacesAvailable -= nbPlaceSelected;
            this.firestore.updateDocument(JOURNEY_PATH, this.idJourney, this.journey);
          }
        }]});
    if (this.journey.nbPlacesAvailable > 1) {
      alertRadio.addInput({
        type: 'radio',
        label: '2 passagers',
        value: '2'
      });
      if (this.journey.nbPlacesAvailable > 2) {
        alertRadio.addInput({
          type: 'radio',
          label: '3 passagers',
          value: '3'
        });
        if (this.journey.nbPlacesAvailable > 3) {
          alertRadio.addInput({
            type: 'radio',
            label: '4 passagers',
            value: '4'
          });
        }
      }
    }
    alertRadio.present();
  }

  private loadJourney() {
    this.firestore.getDocument(JOURNEY_PATH, this.idJourney)
      .then((result) => {
        if (result as Journey) {
          this.journey = result;
          this.dateFormatted = moment(this.journey.date).format("DD MMMM YYYY H:mm");
          this.firestore.getDocument(USER_PATH, this.journey.driver).then((result) => this.driver = result);
          this.loadPassenger();
        } else { this.showAlert('Erreur', 'Impossible de charge les informations du trajet.', true) }
      })
      .catch((e) => {
        console.error(e);
        this.showAlert('Erreur', 'Impossible de charge les informations du trajet.', true)
      })
  }

  private loadPassenger() {
    this.firestore.getSecondDocuments(JOURNEY_PATH, this.idJourney, PASSENGER_PATH)
      .then((result) => {
        if (result != null) {
          var i = 0;
          (result as Passenger[]).forEach(user => {
            let profileUser = {} as User;
            this.firestore.getDocument(USER_PATH, user.id)
              .then((result) => {
                profileUser = result as User;
                for(var j = 0; j < user.nbPassenger; j++ ) {
                  this.profilePassenger[i] = profileUser;
                  this.passengers[i] = user;
                  i++;
                  if (i == this.journey.passengerNb - this.journey.nbPlacesAvailable) {
                    this.initButton();
                    this.loadingPopup.dismiss();
                  }
                }
              });
          });
        } else {
          this.initButton();
          this.loadingPopup.dismiss();
        }
      });
  }

  private showAlert(title: string, message: string, execHandler: boolean) {
    this.loadingPopup.dismiss();
    this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text:'Ok',
        handler: () => {
          if (execHandler) {
            this.navCtrl.pop();
          }
        }
      }]
    }).present();
  }

  private initButton() {
    if (this.journey.driver != TabsPage.userId) {
      let isPassenger = false;
      this.passengers.forEach(user => {
        if (user != null && user.id == TabsPage.userId) {
          isPassenger = true;
        }
      });
      if (!isPassenger) {
        this.textButton = 'Covoiturer';
        this.isDelete = false;
      }
    }
  }
}
