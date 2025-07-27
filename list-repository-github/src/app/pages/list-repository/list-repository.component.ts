import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CardComponent } from '../../components/card/card.component';
import { PaginateComponent } from '../../components/paginate/paginate.component';
import { RepositoriesService } from '../../services/repositories.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-list-repository',
    standalone: true,
    imports: [HeaderComponent, CardComponent, PaginateComponent],
    templateUrl: './list-repository.component.html',
    styleUrl: './list-repository.component.css',
})
export class ListRepositoryComponent implements OnInit {
    repository: string = '';
    total_repositories: number = 0;
    repositories: any[] = [];
    paginate: string[] = [];

    constructor(
        private repositoriesService: RepositoriesService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((param) => {
            this.repository = param['repository'];

            this.repositoriesService
                .getRepositories(this.repository)
                .subscribe({
                    next: (res) => {
                        this.total_repositories = res.body.total_count;
                        this.extractData(res.body.items);
                        this.extractPaginate(res.headers.get('Link'));
                    },
                    error: (err) => {
                        console.error('Erro ao buscar dados: ', err);
                    },
                });
        });
    }

    extractData(data: any[]): void {
        const resolve = data.forEach((repository: any) => {
            const object = {
                name: repository.full_name,
                avatar: repository.owner.avatar_url,
                url: repository.html_url,
                description: repository.description,
                stars: repository.stargazers_count,
                open_issues: repository.open_issues,
                forks: repository.forks,
                language: repository.language,
                topics: repository.topics,
            };

            this.repositories.push(object);
        });

        return resolve;
    }

    extractPaginate(link: string): void {
        const separate = link.split(',');

        const links: any = {};

        for (let part of separate) {
            const section = part.split(';');
            if (section.length !== 2) continue;

            const url = section[0].trim().slice(1, -1);
            const name = section[1].trim().replace(/rel="(.*)"/, '$1');

            links[name] = url;
        }

        this.paginate.push(links);
        return links;
    }
}
