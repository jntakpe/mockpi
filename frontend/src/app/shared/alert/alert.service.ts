import {Injectable} from '@angular/core';
import {MdSnackBar, MdSnackBarRef, SimpleSnackBar} from '@angular/material';
import {appConst} from '../constants';

@Injectable()
export class AlertService {

  constructor(private mdSnackBar: MdSnackBar) {
  }

  open(msg: string, action = appConst.snackBar.closeBtnLabel, config = appConst.snackBar.defaultConfig): MdSnackBarRef<SimpleSnackBar> {
    return this.mdSnackBar.open(msg, action, config);
  }

}
