import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Client } from '../client/client';
import { ClientService } from '../client/client.service';

@Injectable({
  providedIn: 'root'
})
export class ClientResolverService implements Resolve<Client> {

  constructor(
    private _clientService: ClientService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Client | Observable<Client> | Promise<Client> | any{
    const idClient = route.paramMap.get('idClient');
    if(route.url[1].path === 'add'){
      return null;
    }
    if(!idClient || isNaN(Number(idClient)) || idClient.includes('.'))
        return null;
    return this._clientService.getClient(Number(idClient));

  }
}
