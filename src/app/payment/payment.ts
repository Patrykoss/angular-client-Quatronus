import { Injectable } from '@angular/core';
import { ClientCourse } from './../clientCourse/clientCourse'
import { PaymentMethod } from './paymentMethod';
import { PaymentStatus } from './paymentStatus';


export class Payment {
    constructor(
        public id: number, 
        public idMethod: number, 
        public idStatus: number,
        public idClientCourse: number,
        public amount: number, 
        public date: Date
        ){}

    public paymentStatus: PaymentStatus = new PaymentStatus(0,'');
    public paymentMethod: PaymentMethod = new PaymentMethod(0,'');
    public clientCourse: ClientCourse = new ClientCourse(0,0,0,undefined!,false);
}

@Injectable({
    providedIn: "root"
})
export class PaymentAdapter {
    adapt(data: any): Payment {
        return new Payment(data.id, data.idMethod, data.idStatus,data.idClientCourse, data.amount, data.date)
    }
}