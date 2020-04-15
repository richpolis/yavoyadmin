import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { GlobalsService } from 'src/app/services/globals.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { RoleI } from 'src/app/models/role';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnChanges {

  // ======= MAX SHOW NUMBERS PAGE ========
  private MAX_PAGES_DISPLAY = 8;
  public page: number;
  public pages = [];
  public totalPages;
  public from: number;
  public to: number;
  public hasNextPage: boolean;
  public hasPreviousPage: boolean;
  public roles: RoleI[];

  public paramsUsers: any = { origin: 'CN', status: 'a|e', q: '', page: 0 };
  public users: Array<User>;

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

  ngOnChanges(changes: SimpleChanges): void {
    const paginadorActualizado = changes['pages'];
    if (paginadorActualizado.previousValue) {
       this.initPaginator();
    }
 }

  getUsersRequest(params:any = null): void {
    params = params || this.paramsUsers;
    this.usersService.getUsers(params).subscribe(res => {
      this.users = res.data.users;
      this.page = Math.ceil(res.data.page);
      const pageCeil = Math.ceil(res.data.pages);
      this.pages = [];
      for (let cont = 0; cont < pageCeil; cont++) {
        this.pages.push(cont);
      }
      this.hasNextPage = this.page < this.pages.length - 1;
      this.hasPreviousPage = this.page > 0;
      this.users.forEach((user, index, users) => {
        users[index].approved = user.status === 'approved';
        users[index].selected = false;
      });
      this.initPaginator();
    }, error => {
      // show alert to user
      Swal.fire({
        title: 'Error',
        html: error.message,
        type: 'error'
      });
    });
  }

  getStatus(user: User): string {
    return this.usersService.getStatusString(user);
  }

  onDetail(user: User): void {
    this.router.navigate(['/dashboard/users/detail', user.objectId]);
  }

  onDelete(user: User): void {
    if ( user.status !== 'deleted') {
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
          this.usersService.changeStatus(user, 'denied').subscribe(res => {
            if (res.success) {
              Swal.fire({
                title: 'Listo',
                html: 'Se ha procesado la solicitud',
                type: 'success'
              }).then( () => {
                this.getUsersRequest();
              });
            } else {
              // show alert to user
              Swal.fire({
                title: 'Error',
                html: res.message,
                type: 'error'
              });
            }
          });
        }
      })
    }
  }

  loadPage(page) {
    if (page >= 0 && page <= this.pages.length - 1) {
      const params  = JSON.parse(JSON.stringify(this.paramsUsers));
      params.page = page;
      this.paramsUsers.page = page;
      this.getUsersRequest(params);
    }
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

  onEditMember(user: User): void {

  }

  private initPaginator() {

    //  OBTENEMOS EL MAXIMO Y EL MINIMO DE PAGINAS A MOSTRAR
    this.from = Math.min( Math.max(1, this.page - (this.MAX_PAGES_DISPLAY - 2)), this.pages.length - (this.MAX_PAGES_DISPLAY - 1));
    this.to = Math.max( Math.min(this.pages.length, this.page + (this.MAX_PAGES_DISPLAY - 2)), this.MAX_PAGES_DISPLAY);

    if (this.pages.length > (this.MAX_PAGES_DISPLAY - 1)) {
      this.totalPages = new Array(this.to - this.from + 1)
        .fill(0)
          .map((value, index) => index + this.from);

    } else {
      this.totalPages = new Array(this.pages.length)
        .fill(0)
          .map((value, index) => index + 1);
    }

  }

}
