const { signup, login } = require('../../controllers/auth.controller');
const supabase = require('../../config/supabase.client');

// Mock Supabase client
jest.mock('../../config/supabase.client', () => ({
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
  },
}));

describe('Auth Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock Express request and response
    req = {
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('signup', () => {
    it('should sign up a user successfully', async () => {
      // Prepare test data
      const userData = { email: 'test@example.com', password: 'password123' };
      const mockResponse = {
        data: { user: { id: '123', email: userData.email } },
        error: null,
      };

      // Setup mocks
      supabase.auth.signUp.mockResolvedValue(mockResponse);

      // Setup request body
      req.body = userData;

      // Call the function
      await signup(req, res);

      // Assertions
      expect(supabase.auth.signUp).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: mockResponse.data.user });
    });

    it('should return 400 if there is an error during signup', async () => {
      // Prepare test data with error
      const userData = { email: 'test@example.com', password: 'password123' };
      const errorMessage = 'Signup failed';
      const mockResponse = {
        data: null,
        error: { message: errorMessage },
      };

      // Setup mocks with error
      supabase.auth.signUp.mockResolvedValue(mockResponse);

      // Setup request body
      req.body = userData;

      // Call the function
      await signup(req, res);

      // Assertions
      expect(supabase.auth.signUp).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      // Prepare test data
      const userData = { email: 'test@example.com', password: 'password123' };
      const mockResponse = {
        data: {
          session: {
            access_token: 'test-token',
            user: { id: '123', email: userData.email },
          },
        },
        error: null,
      };

      // Setup mocks
      supabase.auth.signInWithPassword.mockResolvedValue(mockResponse);

      // Setup request body
      req.body = userData;

      // Call the function
      await login(req, res);

      // Assertions
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        session: mockResponse.data.session,
      });
    });

    it('should return 400 if there is an error during login', async () => {
      // Prepare test data with error
      const userData = { email: 'test@example.com', password: 'password123' };
      const errorMessage = 'Login failed';
      const mockResponse = {
        data: null,
        error: { message: errorMessage },
      };

      // Setup mocks with error
      supabase.auth.signInWithPassword.mockResolvedValue(mockResponse);

      // Setup request body
      req.body = userData;

      // Call the function
      await login(req, res);

      // Assertions
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
