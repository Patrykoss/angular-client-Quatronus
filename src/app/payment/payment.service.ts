import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { PaymentMethod, PaymentMethodAdapter } from './paymentMethod'
import { PaymentStatus, PaymentStatusAdapter } from './paymentStatus'
import { Payment, PaymentAdapter } from './payment'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentsUrl= 'http://localhost:3000/api/payments';

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _paymentMethodAdapter: PaymentMethodAdapter,
    private _paymentStatusAdapter: PaymentStatusAdapter,
    private _paymentAdapter: PaymentAdapter) { }

  getPayments(): Observable<any[]> {
    return this._http.get<any[]>(this.paymentsUrl);
  }

  getClientPayments(idClient: number): Observable<any[]> {
    return this._http.get<any[]>(`${this.paymentsUrl}/client/${idClient}`);
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
      return this._http.get<PaymentMethod[]>(`${this.paymentsUrl}/method`)
      .pipe(
        map(
          (methods: PaymentMethod[]) => methods.map((method:PaymentMethod)=> this._paymentMethodAdapter.adapt(method))));
    }

  getPaymentStatuses(): Observable<PaymentStatus[]> {
      return this._http.get<PaymentStatus[]>(`${this.paymentsUrl}/status`)
      .pipe(
        map(
          (statuses: PaymentStatus[]) => statuses.map((status:PaymentStatus)=> this._paymentStatusAdapter.adapt(status)))
      );
   }

   getPaymentById(id: number): Observable<Payment> {
    const url = `${this.paymentsUrl}/${id}`;
    return this._http.get<Payment>(url).pipe(
      map((p: Payment) =>{
        const payment = this._paymentAdapter.adapt(p);
        return payment;
      }),
      catchError((err) => {
             this._router.navigate([`/clients/${id}/payments`]);
        return throwError(() => err);
      })
    );
  }

  addPayment(data: any):Observable<any> {
    return this._http.post<any>(this.paymentsUrl, data);
  }

  updatePayment(data: any):Observable<any> {
    const url = `${this.paymentsUrl}/${data.id}`;
    return this._http.put<any>(url, data);
  }


}
