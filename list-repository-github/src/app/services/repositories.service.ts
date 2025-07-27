import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RepositoriesService {
    constructor(private http: HttpClient) {}

    getRepositories(repository: string = 'github'): Observable<any> {
        return this.http.get(
            `https://api.github.com/search/repositories?q=${repository}&per_page=5`,
            {
                observe: 'response',
            }
        );
    }

    getRepositoriesByPaginate(link: string): Observable<any> {
        return this.http.get(link, { observe: 'response' });
    }
}
