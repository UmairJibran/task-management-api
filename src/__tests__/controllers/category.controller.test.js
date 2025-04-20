const {
  createCategory,
  getCategories,
} = require('../../controllers/category.controller');
const supabase = require('../../config/supabase.client');

// Mock Supabase client
jest.mock('../../config/supabase.client', () => ({
  from: jest.fn(),
}));

describe('Category Controller', () => {
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

  describe('createCategory', () => {
    it('should create a new category successfully', async () => {
      // Prepare test data
      const categoryName = 'Test Category';
      const categoryData = { id: '123', name: categoryName };

      // Setup mocks
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: categoryData,
        error: null,
      });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

      supabase.from.mockImplementation(mockFrom);
      mockSelect.mockImplementation(() => ({ single: mockSingle }));

      // Setup request body
      req.body = { name: categoryName };

      // Call the function
      await createCategory(req, res);

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('categories');
      expect(mockInsert).toHaveBeenCalledWith({ name: categoryName });
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(categoryData);
    });

    it('should return 400 if there is an error creating the category', async () => {
      // Prepare test data with error
      const errorMessage = 'Category creation failed';

      // Setup mocks with error
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = jest.fn().mockReturnValue({ insert: mockInsert });

      supabase.from.mockImplementation(mockFrom);
      mockSelect.mockImplementation(() => ({ single: mockSingle }));

      // Setup request body
      req.body = { name: 'Test Category' };

      // Call the function
      await createCategory(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getCategories', () => {
    it('should retrieve all categories successfully', async () => {
      // Prepare test data
      const categoriesData = [
        { id: '123', name: 'Category 1' },
        { id: '456', name: 'Category 2' },
      ];

      // Setup mocks
      const mockSelect = jest.fn().mockResolvedValue({
        data: categoriesData,
        error: null,
      });
      const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });

      supabase.from.mockImplementation(mockFrom);

      // Call the function
      await getCategories(req, res);

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('categories');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(categoriesData);
    });

    it('should return 400 if there is an error retrieving categories', async () => {
      // Prepare test data with error
      const errorMessage = 'Failed to retrieve categories';

      // Setup mocks with error
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });
      const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });

      supabase.from.mockImplementation(mockFrom);

      // Call the function
      await getCategories(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
