import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.css',
})
export class SearchComponent {
    @Input() size: string = '';
    repository: string = '';

    constructor(private router: Router) {}

    searchRepository() {
        this.router.navigate(['/list', this.repository]);
        this.repository = '';
    }
}
