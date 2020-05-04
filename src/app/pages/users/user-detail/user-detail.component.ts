import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';
import { UsersService } from '../../../services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { EventI } from '../../../models/event';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  public user: User;
  public paramsEvent: any = { status: 'approved', q: ''};
  public events: Array<Event>;
  public page: number;
  public pages = [];
  public hasNextPage: boolean;
  public hasPreviousPage: boolean;
  public txtSearch = '';
  public viewRegister: any;
  public viewAttendance: any;
  public view = 'events';
  public statuses = [
    { key: 'active', name: 'Activo' },
    { key: 'inactive', name: 'Inactivo' }
  ];
  public statusEvents = [
    { key: 'request', name: 'Solicitud' },
    { key: 'approved', name: 'Aprobada' },
    { key: 'cancel', name: 'Cancelada' }
  ];
  public schedules = [
    { key: 'mañana', name: 'Mañana' },
    { key: 'tarde', name: 'Tarde' },
    { key: 'noche', name: 'Noche' }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventsService: EventsService,
    private usersService: UsersService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.viewRegister = {cientos: 0, decenas: 0, unidades: 0};
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.getUser(params.get('userId'));
    });
  }

  getStringSchedule(): string {
    const schedule = this.schedules.find(item => item.key === this.user.schedule);
    return schedule.name;
  }

  getStringStatus(): string {
    const status = this.statuses.find(item => item.key === this.user.status);
    return status.name;
  }

  getStringEventSchedule(event: EventI): string {
    const schedule = this.schedules.find(item => item.key === event.schedule);
    return schedule.name;
  }

  getStringEventStatus(event: EventI): string {
    const status = this.statusEvents.find(item => item.key === event.status);
    return status.name;
  }

  getUser(userId: string = null): void {
    userId = userId || this.user.objectId;
    this.usersService.getUser(userId).subscribe(res => {
      console.log(res);
      this.user = res;
    }, error => {
      // show alert to user
      Swal.fire({
        title: 'Error',
        html: error.message,
        type: 'error'
      });
    });
  }

  getEvents(params:any = null): void {
    params = params || this.paramsEvent;
    const where = {role: 'beneficiario'};
    if (params.status.length > 0) {
      if (isNaN(params.status)) {
        where['status'] = params.status;
      }
    }


    this.eventsService.getEventsWithBeneficiarioVoluntario(params, this.user).subscribe(res => {
      console.log(res.data);
      this.events = res.results;
      this.page = Math.ceil(res.data.page);
      const pageCeil = Math.ceil(res.data.pages);
      this.pages = [];
      for (let cont = 0; cont < pageCeil; cont++) {
        this.pages.push(cont);
      }
      this.hasNextPage = this.page < this.pages.length - 1;
      this.hasPreviousPage = this.page > 0;
    }, error => {
      // show alert to user
      Swal.fire({
        title: 'Error',
        html: error.error.message,
        type: 'error'
      });
    });
  }



  loadPage(page) {
    if (page >= 0 && page <= this.pages.length - 1) {
      const params  = JSON.parse(JSON.stringify(this.paramsEvent));
      params.page = page;
      this.getEvents(params);
    }
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
      const params  = JSON.parse(JSON.stringify(this.paramsEvent));
      this.getEvents(params);
    }
  }

  onReturn(): void {
    this.router.navigate(['/dashboard/users']);
  }

  onEdit(user: User): void {
    this.router.navigate(['/dashboard/users/edit', user.objectId]);
  }

}
