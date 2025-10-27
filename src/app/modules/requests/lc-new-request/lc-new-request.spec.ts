import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcNewRequest } from './lc-new-request';

describe('LcNewRequest', () => {
  let component: LcNewRequest;
  let fixture: ComponentFixture<LcNewRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LcNewRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcNewRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
