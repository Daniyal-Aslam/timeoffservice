import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HcmAdapter } from '../hcm/hcm.adapter';
import { CreateRequestDto } from './dto/create-request.dto';
import { handleServiceError } from '../common/utils';

@Injectable()
export class RequestService {
  constructor(
    private prisma: PrismaService,
    private hcm: HcmAdapter,
  ) {}

  async createRequest(dto: CreateRequestDto) {
    const { employeeId, locationId, daysRequested } = dto;

    try {
      return await this.prisma.$transaction(async (tx) => { 
        const balanceRecord = await tx.employeeBalance.findUnique({
          where: {
            employeeId_locationId: { employeeId, locationId },
          },
        });

        if (balanceRecord && balanceRecord.balance < daysRequested) {
          throw new BadRequestException('Insufficient balance');
        } 
        const hcmValidation = await this.hcm.validateBalance(dto);

        if (!hcmValidation?.valid) {
          throw new BadRequestException('Insufficient balance');
        } 
        const request = await tx.timeOffRequest.create({
          data: {
            employeeId,
            locationId,
            daysRequested,
            status: 'PENDING',
          },
        });
 
        const hcmResponse = await this.hcm.createTimeOff(dto);

        if (!hcmResponse?.success) {
          await tx.timeOffRequest.update({
            where: { id: request.id },
            data: { status: 'REJECTED' },
          });

          throw new BadRequestException('HCM rejected request');
        }

        // ✅ UPDATE LOCAL BALANCE
        if (balanceRecord) {
          await tx.employeeBalance.update({
            where: {
              employeeId_locationId: {
                employeeId,
                locationId,
              },
            },
            data: {
              balance: balanceRecord.balance - daysRequested,
            },
          });
        }
 
        return tx.timeOffRequest.update({
          where: { id: request.id },
          data: { status: 'APPROVED' },
        });
      });
    } catch (error) {
      handleServiceError(error);
    }
  }
}