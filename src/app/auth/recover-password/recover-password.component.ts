import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { GlobalsService } from '../../services/globals.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

declare const Swal: any;

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {
  @Input() email;
  formRecoverPassword: FormGroup;
  submitted = false;
  public onClose: Subject<boolean>;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private globalsService: GlobalsService,
    private bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.formRecoverPassword = this.formBuilder.group({
      email: new FormControl(this.email, [Validators.required, Validators.email])
    });
    this.onClose = new Subject();
  }

  get f() { return this.formRecoverPassword.controls; }

  onRecoverPassword(): void {
    this.submitted = true;

    if (this.formRecoverPassword.invalid) {
      return;
    }

    this.authService.recoverPassword(this.formRecoverPassword.get('email').value).subscribe(res => {
      this.onClose.next(true);
      this.bsModalRef.hide();
    }, error => {
      // show alert to user
      Swal.fire({
        title: 'Error',
        html: error.message,
        type: 'error'
      });
    });
  }

  onCancel(): void {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}