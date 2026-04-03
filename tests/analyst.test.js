const request = require('supertest');
const app = require('../app');
const { verifyToken } = require('../utils/auth');

jest.mock('../utils/auth', () => ({
  verifyToken: jest.fn()
}));

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn().mockResolvedValue({ rows: [{ mock: "data" }] }),
    connect: jest.fn()
  };
  return { Pool: jest.fn(() => mPool) };
});

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn(),
      setex: jest.fn()
    };
  });
});

describe('Analyst Endpoints', () => {
  it('should allow POST /analyst/query for Analyst role', async () => {
    verifyToken.mockReturnValue({ role: 'Analyst', id: 2 });

    const response = await request(app)
      .post('/analyst/query')
      .set('Cookie', ['token=valid-token'])
      .send({ query: "SELECT * FROM users" });

    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });

  it('should deny POST /analyst/query for Viewer role', async () => {
    verifyToken.mockReturnValue({ role: 'Viewer', id: 3 });

    const response = await request(app)
      .post('/analyst/query')
      .set('Cookie', ['token=valid-token'])
      .send({ query: "SELECT * FROM users" });

    expect(response.status).toBe(403);
  });
});
