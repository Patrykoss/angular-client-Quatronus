import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthGuardService } from '../helper/auth-guard.service';
import { PaymentService } from '../payment/payment.service';
import { PaymentStatus } from '../payment/paymentStatus';

@Injectable({
  providedIn: 'root'
})
export class PaymentStatutesResolverService implements Resolve<PaymentStatus> {

  constructor(
    private _paymentService: PaymentService,
    private _authGuard: AuthGuardService) { }
    
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<any> | Promise<any> {
    if(this._authGuard.isAdmin())
      return this._paymentService.getPaymentStatuses();
    return [];
  }
}
