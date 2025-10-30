import { TestBed } from '@angular/core/testing';

import { LdEventsService } from './ld-events-service';

describe('LdEventsService', () => {
  let service: LdEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LdEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
