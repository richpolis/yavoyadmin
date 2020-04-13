import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { GlobalsService } from '../../../services/globals.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { RolesService } from '../../../services/roles.service';
declare const Swal: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public paramsUsers: any = { origin: 'CN', status: 'a|e', q: '' };
  public users: Array<User>;
  public page: number;
  public pages = [];
  public hasNextPage: boolean;
  public hasPreviousPage: boolean;
  public roles: any;

  constructor(
    private usersService: UsersService,
    private globalsService: GlobalsService,
    private router: Router,
    private rolesService: RolesService) { }

  ngOnInit() {

    this.roles = this.globalsService.getRoles();
    if (this.roles === null) {
      this.rolesService.getRoles().subscribe(res => {
        this.roles = res.results;
        this.globalsService.setRoles(this.roles);
        this.getUsersRequest();
      }, error => {
        // show alert to user
        Swal.fire({
          title: 'Error',
          html: error.message,
          type: 'error'
        });
      });
    } else {
      this.getUsersRequest();
    }
  }


  CalculateAge(user): number {
    if (user.birthday) {
        let timeDiff = Math.abs(Date.now() - <any>user.birthday);
        return Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365);
    } else {
        return 0;
    }
}

  getUsersRequest(params:any = null): void {
    params = params || this.paramsUsers;
    const roleVoluntario = this.roles.find(role => role.name === 'Voluntario');
    const where = JSON.stringify({'role': {'__type': 'Pointer', 'className': '_Role', 'objectId': roleVoluntario.objectId}});
    this.usersService.getUsers(where).subscribe(res => {
      console.log(res.results);
      this.users = res.results;
      this.users.forEach((user, index, users) => {
        users[index].approved = user.status === 'approved';
        users[index].selected = false;
      });
    }, error => {
      // show alert to user
      Swal.fire({
        title: 'Error',
        html: error.message,
        type: 'error'
      });
    });
  }

  public onChangeOrigin(event: any) {
    const params  = JSON.parse(JSON.stringify(this.paramsUsers));
    this.getUsersRequest(params);
  }

  public onSearchUsers(event: any): void {
    let search = true;
    /*if (event.target.value.length >= 3) {
      search = true;
    } else if (this.paramsUsers.q.length > 0) {
      search = true;
    }*/
    if (search) {
      this.onChangeOrigin(event);
    }
  }


}
