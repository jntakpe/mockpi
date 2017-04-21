import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Mock} from '../shared/api.model';
import {MocksService} from './mocks.service';
import '../shared/rxjs.extension';
import {Observable} from 'rxjs/Observable';
import {TableColumn} from '@swimlane/ngx-datatable/release';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {noop} from 'rxjs/util/noop';

@Component({
  selector: 'mpi-mocks',
  templateUrl: './mocks.component.html',
  styleUrls: ['./mocks.component.scss']
})
export class MocksComponent implements OnInit {

  @ViewChild('actionsTpl') actionsTpl: TemplateRef<any>;

  columns: TableColumn[];

  searchForm: FormGroup;

  mocks$: Observable<Mock[]>;

  private refresh$: Subject<string> = new BehaviorSubject('start');

  constructor(private mocksService: MocksService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.columns = this.initColumns();
    this.searchForm = this.initForm();
    const search$ = this.searchForm.valueChanges.startWith(this.searchForm.value);
    this.mocks$ = this.mocksService.findFilteredMocks(search$, this.refresh$.asObservable());
  }

  remove(mock: Mock): void {
    this.mocksService.remove(mock)
      .catch(() => Observable.of(true).do(() => this.mocksService.displayRemoveError(mock.name)))
      .subscribe(noop, noop, () => this.refresh$.next('remove'));
  }

  private initColumns(): TableColumn[] {
    return [
      {prop: 'name', name: 'Name'},
      {prop: 'request.path', name: 'Path'},
      {prop: 'request.method', name: 'Method'},
      {prop: 'request.fmtParams', name: 'Params'},
      {prop: 'response.body', name: 'Body', width: 600},
      {cellTemplate: this.actionsTpl, name: 'Actions', maxWidth: 100, sortable: false}
    ];
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      name: '',
      path: '',
      method: '',
      params: '',
      body: ''
    });
  }

}
