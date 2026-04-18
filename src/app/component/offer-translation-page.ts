import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { worldLanguages } from '../world-languages';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'offer-translation-page',
  imports: [RouterLink, MatButtonModule, NgOptionTemplateDirective, NgSelectComponent, FormsModule],
  templateUrl: './offer-translation-page.html',
  styleUrl: './offer-translation-page.css',
})
export class OfferTranslationPage {
  public readonly languages = worldLanguages;
  public knownLanguages: string[] = [];
}
