import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CardComponent } from '../../components/card/card.component';
import { PaginateComponent } from '../../components/paginate/paginate.component';
import { RepositoriesService } from '../../services/repositories.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Paginate } from '../../model/Paginate.model';
import { Repository } from '../../model/Repository.model';

@Component({
    selector: 'app-list-repository',
    standalone: true,
    imports: [
        HeaderComponent,
        CardComponent,
        PaginateComponent,
        CommonModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './list-repository.component.html',
    styleUrl: './list-repository.component.css',
})
export class ListRepositoryComponent implements OnInit {
    repository: string = '';
    total_repositories: string = '';
    repositories: Repository[] = [];
    paginate: Paginate[] = [];
    hasCards: boolean = true;
    isLoading: boolean = false;

    constructor(
        private repositoriesService: RepositoriesService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((param) => {
            this.repository = param['repository'];

            this.isLoading = true;

            this.repositoriesService
                .getRepositories(this.repository)
                .subscribe({
                    next: (res) => {
                        this.total_repositories = this.manipulateNumbers(
                            res.body.total_count
                        );

                        this.repositories = [];
                        this.extractData(res.body.items);
                        this.extractPaginate(res.headers.get('Link'));
                        this.isLoading = false;
                    },
                    error: (err) => {
                        this.isLoading = false;
                        console.error('Erro ao buscar dados: ', err);
                    },
                });
        });
    }

    getRepositoriesByPaginate(url: string): void {
        this.isLoading = true;
        this.repositoriesService.getRepositoriesByUrl(url).subscribe({
            next: (res) => {
                this.repositories = [];
                this.extractData(res.body.items);
                this.extractPaginate(res.headers.get('Link'));
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                console.error('Erro ao buscar dados: ', err);
            },
        });
    }

    extractData(data: any[]): void {
        data.forEach((repository: any) => {
            if (repository.topics.length > 4) {
                repository.topics.splice(4);
            }

            const object = {
                name:
                    repository.full_name.length >= 25
                        ? repository.full_name.slice(0, 22).trim() + '...'
                        : repository.full_name,
                avatar: repository.owner.avatar_url,
                url: repository.html_url,
                description: this.verifyDescription(repository.description),
                stars: this.manipulateNumbers(repository.stargazers_count),
                open_issues: this.manipulateNumbers(repository.open_issues),
                forks: this.manipulateNumbers(repository.forks),
                language: repository.language,
                topics: repository.topics,
            };

            this.repositories.push(object);
        });

        return;
    }

    extractPaginate(link: string): Paginate | undefined {
        if (!link) {
            this.hasCards = false;
            this.paginate = [];
            return;
        }

        const separate = link.split(',');

        const links: any = {};

        for (let part of separate) {
            const section = part.split(';');
            if (section.length !== 2) continue;

            const url = section[0].trim().slice(1, -1);
            const name = section[1].trim().replace(/rel="(.*)"/, '$1');

            links[name] = url;
        }

        for (const [chave, valor] of Object.entries(links)) {
            const item = (valor as string)
                .replace('page=5', '')
                .replace(/\D/g, '');

            links[`${chave}_number`] = item;
        }

        this.paginate = [links as Paginate];

        console.log(this.paginate);
        return links as Paginate;
    }

    manipulateNumbers(num: string): string {
        const number = Math.round(Number(num) * 10) / 10;

        if (number >= 1000000) return `${Math.round(number / 1000000)}M`;
        if (number >= 100000) return `${Math.round(number / 1000)}K`;
        if (number >= 1000) return `${Math.round(number / 1000)}K`;

        return number.toString();
    }

    verifyDescription(description: string): string {
        if (!description) return '';

        return description.length >= 72
            ? description.slice(0, 69).trim() + '...'
            : description;
    }
}
