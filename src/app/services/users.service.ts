import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { GlobalsService } from './globals.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  URL_BASE = '';

  constructor(private httpClient: HttpClient, private globalsService: GlobalsService) {
    this.URL_BASE = this.globalsService.getUrlBase();
   }

  getUsers(where: any = null, order: any = null, limit: any = 10, skip: any = 0): Observable<any> {
    const user = this.globalsService.getUser();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_RESTAPI_KEY
      }),
      //params: new HttpParams().set('count', '1').set('limit', '' + limit).set('skip', '' + skip)
      params: new HttpParams()
      .set('where', JSON.stringify(where))
      .set('count', '1')
      .set('limit', '' + limit)
      .set('skip', '' + skip)
      .set('order', order)
    };
    // const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return this.httpClient.get<any>(`${this.URL_BASE}/users`, httpOptions)
                                              .pipe(catchError(this.errorHandler));
  }

  getUser(userId: string): Observable<any> {
    const user = this.globalsService.getUser();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_RESTAPI_KEY
      })
    };
    // const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return this.httpClient.get<any>(`${this.URL_BASE}/users/${userId}`, httpOptions)
                                              .pipe(catchError(this.errorHandler));
  }

  changeStatus2(other: User, status: string): any {
    return new Promise((resolve, reject) => {
      debugger;
      const Parse = this.globalsService.getParseObject();
      const query = new Parse.Query(new Parse.User());
      query.get(other.objectId).then((user) => {
        user.set('status', status);
        user.save().then((response) => {
          console.log('Updated user', response);
          resolve(true);
        }).catch((error) => {
          console.error('Error while updating user', error);
          reject(false);
        });
      });
    });
  }

  changeStatus(other: User, status: string): Observable<any> {
    const user = this.globalsService.getUser();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_RESTAPI_KEY,
        'X-Parse-Session-Token': user.sessionToken
      })
    };
    const params = {
      username: other.username,
      email: other.username,
      birthday: other.birthday,
      location: other.location,
      description: other.description,
      schedules: other.schedules,
      role: other.role,
      circle: other.circle,
      status,
      contact: other.contact,
      firstName: other.firstName,
      lastName: other.lastName,
      isRepresentativeCircle: other.isRepresentativeCircle,
      city: other.city,
      phone: other.phone,
      schedule: other.schedule
    };
    return this.httpClient.put<any>(`${this.URL_BASE}/users/${other.objectId}`, params, httpOptions)
                                                 .pipe(catchError(this.errorHandler));
  }

  getStatusString(user: User): string {
    if (user.status === 'request') {
      return 'Solicitud';
    } else if (user.status === 'approved') {
      return 'Aprobado';
    } else if (user.status === 'deleted') {
      return 'Eliminado';
    }
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }


}
