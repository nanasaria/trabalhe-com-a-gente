import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { Repository } from '../../model/Repository.model';
import { By } from '@angular/platform-browser';

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    const mockRepository: Repository = {
        name: 'github',
        avatar: 'http://localhost:9876/avatar-url',
        url: 'https://repo.url',
        description: 'description',
        stars: '100',
        open_issues: '5',
        forks: '10',
        language: 'TypeScript',
        topics: ['angular', 'typescript'],
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CardComponent);

        component = fixture.componentInstance;
        component.repository = mockRepository;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('cardComponent - Integration', () => {
        it('should display repository name', () => {
            const name = fixture.debugElement.query(By.css('h2')).nativeElement;
            expect(name.textContent).toContain('github');
        });

        it('should display repository avatar', () => {
            const avatar = fixture.debugElement.query(
                By.css('.picture-avatar img')
            ).nativeElement;
            expect(avatar.src).toBe(mockRepository.avatar);
        });

        it('should display repository description', () => {
            const desc = fixture.debugElement.query(
                By.css('.principal-info p')
            ).nativeElement;
            expect(desc.textContent).toContain('description');
        });

        it('should display repository language', () => {
            const lang = fixture.debugElement.query(
                By.css('.principal-info span')
            ).nativeElement;
            expect(lang.textContent).toContain('TypeScript');
        });

        it('should display topics', () => {
            const topics = fixture.debugElement.queryAll(By.css('.topics li'));
            expect(topics.length).toBe(2);
            expect(topics[0].nativeElement.textContent).toContain('angular');
            expect(topics[1].nativeElement.textContent).toContain('typescript');
        });

        it('should display stars, forks and open issues', () => {
            const spans = fixture.debugElement.queryAll(
                By.css('.info-repository span')
            );
            expect(spans[0].nativeElement.textContent).toContain('100');
            expect(spans[1].nativeElement.textContent).toContain('10');
            expect(spans[2].nativeElement.textContent).toContain('5');
        });
    });
});
