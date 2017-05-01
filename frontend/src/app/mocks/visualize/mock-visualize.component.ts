import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';
import {Mock} from '../../shared/api.model';

@Component({
  selector: 'mpi-visualize',
  templateUrl: './mock-visualize.component.html',
  styleUrls: ['./mock-visualize.component.scss']
})
export class MockVisualizeComponent implements OnInit {

  mock: Mock;

  body: string;

  constructor(@Inject(MD_DIALOG_DATA) private data: any) {
  }

  ngOnInit() {
    this.mock = this.data.mock;
    this.body = JSON.parse(this.mock.response.body);
  }

}
