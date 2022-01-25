import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { Course } from '../course';
import { CourseService } from '../course.service';
import { ToastrService } from 'ngx-toastr';
import { AuthGuardService } from 'src/app/helper/auth-guard.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss', './../../../assets/scss/table.scss', './../../../assets/scss/table-course.scss']
})
export class CoursesComponent implements OnInit {
  courses:Course[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _courseService: CourseService, 
    private _toastr: ToastrService,
    private _translateService: TranslateService,
    public authGuard: AuthGuardService) { }

  ngOnInit(): void {
    this._route.data.subscribe((data:any) => {
      this.courses = data.courses });
  }

  askBeforeDelete(course: Course) {
    if(confirm(this._translateService.instant('course-page.alerts.questionDelete')+ course.name + '?')) {
      this.courses = this.courses.filter(c => c !== course);
      this._courseService.deleteCourse(course.id).subscribe((res)=>{
        if(res && res.success)
        this._toastr.success('', this._translateService.instant('course-page.alerts.deleted'), {
          timeOut: 3000,
          positionClass: 'toast-bottom-right' });
      });
     
    }
  }

  getLang(): string {
    const lang = localStorage.getItem('lang');
    if(lang)
      return lang
    return '';
  }
}
