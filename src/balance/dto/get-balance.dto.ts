import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetBalanceDto {
  @ApiProperty({ example: 'emp1' })
  @IsString()
  employeeId: string;

  @ApiProperty({ example: 'loc1' })
  @IsString()
  locationId: string;
}