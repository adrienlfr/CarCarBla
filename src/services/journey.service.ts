import { Injectable } from "@angular/core";
import { Journey, JOURNEY_PATH} from "../models/journey";
import 'firebase/firestore';
import {FirestoreService} from "./firestore.service";

@Injectable()
export class JourneyService {

  constructor(private firestoreSrv: FirestoreService) {}

  getJourney(collection: string, firstId: string, journeyId: string): Promise<Journey> {
    return new Promise<any>((resolve, reject) => {
      this.firestoreSrv.getSecondDocument(collection, firstId, JOURNEY_PATH, journeyId)
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    });
  }

  getAllJourneys(collection: string, firstId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestoreSrv.getAllSecondDocuments(collection, firstId, JOURNEY_PATH)
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    });
  }

  addJourney(firstCollection: string, firstId: string, journey: Journey): Promise<Journey> {
    return new Promise((resolve, reject) => {
      this.firestoreSrv.addSecondDocument(firstCollection, firstId, JOURNEY_PATH, journey)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  updateJourney(firstCollection: string, firstId: string, journeyId: string, journey: Journey): Promise<Journey> {
    return new Promise((resolve, reject) => {
      this.firestoreSrv.updateSecondDocument(firstCollection, JOURNEY_PATH, firstId, journeyId, journey)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  deleteJourney(firstCollection: string, firstId: string, secondId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firestoreSrv.deleteSecondDocument(firstCollection, firstId, JOURNEY_PATH, secondId)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

}
