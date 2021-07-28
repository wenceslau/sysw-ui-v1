import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { HandlerService } from './handler.service';
import { Filter, HttpVerb } from '../@base/modelbase';

export function tokenGetter() {
  return localStorage.getItem('token');
}

export class ServiceParameter {

  constructor(filter?: Filter) {
    this._pageable = false;
    if (filter) {
      if (filter.page) {
        this.addParameter('page', filter.page.toString());
        this._pageable = true;
      }

      if (filter.rowsPerPage) {
        this.addParameter('size', filter.rowsPerPage.toString());
        this._pageable = true;
      }

      if (filter.code)
        this.addParameter('code', filter.code.toString());

      if (filter.status !== null && filter.status != undefined)
        this.addParameter('status', filter.status.toString());

      if (filter.orderBy)
        this.addParameter('orderBy', filter.orderBy)

      if (filter.desc)
        this.addParameter('desc', filter.desc + '')

      if (filter.source)
        this.addParameter('source', filter.source)

    }
  }

  private _httpParams: HttpParams = new HttpParams();
  private _path: string;
  private _object: any;
  private _code: number;
  private _isBlob: Boolean
  private _pageable: Boolean;

  get path(): string {
    return this._path;
  }

  set path(p: string) {
    this._path = p;
  }

  get object(): any {
    return this._object;
  }

  set object(p: any) {
    this._object = p;
  }

  get code(): number {
    return this._code;
  }

  set code(p: number) {
    this._code = p;
  }

  get isBlob(): Boolean {
    return this._isBlob;
  }

  set isBlob(p: Boolean) {
    this._isBlob = p;
  }


  get httpParams(): HttpParams {
    return this._httpParams;
  }

  set httpParams(p: HttpParams) {
    this._httpParams = p;
  }

  addParameter(key: string, value: string) {
    this._httpParams = this._httpParams.append(key, value);
  }

  isPageable(): Boolean {
    return this._pageable;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _url;
  private useOauth = true;

  constructor(
    private http: HttpClient,
    public handler: HandlerService) {
    this._url = environment.apuUrl;
  }

  filterByGet(pars: ServiceParameter, block = false): Promise<any> {
    return this.executeHttpRequest(HttpVerb.GET, pars, block);
    //return this.get_(pars, block);
    // const headers = this.header();
    // this.handler.block(block);
    // return this.http.get(`${this._url}${pars.path}`,
    //   { headers: headers, params: pars.httpParams })
    //   .toPromise()
    //   .then(response => {
    //     this.handler.unblock(block);
    //     try {
    //       return response;
    //     } catch {
    //       return null;
    //     }
    //   });
  }

  filterByPost(pars: ServiceParameter, block = false): Promise<any> {
    return this.executeHttpRequest(HttpVerb.POST, pars, block);
    // return this.post_(pars, block);
    // const headers = this.header();
    // this.handler.block(block);
    // return this.http.post(this._url + pars.path, pars.object,
    //   { headers: headers, params: pars.httpParams })
    //   .toPromise()
    //   .then(response => {
    //     this.handler.unblock(block);
    //     return response;
    //   });
  }

  list(pars: ServiceParameter, block = false): any {
    return this.executeHttpRequest(HttpVerb.GET, pars, block);
    //return this.get_(pars, block);
    // const headers = this.header();
    // this.handler.block(block);
    // return this.http.get(`${this._url}${pars.path}`,
    //   { headers: headers, params: pars.httpParams })
    //   .toPromise()
    //   .then(response => {
    //     this.handler.unblock(block);
    //     try {
    //       return response;
    //     } catch {
    //       return null;
    //     }
    //   });
  }

  save(pars: ServiceParameter, block = true): Promise<any> {
    return this.executeHttpRequest(HttpVerb.POST, pars, block);
    //return this.post_(pars);
    // const headers = this.header();
    // this.handler.block();
    // return this.http.post(`${this._url}${pars.path}`, pars.object, { headers })
    //   .toPromise()
    //   .then(response => {
    //     this.handler.unblock();
    //     return response;
    //   });
  }

  edit(pars: ServiceParameter, block = true): Promise<any> {
    return this.executeHttpRequest(HttpVerb.PUT, pars, block);
    //return this.put_(pars);
    //const headers = this.header();
    // this.handler.block(block);
    // let pathCode = '';
    // if (pars.code != null) {
    //   pathCode = '/' + pars.code;
    // }
    // //Se o codigo nao foi passado recupera do objeto
    // return this.http.put(`${this._url}${pars.path}${pathCode}`, pars.object, { headers })
    //   .toPromise()
    //   .then(response => {
    //     this.handler.unblock(block);
    //     return response;
    //   });
  }

  clone(pars: ServiceParameter, code, block = true): Promise<any> {
    pars.code = code;
    return this.put_(pars, block);
    // const headers = this.header();
    // this.handler.block();
    // return this.http.put(`${this._url}${pars.path}/${code}`, { headers })
    //   .toPromise()
    //   .then(response => {
    //     this.handler.unblock();
    //     return response;
    //   });
  }

  findByCode(pars: ServiceParameter, code: number, block = true): Promise<any> {
    pars.code = code;
    return this.executeHttpRequest(HttpVerb.GET, pars, block);
    //pars.code = code;
    //return this.get_(pars);
    // const headers = this.header();
    // this.handler.block(block);
    // return this.http.get(`${this._url}${pars.path}/${code}`, { headers })
    //   .toPromise()
    //   .then(response => {
    //     this.handler.unblock(block);
    //     return response;
    //   });
  }

  deleteByCode(pars: ServiceParameter, code: number, block = true): Promise<any> {
    pars.code = code;
    return this.executeHttpRequest(HttpVerb.DELETE, pars, block);
    // pars.code = code;
    // return this.delete(pars);
    // const headers = this.header();
    // this.handler.block();
    // return this.http.delete(`${this._url}${pars.path}/${code}`, { headers })
    //   .toPromise()
    //   .then(() => {
    //     this.handler.unblock();
    //   });
  }

  delete(pars: ServiceParameter, block = true) {
    return this.executeHttpRequest(HttpVerb.PUT, pars, block);
    //return this.put_(pars);
    // const headers = this.header();
    // this.handler.block(block);
    // //Se o codigo nao foi passado recupera do objeto
    // return this.http.put(`${this._url}${pars.path}`, pars.object, { headers })
    //   .toPromise()
    //   .then(response => {
    //     this.handler.unblock(block);
    //   });
  }

  download(pars: ServiceParameter, block = true) {
    //pars.isBlob = true;
    //return this.executeHttpRequest(HttpVerb.GET, pars, block);
    const headers = this.header();
    this.handler.block();
    return this.http.get(this._url + pars.path,
      { headers: headers, params: pars.httpParams, responseType: 'blob' })
      .toPromise()
      .then(response => {
        this.handler.unblock();
        return response; //retorna blob
      });
  }

  downloadByPost(pars: ServiceParameter, block = true) {
    //pars.isBlob = true;
    //return this.executeHttpRequest(HttpVerb.POST, pars, block);
    const headers = this.header();
    this.handler.block();
    return this.http.post(this._url + pars.path, pars.object,
      { headers: headers, params: pars.httpParams, responseType: 'blob' })
      .toPromise()
      .then(response => {
        this.handler.unblock();
        return response; //retorna blob
      });
  }

  get(completePath: string, block = true) {
    const pars = new ServiceParameter();
    pars.path = completePath;
    return this.executeHttpRequest(HttpVerb.GET, pars, block);
    // const headers = this.header();
    // this.handler.block(block);
    // return this.http.get(this._url + completePath,
    //   { headers })
    //   .toPromise()
    //   .then(response => {
    //     this.handler.unblock(block);
    //     return response;
    //   });
  }

  post(pars: ServiceParameter, completePath: string, block = true): Promise<any> {
    pars.path = completePath;
    return this.executeHttpRequest(HttpVerb.POST, pars, block);
    // const headers = this.header();
    // this.handler.block(block);
    // return this.http.post(this._url + completePath, pars.object,
    //   { headers })
    //   .toPromise()
    //   .then(response => {
    //     this.handler.unblock(block);
    //     return response;
    //   });
  }

  put(completePath: string, block = true): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = completePath;
    return this.executeHttpRequest(HttpVerb.PUT, pars, block);
    // const headers = this.header();
    // this.handler.block();
    // return this.http.put(this._url + completePath,
    //   { headers })
    //   .toPromise()
    //   .then(response => {
    //     this.handler.unblock();
    //     return response;
    //   });
  }

  patch(completePath: string, block = true): Promise<any> {
    const pars = new ServiceParameter();
    pars.path = completePath;
    return this.executeHttpRequest(HttpVerb.PATCH, pars, block);
    // const headers = this.header();
    // this.handler.block();
    // return this.http.patch(this._url + completePath,
    //   { headers })
    //   .toPromise()
    //   .then(response => {
    //     this.handler.unblock();
    //     return response;
    //   });
  }

  //HTTP Methods

  private executeHttpRequest(verb: HttpVerb, pars: ServiceParameter, block: boolean): Promise<any> {

    switch (verb) {
      case HttpVerb.GET:
        return this.get_(pars, block);
      case HttpVerb.POST:
        return this.post_(pars, block);
      case HttpVerb.PUT:
        return this.put_(pars, block);
      case HttpVerb.PATCH:
        return this.patch_(pars, block);
      case HttpVerb.DELETE:
        return this.delete_(pars, block);
      default:
        return Promise.resolve(null);
    }
  }

  private get_(pars: ServiceParameter, block: boolean) {
    const headers = this.header();
    const url = this.url(pars);
    this.handler.block(block);

    let respType = undefined;
    if (pars.isBlob)
      respType = 'blob';

    return this.http.get(url,
      { headers: headers, params: pars.httpParams, responseType: respType })
      .toPromise()
      .then(response => {
        this.handler.unblock(block);
        return response;
      });
  }

  private post_(pars: ServiceParameter, block: boolean): Promise<any> {
    const headers = this.header();
    const url = this.url(pars);
    this.handler.block(block);
    return this.http.post(url, pars.object,
      { headers: headers, params: pars.httpParams })
      .toPromise()
      .then(response => {
        this.handler.unblock(block);
        return response;
      });
  }

  private put_(pars: ServiceParameter, block: boolean): Promise<any> {
    const headers = this.header();
    const url = this.url(pars);
    this.handler.block(block);
    return this.http.put(url, pars.object,
      { headers: headers, params: pars.httpParams })
      .toPromise()
      .then(response => {
        this.handler.unblock(block);
        return response;
      });
  }

  private patch_(pars: ServiceParameter, block: boolean): Promise<any> {
    const headers = this.header();
    const url = this.url(pars);
    this.handler.block(block);
    return this.http.patch(url, pars.object,
      { headers: headers, params: pars.httpParams })
      .toPromise()
      .then(response => {
        this.handler.unblock(block);
        return response;
      });
  }

  private delete_(pars: ServiceParameter, block: boolean): Promise<void> {
    const headers = this.header();
    const url = this.url(pars);
    this.handler.block(block);
    return this.http.delete(url,
      { headers: headers, params: pars.httpParams })
      .toPromise()
      .then(() => {
        this.handler.unblock(block);
      });
  }

  private url(pars: ServiceParameter): string {
    let path = this._url;

    if (pars.path != null)
      path += '' + pars.path;

    if (pars.code != null)
      path += '/' + pars.code;

    return path;
  }

  private header(): HttpHeaders {
    if (this.useOauth) {
      return null;
    } else {
      //Quando nao for oauth2, usa autenticacao basica
      const headers = new HttpHeaders();
      headers.append('Authorization', 'Basic ZGV2OmQzdjM=');
      headers.append('Content-Type', 'application/json');
      return headers;
    }
  }
}
