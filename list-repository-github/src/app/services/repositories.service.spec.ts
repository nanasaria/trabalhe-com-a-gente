import { TestBed } from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { RepositoriesService } from './repositories.service';

describe('RepositoriesService', () => {
    let service: RepositoriesService;
    let httpClient: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RepositoriesService],
        });
        service = TestBed.inject(RepositoriesService);
        httpClient = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpClient.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getRepositories', () => {
        it('should call getRepositories with default value', () => {
            service.getRepositories().subscribe((response) => {
                expect(response).toBeTruthy;
            });

            const req = httpClient.expectOne(
                'https://api.github.com/search/repositories?q=github&per_page=5'
            );

            expect(req.request.method).toBe('GET');
            req.flush({ items: [] });
        });

        it('should call getRepositories with a repository value', () => {
            const repository = 'angular';

            service.getRepositories(repository).subscribe((response) => {
                expect(response).toBeTruthy;
            });

            const req = httpClient.expectOne(
                `https://api.github.com/search/repositories?q=${repository}&per_page=5`
            );

            expect(req.request.method).toBe('GET');
            req.flush({ items: [] });
        });
    });

    describe('getRepositoriesByUrl', () => {
        it('should call getRepositoriesByUrl with an url value', () => {
            const url =
                'https://api.github.com/search/repositories?q=github&per_page=5&page=2';

            service.getRepositoriesByUrl(url).subscribe((response) => {
                expect(response).toBeTruthy;
            });

            const req = httpClient.expectOne(url);

            expect(req.request.method).toBe('GET');
            req.flush({ items: [] });
        });
    });
});
