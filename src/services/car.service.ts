import { Injectable } from "@angular/core";
import { Car, CAR_PATH} from "../models/car";
import 'firebase/firestore';
import {FirestoreService} from "./firestore.service";
import {USER_PATH} from "../models/user";

@Injectable()
export class CarService {

  constructor(private firestoreSrv: FirestoreService) {}

  getCar(collection: string, firstId: string, carId: string): Promise<Car> {
    return new Promise<any>((resolve, reject) => {
      this.firestoreSrv.getSecondDocument(collection, firstId, CAR_PATH, carId)
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    });
  }

  getAllCars(collection: string, firstId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firestoreSrv.getAllSecondDocuments(collection, firstId, CAR_PATH)
        .then((result) => resolve(result))
        .catch((error) => reject(error))
    });
  }

  addCar(firstCollection: string, firstId: string, car: Car): Promise<Car> {
    return new Promise((resolve, reject) => {
      this.firestoreSrv.addSecondDocument(firstCollection, firstId, CAR_PATH, car)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  updateCar(firstCollection: string, firstId: string, carId: string, car: Car): Promise<Car> {
    return new Promise((resolve, reject) => {
      this.firestoreSrv.updateSecondDocument(firstCollection, USER_PATH, firstId, carId, car)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  deleteCar(firstCollection: string, firstId: string, secondId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firestoreSrv.deleteSecondDocument(firstCollection, firstId, CAR_PATH, secondId)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

}
