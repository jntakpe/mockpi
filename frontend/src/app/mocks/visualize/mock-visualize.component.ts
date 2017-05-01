import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';
import {Mock} from '../../shared/api.model';
import JSONEditor, {JSONEditorOptions} from 'jsoneditor';
import {MocksService} from '../mocks.service';

@Component({
  selector: 'mpi-visualize',
  templateUrl: './mock-visualize.component.html',
  styleUrls: ['./mock-visualize.component.scss']
})
export class MockVisualizeComponent implements OnInit, AfterViewInit {

  @ViewChild('jsoneditorContainer') editorContainer: ElementRef;

  mock: Mock;

  json: any;

  constructor(private mocksService: MocksService, @Inject(MD_DIALOG_DATA) private data: any) {
  }

  ngOnInit() {
    this.mock = this.data.mock;
    this.json = this.mocksService.isApplicationJsonCompatible(this.mock);
  }

  ngAfterViewInit() {
    if (this.json) {
      new JSONEditor(this.editorContainer.nativeElement, this.jsonEditorOptions(), this.json);
    }
  }

  private jsonEditorOptions(): JSONEditorOptions {
    return {
      mode: 'code',
      modes: ['code', 'text'],
      onEditable: node => false,
    };
  }

}
