import { Injectable } from '@angular/core';
import { ClientCourse } from '../clientCourse/clientCourse'


export class Client {
    constructor(
        public id: number,
        public firstName: string, 
        public lastName: string, 
        public phoneNumber: string, 
        public email: string
        ){}

    public clientCourse: ClientCourse[] = []
}

@Injectable({
    providedIn: "root"
})
export class ClientAdapter {
    adapt(data: any): Client {
        return new Client(data.id, data.firstName, data.lastName, data.phoneNumber, data.email);
    }
}