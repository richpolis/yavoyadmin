import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecoverPasswordModalComponent } from 'src/app/components/recover-password-modal/recover-password-modal.component';
import Swal from 'sweetalert2';
import { RoleI } from 'src/app/models/role';
import { RolesService } from 'src/app/services/roles.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  public formSubmitAttempt: boolean;
  public roles: RoleI[];

  constructor(
    private authService: AuthService,
    private globalsService: GlobalsService,
    private rolesService: RolesService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.formLogin = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.email ]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([A-Za-z]|[^ ]){6,16}$/)])
    });
    this.roles = this.globalsService.getRoles();
    if (this.roles === null) {
      this.rolesService.getRoles().subscribe(res => {
        this.roles = res.results;
        this.globalsService.setRoles(this.roles);
      }, error => {
        // show alert to user
        Swal.fire({
          title: 'Error',
          html: error.message,
          type: 'error'
        });
      });
    }
  }

  get f() { return this.formLogin.controls; }


  onLogin(): void {
    if (this.formLogin.valid) {
      this.authService.login(this.formLogin.value).subscribe(res => {
        console.log(res);
        this.globalsService.setUser(res);
        const roleAdmin = this.roles.find(role => role.name === 'Admin');
        if (res.role.objectId === roleAdmin.objectId) {
          this.router.navigate(['/dashboard']);
        } else {
          Swal.fire({
            title: 'Solo administradores',
            html: 'Solo acceso a administradores',
            type: 'error'
          });
          this.globalsService.cleanUser();
        }
      }, error => {
        // show alert to user
        Swal.fire({
          title: 'Error',
          html: 'Error en login',
          type: 'error'
        });
      });
    }
    this.formSubmitAttempt = true;
  }

  openFormRecoverPassword(): void {
    const recoverPasswordModal = this.modalService.open(RecoverPasswordModalComponent);
    recoverPasswordModal.componentInstance.email = this.formLogin.get('username').value;
    recoverPasswordModal.result.then( res => {
      Swal.fire({
        title: 'Exitoso',
        html: 'Se ha enviado un password a su correo',
        type: 'success'
      });
    }).catch((error) => {
      console.log(error)
      Swal.fire({
        title: 'Error',
        html: error.message,
        type: 'error'
      });
    });

  }

}
