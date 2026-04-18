import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'find-translator-page',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './find-translator-page.html',
  styleUrl: './find-translator-page.css',
})
export class FindTranslatorPage {}
