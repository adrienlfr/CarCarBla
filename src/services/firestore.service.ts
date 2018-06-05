import { Injectable } from "@angular/core";
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class FirestoreService {

  private db: any;

  constructor() {
    this.db = firebase.firestore();
  }

  getDocument(collection: string, docId: string | null): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(collection).doc(docId).get()
        .then((querySnapshot) => resolve(querySnapshot.data()))
        .catch((error: any) => reject(error));
    });
  }

  getAllDocuments(collection: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(collection).get()
        .then((querySnapshot) => {
          let arr = [];
          querySnapshot.forEach(function (doc) {
            let obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id;
            arr.push(obj);
          });
          if (arr.length > 0) {
            console.log("Document data:", arr);
            resolve(arr);
          } else {
            console.log("No such document!");
            resolve(null);
          }
        })
        .catch((error: any) => reject(error));
    });
  }

  deleteDocument(collectionName: string, docID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).doc(docID).delete()
        .then((obj: any) => resolve(obj))
        .catch((error: any) => reject(error));
    });
  }

  addDocument(collectionName: string, docId: string, dataObj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).doc(docId).set(dataObj)
        .then((obj: any) => resolve(obj))
        .catch((error: any) => reject(error));
    });
  }

  updateDocument(collectionName: string, docID: string, dataObj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).doc(docID).update(dataObj)
        .then((obj: any) => resolve(obj))
        .catch((error: any) => reject(error));
    });
  }
}
