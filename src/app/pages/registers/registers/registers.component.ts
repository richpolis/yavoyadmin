import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { RoleI } from 'src/app/models/role';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.css']
})
export class RegistersComponent implements OnInit {

  public paramsUsers: any = {status: 'request', q: '', order: 'email', limit: 10, skip: 0};
  public users: Array<User> = [];
  public page = 1;
  public pages = [];
  public hasNextPage: boolean;
  public hasPreviousPage: boolean;
  public roles: RoleI[];
  public count: number;

  public noFoundData: boolean;

  constructor(private userService: UsersService, private globalsService: GlobalsService, private rolesService: RolesService) {}

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

  getUsersRequest(params: any = null): void {
    this.noFoundData = false;
    params = params || this.paramsUsers;
    const roleVoluntario = this.roles.find(role => role.name === 'Voluntario');
    // const where = JSON.stringify({'role': {'__type': 'Pointer', 'className': '_Role', 'objectId': roleVoluntario.objectId}});
    const where = {role: {__type: 'Pointer', className: '_Role', objectId: roleVoluntario.objectId}};
    if (params.q.length > 0) {
      if (isNaN(params.q)) {
        where['$or'] = [
            { firstName: { $regex: params.q, $options: 'i' } },
            { lastName: { $regex: params.q, $options: 'i' } },
            { phone: { $regex: params.q, $options: 'i' } },
            { email: { $regex: params.q, $options: 'i' } }
        ];
      }
    }
    if (params.status.length > 0) {
      if (isNaN(params.status)) {
        where['status'] = params.status;
      }
    }
    console.log(where);
    this.userService.getUsers(where, params.order, params.limit, params.skip).subscribe(res => {
      console.log(res);
      this.users = res.results;
      this.count = Math.ceil(res.count);
      const pageCeil = Math.ceil(this.count / this.paramsUsers.limit);
      this.pages = [];
      if (this.paramsUsers.skip > 0){
        this.page = this.paramsUsers.skip / this.paramsUsers.limit;
      } else {
        this.page = 0;
      }
      for (let cont = 0; cont < pageCeil; cont++) {
        this.pages.push(cont);
      }
      this.hasNextPage = this.page < this.pages.length - 1;
      this.hasPreviousPage = this.page > 0;
      this.noFoundData = this.users.length === 0;
      this.users.forEach((user, index, users) => {
        users[index].approved = user.status === 'approved';
        users[index].selected = false;
      });
    }, error => {
      // show alert to user
      Swal.fire({
        title: 'Error',
        html: error.error.message,
        type: 'error'
      });
    });
  }

  CalculateAge(user): number {
    if (user.birthday) {
        const timeDiff = Math.abs(Date.now() -  user.birthday as any);
        return Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365);
    } else {
        return 0;
    }
  }

  onApproved(user: User): void {
    if ( user.status !== 'approved') {
      Swal.fire({
        title: '¿Está seguro?',
        text: `Favor de confirmar que se aprueba el acceso a: ${user.firstName} ${user.lastName} - ${user.email}.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, dar acceso',
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.value) {
          this.userService.changeStatus(user, 'approved').subscribe(res => {
            Swal.fire({
              title: 'Listo',
              html: 'Se ha procesado la solicitud',
              type: 'success'
            }).then( () => {
              this.getUsersRequest();
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
      });
    }
  }

  onDelete(user: User): void {
    if ( user.status !== 'denied') {
      Swal.fire({
        title: '¿Está seguro?',
        text: `Favor de confirmar que se niega el acceso a: ${user.firstName} ${user.lastName} - ${user.email}.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, negar acceso',
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.value) {
          this.userService.changeStatus(user, 'denied').subscribe(res => {
            Swal.fire({
              title: 'Listo',
              html: 'Se ha procesado la solicitud',
              type: 'success'
            }).then( () => {
              this.getUsersRequest();
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
      });
    }
  }

  loadPage(page) {
    if (page >= 0 && page <= this.pages.length - 1) {
      const params  = JSON.parse(JSON.stringify(this.paramsUsers));
      this.page = page;
      params.skip = page * this.paramsUsers.limit;
      this.paramsUsers.skip = page * this.paramsUsers.limit;
      this.getUsersRequest(params);
    }
  }

  public onSearchUsers(event: any): void {
    const search = true;
    this.paramsUsers.skip = 0;
    this.page = 0;
    if (search) {
      const params  = JSON.parse(JSON.stringify(this.paramsUsers));
      this.getUsersRequest(params);
    }
  }

}
