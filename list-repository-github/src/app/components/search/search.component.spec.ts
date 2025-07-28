import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('SearchComponent', () => {
    let component: SearchComponent;
    let fixture: ComponentFixture<SearchComponent>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [SearchComponent, FormsModule],
            providers: [{ provide: Router, useValue: routerSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('hasParam', () => {
        it('should hasParam return true if params is filled', () => {
            const result = component.hasParam('angular');
            expect(result).toBeTrue();
            expect(component.hasParameter).toBeTrue();
        });

        it('should hasParam return false if params is empty', () => {
            const result = component.hasParam('');
            expect(result).toBeFalse();
            expect(component.hasParameter).toBeFalse();
        });
    });

    describe('searchRepository', () => {
        it('should searchRepository not navigate if repository is empty', () => {
            component.repository = '';
            component.searchRepository();
            expect(routerSpy.navigate).not.toHaveBeenCalled();
        });

        it('should searchRepository navigate if repository is filled', () => {
            component.repository = 'angular';
            component.searchRepository();
            expect(routerSpy.navigate).toHaveBeenCalledWith([
                '/list',
                'angular',
            ]);
            expect(component.repository).toBe('');
        });
    });

    describe('SearchComponent - Integration', () => {
        it('should apply class input-repository-lg when size is "lg"', () => {
            component.size = 'lg';
            fixture.detectChanges();

            const input = fixture.debugElement.query(
                By.css('input')
            ).nativeElement;
            expect(input.classList).toContain('input-repository-lg');
        });

        it('should apply class input-repository-md when size is "md"', () => {
            component.size = 'md';
            fixture.detectChanges();

            const input = fixture.debugElement.query(
                By.css('input')
            ).nativeElement;
            expect(input.classList).toContain('input-repository-md');
        });

        it('should apply error-input class and change placeholder when hasParameter is false', () => {
            component.hasParameter = false;
            component.placeholderText =
                'Necessário inserir o nome do repositório';
            fixture.detectChanges();

            const input = fixture.debugElement.query(
                By.css('input')
            ).nativeElement;
            expect(input.classList).toContain('error-input');
            expect(input.placeholder).toBe(
                'Necessário inserir o nome do repositório'
            );
        });

        it('should not call router.navigate if repository is empty', () => {
            component.repository = '';
            component.searchRepository();

            expect(routerSpy.navigate).not.toHaveBeenCalled();
            expect(component.hasParameter).toBeFalse();
            expect(component.placeholderText).toBe(
                'Necessário inserir o nome do repositório'
            );
        });

        it('should call router.navigate with correct params and clear repository on searchRepository', () => {
            component.repository = 'go';
            component.searchRepository();

            expect(routerSpy.navigate).toHaveBeenCalledWith(['/list', 'go']);
            expect(component.repository).toBe('');
            expect(component.hasParameter).toBeTrue();
        });

        it('should update hasParameter and placeholder correctly in hasParam method', () => {
            let result = component.hasParam('');
            expect(result).toBeFalse();
            expect(component.hasParameter).toBeFalse();
            expect(component.placeholderText).toBe(
                'Necessário inserir o nome do repositório'
            );

            result = component.hasParam('repo');
            expect(result).toBeTrue();
            expect(component.hasParameter).toBeTrue();
        });

        it('should trigger searchRepository on Enter key press', fakeAsync(() => {
            component.repository = 'test';
            fixture.detectChanges();

            const input = fixture.debugElement.query(By.css('input'));
            input.triggerEventHandler('keydown.enter', {});
            tick();

            expect(routerSpy.navigate).toHaveBeenCalledWith(['/list', 'test']);
            expect(component.repository).toBe('');
        }));
    });
});
