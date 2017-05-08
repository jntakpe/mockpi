import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {LoginModule} from './login/login.module';
import {LayoutModule} from './shared/layout/layout.module';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app.routes';
import {ActivitiesComponent} from './activities/activities.component';
import {ActivityComponent} from './activity/activity.component';

@NgModule({
  declarations: [AppComponent, ActivitiesComponent, ActivityComponent],
  imports: [BrowserModule, SharedModule, LoginModule, LayoutModule, RouterModule.forRoot(appRoutes)],
  bootstrap: [AppComponent]
})
export class AppModule {
}
