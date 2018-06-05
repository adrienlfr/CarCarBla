import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  tabBarElement: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar');
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
