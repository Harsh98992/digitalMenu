import { TestBed } from '@angular/core/testing';

import { RestaurntOwnerGuard } from './restaurnt-owner.guard';

describe('RestaurntOwnerGuard', () => {
  let guard: RestaurntOwnerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RestaurntOwnerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
