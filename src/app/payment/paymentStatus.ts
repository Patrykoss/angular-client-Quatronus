import { Injectable } from '@angular/core';
import { Payment } from './payment'

export class PaymentStatus {
    constructor(
        public id: number, 
        public name: string
        ){}

    public payments: Payment[] = []
}

@Injectable({
    providedIn: "root"
})
export class PaymentStatusAdapter {
    adapt(data: any): PaymentStatus {
        return new PaymentStatus(data.id, data.name)
    }
}