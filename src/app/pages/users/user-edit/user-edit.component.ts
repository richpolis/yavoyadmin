import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment-timezone';
import { NgbDateStruct, NgbCalendar, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalsService } from 'src/app/services/globals.service';
import Swal from 'sweetalert2';
import { UsersService } from '../../../services/users.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  public formRegister: FormGroup;
  public formSubmitAttempt: boolean;
  public user: User;
  private _birthdayDate: any;
  public userEnabled = false;
  public statuses = [
    {key: 'active', name: 'Activo'},
    {key: 'inactive', name: 'Inactivo'}
  ]
  public schedules = [
    {key: 'mañana', name: 'Mañana'},
    {key: 'tarde', name: 'Tarde'},
    {key: 'noche', name: 'Noche'}
  ]

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    private modalService: NgbModal,
    private globalsService: GlobalsService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const tomorrow = moment().tz('America/Mexico_City').add(1, 'days');
    const tomorrow1h = moment().tz('America/Mexico_City').add(25, 'hours');

    this.formRegister = this.fb.group({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(3)]),
      city: new FormControl('', [Validators.required, Validators.minLength(3)]),
      status: new FormControl('', [Validators.required, Validators.minLength(3)]),
      circle: new FormControl(null),
      birthdayDateStruct: new FormControl(this.calendar.getToday(), Validators.required),
      phone: new FormControl(''),
      email: new FormControl('', [Validators.email]),
      schedule: new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.usersService.getUser(params.get('userId')).subscribe(res => {
        console.log(res);
        if (res) {
          this.user = res;
          this.formRegister.get('firstName').setValue(this.user.firstName);
          this.formRegister.get('lastName').setValue(this.user.lastName);
          this.formRegister.get('description').setValue(this.user.description);
          this.formRegister.get('city').setValue(this.user.city);
          this.formRegister.get('status').setValue(this.user.status);
          this.formRegister.get('phone').setValue(this.user.phone);
          this.formRegister.get('email').setValue(this.user.username);
          this.formRegister.get('schedule').setValue(this.user.schedule);
          this.formRegister.get('circle').setValue(null);
          const birthdayDate = moment(this.user.birthday.iso).tz('America/Mexico_City');

          this.formRegister.get('birthdayDateStruct').setValue({
            year: birthdayDate.year(),
            month: birthdayDate.month() + 1,
            day: birthdayDate.date()
          });

          this.onChangeDate(null);

          this.userEnabled = true;

        } else {
          // show alert to user
          Swal.fire({
            title: 'Error',
            html: 'Error al recuperar datos',
            type: 'error'
          });
          this.userEnabled = false;
        }
      }, error => {
        // show alert to user
        Swal.fire({
          title: 'Error',
          html: error.message,
          type: 'error'
        });
        this.userEnabled = false;
      });
    });

  }

  get f() { return this.formRegister.controls; }

  onCancel(): void {
    this.router.navigate(['/dashboard/users']);
  }

  onEditUser(): void {
    if (!this.userEnabled) {
      Swal.fire({ title: 'Error', html: 'El usuario no es posible editar', type: 'error' }).then(result => {
        this.router.navigate(['/dashboard/users']);
      });
      return;
    }


    if (this.formRegister.valid) {
      const params = {
        username: this.formRegister.get('email').value,
        email: this.formRegister.get('email').value,
        firstName: this.formRegister.get('firstName').value,
        lastName: this.formRegister.get('lastName').value,
        description: this.formRegister.get('description').value,
        city: this.formRegister.get('city').value,
        status: this.formRegister.get('status').value,
        phone: this.formRegister.get('phone').value,
        schedule: this.formRegister.get('schedule').value,
        birthday: {
          __type: 'Date',
          iso: this._birthdayDate.format(),
        },
        schedules: this.user.schedules,
        location: this.user.location,
        role: this.user.role,
        contact: this.user.contact,
        isRepresentativeCircle: this.user.isRepresentativeCircle,
        gender: this.user.gender,
        photo: this.user.photo || null,
        ine: this.user.ine || null
      };

      this.usersService.updateUser(params, this.user.objectId).subscribe(res => {
        if (res) {
          Swal.fire({
            title: 'Listo',
            html: 'Se ha actualizado el usuario',
            type: 'success'
          }).then(() => {
            this.router.navigate(['/dashboard/users/edit', this.user.objectId]);
          });
        } else {
          // show alert to user
          Swal.fire({
            title: 'Error',
            html: 'Error al actualizar registro',
            type: 'error'
          });
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
    this.formSubmitAttempt = true;
  }

  onChangeDate(event: any): void {
    const birthdayDateStruct: NgbDateStruct = this.formRegister.get('birthdayDateStruct').value;

    let sBirthdayDate = birthdayDateStruct.year + '-';
    sBirthdayDate += (birthdayDateStruct.month >= 10 ? birthdayDateStruct.month : '0' + birthdayDateStruct.month) + '-';
    sBirthdayDate += (birthdayDateStruct.day >= 10 ? birthdayDateStruct.day : '0' + birthdayDateStruct.day);

    this._birthdayDate = moment(sBirthdayDate + 'T00:00:00-06:00' ).tz('America/Mexico_City');
  }

  onSelectPhoto(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0];
      const name = file.name;
      const Parse = this.globalsService.getParseObject();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (e) => { // called once readAsDataURL is completed
        this.user.photo = {
          '__type': 'File',
          'name': name,
          'url': reader.result
        };
        const iconImageFile = new Parse.File(name, file);
        iconImageFile.save().then( res =>  {
          this.user.photo.name = res._name;
          this.user.photo.url = res._url;
         });
      };
    }
  }

  deletePhoto() {
    this.user.photo = null;
  }

  onSelectINE(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0];
      const name = file.name;
      const Parse = this.globalsService.getParseObject();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (e) => { // called once readAsDataURL is completed
        this.user.ine = {
          '__type': 'File',
          'name': name,
          'url': reader.result
        };
        const iconImageFile = new Parse.File(name, file);
        iconImageFile.save().then( res =>  {
          this.user.ine.name = res._name;
          this.user.ine.url = res._url;
         });
      };
    }
  }

  deleteINE() {
    this.user.ine = null;
  }

}