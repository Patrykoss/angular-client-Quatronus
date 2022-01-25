import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Client }  from '../client';
import { ClientService } from '../client.service';
import { FormType } from '../../utils/formType'
import { TranslateService } from '@ngx-translate/core';
import { AuthGuardService } from 'src/app/helper/auth-guard.service';

@Component({
  selector: 'app-form-client',
  templateUrl: './form-client.component.html',
  styleUrls: ['./form-client.component.scss', './../../../assets/scss/table.scss','./../../../assets/scss/form.scss']
})
export class FormClientComponent implements OnInit {

  client: Client | undefined;
  clientForm: FormGroup;
  emailAvailability: boolean = true;
  formType: FormType | undefined;
  baseEmail: string | undefined;
  
  constructor(
    private _route: ActivatedRoute,
    private _clientService: ClientService,
    private _toastr: ToastrService,
    private _router: Router,
    private _translateService: TranslateService,
    public authGuard : AuthGuardService) {  
      this._route.data.subscribe((data:any) => {
        this.client = data.client;
        this.baseEmail = data.email
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
        

        this.clientForm = new FormGroup({
          id: new FormControl({value: this.client?.id, disabled: !editable}),
          firstName: new FormControl({value: this.client?.firstName, disabled: !editable}, [Validators.required,Validators.pattern('^[a-zA-ZąęćłńóśżźĄĘĆŁŃÓŚŹŻ]*$'),Validators.minLength(2),Validators.maxLength(20)]),
          lastName: new FormControl({value: this.client?.lastName, disabled: !editable}, [Validators.required,Validators.pattern('^[a-zA-ZąęćłńóśżźĄĘĆŁŃÓŚŹŻ]*$'),Validators.minLength(2),Validators.maxLength(20)]),
          phoneNumber: new FormControl({value: this.client?.phoneNumber, disabled: !editable},[Validators.required,Validators.pattern('^[0-9]{9}$')]),
          email: new FormControl({value: this.client?.email, disabled: !editable}, [Validators.required,Validators.pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),Validators.maxLength(40)])
        });
    }

  ngOnInit(): void {
  }

  checkAvailability(value:any){
    if(! (this.baseEmail == value)){
      if(this.clientForm.get('email')?.valid){
        
          this._clientService.checkEmailAvailability(value).subscribe(
            res => {
              this.emailAvailability = !res;
          })  
      }else
        this.emailAvailability = true;
      }
    }

  onSubmit() {
    if(this.formType == FormType.add){
      this._clientService.addClient(this.clientForm.value).subscribe((idClient) => {
        this._router.navigate([`/clients/details/${idClient}`])
      })
      this._toastr.success('', this._translateService.instant('client-page.alerts.addedNew'), {
        timeOut: 3000,
        positionClass: 'toast-bottom-right' })
    } else if(this.formType == FormType.edit){
      this._clientService.updateClient(this.clientForm.value).subscribe(()=>{
        this._router.navigate([`/clients/details/${this.clientForm.value.id}`]);
        localStorage.setItem('userName',this.clientForm.value.firstName + ' ' + this.clientForm.value.lastName)
      })
        this._toastr.success('', this._translateService.instant('client-page.alerts.updated'), {
          timeOut: 3000,
          positionClass: 'toast-bottom-right' });
    }
  }

}
