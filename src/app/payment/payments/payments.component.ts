import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../payment.service';
import { PaymentMethodEnum } from './../../utils/paymentMethodEnum';
import { PaymentStatusEnum } from './../../utils/paymentStatusEnum';
import { AuthGuardService } from 'src/app/helper/auth-guard.service';
import { ClientService } from 'src/app/client/client.service';


@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss', './../../../assets/scss/table.scss']
})
export class PaymentsComponent implements OnInit {
  payments: any[] = [];
  paymentMethodEnum = PaymentMethodEnum;
  paymentStatusEnum = PaymentStatusEnum;
  idClient: number | undefined;
  coursesAssigned: boolean | undefined = undefined;
  constructor(
        private _route: ActivatedRoute,
        private _paymentService: PaymentService, 
        private _router: Router,
        public authGuard: AuthGuardService,
        private _clientService: ClientService) { }

  ngOnInit(): void {
    this.idClient = Number(this._route.snapshot.paramMap.get('idClient'));
    if(this.idClient){
      this._paymentService.getClientPayments(this.idClient).subscribe((data)=>{
        this.payments = data;
      })
      this._clientService.getClientCourses(this.idClient).subscribe((res)=> this.coursesAssigned = res.length>0)

    }
      
    else
      this._router.navigate(['/clients']);
      
  }


}

