import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})
export class HandleErrorService {
    constructor(
        private _toastrService: ToastrService, 
        private _router: Router,
        private _translateService: TranslateService) { }

    public handleError(err: HttpErrorResponse) {
        let errorMesage: string;
        if (err.error instanceof ErrorEvent) 
            errorMesage = `An error occurred: ${err.error.message}`;
        else {
            switch (err.status) {
                case 400:
                    errorMesage = this._translateService.instant('httpErros.400'); 
                    break;
                case 401:
                    if(err.url == 'http://localhost:3000/api/auth/signIn')
                        errorMesage = this._translateService.instant('auth-page.errors.invalidCredentials'); 
                    else{
                        if(err.error.expired)
                            errorMesage = this._translateService.instant('httpErros.tokenExpired'); 
                        else
                            errorMesage = this._translateService.instant('httpErros.401'); 
                    }
                    break;
                case 403: 
                    errorMesage = this._translateService.instant('httpErros.403'); 
                    break;
                case 404: 
                    errorMesage = this._translateService.instant('httpErros.404'); 
                    break;
                case 500: 
                    errorMesage = this._translateService.instant('httpErros.500'); 
                    break;
                default: 
                    errorMesage = this._translateService.instant('httpErros.default'); 
                    break;
            }
        }
        this._toastrService.error('', errorMesage, {
            timeOut: 3000,
            positionClass: 'toast-bottom-right' });
        if(err.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            localStorage.removeItem('userName');
            localStorage.removeItem('id');
            this._router.navigate(['signIn']);
        }
        if(err.status === 403) {
            this._router.navigate(['']);
        }
    }
}