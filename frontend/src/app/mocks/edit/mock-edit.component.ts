import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { appConst } from '../../shared/constants';
import '../../shared/rxjs.extension';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'mpi-mock-edit',
  templateUrl: './mock-edit.component.html',
  styleUrls: ['./mock-edit.component.scss']
})
export class MockEditComponent implements OnInit {

  mockForm: FormGroup;

  methods: string[] = appConst.api.methods;

  filteredStatus: Observable<number[]>;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.mockForm = this.formBuilder.group({
      name: '',
      collection: '',
      delay: 0,
      description: '',
      request: this.formBuilder.group({
        path: '',
        method: 'GET',
        params: '',
        headers: ''
      }),
      response: this.formBuilder.group({
        body: '',
        status: '',
        contentType: '',
        encoding: ''
      })
    });
    this.filteredStatus = this.filterStatuses();
  }

  private filterStatuses(): Observable<number[]> {
    const statuses = [200, 201, 400, 401, 403, 404];
    return this.mockForm.get('response').get('status').valueChanges
      .startWith('')
      .map(v => v ? statuses.map(s => s.toString()).filter(s => new RegExp(`^${v.toString()}`, 'gi').test(s)) : statuses);
  }

}
