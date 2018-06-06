import { Injectable } from "@angular/core";
import { Journey, JOURNEY_PATH} from "../models/journey";
import 'firebase/firestore';
import {FirestoreService} from "./firestore.service";

@Injectable()
export class JourneyService {

  constructor(private firestoreSrv: FirestoreService) {}

  getJourney(journeyId: string): Promise<Journey> {
    return new Promise<any>((resolve, reject) => {
      this.firestoreSrv.getDocument(JOURNEY_PATH, journeyId)
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    });
  }

  getAllJourneys(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestoreSrv.getAllDocuments(JOURNEY_PATH)
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    });
  }

  addJourney(journey: Journey): Promise<Journey> {
    return new Promise((resolve, reject) => {
      this.firestoreSrv.addDocument(JOURNEY_PATH, journey)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  updateJourney(journeyId: string, journey: Journey): Promise<Journey> {
    return new Promise((resolve, reject) => {
      this.firestoreSrv.updateDocument(JOURNEY_PATH, journeyId, journey)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  deleteJourney(journeyId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firestoreSrv.deleteDocument(JOURNEY_PATH, journeyId)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

}
