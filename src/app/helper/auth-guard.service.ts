import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
    constructor(
        private _router: Router,
        private _toastr: ToastrService,
        private _translateService: TranslateService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const expectedRole = route.data['expectedRole'];
        if(expectedRole === undefined){
            return true;
        }
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('accessToken');
        if(!role || !token){
            localStorage.removeItem('accessToken');
            localStorage.removeItem('role');
            localStorage.removeItem('userName');
            localStorage.removeItem('idClient');
            this._toastr.error('', this._translateService.instant('httpErros.401'), {
                timeOut: 3000,
                positionClass: 'toast-bottom-right' });
            this._router.navigate(['signIn']);
            return false;
        }
        
        let hasAccess = false;
        for(let r of expectedRole){
            if(r == role)
                hasAccess = true;
        }
        if(!hasAccess){
            this._toastr.error('', this._translateService.instant('httpErros.403'), {
                timeOut: 3000,
                positionClass: 'toast-bottom-right' });
            this._router.navigate(['']);
            return false;
        }
        return true
    }

    isLoggedIn(): boolean {
        const accessToken = localStorage.getItem('accessToken');
        if(!accessToken)
            return false;
        return true;
    }

    isUser(): boolean {
        if(!this.isLoggedIn())
            return false;
        const role = localStorage.getItem('role');
        
        if(role == '' || role === undefined)
            return false;
        if(role == 'User')
            return true;
        return false;
    }

    isAdmin(): boolean {
        if(!this.isLoggedIn())
            return false;
        const role = localStorage.getItem('role');
        if(role == '' || role === undefined)
            return false;
        if(role == 'Admin')
            return true;
        
        return false;
    }

    getUserName(): string | null {
        let email = localStorage.getItem('userName');
        return email;
    }

    getId(): number | null {
        let id = localStorage.getItem('idClient');
        return Number(id);
    }
}