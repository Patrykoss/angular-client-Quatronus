import { Injectable } from '@angular/core';
import { Client } from '../client/client'
import { Course } from '../course/course'
import { Payment } from '../payment/payment';

export class ClientCourse{
    constructor(
        public id: number, 
        public idClient: number, 
        public idCourse: number, 
        public dateJoining: Date, 
        public getCertificate: boolean){
        }
        public client: Client = new Client(0,'','','','');
        public course: Course = new Course(0,'','',undefined!,undefined);
        public payments: Payment[] = [];
        
}

@Injectable({
    providedIn: "root"
})
export class ClientCourseAdapter {
    adapt(data: any): ClientCourse {
        return new ClientCourse(data.id, data.idClient, data.idCourse, data.dateJoining, data.getCertificate)
    }
}