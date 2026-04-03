const request = require('supertest');
const app = require('../app');
const { verifyToken } = require('../utils/auth');

jest.mock('../utils/auth', () => ({
  verifyToken: jest.fn()
}));

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn().mockResolvedValue({ rows: [{ id: 1 }] }),
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

describe('Admin Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /admin/users', () => {
    it('should allow access for Admin role', async () => {
      verifyToken.mockReturnValue({ role: 'Admin', id: 1 });

      const response = await request(app)
        .get('/admin/users')
        .set('Cookie', ['token=valid-token']);

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });

    it('should deny access for Analyst role', async () => {
      verifyToken.mockReturnValue({ role: 'Analyst', id: 2 });

      const response = await request(app)
        .get('/admin/users')
        .set('Cookie', ['token=valid-token']);

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /admin/users/:id', () => {
    it('should allow deletion for Admin role', async () => {
      verifyToken.mockReturnValue({ role: 'Admin', id: 1 });

      const response = await request(app)
        .delete('/admin/users/123')
        .set('Cookie', ['token=valid-token']);

      expect(response.status).not.toBe(401);
      expect(response.status).not.toBe(403);
    });
  });
});
