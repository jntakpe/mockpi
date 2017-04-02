import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { appConst } from '../shared/constants';
import '../shared/rxjs.extension';
import { Mock } from '../shared/api.model';
import { TableModel } from '../shared/table/table.model';
import { TdDataTableService } from '@covalent/core';

@Injectable()
export class MocksService {

  constructor(private http: Http, private dataTableService: TdDataTableService) {
  }

  findMocks(): Observable<Mock[]> {
    return this.http.get(`${appConst.api.baseUrl}/mocks`)
      .map(res => res.json())
      .map((m: Mock[]) => m.map(this.formatRequestParams));
  }

  formatRequestParams(mock: Mock): Mock {
    const params = mock.request.params;
    const urlSearchParams = new URLSearchParams();
    Object.keys(params).forEach(k => urlSearchParams.set(k, params[k]));
    mock.request['fmtParams'] = urlSearchParams.toString();
    return mock;
  }

  updateTable(mocks: Mock[], table: TableModel): Mock[] {
    return this.dataTableService.sortData(mocks, table.sortBy, table.sortOrder);
  }

}
