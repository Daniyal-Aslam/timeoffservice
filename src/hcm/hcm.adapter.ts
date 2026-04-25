import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
  BadGatewayException,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { CreateRequestDto } from '../request/dto/create-request.dto';

@Injectable()
export class HcmAdapter {
  private baseUrl = 'http://localhost:4000';

  async validateBalance(dto: CreateRequestDto) {
    try {
      const res = await axios.get(`${this.baseUrl}/balance`, {
        params: dto,
        timeout: 3000,
      });

      return res.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createTimeOff(dto: CreateRequestDto) {
    try {
      const res = await axios.post(`${this.baseUrl}/request`, dto, {
        timeout: 3000,
      });

      return res.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getBatchBalances() {
    try {
      const res = await axios.get(`${this.baseUrl}/batch`, {
        timeout: 3000,
      });

      return res.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError;

      if (err.response) {
        const status = err.response.status;

        if (status === 400) {
          throw new BadRequestException('Invalid request or insufficient balance');
        }

        if (status >= 500) {
          throw new BadGatewayException('HCM system error');
        }

        throw new BadRequestException('HCM validation failed');
      }

      if (err.code === 'ECONNREFUSED' || err.code === 'ECONNABORTED') {
        throw new ServiceUnavailableException('HCM is unavailable');
      }
    }

    throw new ServiceUnavailableException('Unexpected HCM error');
  }
}