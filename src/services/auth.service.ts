import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase/app';
import { ConnectionUser } from "../models/connectionUser";
import { GooglePlus } from "@ionic-native/google-plus";
import { Platform } from "ionic-angular";
import {User} from "firebase";

@Injectable()
export class AuthService {
  user: firebase.User;

  constructor(public afAuth: AngularFireAuth, private gplus: GooglePlus) {
    afAuth.authState.subscribe(user => {
      this.user = user;
    })
  }

  signInWithEmail(user: ConnectionUser) {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  signUp(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
          if (result as User) {
            resolve(result);
          } else {
            console.error("Pas de User");
            resolve(null);
          }
        })
        .catch((error) => reject(error));
    });
  }

  get authenticated(): boolean {
    return this.user != null;
  }

  get uid(): string {
    return this.user && this.user.uid;
  }
  get email(): string {
    return this.user && this.user.email;
  }
  get displayName(): string {
    return this.user && this.user.displayName;
  }
  get photoURL(): string {
    return this.user && this.user.photoURL;
  }

  updateProfile(profile: {displayName: string | null, photoURL: string | null}) {
    this.user.updateProfile(profile);
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  signUpWithGoogle(platform: Platform): Promise<any> {
    return new Promise((resolve, reject) => {
      if (platform.is('cordova')) {
        this.oauthSignInCordova()
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      } else {
        this.webGoogleLogin()
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      }
    });
  }

  async signInWithGoogle(platform: Platform) {
    if (platform.is('cordova')) {
      return await this.oauthSignInCordova();
    } else {
      return await this.webGoogleLogin();
    }
  }

  private oauthSignInCordova(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gplus.login({
        'webClientId': '865446848271-f4pdcffqg5f6bmq7k8o5o5u1p0ojqe9t.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'https://www.googleapis.com/auth/datastore'
      })
        .then((gplusUser) => {
          this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))
            .then((result) => {
              if (result as User) {
                resolve(result.user);
              } else {
                console.error("Pas de User");
                resolve(null);
              }
            })
            .catch((error) => reject(error))
        })
        .catch((error) => reject(error));
    });
  }

  private async webGoogleLogin(): Promise<any> {
    return new Promise<any> ((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      this.afAuth.auth.signInWithPopup(provider)
        .then((result) => {
          if (result as User) {
            resolve(result.user);
          } else {
            console.error("Pas de User");
            resolve(null);
          }
        })
        .catch((error) => reject(error))
    });
  }
}
