import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clientsUrl= 'http://localhost:3000/api/auth';

  constructor(
    private _http: HttpClient,
    private _translateService: TranslateService,
    private _toastr: ToastrService,
    private _router: Router) { }

  registerAccount(data: any):Observable<any> {
    const newAccount = 
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          password: data.password
        };

    return this._http.post<any>(`${this.clientsUrl}/register`, newAccount).pipe(
      catchError(this.handleError<any>())
    );
  }

  signIn(data: any): Observable<any> {
    const newLog = 
        {
          email: data.email,
          password: data.password
        };
    return this._http.post<any>(`${this.clientsUrl}/signIn`, newLog).pipe(
      catchError(this.handleError<any>())
    );
  }

  logOut(){
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('idClient');
    localStorage.removeItem('role')
    localStorage.removeItem('userName')
    this._router.navigate([''])
    this._toastr.success('', this._translateService.instant('allerts.logOut'), {
      timeOut: 3000,
      positionClass: 'toast-bottom-right' });
  }

  refreshToken(): Observable<any>{
    const data = {
      refreshToken: localStorage.getItem('refreshToken')
    }
    return this._http.post<any>(`${this.clientsUrl}/refreshToken`, data);;
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
