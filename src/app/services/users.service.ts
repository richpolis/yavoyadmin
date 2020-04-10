import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { GlobalsService } from './globals.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  URL_BASE = '';

  constructor(private httpClient: HttpClient, private globalsService: GlobalsService) {
    this.URL_BASE = this.globalsService.getUrlBase();
   }

  getUsers(where: any = null): Observable<any> {
    const user = this.globalsService.getUser();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_RESTAPI_KEY,
        'X-Parse-Session-Token': user.sessionToken
      })
    };
    if (where !== undefined) {
      httpOptions['params'] = new HttpParams().set('where', where);
    }
    // const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return this.httpClient.get<any>(`${this.URL_BASE}/users/`, httpOptions)
                                              .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }


}