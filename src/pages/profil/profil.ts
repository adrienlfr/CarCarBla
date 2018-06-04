import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';

import { AuthService } from "../../services/auth.service";
// import { storage, initializeApp } from 'firebase';

import { LoginPage } from "../login/login";
import { User } from "../../models/user";
import {ProfileService} from "../../services/profile.service";
import {CarsPage} from "../cars/cars";
// import * as firebase from "firebase";
// import {Camera, CameraOptions} from "@ionic-native/camera";

@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html'
})
export class ProfilPage {

  user = {} as User;

  constructor(private auth: AuthService, private profileSrv: ProfileService, public navCtrl: NavController, private alertCtrl: AlertController) {}

  ionViewDidLoad() {
    this.checkPhotoURL();
    this.loadProfile();
  }

  logout(){
    this.auth.signOut();
    this.navCtrl.setRoot(LoginPage);
  }

  onClickCarsButton() {
    this.navCtrl.push(CarsPage);
  }

  private loadProfile() {
    this.profileSrv.getUser(this.auth.uid())
      .then((result) => {
        this.user = result;
        this.checkPhotoURL();
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

  private checkPhotoURL() {
    if ( this.user.photoUrl == null ) {
      this.user.photoUrl = 'assets/imgs/default_avatar.png';
    }
  }

  updateProfile() : void {
    this.profileSrv.updateUser(this.auth.uid(), this.user);
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
