const request = require('supertest');
const app = require('../app');
const { verifyToken } = require('../utils/auth');

jest.mock('../utils/auth', () => ({
  verifyToken: jest.fn()
}));

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn().mockResolvedValue({ rows: [] }),
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

describe('Dashboard Endpoint - Viewer Role', () => {
  it('should allow access to /dashboard for Viewer role', async () => {
    // Mock the decoded token
    verifyToken.mockReturnValue({ role: 'Viewer', id: 1 });

    const response = await request(app)
      .get('/dashboard')
      .set('Cookie', ['token=valid-token']);
    
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });

  it('should deny access to /dashboard if unauthenticated', async () => {
    const response = await request(app)
      .get('/dashboard');
    
    expect(response.status).toBe(401);
  });
});
