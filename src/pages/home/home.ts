import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SearchJourneyPage } from "../search-journey/search-journey";
import { JourneyPage } from "../journey/journey";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  searchJourneyPage: any;
  journeyPage: any;

  constructor(public navCtrl: NavController) {
    this.searchJourneyPage = SearchJourneyPage;
    this.journeyPage = JourneyPage;
  }

}
