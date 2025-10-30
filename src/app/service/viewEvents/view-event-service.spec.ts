import { TestBed } from '@angular/core/testing';

import { ViewEventService } from './view-event-service';

describe('ViewEventService', () => {
  let service: ViewEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
