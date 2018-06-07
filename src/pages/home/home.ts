import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { JourneyPage } from "../journey/journey";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {}

  searchJourney(){
    this.navCtrl.push(JourneyPage, {isSearch: true});
  }

  addJourney(){
    this.navCtrl.push(JourneyPage, {isSearch: false});
  }
}
