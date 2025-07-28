import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from '../search/search.component';
import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('HeaderComponent - Integration', () => {
        it('should display the GitHub logo with src and alt', () => {
            const imgEl = fixture.debugElement.query(
                By.css('img')
            ).nativeElement;
            expect(imgEl.src).toContain('assets/icons/logo.svg');
            expect(imgEl.alt).toBe('Ícone do GitHub');
        });

        it('should contain a link to the homepage', () => {
            const anchorEl = fixture.debugElement.query(
                By.css('a')
            ).nativeElement;
            expect(anchorEl.getAttribute('href')).toBe('/');
        });

        it('should render the SearchComponent with size "md"', () => {
            const searchComponent = fixture.debugElement.query(
                By.directive(SearchComponent)
            );
            expect(searchComponent).toBeTruthy();
            expect(searchComponent.componentInstance.size).toBe('md');
        });
    });
});
