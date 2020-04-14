import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingScreenService {

  // tslint:disable-next-line: variable-name
  private _loading = false;
  loadingStatus: any;

  constructor() {
    this.initialize();
  }

  initialize() {
    this.loadingStatus = new BehaviorSubject<boolean>(false);
  }

  get loading(): boolean {
    return this._loading;
  }

  set loading(value) {
    this._loading = value;
    this.loadingStatus.next(value);
  }

  startLoading() {
    this.loading = true;
  }

  stopLoading() {
    this.loading = false;
  }
}