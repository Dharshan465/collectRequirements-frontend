import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdNewRequest } from './ld-new-request';

describe('LdNewRequest', () => {
  let component: LdNewRequest;
  let fixture: ComponentFixture<LdNewRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LdNewRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LdNewRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
