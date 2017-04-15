import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {appConst} from '../../shared/constants';
import '../../shared/rxjs.extension';
import {Observable} from 'rxjs/Observable';
import {Mock} from '../../shared/api.model';

@Component({
  selector: 'mpi-mock-edit',
  templateUrl: './mock-edit.component.html',
  styleUrls: ['./mock-edit.component.scss']
})
export class MockEditComponent implements OnInit {

  mockForm: FormGroup;

  methods: string[] = appConst.api.methods;

  filteredStatus: Observable<number[]>;

  filteredContentTypes: Observable<string[]>;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.mockForm = this.initializeForm(null);
    this.filteredStatus = this.filterStatuses();
    this.filteredContentTypes = this.filterContentType();
  }

  save() {
  }

  private initializeForm(mock: Mock): FormGroup {
    return this.formBuilder.group({
      name: [mock ? mock.name : '', [Validators.required]],
      collection: [mock ? mock.collection : ''],
      delay: [mock ? mock.delay : null],
      description: [mock ? mock.description : ''],
      request: this.formBuilder.group({
        path: [mock ? mock.request.path : '', [Validators.required]],
        method: [mock ? mock.request.method : 'GET', [Validators.required]],
        params: [mock ? mock.request.params : ''],
        headers: [mock ? mock.request.headers : '']
      }),
      response: this.formBuilder.group({
        body: [mock ? mock.response.body : '', [Validators.required]],
        status: [mock ? mock.response.status : ''],
        contentType: [mock ? mock.response.contentType : '']
      })
    });
  }

  private filterStatuses(): Observable<number[]> {
    const statuses = [200, 201, 400, 401, 403, 404];
    return this.mockForm.get('response').get('status').valueChanges
      .startWith('')
      .map(v => v ? statuses.map(s => s.toString()).filter(s => new RegExp(`^${v.toString()}`, 'gi').test(s)) : statuses);
  }

  private filterContentType(): Observable<string[]> {
    const contentTypes = ['application/json', 'application/text', 'text/plain'];
    return this.mockForm.get('response').get('contentType').valueChanges
      .startWith('')
      .map(v => v ? contentTypes.map(s => s).filter(s => new RegExp(`^${v}`, 'gi').test(s)) : contentTypes);
  }

}
