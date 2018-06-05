import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { User } from "../../models/user";
import {TabsPage} from "../tabs/tabs";

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

  user = {} as User;
  password: string;

  constructor(private auth: AuthService, public navCtrl: NavController, private platform: Platform) {
  }

  async register(user: User, password: string) {
    this.auth.signUp(user.email, password)
      .then(() => this.navCtrl.setRoot(TabsPage))
      .catch(error => console.error(error.message))
  }

  registerWithGoogle() {
    this.auth.signUpWithGoogle(this.platform)
      .then(() => this.navCtrl.setRoot(TabsPage))
      .catch((error) => console.log(error));
  }

  login() {
    this.navCtrl.pop();
  }
}
