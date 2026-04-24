import { Controller, Post, Body } from '@nestjs/common';
import { RequestService } from './request.service';

@Controller('requests')
export class RequestController {
  constructor(private service: RequestService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.createRequest(body);
  }
}