import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router, ActivatedRoute } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // ======= PARA SABER SI TENEMOS QUE QUITAR LOS LINKS DEL HEADER ========
  routeChild;

  constructor(private router: Router, private route: ActivatedRoute,
              private location: Location) {
    this.getDataRoute()
      .subscribe(data => {
        // Recibimos un "true" si es necesario quitar los links del header
        this.routeChild = data.child;
      });

  }

  ngOnInit() {
  }


  goBackPage() {
    this.location.back();
  }

  getDataRoute() {

    return this.router.events.pipe(
      filter((event) => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data));
  }


}
