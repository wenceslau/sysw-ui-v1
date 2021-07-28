import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RsaService } from './rsa.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizerService {

  oauthTokenUrl;    // URL da API  
  jwtPayload: any;  // Armazena o json do token, o payload

  constructor(
    private httpClient: HttpClient,
    private jwtHelperService: JwtHelperService,
    public rsa: RsaService) {
    this.loadToken();
  }

  set(value1: string, value2: string, value3: string, value4: string): Promise<void> {
    this.clearToken();

    this.oauthTokenUrl = environment.apuUrl + '/oauth/token'
    let headers = new HttpHeaders();

    // enviado como post, preciso do content typ para ler o body como um query string
    headers = headers
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    let val1 = (`${value1};${value3};${value4}`);
    let val2 = value2;
    const body = `client=angular&username=${val1}&password=${val2}&grant_type=password`;

    // se tiver sucesso na autenticacao, o token sera armazenado no local storage
    return this.httpClient.post<any>(this.oauthTokenUrl, body, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        console.log('received package')
        this.storeToken(response.access_token);
      })
      .catch(response => {
        return Promise.reject(response);
      });
  }

  // Verifica se o token e valido
  isAccessTokenInvalid() {
    //const token = this.getCookie('theDayIsOK'); 
    const token = localStorage.getItem('token');
    return !token || this.jwtHelperService.isTokenExpired(token);
  }

  // Remove o token do local storage
  clearToken() {
    //console.log('clearToken');
    localStorage.removeItem('token');
    //this.deleteCookie('theDayIsOK');
    this.jwtPayload = null;
  }


  // Verifica se a permissao contem nos authorities do toekn
  hasPermission(permission: string) {
    if (this.jwtPayload)
      return this.jwtPayload && this.jwtPayload.authorities.includes(permission);
  }


  //Carrega o token do storage local
  private loadToken() {
    const token = localStorage.getItem('token');
    let lentgh = undefined;
    if (token)
      lentgh = token.length;

    //se o token existe, decodifica ele jwtPayload
    if (token)
      this.storeToken(token);
  }


  // Armazena o token no storage local e decodifica ele no jwtPayload
  private storeToken(token: string) {
    console.log('Package stered on a place');
    this.jwtPayload = this.jwtHelperService.decodeToken(token);
    localStorage.setItem('token', token);
  }


}
