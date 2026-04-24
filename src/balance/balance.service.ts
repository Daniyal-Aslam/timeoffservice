import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BalanceService {
  constructor(private prisma: PrismaService) {}

  async getBalance(employeeId: string, locationId: string) {
    return this.prisma.employeeBalance.findFirst({
      where: { employeeId, locationId },
    });
  }

  async updateBalance(employeeId: string, locationId: string, balance: number) {
    return this.prisma.employeeBalance.upsert({
      where: { id: `${employeeId}-${locationId}` },
      update: { balance },
      create: {
        id: `${employeeId}-${locationId}`,
        employeeId,
        locationId,
        balance,
      },
    });
  }
}