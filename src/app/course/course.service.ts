import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Course, CourseAdapter} from './course'
import {ClientCourse, ClientCourseAdapter} from './../clientCourse/clientCourse'
import { Client, ClientAdapter } from './../client/client'
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private coursesUrl= 'http://localhost:3000/api/courses';

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private toastr: ToastrService,
    private _courseAdapter: CourseAdapter,
    private _clientAdapter: ClientAdapter,
    private _clientCourseAdapter: ClientCourseAdapter,
    private _translateService: TranslateService) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesUrl)
    .pipe(
      map((courses: Course[]) => courses.map((course:Course)=> this._courseAdapter.adapt(course))),
      catchError(this.handleError<Course[]>())
    );
  }

  getCourse(id: number): Observable<Course> {
    const url = `${this.coursesUrl}/${id}`;
    return this.http.get<Course>(url).pipe(
      map((c: Course) =>{
        const course = this._courseAdapter.adapt(c);
        return course
      }),
      catchError((err) => {
        if(err.status == 404)
            this.router.navigate(['/courses']);   
        return throwError(() => err);
      })
    );
  }

  getExtendedCourse(id: number): Observable<Course> {
    const url = `${this.coursesUrl}/${id}/admin`;
    return this.http.get<Course>(url).pipe(
      map((c: Course) =>{
        const course = this._courseAdapter.adapt(c);
          course.clientCourse = c.clientCourse.map((cc: ClientCourse)=> {
          const clientCourse:ClientCourse = this._clientCourseAdapter.adapt(cc)
          clientCourse.client = this._clientAdapter.adapt(cc.client);
          return clientCourse
        })
        return course
      }),
      catchError((err) => {
        if(err.status == 404)
            this.router.navigate(['/courses']);   
        return throwError(() => err);
      })
    );
  }

  addCourse(data: any):Observable<Number> {
    const newCourse = 
        {
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate
        };

    return this.http.post<Number>(this.coursesUrl, newCourse).pipe(
      catchError(this.handleError<Number>(`addCourse`))
    );
  }

  updateCourse(data: any):Observable<Boolean> {
    const url = `${this.coursesUrl}/${data.id}`;
    const newCourse = 
        {
          id: data.id,
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate
        };

    return this.http.put<boolean>(url, newCourse).pipe(
      catchError(this.handleError<boolean>(`editCourse`))
    );
  }

  deleteCourse(id: number): Observable<any> {
    const url = `${this.coursesUrl}/${id}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError<any>('deleteCourse'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
