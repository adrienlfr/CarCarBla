import { Component } from '@angular/core';
import {ActionSheetController, NavController, NavParams} from 'ionic-angular';

import { AuthService } from "../../services/auth.service";
import { storage } from 'firebase';

import { LoginPage } from "../login/login";
import { User } from "../../models/user";
import { ProfileService } from "../../services/profile.service";
import { CarsPage } from "../cars/cars";
import { TabsPage } from "../tabs/tabs";
import { FirestoreService } from "../../services/firestore.service";
import { Camera, CameraOptions } from "@ionic-native/camera";

@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html'
})
export class ProfilPage {


  user = {} as User;
  isInitProfile: boolean = false;
  isChanged: boolean = false;

  private options: CameraOptions = {
    quality: 50,
    targetHeight: 600,
    targetWidth: 600,
    allowEdit: true,
    cameraDirection: this.camera.Direction.FRONT,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  };

  constructor(private auth: AuthService, private camera: Camera,
              private fires: FirestoreService, private profileSrv: ProfileService,
              public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController) {
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
      .then(() => {
        TabsPage.user = {} as User;
        this.navCtrl.setRoot(LoginPage)
      });
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
      this.profileSrv.addUser(this.auth.uid, this.user)
        .then(() => {
          this.isChanged = false;
          this.isInitProfile = false;
          this.navCtrl.setRoot(TabsPage)
        })
        .catch((e) => console.error(e));
    } else {
      this.profileSrv.updateUser(this.auth.uid, this.user);
    }
  }

  private async takePhoto() {
    try {
      const result = await this.camera.getPicture(this.options);
      const image = `data:image/jpeg;base64,${result}`;
      const pictures = storage().ref(`${this.auth.uid}/${new Date().toISOString()}`);
      pictures.putString(image, 'data_url').then(() => {
        pictures.getDownloadURL().then((url) => {
          this.user.photoUrl = url;
          if ( !this.isInitProfile ) {
            this.saveProfile();
          }
        })
      });
    } catch (e) {
      console.error(e.message);
    }
  }

  presentActionSheetPicture() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modifier la photo',
      buttons: [
        {
          text: 'Appareil photo',
          handler: () => {
            this.options.sourceType = this.camera.PictureSourceType.CAMERA;
            this.takePhoto();
          }
        },
        {
          text: 'Librairie',
          handler: () => {
            this.options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
            this.takePhoto();
          }
        },
        {
          text: 'Annuler',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

}
