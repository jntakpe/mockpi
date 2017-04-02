import { Component, OnInit } from '@angular/core';
import { Mock } from '../shared/api.model';
import { MocksService } from './mocks.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'mpi-mocks',
  templateUrl: './mocks.component.html',
  styleUrls: ['./mocks.component.scss']
})
export class MocksComponent implements OnInit {

  mocks$: Observable<Mock[]>;

  constructor(private mocksService: MocksService) {
  }

  ngOnInit() {
    this.mocks$ = this.mocksService.findMocks();
  }

}
