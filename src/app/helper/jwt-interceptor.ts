import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            return next.handle(req);
        }

        const authReq = req.clone({
            headers: req.headers.set('authorization', `Bearer ${token}`)
          });
          return next.handle(authReq);

    }
}