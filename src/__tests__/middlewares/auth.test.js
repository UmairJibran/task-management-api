const auth = require('../../middlewares/auth');
const supabase = require('../../config/supabase.client');

// Mock Supabase client
jest.mock('../../config/supabase.client', () => ({
  auth: {
    getUser: jest.fn(),
  },
}));

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock Express request, response, and next function
    req = {
      headers: {},
      user: null,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('should set user and call next() with valid token', async () => {
    // Setup valid token in headers
    const token = 'valid-token';
    req.headers.authorization = `Bearer ${token}`;

    // Mock user data response
    const userData = { id: '123', email: 'user@example.com' };
    supabase.auth.getUser.mockResolvedValue({
      data: { user: userData },
      error: null,
    });

    // Call the middleware
    await auth(req, res, next);

    // Assertions
    expect(supabase.auth.getUser).toHaveBeenCalledWith(token);
    expect(req.user).toEqual(userData);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 401 when no token is provided', async () => {
    // No authorization header

    // Call the middleware
    await auth(req, res, next);

    // Assertions
    expect(supabase.auth.getUser).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 for invalid token', async () => {
    // Setup invalid token
    const token = 'invalid-token';
    req.headers.authorization = `Bearer ${token}`;

    // Mock error response
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid token' },
    });

    // Call the middleware
    await auth(req, res, next);

    // Assertions
    expect(supabase.auth.getUser).toHaveBeenCalledWith(token);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when no user is found', async () => {
    // Setup token
    const token = 'token-without-user';
    req.headers.authorization = `Bearer ${token}`;

    // Mock response with no user
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    // Call the middleware
    await auth(req, res, next);

    // Assertions
    expect(supabase.auth.getUser).toHaveBeenCalledWith(token);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors', async () => {
    // Setup token
    const token = 'token-causing-error';
    req.headers.authorization = `Bearer ${token}`;

    // Mock unexpected error
    supabase.auth.getUser.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    // Call the middleware
    await auth(req, res, next);

    // Assertions
    expect(supabase.auth.getUser).toHaveBeenCalledWith(token);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication failed' });
    expect(next).not.toHaveBeenCalled();
  });
});
