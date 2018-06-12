import { Component } from '@angular/core';

import { JourneysPage } from '../journeys/journeys';
import { ProfilPage } from '../profil/profil';
import { HomePage } from '../home/home';
import { AuthService } from "../../services/auth.service";
import {User, USER_PATH} from "../../models/user";
import {AlertController, NavController} from "ionic-angular";
import {Journey, JOURNEY_PATH} from "../../models/journey";
import {FirestoreService} from "../../services/firestore.service";
import {AngularFirestoreCollection} from "angularfire2/firestore";
import {Observable} from "rxjs/Observable";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  static journeysCollection: AngularFirestoreCollection<Journey>;
  static journeys: Observable<Journey[]>;

  static user = {} as User;
  static userId: string;

  tab1Root = HomePage;
  tab2Root = JourneysPage;
  tab3Root = ProfilPage;

  constructor(private auth: AuthService, public navCtrl: NavController, private firebase: FirestoreService, private alertCtrl: AlertController) {}

  ionViewWillEnter() {
    TabsPage.userId = this.auth.uid;
    this.loadProfile();
    this.loadJourneys();
  }

  get authenticated(): boolean {
    return this.auth.authenticated;
  }

  private loadProfile() {
    this.firebase.getDocument(USER_PATH, this.auth.uid)
      .then((result) => {
        if (result == null) {
          this.navCtrl.setRoot(ProfilPage, { isInitProfile: true });
        } else {
          TabsPage.user = result;
        }
      })
      .catch(() => {
        let alert = this.alertCtrl.create({
          title: 'Erreur',
          message: 'Impossible de charge le profile de l\'utilisateur.',
          buttons: ['Ok']
        });
        alert.present();
      });
  }

  private loadJourneys() {
    this.firebase.getDocuments(JOURNEY_PATH).then((result) => TabsPage.journeysCollection = result);
    if (TabsPage.journeysCollection != null) {
      TabsPage.journeys = TabsPage.journeysCollection.valueChanges()
    }
  }

}
