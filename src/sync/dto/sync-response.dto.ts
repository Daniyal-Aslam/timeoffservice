import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SyncResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiPropertyOptional({ example: 5 })
  count?: number;

  @ApiPropertyOptional({ example: 'HCM unavailable' })
  error?: string;
}