import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ClientCourse, ClientCourseAdapter } from './clientCourse';
import { Client, ClientAdapter } from './../client/client';
import { Course, CourseAdapter } from './../course/course';
import { Payment, PaymentAdapter } from './../payment/payment';
import { PaymentStatus, PaymentStatusAdapter } from '../payment/paymentStatus';
import { PaymentMethod, PaymentMethodAdapter } from '../payment/paymentMethod';

@Injectable({
  providedIn: 'root'
})
export class ClientCourseService {

  private clientCourseUrl= 'http://localhost:3000/api/clientCourse';

  constructor(
    private _http: HttpClient, 
    private _router: Router,
    private _clientCourseAdapter: ClientCourseAdapter,
    private _clientAdapter: ClientAdapter,
    private _courseAdapter: CourseAdapter,
    private _paymentAdapter: PaymentAdapter,
    private _paymentStatusAdapter: PaymentStatusAdapter,
    private _paymentMethodAdapter: PaymentMethodAdapter,) { }

  getClientsCourses(): Observable<ClientCourse[]> {
    return this._http.get<ClientCourse[]>(this.clientCourseUrl)
    .pipe(
      catchError(this.handleError<ClientCourse[]>())
    );
  }

  getClientCourse (id: number): Observable<ClientCourse> {
    const url = `${this.clientCourseUrl}/${id}`;
    return this._http.get<ClientCourse>(url).pipe(
      map((cc: ClientCourse) =>{
        const clientCourse = this._clientCourseAdapter.adapt(cc)
        clientCourse.client = cc.client && this._clientAdapter.adapt(cc.client);
        clientCourse.course = cc.course && this._courseAdapter.adapt(cc.course);
        clientCourse.payments = cc.payments.map((payment: Payment) =>{
          const payments: Payment = this._paymentAdapter.adapt(payment)
          payments.paymentStatus = payment.paymentStatus && this._paymentStatusAdapter.adapt(payment.paymentStatus);
          payments.paymentMethod = payment.paymentMethod && this._paymentMethodAdapter.adapt(payment.paymentMethod);
          return payments;
        })
        return clientCourse;
      })
      ,
      catchError((err) => {
        if(err.status == 404)
            this._router.navigate(['/clientCourse']);
        return throwError(() => err);
      })
    );
  }

  addClientCourse(data: any):Observable<Boolean> {
    const newClientCourse = 
        {
          idCourse: data.idCourse,
          idClient: data.idClient,
          dateJoining: data.dateJoining,
          getCertificate: data.getCertificate
        };

    return this._http.post<boolean>(this.clientCourseUrl, newClientCourse).pipe(
      catchError(this.handleError<boolean>(`addClientCourse`))
    );
  }

  updateClientCourse(data: any):Observable<any> {
    const url = `${this.clientCourseUrl}/${data.idClientCourse}`;
    const newClientCourse = 
        {
          idCourse: data.idCourse,
          idClient: data.idClient,
          dateJoining: data.dateJoining,
          getCertificate: data.getCertificate
        };

    return this._http.put<any>(url, newClientCourse).pipe(
      catchError(this.handleError<any>(`editClientCourse`))
    );
  }

  deleteClientCouse(id: number): Observable<any> {
    const url = `${this.clientCourseUrl}/${id}`;
    return this._http.delete<any>(url).pipe(
      catchError(this.handleError<any>('deleteClientCourse'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

}
