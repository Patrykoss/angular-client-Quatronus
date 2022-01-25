import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth/auth.service';
import { AuthGuardService } from '../helper/auth-guard.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  lang: string | undefined | null;
  constructor(
    private _translateService: TranslateService,
    public authGuardService : AuthGuardService,
    private _authService: AuthService) { }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang')
  }

  public selectLanguage(event: any){
    localStorage.setItem('lang', event.target.value)
    this._translateService.use(event.target.value)
  }

  logOut(){
    this._authService.logOut();
  }



}
