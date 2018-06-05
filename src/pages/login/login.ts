import { Component } from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';

import { AuthService } from "../../services/auth.service";

import {RegisterPage} from "../register/register";
import {TabsPage} from "../tabs/tabs";

import { ConnectionUser } from "../../models/connectionUser";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {} as ConnectionUser;

  constructor(private auth: AuthService, public navCtrl: NavController, private platform: Platform) {

  }

  async login(user: ConnectionUser) {
    try {
      this.auth.signInWithEmail(user).then(
        () => this.navCtrl.setRoot(TabsPage),
        error => console.error(error.message)
      );
    } catch (e) {
      console.error(e.message);
    }
  }

  signup(){
    this.navCtrl.push(RegisterPage);
  }

  loginWithGoogle() {
    this.auth.signInWithGoogle(this.platform)
      .then(
        () => this.navCtrl.setRoot(TabsPage),
        error => console.log(error.message)
      );
  }

}
