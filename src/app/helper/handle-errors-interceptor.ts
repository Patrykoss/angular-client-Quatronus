import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error-service';


@Injectable()
export class HandleErrorsInterceptor implements HttpInterceptor {
    
    constructor(private _handleErrorService: HandleErrorService) { }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.error instanceof ErrorEvent) {
                        console.log('This is client side error'); //Client-side
                    } else {
                        this._handleErrorService.handleError(error);
                        console.log('This is server side error'); //Server-side
                    }
                    // return throwError(error);
                    return next.handle(req);
                })
            )

    }
}