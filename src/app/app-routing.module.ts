import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home-page/home-page.component';
import { ClientsComponent } from './client/clients/clients.component';
import { FormClientComponent } from './client/form-client/form-client.component';
import { CoursesComponent } from './course/courses/courses.component';
import { FormCourseComponent } from './course/form-course/form-course.component';
import { ClientsCoursesComponent } from './clientCourse/clients-courses/clients-courses.component';
import { FormClientCourseComponent } from './clientCourse/form-client-course/form-client-course.component';
import { FormRegisterComponent } from './auth/register/form-register/form-register.component';
import { FormSignInComponent } from './auth/signIn/form-sign-in/form-sign-in.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PaymentsComponent } from './payment/payments/payments.component';
import { FormPaymentComponent } from './payment/form-payment/form-payment.component'

import { ClientsResolverService } from './resolver/clients-resolver.service';
import { ClientResolverService } from './resolver/client-resolver.service';
import { CoursesResolverService } from './resolver/courses-resolver.service';
import { ClientCourseResolverService } from './resolver/client-course-resolver.service';
import { ClientCoursesResolverService } from './resolver/client-courses-resolver.service';
import { AuthGuardService } from './helper/auth-guard.service';
import { CourseResolverService } from './resolver/course-resolver.service';
import { PaymentMethodsResolverService } from './resolver/payment-methods-resolver.service';
import { PaymentStatutesResolverService } from './resolver/payment-statutes-resolver.service'
import { PaymentResolverService } from './resolver/payment-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full'},
  { path: '', component: HomePageComponent},
  { path: 'register', component: FormRegisterComponent},
  { path: 'signIn', component: FormSignInComponent } ,
  { path: 'clients',  component: ClientsComponent, resolve: {clients: ClientsResolverService}, canActivate: [AuthGuardService], data: { expectedRole: ['Admin']} },
  { path: 'clients/add', component: FormClientComponent, canActivate: [AuthGuardService], data: { expectedRole: ['Admin']} },
  { path: 'clients/details/:idClient', component: FormClientComponent, resolve: {client: ClientResolverService}, canActivate: [AuthGuardService], data: { expectedRole: ['Admin','User']}},
  { path: 'clients/edit/:idClient', component: FormClientComponent, resolve: {client: ClientResolverService}, canActivate: [AuthGuardService], data: { expectedRole: ['Admin', 'User']}},
  { path: 'courses',  component: CoursesComponent, resolve: {courses: CoursesResolverService}},
  { path: 'courses/add', component: FormCourseComponent, canActivate: [AuthGuardService], data: { expectedRole: ['Admin'] }},
  { path: 'courses/details/:idCourse', component: FormCourseComponent, resolve: {course: CourseResolverService}},
  { path: 'courses/edit/:idCourse', component: FormCourseComponent, resolve: {course: CourseResolverService}, canActivate: [AuthGuardService], data: { expectedRole: ['Admin']}},
  { path: 'clientCourse',  component: ClientsCoursesComponent, canActivate: [AuthGuardService], data: { expectedRole: ['Admin'] }},
  { path: 'clientCourse/add', component: FormClientCourseComponent, resolve: {clients: ClientsResolverService, courses: CoursesResolverService, clientCourse: ClientCourseResolverService}, canActivate: [AuthGuardService], data: { expectedRole: ['Admin'] }},
  { path: 'clientCourse/details/:id', component: FormClientCourseComponent, resolve: {clientCourse: ClientCourseResolverService}, canActivate: [AuthGuardService], data: { expectedRole: ['Admin'] }},
  { path: 'clientCourse/edit/:id', component: FormClientCourseComponent, resolve: {clients: ClientsResolverService, courses: CoursesResolverService, clientCourse: ClientCourseResolverService}, canActivate: [AuthGuardService], data: { expectedRole: ['Admin'] }},
  { path: 'clients/:idClient/payments', component: PaymentsComponent, canActivate: [AuthGuardService], data: { expectedRole: ['Admin','User'] }},
  { path: 'payments/add/client/:idClient', component: FormPaymentComponent, resolve: {paymentMethods: PaymentMethodsResolverService, paymentStatuses: PaymentStatutesResolverService, courses: ClientCoursesResolverService}, canActivate: [AuthGuardService], data: { expectedRole: ['Admin','User'] }},
  { path: 'payments/edit/:idPayment/client/:idClient', component: FormPaymentComponent, resolve: {paymentMethods: PaymentMethodsResolverService, paymentStatuses: PaymentStatutesResolverService, courses: ClientCoursesResolverService, payment: PaymentResolverService}, canActivate: [AuthGuardService], data: { expectedRole: ['Admin'] }},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
