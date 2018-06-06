import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from "../../services/auth.service";
// import { storage, initializeApp } from 'firebase';

import { LoginPage } from "../login/login";
import { User } from "../../models/user";
import {ProfileService} from "../../services/profile.service";
import {CarsPage} from "../cars/cars";
import {TabsPage} from "../tabs/tabs";
import {FirestoreService} from "../../services/firestore.service";
// import * as firebase from "firebase";
// import {Camera, CameraOptions} from "@ionic-native/camera";

@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html'
})
export class ProfilPage {

  user = {} as User;
  isInitProfile: boolean = false;
  isChanged: boolean = false;

  constructor(private auth: AuthService,private fires: FirestoreService, private profileSrv: ProfileService, public navCtrl: NavController, public navParams: NavParams) {
    if (this.navParams.get('isInitProfile')) {
      this.isInitProfile = true;
      this.isChanged = true;
      this.loadProfile();
    } else {
      this.user = TabsPage.user;
    }
  }

  logout(){
    this.auth.signOut()
      .then(() => this.navCtrl.setRoot(LoginPage));
  }

  onClickCarsButton() {
    this.navCtrl.push(CarsPage);
  }

  private loadProfile() {
    this.user.email = this.auth.email;
    this.user.username = this.auth.displayName;
    if ( this.auth.photoURL != null ) {
      this.user.photoUrl = this.auth.photoURL;
    } else {
      this.user.photoUrl = 'assets/imgs/default_avatar.png';
    }
  }

  saveProfile() : void {
    if ( this.isInitProfile ) {
      this.fires.addDocument("Test", {name: 'Adrien', value: 'test'});
      /*this.profileSrv.addUser(this.auth.uid, this.user)
        .then(() => {
          this.isChanged = false;
          this.isInitProfile = false;
          this.navCtrl.setRoot(TabsPage)
        })
        .catch((e) => console.error(e));*/
    } else {
      this.profileSrv.updateUser(this.auth.uid, this.user);
    }
  }

  /*async takePhoto() {
    try {
      const options: CameraOptions = {
        quality: 50,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      };

      const result = await this.camera.getPicture(options);
      const image = `data:image/jpeg;base64,${result}`;
      const pictures = storage().ref('pictures');
      pictures.putString(image, 'data_url');

    } catch (e) {
      console.error(e.message);
    }
  }*/

}
