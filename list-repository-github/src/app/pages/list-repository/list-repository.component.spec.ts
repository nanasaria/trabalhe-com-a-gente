import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListRepositoryComponent } from './list-repository.component';
import { RepositoriesService } from '../../services/repositories.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PaginateComponent } from '../../components/paginate/paginate.component';
import { CardComponent } from '../../components/card/card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

const mockRepositoriesResponse = {
    body: {
        total_count: 1234,
        items: [
            {
                full_name: 'user/full_name',
                owner: { avatar_url: 'https://example.com/avatar.png' },
                html_url: 'https://github.com/user/repository',
                description: 'description',
                stargazers_count: 1230,
                open_issues: 10,
                forks: 50,
                language: 'javascript',
                topics: [
                    'angular',
                    'typescript',
                    'javascript',
                    'react',
                    'nextjs',
                ],
            },
        ],
    },
    headers: new HttpHeaders({
        Link: '<https://api.github.com/repositories?page=2>; rel="next", <https://api.github.com/repositories?page=5>; rel="last"',
    }),
};

class MockRepositoriesService {
    getRepositories(repository: string) {
        return of(mockRepositoriesResponse);
    }

    getRepositoriesByUrl(url: string) {
        return of(mockRepositoriesResponse);
    }
}

const mockActivatedRoute = {
    params: of({ repository: 'github' }),
};

describe('ListRepositoryComponent', () => {
    let component: ListRepositoryComponent;
    let fixture: ComponentFixture<ListRepositoryComponent>;
    let mockService: jasmine.SpyObj<RepositoriesService>;
    let mockRoute: any;

    beforeEach(async () => {
        mockService = jasmine.createSpyObj('RepositoriesService', [
            'getRepositories',
            'getRepositoriesByUrl',
        ]);

        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                ListRepositoryComponent,
                HeaderComponent,
                CardComponent,
                PaginateComponent,
                MatProgressSpinnerModule,
                CommonModule,
            ],
            providers: [
                { provide: RepositoriesService, useValue: mockService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                {
                    provide: RepositoriesService,
                    useClass: MockRepositoriesService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ListRepositoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should fetch repositories and update state on init', () => {
            const mockParam = { repository: 'github' };

            const mockResponse = {
                body: {
                    total_count: '100',
                    items: [{ name: 'github', id: 103708041 }],
                },
                headers: {
                    get: () => '<https://api.github.com/...>; rel="next"',
                },
            };

            mockRoute.params = of(mockParam);

            mockService.getRepositories.and.returnValue(of(mockResponse));

            spyOn(component, 'extractData');
            spyOn(component, 'extractPaginate');
            spyOn(component, 'manipulateNumbers').and.returnValue('1.2K');

            component.ngOnInit();

            expect(component.repository).toBe('github');
            expect(mockService.getRepositories).toHaveBeenCalledWith('github');
            expect(component.manipulateNumbers).toHaveBeenCalledWith('100');
            expect(component.total_repositories).toBe('1.2K');
            expect(component.extractData).toHaveBeenCalledWith(
                mockResponse.body.items
            );
            expect(component.extractPaginate).toHaveBeenCalledWith(
                '<https://api.github.com/...>; rel="next"'
            );
            expect(component.isLoading).toBeFalse();
        });

        it('should handle error when fetch fails', () => {
            const mockParam = { repository: 'github' };

            mockRoute.params = of(mockParam);

            const errorResponse = {
                status: 403,
                statusText: 'Server Error',
            };

            mockService.getRepositories.and.returnValue(
                throwError(() => errorResponse)
            );

            spyOn(console, 'error');

            component.ngOnInit();

            expect(mockService.getRepositories).toHaveBeenCalledWith('github');
            expect(console.error).toHaveBeenCalledWith(
                'Erro ao buscar dados: ',
                errorResponse
            );
            expect(component.isLoading).toBeFalse();
        });
    });

    describe('getRepositoriesByPaginate', () => {
        it('should getRepositoriesByPaginate return repositories', () => {
            const url =
                'https://api.github.com/search/repositories?q=node&per_page=5&page=2';

            const mockResponse = {
                body: {
                    total_count: '100',
                    items: [{ name: 'github', id: 10370 }],
                },
                headers: {
                    get: () => '<https://api.github.com/...>; rel="next"',
                },
            };

            mockService.getRepositoriesByUrl.and.returnValue(of(mockResponse));

            spyOn(component, 'extractData');
            spyOn(component, 'extractPaginate');

            component.getRepositoriesByPaginate(url);

            expect(mockService.getRepositoriesByUrl).toHaveBeenCalledWith(url);
            expect(component.extractData).toHaveBeenCalledWith(
                mockResponse.body.items
            );
            expect(component.extractPaginate).toHaveBeenCalledWith(
                '<https://api.github.com/...>; rel="next"'
            );
            expect(component.isLoading).toBeFalse();
        });

        it('should handle error on getRepositoriesByPaginate', () => {
            const url =
                'https://api.github.com/search/repositories?q=node&per_page=5&page=2';

            const errorResponse = {
                status: 403,
                statusText: 'Server Error',
            };

            mockService.getRepositoriesByUrl.and.returnValue(
                throwError(() => errorResponse)
            );

            spyOn(console, 'error');

            component.getRepositoriesByPaginate(url);

            expect(mockService.getRepositoriesByUrl).toHaveBeenCalledWith(url);
            expect(component.isLoading).toBeFalse();
        });
    });

    describe('extractData', () => {
        it('should extract and format object repository including description', () => {
            const mockData = [
                {
                    full_name: 'full_nameRepositoryGithub',
                    owner: { avatar_url: 'https://example.com/avatar.png' },
                    html_url: 'https://github.com/example/repo',
                    description: 'Repository description',
                    stargazers_count: '1200',
                    open_issues: '30',
                    forks: '75',
                    language: 'JavaScript',
                    topics: [
                        'node',
                        'javascript',
                        'react',
                        'unit test',
                        'docker',
                        'aws',
                    ],
                },
            ];

            spyOn(component, 'verifyDescription').and.callFake((desc) => desc);
            spyOn(component, 'manipulateNumbers').and.callFake(
                (item) => `${item}k`
            );

            component.repositories = [];
            component.extractData(mockData);
            expect(component.repositories.length).toBe(1);
            expect(component.repositories[0]).toEqual({
                name: 'full_nameRepositoryGit...',
                avatar: 'https://example.com/avatar.png',
                url: 'https://github.com/example/repo',
                description: 'Repository description',
                stars: '1200k',
                open_issues: '30k',
                forks: '75k',
                language: 'JavaScript',
                topics: ['node', 'javascript', 'react', 'unit test'],
            });

            expect(component.verifyDescription).toHaveBeenCalledWith(
                'Repository description'
            );
            expect(component.manipulateNumbers).toHaveBeenCalledWith('1200');
            expect(component.manipulateNumbers).toHaveBeenCalledWith('30');
            expect(component.manipulateNumbers).toHaveBeenCalledWith('75');
        });

        it('should extract and format object repository without manipulate description', () => {
            const mockData = [
                {
                    full_name: 'full_name',
                    owner: { avatar_url: 'https://example.com/avatar.png' },
                    html_url: 'https://github.com/example/repo',
                    description: 'Repository description',
                    stargazers_count: '1200',
                    open_issues: '30',
                    forks: '75',
                    language: 'JavaScript',
                    topics: [
                        'node',
                        'javascript',
                        'react',
                        'unit test',
                        'docker',
                        'aws',
                    ],
                },
            ];

            spyOn(component, 'verifyDescription').and.callFake((desc) => desc);
            spyOn(component, 'manipulateNumbers').and.callFake(
                (item) => `${item}k`
            );

            component.repositories = [];
            component.extractData(mockData);
            expect(component.repositories.length).toBe(1);
            expect(component.repositories[0]).toEqual({
                name: 'full_name',
                avatar: 'https://example.com/avatar.png',
                url: 'https://github.com/example/repo',
                description: 'Repository description',
                stars: '1200k',
                open_issues: '30k',
                forks: '75k',
                language: 'JavaScript',
                topics: ['node', 'javascript', 'react', 'unit test'],
            });

            expect(component.verifyDescription).toHaveBeenCalledWith(
                'Repository description'
            );
            expect(component.manipulateNumbers).toHaveBeenCalledWith('1200');
            expect(component.manipulateNumbers).toHaveBeenCalledWith('30');
            expect(component.manipulateNumbers).toHaveBeenCalledWith('75');
        });
    });

    describe('extractPaginate', () => {
        it('should skip pagination sections', () => {
            const linkHeader =
                '<https://api.github.com/search/repositories?q=github&page=2>';

            const result = component.extractPaginate(linkHeader);

            expect(result).toBeUndefined();
            expect(component.paginate).toEqual([]);
            expect(component.hasCards).toBeFalse();
        });

        it('should extract pagination links and page numbers', () => {
            const mockLinkHeader =
                '<https://api.github.com/search/repositories?q=angular&page=4>; rel="next", ' +
                '<https://api.github.com/search/repositories?q=angular&page=200>; rel="last", ' +
                '<https://api.github.com/search/repositories?q=angular&page=1>; rel="first", ' +
                '<https://api.github.com/search/repositories?q=angular&page=2>; rel="prev"';

            const result = component.extractPaginate(mockLinkHeader);

            if (result) {
                expect(result).toEqual({
                    next: 'https://api.github.com/search/repositories?q=angular&page=4',
                    last: 'https://api.github.com/search/repositories?q=angular&page=200',
                    first: 'https://api.github.com/search/repositories?q=angular&page=1',
                    prev: 'https://api.github.com/search/repositories?q=angular&page=2',
                    next_number: '4',
                    last_number: '200',
                    first_number: '1',
                    prev_number: '2',
                });
                expect(component.paginate).toEqual([result]);
            }

            expect(component.hasCards).toBeTrue();
        });

        it('should handle empty or invalid link when extract pagination', () => {
            const result = component.extractPaginate('');

            expect(component.hasCards).toBeFalse();
            expect(component.paginate).toEqual([]);
            expect(result).toBeUndefined();
        });
    });

    describe('manipulateNumbers', () => {
        it('must format numbers greater than 1.000.000 to 1M', () => {
            const result = component.manipulateNumbers('1000000');
            expect(result).toBe('1M');
        });

        it('must format numbers greater than 1.000 and less than 1.000.000 to 1K', () => {
            const result = component.manipulateNumbers('1000');
            expect(result).toBe('1K');
        });

        it('must format numbers less than 1000', () => {
            const result = component.manipulateNumbers('900');
            expect(result).toBe('900');
        });
    });

    describe('verifyDescription', () => {
        it('should return an empty string if description is falsy', () => {
            expect(component.verifyDescription('')).toBe('');
            expect(component.verifyDescription(null as any)).toBe('');
            expect(component.verifyDescription(undefined as any)).toBe('');
        });

        it('should return the original description if length < 72', () => {
            const shortDesc = 'This is a short description.';
            expect(component.verifyDescription(shortDesc)).toBe(shortDesc);
        });

        it('should return truncated description with "..." if length grater than or equal to 72', () => {
            const longDesc =
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel nibh.';
            const result = component.verifyDescription(longDesc);

            expect(result.endsWith('...')).toBeTrue();
            expect(result.length).toBeLessThanOrEqual(72);
        });
    });

    describe('ListRepositoryComponent - Integration', () => {
        it('should display the total repositories', () => {
            const compiled = fixture.nativeElement as HTMLElement;
            expect(compiled.querySelector('h1')?.textContent).toContain(
                '1K Resultados'
            );
        });

        it('should render the <app-card> component with repositories', () => {
            const card = fixture.nativeElement.querySelector('app-card');
            expect(card).toBeTruthy();
        });

        it('should render the <app-paginate> component with pagination', () => {
            const paginate =
                fixture.nativeElement.querySelector('app-paginate');
            expect(paginate).toBeTruthy();
        });

        it('must not be charging after charging', () => {
            expect(component.isLoading).toBeFalse();
        });
    });
});
