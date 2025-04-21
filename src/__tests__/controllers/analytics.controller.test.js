const {
  getCompletionRate,
  getOverdueTasks,
} = require('../../controllers/analytics.controller');
const supabase = require('../../config/supabase.client');

// Mock Supabase client
jest.mock('../../config/supabase.client', () => ({
  from: jest.fn(),
}));

describe('Analytics Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock Express request and response
    req = {
      query: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('getCompletionRate', () => {
    it('should get task completion rates for all time', async () => {
      // Prepare test data
      const taskData = [
        { status: 'completed' },
        { status: 'completed' },
        { status: 'in_progress' },
        { status: 'pending' },
      ];

      // Setup mock for select returning data directly
      const mockSelect = jest.fn().mockResolvedValue({
        data: taskData,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      // Call the function
      await getCompletionRate(req, res);

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(mockSelect).toHaveBeenCalledWith('status');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        total: 4,
        completed: 2,
        inProgress: 1,
        pending: 1,
        completionRate: 50,
        inProgressRate: 25,
        pendingRate: 25,
        timeframe: 'all',
      });
    });

    it('should handle empty results gracefully', async () => {
      // Prepare test data
      const taskData = [];

      // Setup mock for select returning empty data
      const mockSelect = jest.fn().mockResolvedValue({
        data: taskData,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      // Call the function
      await getCompletionRate(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        completionRate: 0,
        inProgressRate: 0,
        pendingRate: 0,
        timeframe: 'all',
      });
    });

    it('should handle errors from the database', async () => {
      // Setup mock with error
      const errorMessage = 'Database connection failed';
      const mockSelect = jest.fn().mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      // Call the function
      await getCompletionRate(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should handle unexpected errors', async () => {
      // Setup mock to throw error
      const mockSelect = jest.fn().mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      // Call the function
      await getCompletionRate(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch completion rates',
      });
    });
  });

  describe('getOverdueTasks', () => {
    it('should fetch overdue tasks successfully', async () => {
      // Prepare test data
      const tasksData = [
        {
          id: '1',
          title: 'Task 1',
          status: 'pending',
          due_date: '2025-03-01',
          categories: { name: 'Work' },
        },
        {
          id: '2',
          title: 'Task 2',
          status: 'in_progress',
          due_date: '2025-03-15',
          categories: { name: 'Personal' },
        },
      ];

      // Setup complete mock chain
      const mockNeq = jest.fn().mockResolvedValue({
        data: tasksData,
        error: null,
      });

      const mockLt = jest.fn().mockReturnValue({
        neq: mockNeq,
      });

      const mockSelect = jest.fn().mockReturnValue({
        lt: mockLt,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      // Call the function
      await getOverdueTasks(req, res);

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        categories(name)
      `);
      expect(mockLt).toHaveBeenCalledWith('due_date', expect.any(String));
      expect(mockNeq).toHaveBeenCalledWith('status', 'completed');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        overdueTasks: tasksData,
        count: 2,
      });
    });

    it('should handle empty results for overdue tasks', async () => {
      // Prepare test data
      const tasksData = [];

      // Setup complete mock chain
      const mockNeq = jest.fn().mockResolvedValue({
        data: tasksData,
        error: null,
      });

      const mockLt = jest.fn().mockReturnValue({
        neq: mockNeq,
      });

      const mockSelect = jest.fn().mockReturnValue({
        lt: mockLt,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      // Call the function
      await getOverdueTasks(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        overdueTasks: tasksData,
        count: 0,
      });
    });

    it('should handle database errors', async () => {
      // Setup mock with error
      const errorMessage = 'Database query failed';

      const mockNeq = jest.fn().mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });

      const mockLt = jest.fn().mockReturnValue({
        neq: mockNeq,
      });

      const mockSelect = jest.fn().mockReturnValue({
        lt: mockLt,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      // Call the function
      await getOverdueTasks(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should handle unexpected errors', async () => {
      // Setup mock to throw error
      const mockSelect = jest.fn().mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      // Call the function
      await getOverdueTasks(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch overdue tasks',
      });
    });
  });
});
