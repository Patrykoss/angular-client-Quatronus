import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ClientsComponent } from './client/clients/clients.component';
import { FormClientComponent } from './client/form-client/form-client.component';
import { FormCourseComponent } from './course/form-course/form-course.component';
import { CoursesComponent } from './course/courses/courses.component';
import { ClientsCoursesComponent } from './clientCourse/clients-courses/clients-courses.component';
import { FormClientCourseComponent } from './clientCourse/form-client-course/form-client-course.component';
import { FormRegisterComponent } from './auth/register/form-register/form-register.component';
import { FormSignInComponent } from './auth/signIn/form-sign-in/form-sign-in.component';
import { JwtInterceptor } from './helper/jwt-interceptor'
import { HandleErrorsInterceptor } from './helper/handle-errors-interceptor';
import { PaymentsComponent } from './payment/payments/payments.component';
import { FormPaymentComponent } from './payment/form-payment/form-payment.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    ClientsComponent,
    FormClientComponent,
    FormCourseComponent,
    CoursesComponent,
    ClientsCoursesComponent,
    FormClientCourseComponent,
    FormRegisterComponent,
    FormSignInComponent,
    PaymentsComponent,
    FormPaymentComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HandleErrorsInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function appInitializerFactory(translateService: TranslateService) {
  return () => {
    if(!localStorage.getItem('lang'))
       localStorage.setItem('lang', 'en-GB');
    let lang = localStorage.getItem('lang');
    translateService.setDefaultLang(lang!);
    return translateService.use(lang!);
  };
}



