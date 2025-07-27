import { Component } from '@angular/core';
import { SearchComponent } from '../../components/search/search.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [SearchComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent {}
