import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceRequestScheduleComponent } from '../../../components/service-request-schedule/service-request-schedule.component';
import * as moment from 'moment-timezone';
import { User } from 'src/app/models/user';
import { RoleI } from 'src/app/models/role';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  public user: User;
  public attendanceEvent: boolean;
  public paramsUser: any = { origin: 'CN', status: 'approved', q: '' , cancel: false, attendance: false};
  public users: Array<User>;
  public page: number;
  public pages = [];
  public hasNextPage: boolean;
  public hasPreviousPage: boolean;
  public txtSearch = '';
  public viewRegister: any;
  public viewAttendance: any;
  public view = 'events';
  public roles: RoleI[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService,
    private rolesService: RolesService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.viewRegister = {cientos: 0, decenas: 0, unidades: 0};
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.getUser(params.get('userId'));
    });
  }

  getRoleName(roleId: string): string {
    let resp = '';
    for(let role of this.roles){
      if(role.objectId === roleId){
        resp = role.name;
        break;
      }
    }
    return resp;
  }

  getUser(userId: string = null): void {
    userId = userId || this.user.objectId;
    this.usersService.getUser(userId).subscribe(res => {
      if (res) {
        console.log(res);
        this.user = res;
      }
    }, error => {
      // show alert to user
      Swal.fire({
        title: 'Error',
        html: error.message,
        type: 'error'
      });
    });
  }

  getRoles() {
    return new Promise( (resolve, reject) => {
      this.rolesService.getRoles().subscribe( res => {
        if (res.results) {
          this.roles = res.results;
          resolve(true);
        } else {
          reject(false);
        }
      }, error => {
        reject(error);
      });
    });
  }



  loadPage(page) {
    if (page >= 0 && page <= this.pages.length - 1) {
      const params  = JSON.parse(JSON.stringify(this.paramsUser));
      params.page = page;
    }
  }

  onChangeView(event: any) {
    if (event.target.value === 'events') {
      this.paramsUser.attendance = false;
      this.paramsUser.cancel = false;
    } else if (event.target.value === 'attendances') {
      this.paramsUser.attendance = true;
      this.paramsUser.cancel = false;
    } else if (event.target.value === 'services-requests') {
      delete this.paramsUser.attendance;
      delete this.paramsUser.cancel;
    }
    this.onSearchRegisters(null);
  }

  onSearchRegisters(event: any): void {
    let search = true;
    /*if (event.target.value.length >= 3) {
      this.paramsUser.q = event.target.value;
      search = true;
    } else if (this.paramsUser.q.length > 0) {
      this.paramsUser.q = '';
      search = true;
    }*/
    if (search) {
      const params  = JSON.parse(JSON.stringify(this.paramsUser));
    }
  }

  onReturn(): void {
    this.router.navigate(['/dashboard/users']);
  }

  onApproved(): void {
    if ( this.user.status === 'request') {
      Swal.fire({
        title: '¿Está seguro?',
        text: `Favor de confirmar el acceso a: ${this.user.firstName} ${this.user.lastName} - ${this.user.email}.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.value) {
          this.usersService.changeStatus(this.user, 'approved').subscribe(res => {
            if (res.success) {
              Swal.fire({
                title: 'Listo',
                html: 'Se ha procesado la solicitud',
                type: 'success'
              }).then( () => {
                this.getUser();
              });
            } else {
              // show alert to user
              Swal.fire({
                title: 'Error',
                html: res.message,
                type: 'error'
              });
            }
          }, error => {
            // show alert to user
            Swal.fire({
              title: 'Error',
              html: error.error.message,
              type: 'error'
            });
          });
        }
      });
    }
  }

  onDelete(): void {
    if ( this.user.status !== 'deleted') {
      Swal.fire({
        title: '¿Está seguro?',
        text: `Favor de confirmar que se niega el acceso a: ${this.user.firstName} ${this.user.lastName} - ${this.user.email}.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, negar acceso',
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.value) {
          this.usersService.changeStatus(this.user, 'denied').subscribe(res => {
            if (res.success) {
              Swal.fire({
                title: 'Listo',
                html: 'Se ha procesado la solicitud',
                type: 'success'
              }).then( () => {
                this.getUser();
              });
            } else {
              // show alert to user
              Swal.fire({
                title: 'Error',
                html: res.message,
                type: 'error'
              });
            }
          }, error => {
            // show alert to user
            Swal.fire({
              title: 'Error',
              html: error.error.message,
              type: 'error'
            });
          });
        }
      });
    }
  }


}
