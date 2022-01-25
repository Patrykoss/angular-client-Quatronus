import { Component, OnInit } from '@angular/core';

import { ClientCourse } from '../clientCourse';
import { ClientCourseService } from '../client-course.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-clients-courses',
  templateUrl: './clients-courses.component.html',
  styleUrls: ['./clients-courses.component.scss', './../../../assets/scss/table.scss', './../../../assets/scss/table-clientCourse.scss' ]
})
export class ClientsCoursesComponent implements OnInit {

  clientsCourses:ClientCourse[] = [];

  constructor(
    private _clientCourseService: ClientCourseService, 
    private _toastr: ToastrService,
    private _translateService: TranslateService) { 

  }

  ngOnInit(): void {
    this.getClientsCourses();
  }

  getClientsCourses(): void {
    this._clientCourseService.getClientsCourses()
        .subscribe( clientsCourses=> this.clientsCourses = clientsCourses);
  }

  askBeforeDelete(clientCourse: ClientCourse) {
    if(confirm(this._translateService.instant('clientCourse-page.alerts.questionDelete') + '?')) {
      this.clientsCourses = this.clientsCourses.filter(c => c !== clientCourse);
      this._clientCourseService.deleteClientCouse(clientCourse.id).subscribe((res)=>{
        if(res && res.success)
          this._toastr.success('', this._translateService.instant('clientCourse-page.alerts.deleted'), {
            timeOut: 3000,
            positionClass: 'toast-bottom-right' });
      })
    }
  }

  getLang(): string {
    const lang = localStorage.getItem('lang');
    if(lang)
      return lang
    return '';
  }

}
