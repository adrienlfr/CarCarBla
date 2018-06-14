import { Component } from '@angular/core';
import { JourneyPage } from "../journey/journey";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  journeyPage = JourneyPage;

  constructor() {}
}
