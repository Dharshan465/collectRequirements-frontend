import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdEditRequest } from './ld-edit-request';

describe('LdEditRequest', () => {
  let component: LdEditRequest;
  let fixture: ComponentFixture<LdEditRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LdEditRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LdEditRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
