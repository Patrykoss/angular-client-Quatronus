import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentService } from '../payment/payment.service';
import { PaymentMethod } from '../payment/paymentMethod';


@Injectable({
  providedIn: 'root'
})
export class PaymentMethodsResolverService implements Resolve<PaymentMethod> {

  constructor(
    private _paymentService: PaymentService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<any> | Promise<any> {
    return this._paymentService.getPaymentMethods();
  }
}
