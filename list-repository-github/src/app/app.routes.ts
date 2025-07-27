import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ListRepositoryComponent } from './pages/list-repository/list-repository.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'list/:repository',
        component: ListRepositoryComponent,
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];
