import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {SearchJourneyPage} from "../search-journey/search-journey";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  searchJourneyPage: any;

  constructor(public navCtrl: NavController) {
    this.searchJourneyPage = SearchJourneyPage;
  }

}
