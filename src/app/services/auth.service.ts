import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../models/user';
import { GlobalsService } from './globals.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AUTH_SERVER = '';
  loggedIn: any = null;

  constructor(private globalsService: GlobalsService, private httpClient: HttpClient ) {
    this.initialize();
  }

  initialize() {
    this.AUTH_SERVER = this.globalsService.getUrlBase();
    this.loggedIn = new BehaviorSubject<boolean>(false);
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  register(user: User): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_RESTAPI_KEY,
        'X-Parse-Revocable-Session': '1'
      })
    };
     return this.httpClient.post<any>(`${this.AUTH_SERVER}/users`, user, httpOptions)
                                                 .pipe(catchError(this.errorHandler));
  }

  login(user: User): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_RESTAPI_KEY,
        'X-Parse-Revocable-Session': '1'
      }),
      params: new HttpParams().set('username', user.username).set('password', user.password)
    };
    return this.httpClient.get<any>(`${this.AUTH_SERVER}/login`,httpOptions)
               .pipe(tap(
                 (res: any ) => {
                   if (res) {
                     this.globalsService.setUser(res);
                     this.loggedIn.next(true);
                   }
                 }
               ), catchError(this.errorHandler));
  }

  recoverPassword(email: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_RESTAPI_KEY
      })
    };
    return this.httpClient.post<any>(`${this.AUTH_SERVER}/requestPasswordReset`, {email}, httpOptions)
                                                .pipe(catchError(this.errorHandler));
  }

  me(): Observable<any> {
    const user = this.globalsService.getUser();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_RESTAPI_KEY,
        'X-Parse-Session-Token': user.sessionToken
      })
    };
    return this.httpClient.get<any>(`${this.AUTH_SERVER}/users/me`, httpOptions)
                                                .pipe(catchError(this.errorHandler));
  }

  logout() {
    this.globalsService.cleanUser();
    this.loggedIn.next(false);
  }

  reviewAuthService() {
    if (this.globalsService.getUser() !== null) {
      this.loggedIn.next(true);
    }
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

}


