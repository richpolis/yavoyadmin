import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { GlobalsService } from './globals.service';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { AddressI } from '../models/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  URL_BASE = '';

  constructor(private httpClient: HttpClient, private globalsService: GlobalsService) {
    this.URL_BASE = this.globalsService.getUrlBase();
   }

  getAddresses(where: any = null, order: any = null, limit: any = 10, skip: any = 0): Observable<any> {
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
    return this.httpClient.get<any>(`${this.URL_BASE}/classes/Address`, httpOptions)
                                              .pipe(catchError(this.errorHandler));
  }

  getStringFromAddress(address: AddressI): string {
    let s_address = '' + address.street;
    if (address.numInt.length > 0) {
      s_address += ' ' + address.numInt;
    }
    if (address.numExt.length > 0) {
      s_address += ' ' + address.numExt;
    }
    if (address.suburb.length > 0) {
      s_address += ' col. ' + address.suburb;
    }
    if (address.postalCode.length > 0) {
      s_address += ' cp. ' + address.postalCode;
    }
    if (address.delegation.length > 0) {
      s_address += ', ' + address.delegation;
    }
    if (address.city.length > 0) {
      s_address += ', ' + address.delegation;
    }
    return s_address;
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
