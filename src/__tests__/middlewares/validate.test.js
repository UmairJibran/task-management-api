const validate = require('../../middlewares/validate');

describe('Validate Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock Express request, response, and next function
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it('should call next() when validation passes', () => {
    // Create a mock schema that always passes validation
    const mockSchema = {
      validate: jest.fn().mockReturnValue({ error: null }),
    };

    // Setup request body
    req.body = { name: 'Test Name' };

    // Create middleware with mock schema
    const middleware = validate(mockSchema);

    // Call the middleware
    middleware(req, res, next);

    // Assertions
    expect(mockSchema.validate).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 400 with error message when validation fails', () => {
    // Create a mock error message
    const errorMessage = 'Validation failed';

    // Create a mock schema that fails validation
    const mockSchema = {
      validate: jest.fn().mockReturnValue({
        error: {
          details: [{ message: errorMessage }],
        },
      }),
    };

    // Setup request body
    req.body = { invalid: 'data' };

    // Create middleware with mock schema
    const middleware = validate(mockSchema);

    // Call the middleware
    middleware(req, res, next);

    // Assertions
    expect(mockSchema.validate).toHaveBeenCalledWith(req.body);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});
