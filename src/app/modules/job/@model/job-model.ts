
import { Model } from "../../../@suite/@base/modelbase";

export class JobModel extends Model {
}

export class Task extends JobModel {
    name: string;
    description: string;
    frequency: string;
    scheduler: string;
    state: string;
    benRun: string;
    lastRun: Date;
    codeBusinessUnit: number;
    notify: boolean;
    taskProperties: TaskProperty[];
}

export class TaskProperty extends JobModel {
    name: string;
    description: string;
    value: string;
    
}