import { Component } from '@angular/core';

import { JourneysPage } from '../journeys/journeys';
import { ProfilPage } from '../profil/profil';
import { HomePage } from '../home/home';
import { AuthService } from "../../services/auth.service";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = JourneysPage;
  tab3Root = ProfilPage;

  constructor(private auth: AuthService) {}


  get authenticated(): boolean {
    return this.auth.authenticated;
  }

}
