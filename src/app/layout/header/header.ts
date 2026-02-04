import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [MatToolbar, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}
