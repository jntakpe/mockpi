import {NgModule} from '@angular/core';
import {SecurityService} from './security.service';
import {LocalStorageService} from '../local-storage/local-storage.service';
import {ConnectedGuard} from './guard/connected-guard.service';

@NgModule({
  providers: [SecurityService, LocalStorageService, ConnectedGuard]
})
export class SecurityModule {
}
