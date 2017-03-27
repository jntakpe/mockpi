import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import '../../../rxjs.extension';
import { NavSignService } from './nav-sign.service';

@Component({
  selector: 'mpi-nav-sign',
  templateUrl: './nav-sign.component.html',
  styleUrls: ['./nav-sign.component.scss']
})
export class NavSignComponent implements OnInit {

  username$: Observable<string>;

  constructor(private navSignService: NavSignService) {
  }

  ngOnInit() {
    this.username$ = this.navSignService.username();
  }

  logout(): void {
    this.navSignService.logoutThenRedirectHome().subscribe();
  }

}
