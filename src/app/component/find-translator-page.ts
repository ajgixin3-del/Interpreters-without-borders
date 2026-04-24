import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { worldLanguages } from '../world-languages';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'find-translator-page',
  imports: [RouterLink, MatButtonModule, NgOptionTemplateDirective, NgSelectComponent, FormsModule],
  templateUrl: './find-translator-page.html',
  styleUrl: './find-translator-page.css',
})
export class FindTranslatorPage {
  public readonly languages = worldLanguages;
  public knownLanguages: string[] = [];
  public requiredLanguages: string[] = [];
}
