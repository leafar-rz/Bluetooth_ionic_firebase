import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockListPage } from './stock-list.page';

describe('StockListPage', () => {
  let component: StockListPage;
  let fixture: ComponentFixture<StockListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StockListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
