import { Routes } from "@angular/router";
import { ForexLandingPageComponent } from "./pages/forex-landing-page/forex-landing-page.component";
import { ForexDetailPageComponent } from "./pages/forex-detail-page/forex-detail-page.component";
import { MessagesComponent } from "./pages/messages/messages.component";

export const routes: Routes = [
  { path: '', component: ForexLandingPageComponent},
  { path: 'detail/:id', component: ForexDetailPageComponent},
];
