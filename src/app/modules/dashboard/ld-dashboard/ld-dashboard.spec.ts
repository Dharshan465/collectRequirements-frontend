import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdDashboard } from './ld-dashboard';

describe('LdDashboard', () => {
  let component: LdDashboard;
  let fixture: ComponentFixture<LdDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LdDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LdDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
