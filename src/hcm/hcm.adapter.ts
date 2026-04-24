import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HcmAdapter {
  baseUrl = 'http://localhost:4000';

  async validateBalance(dto: any) {
    const res = await axios.get(`${this.baseUrl}/balance`, {
      params: dto,
    });
    return res.data;
  }

  async createTimeOff(dto: any) {
    try {
      const res = await axios.post(`${this.baseUrl}/request`, dto);
      return res.data;
    } catch (e) {
      return { success: false };
    }
  }
}