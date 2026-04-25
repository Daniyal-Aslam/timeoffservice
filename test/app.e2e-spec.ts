import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import express from 'express';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

let hcmServer: any; 
let isHcmDown = false;

function startMockHCM(port = 4000) {
  const app = express();
  app.use(express.json());

  const balances: Record<string, number> = {
    'emp1-loc1': 10,
  };

  app.get('/balance', (req, res) => {
    if (isHcmDown) {
      return res.status(503).json({ error: 'HCM down' });
    }
    const key = `${req.query.employeeId}-${req.query.locationId}`;
    const balance = balances[key] ?? 0;

    res.json({
      valid: balance >= Number(req.query.daysRequested),
      balance,
    });
  });

  app.post('/request', (req, res) => {
    if (isHcmDown) {
      return res.status(503).json({ success: false });
    }
    const key = `${req.body.employeeId}-${req.body.locationId}`;
    const current = balances[key] ?? 0;

    if (current < req.body.daysRequested) {
      return res.status(400).json({ success: false });
    }

    balances[key] = current - req.body.daysRequested;
    return res.json({ success: true });
  });

  app.get('/batch', (_req, res) => {
    res.json([
      { employeeId: 'emp1', locationId: 'loc1', balance: balances['emp1-loc1'] },
    ]);
  });

  return new Promise((resolve) => {
    const server = app.listen(port, () => resolve(server));
  });
}

describe('TimeOff (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => { 
    hcmServer = await startMockHCM(4000);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get(PrismaService); 
    await prisma.timeOffRequest.deleteMany();
    await prisma.employeeBalance.deleteMany();
  });

  beforeEach(async () => {
    // reset DB
    await prisma.timeOffRequest.deleteMany();
    await prisma.employeeBalance.deleteMany();

    isHcmDown = false;

    // restart mock HCM to reset balances
    if (hcmServer) {
      hcmServer.close();
    }
    hcmServer = await startMockHCM(4000);
  });

  afterAll(async () => {
    await app.close();
    hcmServer.close();
  });

  // ----------------------------
  // ✅ 1. Happy path
  // ----------------------------
  it('should approve a valid request', async () => {
    const res = await request(app.getHttpServer())
      .post('/requests')
      .send({
        employeeId: 'emp1',
        locationId: 'loc1',
        daysRequested: 2,
      })
      .expect(201);

    expect(res.body.status).toBe('APPROVED');
  });
 
  it('should reject when insufficient balance', async () => {
    const res = await request(app.getHttpServer())
      .post('/requests')
      .send({
        employeeId: 'emp1',
        locationId: 'loc1',
        daysRequested: 999,
      })
      .expect(400);

    expect(res.body.message).toContain('Insufficient');
  });
 
  it('should not allow exceeding balance after multiple requests', async () => { 
    await request(app.getHttpServer())
      .post('/requests')
      .send({
        employeeId: 'emp1',
        locationId: 'loc1',
        daysRequested: 6,
      })
      .expect(201);
 
    await request(app.getHttpServer())
      .post('/requests')
      .send({
        employeeId: 'emp1',
        locationId: 'loc1',
        daysRequested: 5,
      })
      .expect(400);
  });
 
  it('should fail if HCM is down', async () => { 
    isHcmDown = true;

    const res = await request(app.getHttpServer())
      .post('/requests')
      .send({
        employeeId: 'emp1',
        locationId: 'loc1',
        daysRequested: 1,
      });

    expect([400, 500, 502, 503]).toContain(res.status); 
    hcmServer = await startMockHCM(4000);
  });
});