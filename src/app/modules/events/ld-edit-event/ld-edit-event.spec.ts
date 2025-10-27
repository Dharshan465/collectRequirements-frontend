import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdEditEvent } from './ld-edit-event';

describe('LdEditEvent', () => {
  let component: LdEditEvent;
  let fixture: ComponentFixture<LdEditEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LdEditEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LdEditEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
