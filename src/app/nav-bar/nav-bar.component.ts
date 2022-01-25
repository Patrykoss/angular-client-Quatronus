import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from '../helper/auth-guard.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(
    public authGuard : AuthGuardService
  ) { }

  ngOnInit(): void {
  }


}
