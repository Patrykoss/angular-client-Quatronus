import { Injectable } from '@angular/core';
import { Payment } from './payment'

export class PaymentMethod {
    constructor(
        public id: number, 
        public name: string
        ){}

    public payments: Payment[] = []
}

@Injectable({
    providedIn: "root"
})
export class PaymentMethodAdapter {
    adapt(data: any): PaymentMethod {
        return new PaymentMethod(data.id, data.name)
    }
}