import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Payment } from '../payment/payment';
import { PaymentService } from '../payment/payment.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentResolverService implements Resolve<Payment> {

  constructor(
    private _paymentService: PaymentService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Payment | Observable<Payment> | Promise<Payment> | any {
    const idPayment = route.paramMap.get('idPayment');
    if(!idPayment || isNaN(Number(idPayment)) || idPayment.includes('.'))
        return null;

    return this._paymentService.getPaymentById(Number(idPayment));
  }
}
