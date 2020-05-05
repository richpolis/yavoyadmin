import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { GlobalsService } from './globals.service';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  URL_BASE = '';

  constructor(private httpClient: HttpClient, private globalsService: GlobalsService) {
    this.URL_BASE = this.globalsService.getUrlBase();
   }

   getEvents(where: any = null, order: any = null, limit: any = 10, skip: any = 0): Observable<any> {
    const user = this.globalsService.getUser();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_RESTAPI_KEY
      }),
      params: new HttpParams()
      .set('where', JSON.stringify(where))
      .set('count', '1')
      .set('limit', '' + limit)
      .set('skip', '' + skip)
      .set('order', order)
    };
    // const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return this.httpClient.get<any>(`${this.URL_BASE}/classes/Event`, httpOptions)
                                              .pipe(catchError(this.errorHandler));
  }

  getEvent(userId: string): Observable<any> {
    const user = this.globalsService.getUser();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_RESTAPI_KEY
      })
    };
    // const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return this.httpClient.get<any>(`${this.URL_BASE}/classes/Event/${userId}`, httpOptions)
                                              .pipe(catchError(this.errorHandler));
  }


  getEventsWithBeneficiarioVoluntario(params: any = {}, limit: any = 10, skip: any = 0): Observable<any> {
    const user = this.globalsService.getUser();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-Parse-Application-Id': environment.PARSE_APP_ID,
        'X-Parse-REST-API-Key': environment.PARSE_RESTAPI_KEY
        //'X-Parse-Master-Key': environment.MASTER_KEY
      })
      // ,
      // params: new HttpParams()
      // .set('where', JSON.stringify(where))
      // .set('count', '1')
      // .set('limit', '' + limit)
      // .set('skip', '' + skip)
      // .set('order', order)
    };
    params.limit = limit;
    params.skip = skip;
    return this.httpClient.post<any>(`${this.URL_BASE}/functions/getEvents`, params, httpOptions)
                                              .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}