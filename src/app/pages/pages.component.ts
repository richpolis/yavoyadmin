import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { UsersService } from '../services/users.service';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit, OnDestroy {

  private intervalMembers$: Observable<number> = interval(1000 * 30);
  private subscription: Subscription;

  // Pasar esta variable por @Input al header component y al sidebar component
  // Para mayor referencia consulte el pages.component de la YaVoyAdmin
  public totalRequest = 0;

  constructor(private usersService: UsersService ) { }

  ngOnInit() {
    // Llamar el servicio cada 30 segundos
    this.subscription = this.intervalMembers$.subscribe(x => {

      // Llamar metodo
      this.getUsersRequest();

    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // ======= CREAR SERVICIO PARA TRAER SOLO EL TOTAL DE REGISTROS PENDIENTES Y NO TODA LA LISTA ========
  getUsersRequest() {

  }

}
