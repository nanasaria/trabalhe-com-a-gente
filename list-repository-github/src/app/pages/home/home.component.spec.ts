import { SearchComponent } from '../../components/search/search.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('HomeComponent - Integration', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HomeComponent,
                SearchComponent,
                FormsModule,
                RouterTestingModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render the GitHub logo with correct src and alt', () => {
        const img = fixture.debugElement.query(By.css('img')).nativeElement;
        expect(img.src).toContain('assets/icons/logo-large.svg');
        expect(img.alt).toBe('Ícone do GitHub');
    });

    it('should render the SearchComponent with size "lg"', () => {
        const searchComponent = fixture.debugElement.query(
            By.directive(SearchComponent)
        );
        expect(searchComponent).toBeTruthy();

        const instance = searchComponent.componentInstance as SearchComponent;
        expect(instance.size).toBe('lg');
    });

    it('should have the main container with class "home"', () => {
        const container = fixture.debugElement.query(By.css('.home'));
        expect(container).toBeTruthy();
    });
});
