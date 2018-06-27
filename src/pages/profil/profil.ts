import { Component } from '@angular/core';
import {ActionSheetController, NavController, NavParams} from 'ionic-angular';

import { AuthService } from "../../services/auth.service";
import { storage } from 'firebase';

import { LoginPage } from "../login/login";
import {User, USER_PATH} from "../../models/user";
import { TabsPage } from "../tabs/tabs";
import { FirestoreService } from "../../services/firestore.service";
import { Camera, CameraOptions } from "@ionic-native/camera";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html'
})
export class ProfilPage {

  user = {} as User;
  profilForm: FormGroup;
  isInitProfile: boolean = false;

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

  constructor(private auth: AuthService, private camera: Camera, private firestore: FirestoreService,
              public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController , private formBuilder: FormBuilder) {

    if (this.navParams.get('isInitProfile')) {
      this.isInitProfile = true;
      this.loadProfile();
    } else {
      this.user = TabsPage.user;
      this.configValidator(this.user.username, this.user.firstname, this.user.lastname);
    }
  }

  logout(){
    this.auth.signOut()
      .then(() => {
        TabsPage.user = {} as User;
        this.navCtrl.setRoot(LoginPage)
      });
  }

  private loadProfile() {
    this.user.email = this.auth.email;
    this.configValidator(this.auth.displayName, "", "");
    if ( this.auth.photoURL != null ) {
      this.user.photoUrl = this.auth.photoURL;
    } else {
      this.user.photoUrl = 'assets/imgs/default_avatar.png';
    }
  }

  private configValidator(username: string, firstname: string, lastname: string) {
    this.profilForm = this.formBuilder.group({
      username: [username, Validators.compose([Validators.required])],
      firstname: [firstname, Validators.compose([Validators.required])],
      lastname: [lastname, Validators.compose([Validators.required])]
    });
  }

  saveProfile() : void {
    this.user.username = this.profilForm.value.username;
    this.user.firstname = this.profilForm.value.firstname;
    this.user.lastname = this.profilForm.value.lastname;

    if ( this.isInitProfile ) {
      this.firestore.setDocument(USER_PATH, this.auth.uid, this.user)
        .then(() => {
          this.isInitProfile = false;
          this.navCtrl.setRoot(TabsPage)
        })
        .catch((e) => console.error(e));
    } else {
      this.firestore.updateDocument(USER_PATH, this.auth.uid, this.user);
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
