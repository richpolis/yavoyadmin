import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalsService } from './globals.service';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CirclesService {
  URL_BASE = '';

  constructor(private httpClient: HttpClient, private globalsService: GlobalsService) {
    this.URL_BASE = this.globalsService.getUrlBase();
   }

  getCircles(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_RESTAPI_KEY,
        'X-Parse-Master-Key': environment.MASTER_KEY
      })
    };
    // const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return this.httpClient.get<any>(`${this.URL_BASE}/classes/Circle`, httpOptions)
                                              .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}