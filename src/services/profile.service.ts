import { Injectable } from "@angular/core";
import { User, USER_PATH} from "../models/user";
import 'firebase/firestore';
import {FirestoreService} from "./firestore.service";

@Injectable()
export class ProfileService {

  constructor(private firestoreSrv: FirestoreService) {}

  getUser(userId: string): Promise<User> {
    return new Promise<any>((resolve, reject) => {
      this.firestoreSrv.getDocument(USER_PATH, userId)
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    });
  }

  getAllUsers(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestoreSrv.getDocuments(USER_PATH)
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    });
  }

  addUser(userId: string, user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      this.firestoreSrv.setDocument(USER_PATH, userId, user)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  updateUser(userId: string, user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      this.firestoreSrv.updateDocument(USER_PATH, userId, user)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  deleteUser(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firestoreSrv.deleteDocument(USER_PATH, userId)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

}
