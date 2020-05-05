import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../services/users.service';
import { AddressService } from 'src/app/services/address.service';
import { User } from 'src/app/models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css']
})
export class RegisterModalComponent implements OnInit {

  @Input() title = 'Detalle de voluntario';
  @Input() btnLabelAccept = 'Cerrar';
  @Input() user: User;
  @Input() addressString = '';

  constructor(
    public activeModal: NgbActiveModal,
    private usersService: UsersService,
    private addressService: AddressService
  ) {}

  ngOnInit(): void { }


  public getAddress(user: User) {
    const where = {voluntary: {
      __type: 'Pointer',
      className: '_User',
      objectId: this.user.objectId
    }};

    this.addressService.getAddresses(where,'createdAt').subscribe(res => {
      if (res.results.length > 0) {
        this.addressString = this.addressService.getStringFromAddress(res.results[0]);
      }
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

  getStringAddress(user): string {
    return '';
  }

  getStringHobbies(user): string {
    let hobbies = '';
    this.user.activities.forEach(item => {
      if (hobbies.length > 0) {
        hobbies += ('. ' + item);
      } else {
        hobbies += item;
      }
    });
    return hobbies;
  }

  closeModal() {
    this.activeModal.dismiss();
  }



}

