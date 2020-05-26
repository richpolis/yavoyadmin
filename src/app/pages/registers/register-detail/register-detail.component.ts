import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModalComponent } from '../../../components/user-modal/user-modal.component';
import { CircleI } from 'src/app/models/circle';
import { EventI } from '../../../models/event';
import { User } from 'src/app/models/user';
import { EventsService } from 'src/app/services/events.service';
import { UsersService } from '../../../services/users.service';
import { CirclesService } from '../../../services/circles.service';
import { AddressService } from 'src/app/services/address.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register-detail',
  templateUrl: './register-detail.component.html',
  styleUrls: ['./register-detail.component.css']
})
export class RegisterDetailComponent implements OnInit {

  public user: User = null;
  public paramsEvent: any = { status: 'request', q: ''};
  public events: Array<EventI>;
  public circles: Array<CircleI>;
  public page: number;
  public pages = [];
  public hasNextPage: boolean;
  public hasPreviousPage: boolean;
  public txtSearch = '';
  public viewRegister: any;
  public viewAttendance: any;
  public view = 'events';
  public statuses = [
    {key: 'request', name: 'Solicitud'},
    {key: 'approved', name: 'Aprobado'},
    {key: 'denied', name: 'Denegado'}
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

  public noFoundData: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventsService: EventsService,
    private usersService: UsersService,
    private circlesService: CirclesService,
    private addressService: AddressService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.viewRegister = {cientos: 0, decenas: 0, unidades: 0};
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.circlesService.getCircles().subscribe(res => {
        this.circles = res.results;
        this.getUser(params.get('userId'));
      });
    });
  }

  getStringSchedule(user: User): string {
    if (user !== null && user.schedule !== null && user.schedule.length > 0) {
      const schedules = this.schedules.filter(item => item.key === user.schedule);
      return schedules.length > 0 ? schedules[0].name : '';
    } else {
      return '';
    }
  }

  getStringStatus(user: User): string {
    if (this.user !== null && this.user.status !== null && this.user.status.length > 0) {
      const statuses = this.statuses.filter(item => item.key === this.user.status);
      return statuses.length > 0 ? statuses[0].name : '';
    } else {
      return '';
    }
  }

  getStringEventSchedule(event: EventI): string {
    if (this.user !== null && event.schedule !== null && event.schedule !== undefined && event.schedule.length > 0) {
      const schedules = this.schedules.filter(item => item.key === event.schedule);
      return schedules.length > 0 ? schedules[0].name : '';
    } else {
      return '';
    }
  }

  getStringEventStatus(event: EventI): string {
    if (this.user !== null && event.status !== null && event.status !== undefined  && event.status.length > 0) {
      const statuses = this.statusEvents.filter(item => item.key === event.status);
      return statuses.length > 0 ? statuses[0].name : '';
    } else {
      return '';
    }
  }

  getStringCircle(user: User): string {
    if (user !== null && user.circle !== null && user.circle !== undefined  && this.circles.length > 0) {
      const circles = this.circles.filter(item => item.objectId === user.circle.objectId);
      return circles.length > 0 ? circles[0].name : '';
    } else {
      return '';
    }
  }

  getUser(userId: string = null): void {
    userId = userId || this.user.objectId;
    this.usersService.getUser(userId).subscribe(res => {
      console.log(res);
      this.user = res;
      this.getEvents();
    }, error => {
      // show alert to user
      Swal.fire({
        title: 'Error',
        html: error.message,
        type: 'error'
      });
    });
  }

  getEvents(params: any = null): void {
    params = params || this.paramsEvent;
    const where = {voluntary: this.user.objectId};
    if (params.status.length > 0) {
      if (isNaN(params.status)) {
        where['status'] = params.status;
      }
    }

    this.eventsService.getEventsWithBeneficiarioVoluntario(where).subscribe(res => {
      console.log(res);
      this.events = res.result;
      // this.page = Math.ceil(res.data.page);
      // const pageCeil = Math.ceil(res.data.pages);
      // this.pages = [];
      // for (let cont = 0; cont < pageCeil; cont++) {
      //   this.pages.push(cont);
      // }
      // this.hasNextPage = this.page < this.pages.length - 1;
      // this.hasPreviousPage = this.page > 0;
      this.noFoundData = this.events.length === 0;
    }, error => {
      // show alert to user
      Swal.fire({
        title: 'Error',
        html: error.message,
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

  onChangeStatus(event: any): void {
    const search = true;
    if (search) {
      const params  = JSON.parse(JSON.stringify(this.paramsEvent));
      this.getEvents(params);
    }
  }

  onReturn(): void {
    this.router.navigate(['/dashboard/registers']);
  }

  onEdit(): void {
    this.router.navigate(['/dashboard/registers/edit', this.user.objectId]);
  }

  showModalUser(user: User): void {
    const where = {user: {
      __type: 'Pointer',
      className: '_User',
      objectId: user.objectId
    }};

    let addressString = '';

    this.addressService.getAddresses(where, 'createdAt').subscribe(res => {
      console.log(res);

      if (res.results.length > 0) {
        addressString = this.addressService.getStringFromAddress(res.results[0]);
      }

      const registerModal = this.modalService.open(UserModalComponent, { size: 'lg' });
      registerModal.componentInstance.user = user;
      registerModal.componentInstance.addressString = addressString;
      registerModal.result.then( resp => {
        console.log(resp);
      }).catch((error) => {
        if (error !== undefined && error.message !== undefined) {
          Swal.fire({
            title: 'Error',
            html: error.message,
            type: 'error'
          });
        }
      });

    }, error => {
      // show alert to user
      Swal.fire({
        title: 'Error',
        html: error.message,
        type: 'error'
      });
      return '';
    });
  }
}
