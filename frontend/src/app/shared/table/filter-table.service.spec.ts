import {inject, TestBed} from '@angular/core/testing';
import {FilterTableService} from './filter-table.service';
import {RegexType} from './regex-type';

describe('filter service', () => {

  const dummyData = [
    {id: 1, firstName: 'Bruce', lastName: 'Wayne', age: 35},
    {id: 2, firstName: 'John', lastName: 'Rambo', age: 40},
    {id: 3, firstName: 'Clark', lastName: 'Kent', age: 35},
    {id: 4, firstName: 'Bruce', lastName: 'Banner', age: 45}
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterTableService]
    });
  });

  it('should filter none cuz no params', inject([FilterTableService], (filterTableService: FilterTableService) => {
    expect(filterTableService.regexFilter(dummyData, null).length).toBe(dummyData.length);
  }));

  it('should filter none cuz empty params', inject([FilterTableService], (filterTableService: FilterTableService) => {
    expect(filterTableService.regexFilter(dummyData, {}).length).toBe(dummyData.length);
  }));

  it('should filter none cuz empty params strings', inject([FilterTableService], (filterTableService: FilterTableService) => {
    expect(filterTableService.regexFilter(dummyData, {firstName: '', lastName: ''}).length).toBe(dummyData.length);
  }));

  it('should filter 1 with firstName exact matching', inject([FilterTableService], (filterTableService: FilterTableService) => {
    const result = filterTableService.regexFilter(dummyData, {firstName: 'John'});
    expect(result.length).toBe(1);
    expect(result[0].lastName).toBe('Rambo');
  }));

  it('should filter 1 with firstName ignoring case', inject([FilterTableService], (filterTableService: FilterTableService) => {
    const result = filterTableService.regexFilter(dummyData, {firstName: 'jOHn'});
    expect(result.length).toBe(1);
    expect(result[0].lastName).toBe('Rambo');
  }));

  it('should filter 1 with firstName ignoring case first char', inject([FilterTableService], (filterTableService: FilterTableService) => {
    const result = filterTableService.regexFilter(dummyData, {firstName: 'j'});
    expect(result.length).toBe(1);
    expect(result[0].lastName).toBe('Rambo');
  }));

  it('should filter 1 with firstName matching case first char', inject([FilterTableService], (filterTableService: FilterTableService) => {
    const result = filterTableService.regexFilter(dummyData, {firstName: 'J'});
    expect(result.length).toBe(1);
    expect(result[0].lastName).toBe('Rambo');
  }));

  it('should filter 1 with firstName and lastname ignoring case first char',
    inject([FilterTableService], (filterTableService: FilterTableService) => {
      const result = filterTableService.regexFilter(dummyData, {firstName: 'j', lastName: 'r'});
      expect(result.length).toBe(1);
      expect(result[0].lastName).toBe('Rambo');
    }));

  it('should filter none with firstName and lastName', inject([FilterTableService], (filterTableService: FilterTableService) => {
    expect(filterTableService.regexFilter(dummyData, {firstName: 'j', lastName: 'a'}).length).toBe(0);
  }));

  it('should filter none with firstName', inject([FilterTableService], (filterTableService: FilterTableService) => {
    expect(filterTableService.regexFilter(dummyData, {firstName: 'z'}).length).toBe(0);
  }));

  it('should filter 2 with firstName matching', inject([FilterTableService], (filterTableService: FilterTableService) => {
    expect(filterTableService.regexFilter(dummyData, {firstName: 'bruce'}).length).toBe(2);
  }));

  it('should filter 2 with firstName first char', inject([FilterTableService], (filterTableService: FilterTableService) => {
    expect(filterTableService.regexFilter(dummyData, {firstName: 'b'}).length).toBe(2);
  }));

  it('should filter 1 with firstName and lastName first char', inject([FilterTableService], (filterTableService: FilterTableService) => {
    const result = filterTableService.regexFilter(dummyData, {firstName: 'bruce', lastName: 'b'});
    expect(result.length).toBe(1);
    expect(result[0].lastName).toBe('Banner');
  }));

  it('should filter 1 firsname containing o', inject([FilterTableService], (filterTableService: FilterTableService) => {
    const result = filterTableService.regexFilter(dummyData, {firstName: 'o'}, RegexType.Contains);
    expect(result.length).toBe(1);
    expect(result[0].lastName).toBe('Rambo');
  }));

  it('should filter 1 firsname containing ruc and lastname containing r',
    inject([FilterTableService], (filterTableService: FilterTableService) => {
      const result = filterTableService.regexFilter(dummyData, {firstName: 'ruc', lastName: 'r'}, RegexType.Contains);
      expect(result.length).toBe(1);
      expect(result[0].lastName).toBe('Banner');
    }));

  it('should filter 1 firsname endswith k', inject([FilterTableService], (filterTableService: FilterTableService) => {
    const result = filterTableService.regexFilter(dummyData, {firstName: 'k'}, RegexType.EndsWith);
    expect(result.length).toBe(1);
    expect(result[0].lastName).toBe('Kent');
  }));

  it('should filter 1 firsname containing ruc and lastname containing r',
    inject([FilterTableService], (filterTableService: FilterTableService) => {
      const result = filterTableService.regexFilter(dummyData, {firstName: 'ce', lastName: 'er'}, RegexType.EndsWith);
      expect(result.length).toBe(1);
      expect(result[0].lastName).toBe('Banner');
    }));

  it('should filter 2 with number', inject([FilterTableService], (filterTableService: FilterTableService) => {
    const result = filterTableService.regexFilter(dummyData, {age: 35});
    expect(result.length).toBe(2);
  }));

  it('should filter 1 with number', inject([FilterTableService], (filterTableService: FilterTableService) => {
    const result = filterTableService.regexFilter(dummyData, {age: 45});
    expect(result.length).toBe(1);
  }));

  it('should filter 0 with number', inject([FilterTableService], (filterTableService: FilterTableService) => {
    const result = filterTableService.regexFilter(dummyData, {age: 20});
    expect(result.length).toBe(0);
  }));

  it('should filter 1 with number and lastName', inject([FilterTableService], (filterTableService: FilterTableService) => {
    const result = filterTableService.regexFilter(dummyData, {lastName: 'Kent', age: 35});
    expect(result.length).toBe(1);
  }));

});
