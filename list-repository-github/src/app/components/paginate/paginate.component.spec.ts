import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { PaginateComponent } from './paginate.component';
import { Paginate } from '../../model/Paginate.model';
import { By } from '@angular/platform-browser';

describe('PaginateComponent', () => {
    let component: PaginateComponent;
    let fixture: ComponentFixture<PaginateComponent>;

    const mockPaginate: Paginate[] = [
        {
            first: 'url1',
            first_number: '1',
            prev: 'url2',
            prev_number: '2',
            next: 'url4',
            next_number: '4',
            last: 'url200',
            last_number: '200',
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PaginateComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PaginateComponent);
        component = fixture.componentInstance;
        component.paginate = mockPaginate;
        component.calcCurrentPage();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('calcCurrentPage', () => {
        it('should not call calcCurrentPage when paginate is not changed', () => {
            spyOn(component, 'calcCurrentPage');

            const changes: SimpleChanges = {};

            component.ngOnChanges(changes);

            expect(component.calcCurrentPage).not.toHaveBeenCalled();
        });

        it('should not call calcCurrentPage when paginate is changed and empty', () => {
            spyOn(component, 'calcCurrentPage');
            component.paginate = [];

            const changes: SimpleChanges = {
                paginate: new SimpleChange(null, component.paginate, false),
            };

            component.ngOnChanges(changes);

            expect(component.calcCurrentPage).not.toHaveBeenCalled();
        });

        it('should call calcCurrentPage when paginate is changed', () => {
            spyOn(component, 'calcCurrentPage');
            component.paginate = [{ next_number: '2' }];

            const changes: SimpleChanges = {
                paginate: new SimpleChange(null, component.paginate, false),
            };

            component.ngOnChanges(changes);

            expect(component.calcCurrentPage).toHaveBeenCalled();
        });

        it('should emit event eventPage with correct value', () => {
            spyOn(component.eventPage, 'emit');

            const url =
                'https://api.github.com/search/repositories?q=github&page=2';
            component.onChangePage(url);

            expect(component.eventPage.emit).toHaveBeenCalledWith(url);
        });

        it('should return empty string if paginate is empty', () => {
            component.paginate = [];
            const result = component.calcCurrentPage();

            expect(result).toBe('');
        });

        it('should return next_number - 1 when next_number is a valid number', () => {
            component.paginate = [{ next_number: '3', prev_number: '1' }];
            const result = component.calcCurrentPage();

            expect(result).toBe('2');
        });

        it('should return prev_number + 1 when next_number is a invalid number', () => {
            component.paginate = [{ next_number: 'NaN', prev_number: '4' }];
            const result = component.calcCurrentPage();

            expect(result).toBe('5');
        });
    });

    describe('PaginateComponent - Integration', () => {
        it('should display pagination buttons', () => {
            const anchors = fixture.debugElement.queryAll(By.css('a'));
            const labels = anchors.map((a) =>
                a.nativeElement.textContent.trim()
            );
            expect(labels).toContain('1');
            expect(labels).toContain('2');
            expect(labels).toContain('3');
            expect(labels).toContain('4');
            expect(labels).toContain('...');
            expect(labels).toContain('200');
        });

        it('should emit the event when clicking on a page', () => {
            spyOn(component.eventPage, 'emit');

            const firstLink = fixture.debugElement.queryAll(By.css('a'))[0];
            firstLink.triggerEventHandler('click');
            expect(component.eventPage.emit).toHaveBeenCalledWith('url1');
        });

        it('should calculate current page', () => {
            expect(component.currentPage).toBe('3');
        });
    });
});
