import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdDeleteEvent } from './ld-delete-event';

describe('LdDeleteEvent', () => {
  let component: LdDeleteEvent;
  let fixture: ComponentFixture<LdDeleteEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LdDeleteEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LdDeleteEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
