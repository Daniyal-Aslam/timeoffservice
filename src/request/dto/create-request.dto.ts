import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({ example: 'emp1' })
  @IsString()
  employeeId: string;

  @ApiProperty({ example: 'loc1' })
  @IsString()
  locationId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  daysRequested: number;
}