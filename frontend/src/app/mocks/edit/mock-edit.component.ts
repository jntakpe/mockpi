import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {appConst} from '../../shared/constants';
import '../../shared/rxjs.extension';
import {Observable} from 'rxjs/Observable';
import {Mock} from '../../shared/api.model';
import {MocksService} from '../mocks.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'mpi-mock-edit',
  templateUrl: './mock-edit.component.html',
  styleUrls: ['./mock-edit.component.scss']
})
export class MockEditComponent implements OnInit {

  mockForm: FormGroup;

  paramsFormArray: FormArray;

  headersFormArray: FormArray;

  methods: string[] = appConst.api.methods;

  filteredStatus: Observable<number[]>;

  filteredContentTypes: Observable<string[]>;

  initialName: string;

  constructor(private formBuilder: FormBuilder, private mocksService: MocksService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data
      .map(d => d.mock)
      .subscribe((mock: Mock) => {
        this.mockForm = this.initializeForm(mock);
        this.filteredStatus = this.filterStatuses();
        this.filteredContentTypes = this.filterContentType();
      });
  }

  save(): void {
    const mockForm = this.mockForm.value;
    mockForm.request.params = this.mocksService.mapKeyValueToLiteral(mockForm.request.params);
    mockForm.request.headers = this.mocksService.mapKeyValueToLiteral(mockForm.request.headers);
    this.mocksService.save(mockForm, this.initialName).subscribe(
      () => this.mocksService.redirectMocks(),
      err => this.mocksService.displaySaveError(err)
    );
  }

  addToFormArray(formArray: FormArray): void {
    formArray.push(this.keyValueGroup());
  }

  removeFromFormArray(formArray: FormArray, index: number): void {
    formArray.removeAt(index);
  }

  private initializeForm(mock: Mock): FormGroup {
    this.paramsFormArray = this.initKeyValueFormArray(mock ? mock.request.params : null);
    this.headersFormArray = this.initKeyValueFormArray(mock ? mock.request.headers : null);
    return this.formBuilder.group({
      name: [mock ? mock.name : '', [Validators.required]],
      collection: [mock ? mock.collection : ''],
      delay: [mock ? mock.delay : null],
      description: [mock ? mock.description : ''],
      request: this.formBuilder.group({
        path: [mock ? mock.request.path : '', [Validators.required]],
        method: [mock ? mock.request.method : 'GET', [Validators.required]],
        params: this.paramsFormArray,
        headers: this.headersFormArray
      }),
      response: this.formBuilder.group({
        body: [mock ? mock.response.body : '', [Validators.required]],
        status: [mock ? mock.response.status : ''],
        contentType: [mock ? mock.response.contentType : '']
      })
    });
  }

  private initKeyValueFormArray(map: { [key: string]: string }): FormArray {
    if (!map) {
      return this.formBuilder.array([]);
    }
    return this.formBuilder.array(Object.keys(map).map(k => this.keyValueGroup(k, map[k])));
  }

  private keyValueGroup(key: string = '', value: string = ''): FormGroup {
    return this.formBuilder.group({
      key: this.formBuilder.control(key, Validators.required),
      value: this.formBuilder.control(value, Validators.required)
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
