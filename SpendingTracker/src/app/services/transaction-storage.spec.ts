import { TestBed } from '@angular/core/testing';
import { TransactionStorage } from './transaction-storage';

describe('TransactionStorage', () => {
  let service: TransactionStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
