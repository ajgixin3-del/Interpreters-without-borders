import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'offer-translation-page',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './offer-translation-page.html',
  styleUrl: './offer-translation-page.css',
})
export class OfferTranslationPage {}
