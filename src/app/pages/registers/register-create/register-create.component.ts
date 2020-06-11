import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment-timezone';
import { NgbDateStruct, NgbCalendar, NgbModal, NgbInputDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { GlobalsService } from 'src/app/services/globals.service';
import Swal from 'sweetalert2';
import { UsersService } from '../../../services/users.service';
import { User } from 'src/app/models/user';
import { CirclesService } from '../../../services/circles.service';
import { CircleI } from 'src/app/models/circle';

import { MustMatch } from '../../../helpers/must-match.validator';

@Component({
  selector: 'app-register-create',
  templateUrl: './register-create.component.html',
  styleUrls: ['./register-create.component.css']
})
export class RegisterCreateComponent implements OnInit {

  public formRegister: FormGroup;
  public formSubmitAttempt: boolean;
  public user: User;
  private _birthdayDate: any;
  public userEnabled = false;
  public is_valid_date = false;
  public statuses = [
    {key: 'request', name: 'Solicitud'},
    {key: 'approved', name: 'Aprobado'},
    {key: 'denied', name: 'Denegado'}
  ];
  public schedules = [
    {key: 'mañana', name: 'Mañana'},
    {key: 'tarde', name: 'Tarde'},
    {key: 'noche', name: 'Noche'}
  ];
  public circles: CircleI[];
  public max_date: NgbDateStruct;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    private modalService: NgbModal,
    private globalsService: GlobalsService,
    private usersService: UsersService,
    private circlesService: CirclesService,
    private activatedRoute: ActivatedRoute,
    private config: NgbInputDatepickerConfig
  ) { 
    const valid_date = moment().subtract(18, 'years').tz('America/Mexico_City');
    this.max_date = {year: valid_date.year(), month: valid_date.month() + 1, day: valid_date.date()};
  }

  ngOnInit() {
    this.formRegister = this.fb.group({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(3)]),
      city: new FormControl(''),
      status: new FormControl('approved', [Validators.required, Validators.minLength(3)]),
      circle: new FormControl(''),
      birthdayDateStruct: new FormControl(this.calendar.getToday()),
      phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern('[0-9]{10}')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      schedule: new FormControl('mañana', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([A-Za-z]|[^ ]){6,16}$/)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6), 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([A-Za-z]|[^ ]){6,16}$/)])
    }, { validator: MustMatch('password', 'confirmPassword') });

    this.circlesService.getCircles().subscribe(circles => {
      this.circles = circles.results;
      this.user = {
        firstName: '',
        lastName: '',
        username: '',
        photo: null,
        ine: null,
        email: '',
        birthday: null, 
        phone: '',
        password: '1234',
        sessionToken: '',
        emailVerified: true,
        objectId: '',
        createdAt: null,
        updatedAt: null,
        ACL: {
          '*': {
              'read': true
          },
          'role:Admin': {
              'read': true,
              'write': true
          }
        },
        isRepresentativeCircle: false,
        contact: null,
        circle: '',
        status: 'approved',
        role: 'voluntario',
        approved: true,
        request: false,
        selected: false,
        city: '',
        location: null,
        description: '',
        schedules: [],
        activities: [],
        schedule: 'mañana',
        gender: '',
        interests: ''
      };
      const birthdayDate = moment().subtract(18, 'years').tz('America/Mexico_City');

      this.formRegister.get('firstName').setValue(this.user.firstName);
      this.formRegister.get('lastName').setValue(this.user.lastName);
      this.formRegister.get('description').setValue(this.user.description);
      this.formRegister.get('city').setValue(this.user.city);
      this.formRegister.get('status').setValue(this.user.status);
      this.formRegister.get('phone').setValue(this.user.phone);
      this.formRegister.get('email').setValue(this.user.username);
      this.formRegister.get('schedule').setValue(this.user.schedule);

      this.formRegister.get('birthdayDateStruct').setValue({
        year: birthdayDate.year(),
        month: birthdayDate.month() + 1,
        day: birthdayDate.date()
      });

      this.onChangeDate(null);



      this.userEnabled = true;
    });

  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true }
  }

  get f() { return this.formRegister.controls; }

  onCancel(): void {
    this.router.navigate(['/dashboard/registers']);
  }

  onCreateUser(): void {
    if (!this.userEnabled) {
      Swal.fire({ title: 'Error', html: 'El usuario no es posible editar', type: 'error' }).then(result => {
        this.router.navigate(['/dashboard/registers']);
      });
      return;
    }

    if (this.formRegister.valid) {
      const params = {
        username: this.formRegister.get('email').value,
        password: this.formRegister.get('password').value,
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
        ACL: {
          '*': {
              'read': true
          },
          'role:Admin': {
              'read': true,
              'write': true
          }
        },
        circle: null,
        role: this.user.role,
        isRepresentativeCircle: false,
        gender: this.user.gender,
        photo: this.user.photo || null,
        ine: this.user.ine || null
      };

      if (params.photo === null || params.ine === null){
        Swal.fire({
          title: 'Error',
          html: 'La imagen de perfil y la foto de INE son requeridos.',
          type: 'error'
        });
        return;
      }

      if (this.formRegister.get('circle').value.length > 0) {
        params.circle = {
          __type: 'Pointer',
          className: 'Circle',
          objectId: this.formRegister.get('circle').value
        };
      }

      this.usersService.createUser(params).subscribe(res => {
        if (res) {
          Swal.fire({
            title: 'Listo',
            html: 'Se ha registrado el voluntario',
            type: 'success'
          }).then(() => {
            this.router.navigate(['/dashboard/registers']);
          });
        } else {
          // show alert to user
          console.log(res);
          Swal.fire({
            title: 'Error',
            html: 'Error al crear el registro',
            type: 'error'
          });
        }
      }, error => {
        // show alert to user
        let message = '';
        if(error.error !== undefined && error.error.code === 202){
          message = "Existe un usuario registrado con el mismo email";
        } else{
          message = error.error.error;
        }
        Swal.fire({
          title: 'Error',
          html: message,
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
    
    this.validateBirthday();

  }

  validateBirthday(): void {
    const valid_date = moment().subtract(18, 'years').tz('America/Mexico_City');
    this.is_valid_date = !(this._birthdayDate >= valid_date);
  }



  onSelectPhoto(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0];
      const name = file.name;
      const Parse = this.globalsService.getParseObject();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (e) => { // called once readAsDataURL is completed
        this.user.photo = {};
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
        this.user.ine = {};
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
