import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdViewEvent } from './ld-view-event';

describe('LdViewEvent', () => {
  let component: LdViewEvent;
  let fixture: ComponentFixture<LdViewEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LdViewEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LdViewEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
