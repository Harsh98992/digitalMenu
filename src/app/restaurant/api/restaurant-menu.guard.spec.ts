import { TestBed } from '@angular/core/testing';

import { RestaurantMenuGuard } from './restaurant-menu.guard';

describe('RestaurantMenuGuard', () => {
  let guard: RestaurantMenuGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RestaurantMenuGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
