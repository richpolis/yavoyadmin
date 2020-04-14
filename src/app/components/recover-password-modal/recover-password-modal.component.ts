import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GlobalsService } from 'src/app/services/globals.service';

@Component({
  selector: 'app-recover-password-modal',
  templateUrl: './recover-password-modal.component.html',
  styleUrls: ['./recover-password-modal.component.css']
})
export class RecoverPasswordModalComponent implements OnInit {
  @Input() email;
  formRecoverPassword: FormGroup;
  submitted = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private globalsService: GlobalsService
  ) { }

  ngOnInit() {
    this.formRecoverPassword = this.formBuilder.group({
      email: new FormControl(this.email, [Validators.required, Validators.email])
    });
  }

  get f() { return this.formRecoverPassword.controls; }

  onRecoverPassword(): void {
    this.submitted = true;

    if (this.formRecoverPassword.invalid) {
      return;
    }

    this.authService.recoverPassword(this.formRecoverPassword.get('email').value).subscribe(res => {
      this.activeModal.close(res);
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
