import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Journey} from "../../models/journey";
import {Car} from "../../models/car";

/**
 * Generated class for the CarsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cars',
  templateUrl: 'cars.html',
})
export class CarsPage {

  cars: Car[];
  tabBarElement: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar');
    this.cars =[
      {model: '206', isActive: true},
      {model: 'Ford fiesta', isActive: false }
    ]
  }

  ionViewDidLoad() {
    if (this.tabBarElement != null) {
      this.tabBarElement.style.display = 'none';
    }
  }
  ionViewWillLeave() {
    if (this.tabBarElement != null) {
      this.tabBarElement.style.display = 'flex';
    }
  }

}
