import { Component } from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { User } from "../../models/user";
import {ProfileService} from "../../services/profile.service";

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

  constructor(private auth: AuthService, private srvProfile: ProfileService, public navCtrl: NavController, private platform: Platform, public navParams: NavParams) {
  }

  async register(user: User, password: string) {
    this.auth.signUp(user.email, password)
      .then((result) => {
        if (result != null) {
          this.createProfile(result.user.uid);
        }
      })
      .catch(error => console.error(error.message))
  }

  registerWithGoogle() {
    this.auth.signUpWithGoogle(this.platform)
      .then((result) => {
          if (result != null && result as User) {
            this.user.username = result.displayName;
            this.user.email = result.email;
            this.user.photoUrl = result.photoURL;

            this.createProfile(result.uid);
          }
      })
      .catch((error) => console.log(error));
}

  private createProfile(userId: string) {
    this.srvProfile.addUser(this.user, userId);
  }

  login() {
    this.navCtrl.pop();
  }
}
