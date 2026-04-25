import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BalanceService {
  constructor(private prisma: PrismaService) {}

  async getBalance(employeeId: string, locationId: string) {
    const balance = await this.prisma.employeeBalance.findUnique({
      where: {
        employeeId_locationId: { employeeId, locationId },
      },
    });

    return (
      balance || {
        employeeId,
        locationId,
        balance: 0,
      }
    );
  }

  async updateBalance(employeeId: string, locationId: string, balance: number) {
    return this.prisma.employeeBalance.upsert({
      where: {
        employeeId_locationId: { employeeId, locationId },
      },
      update: { balance },
      create: {
        employeeId,
        locationId,
        balance,
      },
    });
  }
}