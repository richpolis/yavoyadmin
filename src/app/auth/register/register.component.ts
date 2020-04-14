import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalsService } from 'src/app/services/globals.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formRegister: FormGroup;
  public formSubmitAttempt: boolean;

  constructor(  private authService: AuthService,
                private router: Router,
                private formBuilder: FormBuilder ) { }

  ngOnInit() {
    this.formRegister = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['User', Validators.required]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.formRegister.get(field).valid && this.formRegister.get(field).touched) ||
      (this.formRegister.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onRegister(): void {
    if (this.formRegister.valid) {
      this.authService.register(this.formRegister.value).subscribe( (res: any) => {
        if (res.success) {
          // show data for new User
          this.router.navigate(['/login']);
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
    this.formSubmitAttempt = true;
  }

}
