import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounts-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './accounts-page.component.html',
  styleUrls: ['./accounts-page.component.css']
})
export class AccountsPageComponent {}
