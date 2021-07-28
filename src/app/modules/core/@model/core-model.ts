import { Model } from "src/app/@suite/@base/modelbase";

//----------------- FILTER CORE-----------------------//

export class BaseFilter {
  code: number;
  status: boolean;
  orderBy; string;
  desc: boolean;
  source: string;
  page: number;
  rowsPerPage: number;
}

export class LanguageFilter extends BaseFilter {
  key: string;
  portugues: string;
  english: string;
  spanish: string
}

export class ProfileFilter extends BaseFilter {
  name: string;
  codPermissions: number;
  businessUnitProfile: BusinessUnitModel;
}

export class PermissionFilter extends BaseFilter {
  role: string;
  module: string;
  application: string;
  strApplication: string;
  key: string;
  description: string;
  component: string;
  label: string;
  root: string;
}

export class UserFilter extends BaseFilter {
  name: string;
  username: string;
  email: string;
  profile: Profile;
  sector: Sector;
  businessUnit: BusinessUnitModel;
}

export class DataServiceFilter extends BaseFilter {
  type: string;
  name: string;
  scope: string;
  codBusinessUnit: number;
}

export class SectorFilter extends BaseFilter {
  name: string;
  codBusinessUnit: number;
  onlySectorFromAppLogged: boolean;
}

export class ParameterFilter extends BaseFilter {
  group: string;
  key: string;
  value: string;
  description: string;
}

export class UserLogonHistoryFilter extends BaseFilter {
  ipAddress: string;
  userLogon: string;
  statusLogon: string;
  dateRecordStart: Date;
  dateRecordEnd: Date;
  codUserRecord: number
}

export class UserActionFilter extends BaseFilter {
  action: string;
  nameObject: string;
  idRecord: number;
  idObject: number;
  hashObject: string;
  dateRecordStart: Date;
  dateRecordEnd: Date;
  codUserRecord: number
  resume: boolean;
}

export class UserGroupFilter extends BaseFilter {
  name: string;
  description: string;
  username: string;
}

//----------------- MODEL CORE-----------------------//

export class CoreModel extends Model {
}

export class LanguageModel extends CoreModel {
  module: string;
  key: string;
  portugues: string;
  english: string;
  spanish: string;
  description: string;
  dateRecord: Date;
  dateUpdate: Date;
}


export class ApplicationModel extends CoreModel {
  name: string;
  displayName: string;
  nameModuleSource: string;
  image: string;
  mainColor: string;
  licence: string;
  dateInitializer: Date;
  main: boolean;

}
export class ApplicationLst {
  code: number;
  name: string;
}
export class ApplicationVwr extends CoreModel {
  name: string;
  displayName: string;
  nameModuleSource: string;
  image: string;
  mainColor: string;
  licence: string;
  dateInitializer: Date;
  main: boolean;
}

export class PermissionModel extends CoreModel {
  type: number;
  strApplication: string;
  application: ApplicationModel;
  role: string;
  module: string;
  key: string;
  description: string;
  predecessorPermission: string;
  component: string;
  label: string;
  root: string;
  router: string;
  icon: string;
  display: string;
  sequence: number;
  exclusice: boolean;
  toolbar: boolean;
  rootToolbar: boolean;
}

export class BusinessUnitParameterModel extends CoreModel {
  application: string;
  key: string;
  value: string;
  description: string;

  constructor(code?: number,
    application?: string,
    key?: string,
    value?: string,
    description?: string) {
    super();
    this.code = code;
    this.application = application;
    this.key = key;
    this.value = value;
    this.description = description;
  }
}

export class BusinessUnitModel extends CoreModel {
  name: string;
  description: string;
  uniqueId: string;
  license: string;
  image: string;
  hasDomainControl: boolean;
  applications: ApplicationModel[];
  businessUnitParameters: BusinessUnitParameterModel[];
}
export class BusinessUnitLst extends CoreModel {
  code: number;
  name: string;
}
export class BusinessUnitVwr extends CoreModel {
  name: string;
  description: string;
  uniqueId: string;
  license: string;
  applications: ApplicationLst[];
  businessUnitParameters: BusinessUnitParameterModel[];
  image: string;
  hasDomainControl: boolean;
}


export class AppLicense {
  machineInfo: string;
  applicationName: string;
  applicationUniqueId: string;
  expiration: Date;
  licenceNumber: number;
  detailLicenseNumber: string;
}

export class License {
  businesUniqueId: string;
  appLicences: AppLicense[];
}


export class LanguageTO {
  key: string;
  value: string;
}


export class Profile extends CoreModel {
  code: number;
  name: string;
  type: number;
  businessUnit: BusinessUnitModel;
  permissions: PermissionModel[];
}


export class Sector extends CoreModel {
  name: string;
  description: string;
  uniqueId: string;
  businessUnit: BusinessUnitModel;
  dataService: DataService;
  nameExternalDatabase: string;
  dateCreateDatabase: Date;
  label: string;
  requiredDb: boolean;
  appsName: string;
  bussinesName: string;
  buHasDc: boolean;
}

export class SectorTO extends CoreModel {
  name: string;
  label: string;
}

export class User extends CoreModel {
  name: string;
  username: string;
  email: string;
  firstAccess: boolean;
  profile: Profile;
  businessUnit: BusinessUnitModel;
  sectors: SectorTO[];
  sectorForList: any;
  receiveNotify: boolean;
  sendNotify: boolean;
  viewNotify: boolean;
  windowsAutentication: boolean;
}

export class Property extends CoreModel {
  dataType: string;
  name: string;
  value: string;
  description: string;

  constructor(code?: number,
    dataType?: string,
    name?: string,
    value?: string,
    description?: string) {
    super();
    this.code = code;
    this.dataType = dataType;
    this.name = name;
    this.value = value;
    this.description = description;
    this.status = true;
  }
}


export class DataService extends CoreModel {
  type: string;
  name: string;
  identifier: string;
  scope: string;
  description: string;
  displayName: string;
  profile: Profile;
  businessUnit: BusinessUnitModel;
  properties: Property[];
  codSectorsDataTask: string;
  codSectorDataTaskParent: number;
}

export class Parameter extends CoreModel {
  group: string;
  key: string;
  value: string;
  description: string;
}

export class DataList extends CoreModel {
  name: string;
  description: string;
}

export class ItemDataList extends CoreModel {
  group: string;
  labelItem: string;
  valueItem: string;
  description: string;
  dataList: DataList;
}

export class Notify extends CoreModel {
  dateTimeNotify: Date;
  sectorName: string;
  sectorCode: number;
  message: string;
  userName: string;
  userCode: number;
  type: string;
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

export class InfoModel {
  permission: PermissionModel;
  numRecords: number;
  lastUpdate: Date;
  updatedBy: string;
}

export class UserLogonHistory extends CoreModel {
  ipAddress: string;
  browser: string;
  userLogon: string;
  statusLogon: string;
  dateRecord: Date;
}

export class UserAction extends CoreModel {
  action: string;
  nameObject: string;
  idRecord: number;
  valueRecord: string;
  dateRecord: Date;
  userRecord: User;
  codeSector: number;
  application: string;
}

export class JsonObject {
  column: string;
  value: any;
}

export class Bool {
  value: boolean;
  message: string;
  object: any;
}

export class UserGroup extends CoreModel {
  name: string;
  decription: string;
  businessUnit: BusinessUnitModel;
  users: User[];
}