import {inject, TestBed} from '@angular/core/testing';
import {AlertService} from './alert.service';
import {MockpiMaterialModule} from '../mockpi-material.module';
import {MdSnackBar} from '@angular/material';
import {appConst} from '../constants';

describe('AlertService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockpiMaterialModule],
      providers: [AlertService]
    });
  });

  it('should create alertService', inject([AlertService], (service: AlertService) => {
    expect(service).toBeTruthy();
  }));

  it('should call mdSnackBar', inject([AlertService, MdSnackBar], (alertService: AlertService, mdSnackBar: MdSnackBar) => {
    spyOn(mdSnackBar, 'open');
    alertService.open('test');
    expect(mdSnackBar.open).toHaveBeenCalledWith('test', appConst.snackBar.closeBtnLabel, appConst.snackBar.defaultConfig);
  }));

});
