import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdEvents } from './ld-events';

describe('LdEvents', () => {
  let component: LdEvents;
  let fixture: ComponentFixture<LdEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LdEvents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LdEvents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
