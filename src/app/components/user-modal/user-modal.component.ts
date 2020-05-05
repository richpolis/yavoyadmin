import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../services/users.service';
import { User } from 'src/app/models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {

  @Input() title = 'Detalle de beneficiario';
  @Input() btnLabelAccept = 'Cerrar';
  @Input() user: User;

  constructor(
    public activeModal: NgbActiveModal,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {}


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

