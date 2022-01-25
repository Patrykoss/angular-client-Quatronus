import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth.service';
import { TranslateService } from '@ngx-translate/core';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-form-sign-in',
  templateUrl: './form-sign-in.component.html',
  styleUrls: ['./form-sign-in.component.scss','./../../../../assets/scss/form.scss']
})
export class FormSignInComponent implements OnInit {
  signInForm: FormGroup =  new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private __authService: AuthService,
    private _toastr: ToastrService,
    private _router: Router,
    private _translateService: TranslateService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.__authService.signIn(this.signInForm.value).subscribe((res)=>{
      if(res && res.accessToken && res.refreshToken) {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        let tokenInfo = this.getDecodedAccessToken(res.accessToken);
        localStorage.setItem('role', tokenInfo.role);
        localStorage.setItem('userName', tokenInfo.userName);
        localStorage.setItem('idClient', tokenInfo.id);
        this._router.navigate([''])
        this._toastr.success('', this._translateService.instant('auth-page.alerts.loggedIn'), {
          timeOut: 3000,
          positionClass: 'toast-bottom-right' })
      }else{
        this._toastr.error('', this._translateService.instant('auth-page.errors.unknown'), {
          timeOut: 3000,
          positionClass: 'toast-bottom-right' })
      }
    })
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }
  

}
