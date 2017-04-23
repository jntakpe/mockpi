import {Injectable} from '@angular/core';
import {RegexType} from './regex-type';
import * as sift from 'sift';
import * as flat from 'flat';

@Injectable()
export class FilterTableService {

  constructor() {
  }

  regexFilter<T>(data: T[], filterParams: { [key: string]: any }, regexType: RegexType = RegexType.StartsWith, operator = '$and') {
    const params = this.filterTruthyParams(filterParams);
    if (!params || !Object.keys(params).length) return data;
    return sift({[operator]: this.buildPredicatesArray(params, regexType)}, data);
  }

  private buildPredicatesArray(filterParams: { [key: string]: any }, regexType: RegexType): any[] {
    return Object.keys(filterParams)
      .map(k => ({k, v: filterParams[k]}))
      .map(({k, v}) => typeof v === 'string' ? this.regexPredicate(k, v, regexType) : this.numberPredicate(k, v))
  }

  private regexPredicate(key, value, regexType: RegexType): any {
    const regex = this.regexByType(value, regexType);
    return {[key]: {$regex: regex, $options: 'i'}};
  }

  private numberPredicate(key, value): any {
    return {[key]: {$eq: value}};
  }

  private regexByType(value: any, regexType: RegexType): string {
    switch (regexType) {
      case RegexType.Contains:
        return `${value}`;
      case RegexType.EndsWith:
        return `${value}$`;
      default:
        return `^${value}`;
    }
  }

  private filterTruthyParams(filterParams: { [key: string]: any }): { [key: string]: any } {
    if (!filterParams) {
      return;
    }
    const params = flat.flatten(filterParams);
    return Object.keys(params)
      .filter(k => params[k])
      .map(k => ({[k]: params[k]}))
      .reduce((a, c) => Object.assign(a, c), {});
  }


}
