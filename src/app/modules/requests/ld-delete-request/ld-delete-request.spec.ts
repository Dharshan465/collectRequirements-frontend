import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdDeleteRequest } from './ld-delete-request';

describe('LdDeleteRequest', () => {
  let component: LdDeleteRequest;
  let fixture: ComponentFixture<LdDeleteRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LdDeleteRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LdDeleteRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
