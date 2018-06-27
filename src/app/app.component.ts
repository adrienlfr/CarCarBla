import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {LoginPage} from "../pages/login/login";
import {AuthService} from "../services/auth.service";
import {TabsPage} from "../pages/tabs/tabs";

declare var google: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = LoginPage;
  private platform;

  constructor(
    platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private auth: AuthService)
  {
    this.platform = platform;
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.auth.afAuth.authState
        .subscribe(
          user => {
            if (user) {
              this.statusBar.styleDefault();
              this.splashScreen.hide();
              this.rootPage = TabsPage;
            } else {
              this.statusBar.styleDefault();
              this.splashScreen.hide();
              this.rootPage = LoginPage;
            }
          },
          () => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.rootPage = LoginPage;
          });
    });
  }

}
