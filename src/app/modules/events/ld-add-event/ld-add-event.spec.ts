import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdAddEvent } from './ld-add-event';

describe('LdAddEvent', () => {
  let component: LdAddEvent;
  let fixture: ComponentFixture<LdAddEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LdAddEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LdAddEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
