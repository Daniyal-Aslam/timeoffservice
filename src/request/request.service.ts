import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HcmAdapter } from '../hcm/hcm.adapter';

@Injectable()
export class RequestService {
  constructor(
    private prisma: PrismaService,
    private hcm: HcmAdapter,
  ) {}

  async createRequest(dto: any) {
    const { employeeId, locationId, daysRequested } = dto;

    const hcmValidation = await this.hcm.validateBalance(dto);

    if (!hcmValidation.valid) {
      throw new BadRequestException('Insufficient balance (HCM)');
    }

    const request = await this.prisma.timeOffRequest.create({
      data: {
        employeeId,
        locationId,
        daysRequested,
        status: 'PENDING',
      },
    });

    const hcmResponse = await this.hcm.createTimeOff(dto);

    if (hcmResponse.success) {
      return this.prisma.timeOffRequest.update({
        where: { id: request.id },
        data: { status: 'APPROVED' },
      });
    }

    return this.prisma.timeOffRequest.update({
      where: { id: request.id },
      data: { status: 'REJECTED' },
    });
  }
}