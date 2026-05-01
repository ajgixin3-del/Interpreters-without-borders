import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DemoDialog } from './demo-dialog';

@Component({
  selector: 'app-welcome-page',
  imports: [RouterLink, MatButton],
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.css',
})
export class WelcomePage {
  private readonly dialog: MatDialog = inject(MatDialog);

  constructor() {
    this.dialog.open(DemoDialog);
  }
}
