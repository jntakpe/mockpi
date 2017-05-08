import {NgModule} from '@angular/core';
import {ActivityComponent} from './activity.component';
import {TableModule} from '../shared/table/table.module';
import {SharedModule} from '../shared/shared.module';
import {ActivityService} from './activity.service';

@NgModule({
  declarations: [ActivityComponent],
  imports: [SharedModule, TableModule],
  exports: [ActivityComponent],
  providers: [ActivityService]
})
export class ActivityModule {
}
