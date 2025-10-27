import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcDashboard } from './lc-dashboard';

describe('LcDashboard', () => {
  let component: LcDashboard;
  let fixture: ComponentFixture<LcDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LcDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
