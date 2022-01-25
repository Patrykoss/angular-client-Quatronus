import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Course } from './../course/course';
import { CourseService } from './../course/course.service';
import { Observable } from 'rxjs';
import { AuthGuardService } from './../helper/auth-guard.service';
import { FormType } from './../utils/formType'

@Injectable({
  providedIn: 'root'
})
export class CourseResolverService implements Resolve<Course> {
  course: Course | undefined;
  constructor(
    private _courseService: CourseService,
    private _authGuard: AuthGuardService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    const idCourse = Number(route.paramMap.get('idCourse'));
    if(route.url[1].path === 'details'){
      if(this._authGuard.isAdmin())
        return this._courseService.getExtendedCourse(idCourse)
      else
        return this._courseService.getCourse(idCourse);
    } else if(route.url[1].path === 'edit'){
      return this._courseService.getCourse(idCourse);
    } else if(route.url[1].path === 'add') {
      return null;
    }
    return null;
  }
}
