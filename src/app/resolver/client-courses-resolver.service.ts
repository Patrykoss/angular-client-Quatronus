import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientService } from '../client/client.service';
import { ClientCourse } from '../clientCourse/clientCourse';

@Injectable({
  providedIn: 'root'
})
export class ClientCoursesResolverService implements Resolve<ClientCourse> {

  constructor(
    private _clientService: ClientService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<any> | Promise<any> {
    const idClient = route.paramMap.get('idClient');
    if(!idClient || isNaN(Number(idClient)) || idClient.includes('.'))
        return [];

    return this._clientService.getClientCourses(Number(idClient));
  }
}
