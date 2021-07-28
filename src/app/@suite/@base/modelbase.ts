export class Model {

  code: number;
  status: boolean;
  
  message: string;
  question: boolean;
  confirmAction: boolean;  
  initializer: boolean;

  toString() {
    return this.code + "";
  }
}

export class Filter {
  code: number;
  status: boolean;

  page: number;
  rowsPerPage: number;
  orderBy; string;
  desc: boolean;

  source: string;
}

export class InfoUser {
  code: number;
  name: string;
  username: string;
  profile: number;
  email: string;
  dateStart: Date;
  lastAccess: Date;
}

export class InfoEnviorment {
  busiessUnitCode: number;
  busiessUnit: string;
  sector: string;
  dataService: number;
  dataBaseSector: string;
  countObject: Date;
  hasDatabaseSector: boolean;
  maxFileUploadBytes: number;
  sysMonkey: any;
}

export class InfoSystem {
  application: string;
  version: string;
  copyrigth: string;
}


export enum HttpVerb {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
}