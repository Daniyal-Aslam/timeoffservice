
import { Controller, Post, Body } from '@nestjs/common';
import { RequestService } from './request.service';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateRequestDto } from './dto/create-request.dto';

@ApiTags('Requests')
@Controller('requests')
export class RequestController {
  constructor(private service: RequestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a time-off request' })
  @ApiResponse({ status: 201, description: 'Request created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request or insufficient balance' })
  create(@Body() body: CreateRequestDto) {
    return this.service.createRequest(body);
  }
}