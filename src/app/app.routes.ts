import { Routes } from '@angular/router';
import { WelcomePage } from './component/welcome-page';
import { OfferTranslationPage } from './component/offer-translation-page';
import { FindTranslatorPage } from './component/find-translator-page';

export const routes: Routes = [
  {
    path: '',
    component: WelcomePage,
  },
  {
    path: 'find-translator',
    component: FindTranslatorPage,
  },
  {
    path: 'offer-translation',
    component: OfferTranslationPage,
  },
];
