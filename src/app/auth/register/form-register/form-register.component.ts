import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { ClientService } from './../../../client/client.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.scss', './../../../../assets/scss/table.scss','./../../../../assets/scss/form.scss']
})
export class FormRegisterComponent implements OnInit {

  registerForm: FormGroup;
  emailAvailability: boolean = true;
  
  constructor(
    private _toastr: ToastrService,
    private _router: Router,
    private _clientService: ClientService,
    private _translateService: TranslateService,
    private __authService: AuthService) {  
        this.registerForm = new FormGroup({
          id: new FormControl(),
          firstName: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-ZąęćłńóśżźĄĘĆŁŃÓŚŹŻ]*$'),Validators.minLength(2),Validators.maxLength(20)]),
          lastName: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-ZąęćłńóśżźĄĘĆŁŃÓŚŹŻ]*$'),Validators.minLength(2),Validators.maxLength(20)]),
          phoneNumber: new FormControl('',[Validators.required,Validators.pattern('^[0-9]{9}$')]),
          email: new FormControl('', [Validators.required,Validators.pattern(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),Validators.maxLength(40)]),
          password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)])
        });
    }

  ngOnInit(): void {
  }

  checkAvailability(value:any){
      if(this.registerForm.get('email')?.valid){
          this._clientService.checkEmailAvailability(value).subscribe(
            res => {
              this.emailAvailability = !res;
          })  
      }else
        this.emailAvailability = true;
      
    }

  onSubmit() {
      this.__authService.registerAccount(this.registerForm.value).subscribe((res)=>{
        if(res.success == true) {
          this._router.navigate(['/signIn'])
          this._toastr.success('', this._translateService.instant('auth-page.alerts.registered'), {
            timeOut: 3000,
            positionClass: 'toast-bottom-right' })
        } else {
          this._toastr.error('', this._translateService.instant('auth-page.alerts.unregistered'), {
            timeOut: 3000,
            positionClass: 'toast-bottom-right' })
        }
      })
  }

}