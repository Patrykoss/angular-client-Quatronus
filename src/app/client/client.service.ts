import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Client, ClientAdapter } from './client'
import {ClientCourse, ClientCourseAdapter} from './../clientCourse/clientCourse'
import {CourseAdapter} from './../course/course';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private clientsUrl= 'http://localhost:3000/api/clients';

  constructor(
    private _http: HttpClient, 
    private _router: Router, 
    private _toastr: ToastrService,
    private _clientAdapter: ClientAdapter,
    private _courseAdapter: CourseAdapter,
    private _clientCourseAdapter: ClientCourseAdapter,
    private _translateService: TranslateService) { }

  getClients(): Observable<Client[]> {
    return this._http.get<Client[]>(this.clientsUrl)
    .pipe(catchError(this.handleError<any[]>()));
  }

  getClientCourses(idClient: number): Observable<any[]> {
    return this._http.get<any[]>(`${this.clientsUrl}/${idClient}/courses`)
    .pipe(
        catchError(this.handleError<any[]>())
    );
  }

  getClient(id: number): Observable<Client> {
    const url = `${this.clientsUrl}/${id}`;
    return this._http.get<Client>(url).pipe(
      map((c: Client) =>{
        const client = this._clientAdapter.adapt(c);
        client.clientCourse = c.clientCourse.map((cc: ClientCourse)=> {
          const clientCourse:ClientCourse = this._clientCourseAdapter.adapt(cc)
          clientCourse.course = this._courseAdapter.adapt(cc.course);
          return clientCourse
        })
        return client
      }),
      catchError((err) => {
             this._router.navigate(['/clients']);
        return throwError(() => err);
      })
    );
  }

  checkEmailAvailability(email: string): Observable<Boolean> {
    const url = `${this.clientsUrl}/email/${email}`;
    return this._http.get<boolean>(url).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  addClient(data: any):Observable<Number> {
    const newClient = 
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          email: data.email
        };

    return this._http.post<Number>(this.clientsUrl, newClient).pipe(
      catchError(this.handleError<Number>(`addClient`))
    );
  }

  updateClient(data: any):Observable<Boolean> {
    const url = `${this.clientsUrl}/${data.id}`;
    const newClient = 
        {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          email: data.email
        };

    return this._http.put<boolean>(url, newClient).pipe(
      catchError(this.handleError<boolean>(`editClient`))
    );
  }

  deleteClient(id: number): Observable<any> {
    const url = `${this.clientsUrl}/${id}`;
  
    return this._http.delete<any>(url).pipe(
      catchError(this.handleError<any>('deleteClient'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

}
