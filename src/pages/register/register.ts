import { Component } from '@angular/core';
import {LoadingController, NavController, Platform} from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import {TabsPage} from "../tabs/tabs";
import {ConnectionUser} from "../../models/connectionUser";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as ConnectionUser;

  constructor(private auth: AuthService, public navCtrl: NavController, private platform: Platform, private loadingCtrl: LoadingController) {
  }

  async register(user: ConnectionUser) {
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

    this.auth.signUp(user.email, user.password)
      .then(() => {
        loadingPopup.dismiss();
        this.navCtrl.setRoot(TabsPage)
      })
      .catch(error => {
        loadingPopup.dismiss();
        console.error(error.message)
      })
  }

  registerWithGoogle() {
    this.auth.signUpWithGoogle(this.platform)
      .then(() => this.navCtrl.setRoot(TabsPage))
      .catch((error) => console.log(error));
  }
}
