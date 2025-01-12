/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PrismaService } from './prisma.service';

describe('Service: Prisma', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrismaService]
    });
  });

  it('should ...', inject([PrismaService], (service: PrismaService) => {
    expect(service).toBeTruthy();
  }));
});
