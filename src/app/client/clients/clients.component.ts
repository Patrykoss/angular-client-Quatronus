import { Component, OnInit } from '@angular/core';

import { Client } from '../client';
import { ClientService } from '../client.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss' ,'./../../../assets/scss/table.scss', './../../../assets/scss/table-client.scss']
})
export class ClientsComponent implements OnInit {
  clients:Client[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _clientService: ClientService, 
    private _toastr: ToastrService,
    private _translateService: TranslateService) { }

  ngOnInit(): void {
    this._route.data.subscribe((data:any) => {
      this.clients = data.clients });
  }

  askBeforeDelete(client: Client) {
    if(confirm(this._translateService.instant('client-page.alerts.questionDelete') + client.firstName + ' ' + client.lastName + '?')) {
      this.clients = this.clients.filter(c => c !== client);
      this._clientService.deleteClient(client.id).subscribe((res) => {
        if(res && res.success)
          this._toastr.success('', this._translateService.instant('client-page.alerts.deleted'), {
            timeOut: 3000,
            positionClass: 'toast-bottom-right' });
      });
      
    }
  }

  getLang(): string {
    const lang = localStorage.getItem('lang');
    if(lang)
      return lang
    return '';
  }
}
