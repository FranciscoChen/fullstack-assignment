import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForexLandingPageComponent } from './pages/forex-landing-page/forex-landing-page.component';
import { ForexDetailPageComponent } from './pages/forex-detail-page/forex-detail-page.component';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';
import { routes } from './forex.routing';
import { MessagesComponent } from './pages/messages/messages.component';

export const loader = ['en', 'es'].reduce((acc, lang) => {
  acc[lang] = () => import(`./i18n/forex.${lang}.json`);
  return acc;
}, {});

@NgModule({
  declarations: [
    ForexLandingPageComponent,
    ForexDetailPageComponent,
    MessagesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'forex',
        loader
      }
    }
  ],
})
export class ForexModule { }
