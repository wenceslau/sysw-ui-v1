import { Filter } from "../../../@suite/@base/modelbase";

export class JobFilter extends Filter {

}

export class TaskFilter extends JobFilter {
    name: string;
    description: string;
  }