import { Component } from '@angular/core';
import {LoadingController, NavController, Platform} from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import {TabsPage} from "../tabs/tabs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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

  registerForm: FormGroup;

  constructor(private auth: AuthService, public navCtrl: NavController, private platform: Platform, private loadingCtrl: LoadingController, private formBuilder: FormBuilder) {
    this.registerForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    })
  }

  async register() {
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

    this.auth.signUp(this.registerForm.value.email, this.registerForm.value.password)
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
