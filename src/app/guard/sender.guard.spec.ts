import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { senderGuard } from './sender.guard';

describe('senderGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => senderGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
