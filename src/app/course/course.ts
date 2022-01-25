import { Injectable } from '@angular/core';
import {ClientCourse} from '../clientCourse/clientCourse'

export class Course {
    constructor(
        public id: number, 
        public name: string, 
        public description: string,
        public startDate: Date, 
        public endDate?: Date
        ){}

    public clientCourse: ClientCourse[] = []
}

@Injectable({
    providedIn: "root"
})
export class CourseAdapter {
    adapt(data: any): Course {
        return new Course(data.id, data.name, data.description, data.startDate, data.endDate)
    }
}