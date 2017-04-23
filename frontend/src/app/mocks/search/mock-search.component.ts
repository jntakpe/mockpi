import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'mpi-mock-search',
  templateUrl: './mock-search.component.html',
  styleUrls: ['./mock-search.component.scss']
})
export class MockSearchComponent implements OnInit {

  @Output()
  searchChanges = new EventEmitter<any>();

  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.searchForm = this.initForm();
    this.searchForm.valueChanges.subscribe(v => this.searchChanges.emit(v));
  }

  private initForm(): FormGroup {
    return this.formBuilder.group({
      name: '',
      request: this.formBuilder.group({
        path: '',
        method: '',
        params: '',
      }),
      response: this.formBuilder.group({
        body: ''
      })
    });
  }

}
