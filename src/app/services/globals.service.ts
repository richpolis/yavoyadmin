import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { RoleI } from '../models/role';
declare const Parse: any;

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  urlBase = environment.serverURL;

  user: User = null;
  roles: RoleI[];
  origin: string;
  eventType: string;

  constructor() {}

  getUser(): User {
    if (!this.user) {
      if (!localStorage.getItem('user_yavoy') === null) {
        this.user = JSON.parse(localStorage.getItem('user_yavoy'));
      } else {
        return null;
      }
    }
    return this.user;
  }

  setUser(user: User): void {
    this.user = user;
    localStorage.setItem('user_yavoy', JSON.stringify(this.user));
  }

  cleanUser(): void {
    if (localStorage.getItem('user_yavoy') !== null) {
      localStorage.removeItem('user_yavoy');
    }
    this.user = null;
  }

  getUrlBase(): string {
    return this.urlBase;
  }

  getParseObject(): any {
    Parse.initialize(environment.PARSE_APP_ID, environment.PARSE_JS_KEY);
    Parse.serverURL = environment.serverURL;
    return Parse;
  }

  getRoles() {
    if (!this.roles) {
      if (!localStorage.getItem('roles_yavoy') === null) {
        this.roles = JSON.parse(localStorage.getItem('roles_yavoy'));
      } else {
        return null;
      }
    }
    return this.roles;
  }

  setRoles(roles: RoleI[]): void {
    this.roles = roles;
    localStorage.setItem('roles_yavoy', JSON.stringify(this.roles));
  }

}
