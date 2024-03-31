import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasculePage } from './bascule.page';

describe('BasculePage', () => {
  let component: BasculePage;
  let fixture: ComponentFixture<BasculePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BasculePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
