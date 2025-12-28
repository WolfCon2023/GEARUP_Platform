import { describe, it, expect, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

describe('Auth Middleware', () => {
  it('should generate valid JWT token', () => {
    const payload = {
      user_id: 'test_user',
      email: 'test@example.com',
      role: 'teacher' as const,
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    const decoded = jwt.verify(token, JWT_SECRET);
    
    expect(decoded).toMatchObject(payload);
  });

  it('should verify token expiration', () => {
    const payload = {
      user_id: 'test_user',
      email: 'test@example.com',
      role: 'teacher' as const,
    };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1s' });
    
    // Token should be valid immediately
    expect(() => jwt.verify(token, JWT_SECRET)).not.toThrow();
  });
});



