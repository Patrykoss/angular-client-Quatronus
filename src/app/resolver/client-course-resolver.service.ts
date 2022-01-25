import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import {ClientCourseService} from './../clientCourse/client-course.service'
import {ClientCourse} from './../clientCourse/clientCourse'

@Injectable({
  providedIn: 'root'
})
export class ClientCourseResolverService implements Resolve<ClientCourse> {

  constructor(
      private _clientCourseService: ClientCourseService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    let idClient = route.queryParams['idClient'];
    let idCourse = route.queryParams['idCourse'];
    const idClientCourse = route.paramMap.get('id');
    if(!idClientCourse || isNaN(Number(idClientCourse)) || idClientCourse.includes('.'))
        return new ClientCourse(0,idClient,idCourse,undefined!,false);
 
    return this._clientCourseService.getClientCourse(parseInt(idClientCourse));
  }
}

