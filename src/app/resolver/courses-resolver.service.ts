
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, Observable, catchError } from 'rxjs';

import {Course} from '../course/course'
import {CourseService} from '../course/course.service'


@Injectable({
  providedIn: 'root'
})
export class CoursesResolverService implements Resolve<Course>{

  constructor(private _courseService: CourseService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this._courseService.getCourses();
  }
}
