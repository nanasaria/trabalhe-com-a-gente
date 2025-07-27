import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRepositoryComponent } from './list-repository.component';

describe('ListRepositoryComponent', () => {
  let component: ListRepositoryComponent;
  let fixture: ComponentFixture<ListRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRepositoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
