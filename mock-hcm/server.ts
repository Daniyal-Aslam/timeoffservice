import express from 'express';

const app = express();
app.use(express.json());

let balances = {
  'emp1-loc1': 10,
};

app.get('/balance', (req, res) => {
  const key = `${req.query.employeeId}-${req.query.locationId}`;
  const balance = balances[key] || 0;

  res.json({
    valid: balance >= Number(req.query.daysRequested),
    balance,
  });
});

app.post('/request', (req, res) => {
  const key = `${req.body.employeeId}-${req.body.locationId}`;
  const current = balances[key] || 0;

  if (current < req.body.daysRequested) {
    return res.status(400).json({ success: false });
  }

  balances[key] -= req.body.daysRequested;
  res.json({ success: true });
});

app.get('/batch', (req, res) => {
  res.json([
    { employeeId: 'emp1', locationId: 'loc1', balance: balances['emp1-loc1'] },
  ]);
});

app.listen(4000, () => console.log('Mock HCM running'));