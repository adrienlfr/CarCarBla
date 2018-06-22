import { Component } from '@angular/core';
import {LoadingController, NavController, Platform} from 'ionic-angular';

import { AuthService } from "../../services/auth.service";

import {RegisterPage} from "../register/register";
import {TabsPage} from "../tabs/tabs";

import { ConnectionUser } from "../../models/connectionUser";
import {FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";

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
  registerPage = RegisterPage;
  loginForm: FormGroup;

  constructor(private auth: AuthService, public navCtrl: NavController, private platform: Platform,
              private loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[\w0-9]+@[\w0-9]+\.[\w]+$/gm')])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    })
  }

  async login(user: ConnectionUser) {
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

    try {
      this.auth.signInWithEmail(user).then(
        () => {
          loadingPopup.dismiss();
          this.navCtrl.setRoot(TabsPage)})
        .catch(error => {
              loadingPopup.dismiss();
              console.error(error.message)
            });
    } catch (e) {
      loadingPopup.dismiss();
      console.error(e.message);
    }
  }

  loginWithGoogle() {
    this.auth.signInWithGoogle(this.platform)
      .then(
        () => this.navCtrl.setRoot(TabsPage),
        error => console.log(error.message)
      );
  }

}
