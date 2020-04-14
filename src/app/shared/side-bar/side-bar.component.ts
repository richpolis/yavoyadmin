import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  logeado = true;
  @ViewChild('background', { static: true }) background: ElementRef;
  @ViewChild('sidebar', { static: true }) sidebar: ElementRef;

  constructor() { }

  ngOnInit() {
  }
  openSideBar() {

    this.sidebar.nativeElement.classList.remove('slideOutRight');
    this.sidebar.nativeElement.classList.add('slideInRight');
    this.background.nativeElement.classList.remove('hide');

  }

  closeSideBar() {
    this.sidebar.nativeElement.classList.remove('slideInRight');
    this.sidebar.nativeElement.classList.add('slideOutRight');
    setTimeout(() => {
      this.background.nativeElement.classList.add('hide');
    }, 600);
  }
}
