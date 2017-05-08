import {Routes} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {HomeComponent} from '../../home/home.component';
import {RegisterComponent} from '../../register/register.component';
import {MocksComponent} from '../../mocks/mocks.component';
import {MockEditComponent} from '../../mocks/edit/mock-edit.component';
import {MockEditResolver} from '../../mocks/edit/mock-edit.resolver';
import {ActivityComponent} from '../../activity/activity.component';

export const layoutRoutes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {path: 'home', component: HomeComponent},
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'register', component: RegisterComponent},
      {path: 'mocks', component: MocksComponent},
      {path: 'mock', component: MockEditComponent},
      {path: 'mock/:id', component: MockEditComponent, resolve: {mock: MockEditResolver}},
      {path: 'activity', component: ActivityComponent}
    ]
  }
];
