import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { FormType } from '../../utils/formType'
import { TranslateService } from '@ngx-translate/core';
import { AuthGuardService } from 'src/app/helper/auth-guard.service';
import { Payment } from '../payment';
import { PaymentMethod } from '../paymentMethod';
import { PaymentStatus } from '../paymentStatus';
import { ClientCourse } from 'src/app/clientCourse/clientCourse';
import { PaymentService } from '../payment.service';
import { PaymentMethodEnum } from './../../utils/paymentMethodEnum';
import { PaymentStatusEnum } from './../../utils/paymentStatusEnum';

@Component({
  selector: 'app-form-payment',
  templateUrl: './form-payment.component.html',
  styleUrls: ['./form-payment.component.scss', './../../../assets/scss/table.scss','./../../../assets/scss/form.scss']
})
export class FormPaymentComponent implements OnInit {

    payment: Payment | undefined;
    paymentForm: FormGroup;
    formType: FormType | undefined;
    courses: ClientCourse[] = [];
    paymentMethods: PaymentMethod[] = [];
    paymentStatuses: PaymentStatus[] = [];
    paymentMethodEnum = PaymentMethodEnum;
    paymentStatusEnum = PaymentStatusEnum;
    idClient: number | undefined;
  
    constructor(private _route: ActivatedRoute,
      private _toastr: ToastrService,
      private _router: Router,
      private _translateService: TranslateService,
      public authGuard: AuthGuardService,
      private _paymentService: PaymentService) {
        this._route.data.subscribe((data:any) => {
            this.paymentMethods = data.paymentMethods,
            this.paymentStatuses = data.paymentStatuses,
            this.payment = data.payment,
            this.courses = data.courses
         });
        this.idClient = Number(this._route.snapshot.paramMap.get('idClient'));
        if(this.payment)
          this.formType = FormType.edit;
        else
          this.formType = FormType.add;

          this.paymentForm = new FormGroup({
            id: new FormControl({value:  this.payment?.id, disabled: false}),
            idStatus: new FormControl({value: this.formType == FormType.add?'':this.payment?.idStatus, disabled: this.authGuard.isUser() || false},[Validators.required]),
            idMethod: new FormControl({value: this.formType == FormType.add?'':this.payment?.idMethod, disabled: false},[Validators.required]),
            date: new FormControl({value: this.payment?.date, disabled: false},[Validators.required]),
            amount: new FormControl({value: this.payment?.amount, disabled: false},[Validators.required,Validators.pattern(/^([0-9]{1,5}[.]{0,1})[0-9]{0,2}$/)]),
            idClientCourse: new FormControl({value: this.formType == FormType.add?'':this.payment?.idClientCourse, disabled: false},[Validators.required]),
          }
          );
       }
  
    ngOnInit(): void {
    }
  
    onSubmit() {
      if(this.formType == FormType.add){
        console.log(this.paymentForm.value)
        this._paymentService.addPayment(this.paymentForm.value).subscribe((result) => {
          if(result.success){
            this._router.navigate([`/clients/${this.courses[0].client.id}/payments`]);
            this._toastr.success('', this._translateService.instant('payment-page.alerts.addedNew'), {
              timeOut: 3000,
              positionClass: 'toast-bottom-right' });
          }
        })
      } 
      else if(this.formType == FormType.edit){
        this._paymentService.updatePayment(this.paymentForm.value).subscribe((result)=>{
          if(result.success){
            this._router.navigate([`/clients/${this.courses[0].client.id}/payments`]);
            this._toastr.success('', this._translateService.instant('payment-page.alerts.updated'), {
              timeOut: 3000,
              positionClass: 'toast-bottom-right' });
          }
        });
          
      }
    }

}

