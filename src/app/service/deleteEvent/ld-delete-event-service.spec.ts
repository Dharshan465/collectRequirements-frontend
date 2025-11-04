import { TestBed } from '@angular/core/testing';

import { LdDeleteEventService } from './ld-delete-event-service';

describe('LdDeleteEventService', () => {
  let service: LdDeleteEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LdDeleteEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
