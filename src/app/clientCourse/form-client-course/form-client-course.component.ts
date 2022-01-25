import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Client }  from '../../client/client';
import { Course }  from '../../course/course';
import { ClientCourse }  from '../clientCourse';
import { ClientCourseService } from '../client-course.service';
import {FormType} from '../../utils/formType'
import { TranslateService } from '@ngx-translate/core';
import { PaymentMethodEnum } from './../../utils/paymentMethodEnum';
import { PaymentStatusEnum } from './../../utils/paymentStatusEnum';

@Component({
  selector: 'app-form-client-course',
  templateUrl: './form-client-course.component.html',
  styleUrls: ['./form-client-course.component.scss', './../../../assets/scss/table.scss','./../../../assets/scss/form.scss']
})
export class FormClientCourseComponent implements OnInit {

  clientCourse: ClientCourse = new ClientCourse(0,0,0,undefined!,false);
  clientCourseForm: FormGroup;
  formType: FormType | undefined;
  clients: Client[] = [];
  courses: Course[] = [];
  paymentMethodEnum = PaymentMethodEnum;
  paymentStatusEnum = PaymentStatusEnum;

  constructor(private _route: ActivatedRoute,
    private _clientCourseService: ClientCourseService,
    private _toastr: ToastrService,
    private _router: Router,
    private _translateService: TranslateService) {

        this._route.data.subscribe((data:any) => {
        this.clients = data.clients
        this.courses = data.courses
        this.clientCourse = data.clientCourse
        });

      let editable = true;
      let urlFormType =  this._route.snapshot.url[1];
      if(urlFormType.toString() === 'details')
        this.formType = FormType.details;
      else if(urlFormType.toString() === 'add')
        this.formType = FormType.add;
      else
        this.formType = FormType.edit;

        if(this.formType == FormType.details)
          editable = false;
        

        if(this.formType == FormType.details || this.formType == FormType.edit){
          if(this.clientCourse === null){
            this._router.navigate(['/']);
            this._toastr.error('', this._translateService.instant('clientCourse-page.errors.noRecord'), {
              timeOut: 3000,
              positionClass: 'toast-bottom-right' });
          }
        }

        this.clientCourseForm = new FormGroup({
          idClientCourse: new FormControl({value: this.clientCourse.id, disabled: !editable}),
          idClient: new FormControl({value: !this.clientCourse.idClient?'':this.clientCourse.idClient, disabled: !editable || this.clientCourse.payments.length > 0}, [Validators.required]),
          idCourse: new FormControl({value: !this.clientCourse.idCourse?'':this.clientCourse.idCourse, disabled: !editable || this.clientCourse.payments.length > 0}, [Validators.required]),
          dateJoining: new FormControl({value: this.clientCourse.dateJoining, disabled: !editable},[Validators.required]),
          getCertificate: new FormControl({value: this.clientCourse.getCertificate, disabled: !editable}, [])
        });
     }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.formType == FormType.add){
      this._clientCourseService.addClientCourse(this.clientCourseForm.value).subscribe((id) => {
        this._router.navigate([`/clientCourse/details/${id}`]);
      })
      this._toastr.success('', this._translateService.instant('clientCourse-page.alerts.addedNew'), {
        timeOut: 3000,
        positionClass: 'toast-bottom-right' });
    } else if(this.formType == FormType.edit){
      this._clientCourseService.updateClientCourse(this.clientCourseForm.value).subscribe((res)=> {
        if(res){
          this._router.navigate([`/clientCourse/details/${this.clientCourseForm.value.idClientCourse}`]);
          this._toastr.success('', this._translateService.instant('clientCourse-page.alerts.updated'), {
            timeOut: 3000,
            positionClass: 'toast-bottom-right'});
        }
      })
        
    }
  }

  

}
