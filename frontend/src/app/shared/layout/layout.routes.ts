import {Routes} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {HomeComponent} from '../../home/home.component';

export const layoutRoutes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {path: 'home', component: HomeComponent},
      {path: '', redirectTo: 'home', pathMatch: 'full'}
    ]
  }
];
