import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdViewRequest } from './ld-view-request';

describe('LdViewRequest', () => {
  let component: LdViewRequest;
  let fixture: ComponentFixture<LdViewRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LdViewRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LdViewRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
