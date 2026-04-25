import { ApiProperty } from '@nestjs/swagger';

export class BalanceResponseDto {
  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  locationId: string;

  @ApiProperty({ example: 10 })
  balance: number;
}