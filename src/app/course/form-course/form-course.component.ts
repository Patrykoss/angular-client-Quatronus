import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Course }  from '../course';
import { CourseService } from '../course.service';
import { FormType } from '../../utils/formType'
import { TranslateService } from '@ngx-translate/core';
import { AuthGuardService } from 'src/app/helper/auth-guard.service';

@Component({
  selector: 'app-form-course',
  templateUrl: './form-course.component.html',
  styleUrls: ['./form-course.component.scss', './../../../assets/scss/table.scss','./../../../assets/scss/form.scss']
})
export class FormCourseComponent implements OnInit {
  course: Course | undefined;
  courseForm: FormGroup;
  formType: FormType | undefined;
  baseStartDate: Date | undefined;

  constructor(private _route: ActivatedRoute,
    private _courseService: CourseService,
    private _toastr: ToastrService,
    private _router: Router,
    private _translateService: TranslateService,
    public authGuard: AuthGuardService) {
      this._route.data.subscribe((data:any) => {
        this.course = data.course
        this.baseStartDate = data.startDate;
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
        
        this.courseForm = new FormGroup({
          id: new FormControl({value:  this.course?.id, disabled: false}),
          name: new FormControl({value: this.course?.name, disabled: !editable}, [Validators.required,Validators.minLength(2),Validators.maxLength(70)]),
          description: new FormControl({value: this.course?.description, disabled: !editable}, [Validators.required,Validators.minLength(10),Validators.maxLength(200)]),
          startDate: new FormControl({value: this.course?.startDate, disabled: !editable},[Validators.required, this.checkStartDate]),
          endDate: new FormControl({value: this.course?.endDate, disabled: !editable}, [])
        },
        { validators: this.checkEndDate}
        );
     }

    checkStartDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      if(this.courseForm == null || control.value == '' || control.value === undefined || this.formType == FormType.edit) 
        return null;
      let date = new Date();
      const nowDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return !(new Date(control.value) >= nowDate) ? { invalidStartDate: true } : null;
    };

    checkEndDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      if(this.courseForm == null || this.endDate?.value == '' || this.endDate?.value === undefined || this.endDate?.value === null)
        return null;

      if((this.startDate?.value === undefined || this.startDate?.value == '') && !(this.endDate?.value == undefined))
        return {inv: true}
      
      return !(this.endDate?.value >= this.startDate?.value) ? { invalidEndDate: true } : null;
    };

    get startDate() { return this.courseForm.get('startDate'); }
    get endDate() { return this.courseForm.get('endDate'); }

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.formType == FormType.add){
      let num;
      this._courseService.addCourse(this.courseForm.value).subscribe((idCourse) => {
        num = idCourse;
      })
      this._router.navigate([`/courses/details/${num}`]);
      this._toastr.success('', this._translateService.instant('course-page.alerts.addedNew'), {
        timeOut: 3000,
        positionClass: 'toast-bottom-right' });
    } else if(this.formType == FormType.edit){
      this._courseService.updateCourse(this.courseForm.value).subscribe(()=>{
        this._router.navigate([`/courses/details/${this.courseForm.value.id}`]);
      });
        this._toastr.success('', this._translateService.instant('course-page.alerts.updated'), {
          timeOut: 3000,
          positionClass: 'toast-bottom-right' });
    }
  }

}
