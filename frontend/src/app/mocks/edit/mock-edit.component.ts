import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {appConst} from '../../shared/constants';
import '../../shared/rxjs.extension';
import {Observable} from 'rxjs/Observable';
import {Mock, Request} from '../../shared/api.model';
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

  id: string;

  nameTimeout;

  requestTimeout;

  duplicateAndPending: boolean;

  constructor(private formBuilder: FormBuilder, private mocksService: MocksService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    Observable.race(this.mockFromData(), this.mockFromDuplicate()).subscribe(mock => {
      this.mockForm = this.initializeForm(mock);
      this.filteredStatus = this.filterStatuses();
      this.filteredContentTypes = this.filterContentType();
    });
  }

  save(): void {
    const mockForm = this.mockForm.value;
    this.mockForm.value.request = this.mapParamsAndHeaders(mockForm.request);
    this.mocksService.save(mockForm, this.id).subscribe(
      () => {
        this.mocksService.displaySaveSuccess(mockForm.name, this.id);
        this.mocksService.redirectMocks();
      },
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
      name: [mock ? mock.name : '', [Validators.required], [c => this.validateNameAvailable(c)]],
      collection: [mock ? mock.collection : ''],
      delay: [mock ? mock.delay.toString() : null],
      description: [mock ? mock.description : ''],
      request: this.formBuilder.group({
        path: [mock ? mock.request.path : '', [Validators.required]],
        method: [mock ? mock.request.method : 'GET', [Validators.required]],
        params: this.paramsFormArray,
        headers: this.headersFormArray
      }, {
        asyncValidator: g => this.validateRequestAvailable(g)
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

  private mockFromData(): Observable<Mock> {
    return this.route.data
      .filter(d => d.mock)
      .map(d => d.mock)
      .do(m => this.id = m.id);
  }

  private mockFromDuplicate(): Observable<Mock> {
    return this.route.queryParams
      .map(p => p.duplicate ? this.retrieveDuplicateMock() : null);
  }

  private retrieveDuplicateMock(): Mock {
    this.duplicateAndPending = true;
    return this.mocksService.retrieveCurrentDuplicate();
  }

  private validateNameAvailable(control: AbstractControl): Promise<any> {
    control.markAsTouched();
    clearTimeout(this.nameTimeout);
    return new Promise(resolve => {
      this.nameTimeout = setTimeout(() => {
        this.mocksService.checkNameAvailable(control.value, this.id).subscribe(() => resolve(null), () => resolve({taken: true}));
      }, 400);
    });
  }

  private validateRequestAvailable(group: FormGroup): Promise<any> {
    clearTimeout(this.requestTimeout);
    return new Promise(resolve => {
      this.requestTimeout = setTimeout(() => {
        const request = this.mapParamsAndHeaders(group.value);
        this.mocksService.checkRequestAvailable(request, this.id)
          .do(() => this.duplicateAndPending = false)
          .subscribe(() => resolve(null), () => resolve({taken: true}));
      }, 1000);
    });
  }

  private mapParamsAndHeaders(request: any): Request {
    const params = this.mocksService.mapKeyValueToLiteral(request.params);
    const headers = this.mocksService.mapKeyValueToLiteral(request.headers);
    return Object.assign({}, request, {params, headers});
  }

}
