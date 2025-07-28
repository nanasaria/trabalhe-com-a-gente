import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { By } from '@angular/platform-browser';

describe('NotFoundComponent - Integration', () => {
    let component: NotFoundComponent;
    let fixture: ComponentFixture<NotFoundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotFoundComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the GitHub logo image with correct src and alt', () => {
        const img = fixture.debugElement.query(By.css('img')).nativeElement;
        expect(img.src).toContain('assets/icons/logo-large.svg');
        expect(img.alt).toBe('Ícone do GitHub');
    });

    it('should display the main heading text', () => {
        const h1 = fixture.debugElement.query(By.css('h1')).nativeElement;
        expect(h1.textContent).toContain('Ops! A página não foi encontrada :(');
    });

    it('should display the subheading text', () => {
        const h2 = fixture.debugElement.query(By.css('h2')).nativeElement;
        expect(h2.textContent).toContain(
            'Você pode continuar desvendando por aqui'
        );
    });

    it('should have a link with text "Desvendar..." pointing to "/"', () => {
        const link = fixture.debugElement.query(By.css('a')).nativeElement;
        expect(link.textContent).toBe('Desvendar...');
        expect(link.getAttribute('href')).toBe('/');
    });

    it('should have the main container with class "page-not-found"', () => {
        const container = fixture.debugElement.query(By.css('.page-not-found'));
        expect(container).toBeTruthy();
    });
});
