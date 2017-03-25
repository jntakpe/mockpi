import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {HeaderService} from './header.service';

@Component({
  selector: 'mpi-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  username$: Observable<string>;

  constructor(private headerService: HeaderService) {
  }

  ngOnInit() {
    this.username$ = this.headerService.username();
  }

  logout(): void {
    this.headerService.logoutThenRedirectHome().subscribe();
  }

}
