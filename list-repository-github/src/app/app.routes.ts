import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ListRepositoryComponent } from './pages/list-repository/list-repository.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'list/:repository',
        component: ListRepositoryComponent,
    },
];
