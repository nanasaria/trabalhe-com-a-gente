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
    placeholderText: string = 'Buscar repositório...';
    hasParameter: boolean = true;

    constructor(private router: Router) {}

    searchRepository() {
        if (!this.hasParam(this.repository)) return;

        this.router.navigate(['/list', this.repository]);
        this.repository = '';
    }

    hasParam(param: string): boolean {
        if (!param) {
            this.hasParameter = false;
            this.placeholderText = 'Necessário inserir o nome do repositório';
            return false;
        }

        this.hasParameter = true;
        return true;
    }
}
