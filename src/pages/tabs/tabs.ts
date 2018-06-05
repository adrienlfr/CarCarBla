import { Component } from '@angular/core';

import { JourneysPage } from '../journeys/journeys';
import { ProfilPage } from '../profil/profil';
import { HomePage } from '../home/home';
import { AuthService } from "../../services/auth.service";
import {User} from "../../models/user";
import {ProfileService} from "../../services/profile.service";
import {AlertController, NavController} from "ionic-angular";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  static user = {} as User;

  tab1Root = HomePage;
  tab2Root = JourneysPage;
  tab3Root = ProfilPage;

  constructor(private auth: AuthService, public navCtrl: NavController, private profileSrv: ProfileService, private alertCtrl: AlertController) {
    this.loadProfile();
  }


  get authenticated(): boolean {
    return this.auth.authenticated;
  }

  private loadProfile() {
    this.profileSrv.getUser(this.auth.uid)
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

}
