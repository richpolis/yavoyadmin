import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { GlobalsService } from '../../services/globals.service';
import { Router } from '@angular/router';
import { RoleI } from '../../models/role';
import { RolesService } from '../../services/roles.service';
declare const Swal: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  public formSubmitAttempt: boolean;
  roles: any;

  constructor(
    private authService: AuthService,
    private globalsService: GlobalsService,
    private rolesService: RolesService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.formLogin = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.email ]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
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

  isFieldInvalid(field: string) {
    return (
      (!this.formLogin.get(field).valid && this.formLogin.get(field).touched) ||
      (this.formLogin.get(field).untouched && this.formSubmitAttempt)
    );
  }


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

  onRegister(): void {
    this.router.navigate(['/register']);
  }

}

