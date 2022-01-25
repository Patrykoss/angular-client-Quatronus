import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, Observable, catchError } from 'rxjs';

import {Client} from '../client/client'
import {ClientService} from '../client/client.service'

@Injectable({
  providedIn: 'root'
})
export class ClientsResolverService implements Resolve<Client> {

  constructor(private _clientService: ClientService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
    return this._clientService.getClients();
  }
}
