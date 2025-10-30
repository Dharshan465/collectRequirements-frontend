import { TestBed } from '@angular/core/testing';

import { LdAddEvent } from './ld-add-event';

describe('LdAddEvent', () => {
  let service: LdAddEvent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LdAddEvent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
