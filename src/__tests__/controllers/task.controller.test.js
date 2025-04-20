const { createTask, getTasks } = require('../../controllers/task.controller');
const supabase = require('../../config/supabase.client');

// Mock Supabase client
jest.mock('../../config/supabase.client', () => ({
  from: jest.fn(),
}));

describe('Task Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock Express request and response
    req = {
      body: {},
      params: {},
      query: {},
      user: { id: 'user-123' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      // Prepare test data
      const taskData = {
        title: 'Test Task',
        description: 'Task Description',
        categoryId: 'category-123',
        status: 'pending',
        dueDate: '2025-05-01T00:00:00.000Z',
      };

      const createdTask = {
        id: 'task-123',
        title: taskData.title,
        description: taskData.description,
        category_id: taskData.categoryId,
        user_id: req.user.id,
        status: taskData.status,
        due_date: taskData.dueDate,
      };

      // Setup mocks for category check
      const mockCategorySelect = jest.fn().mockReturnThis();
      const mockCategoryEq = jest.fn().mockReturnThis();
      const mockCategorySingle = jest.fn().mockResolvedValue({
        data: { id: taskData.categoryId },
        error: null,
      });

      // Setup mocks for task creation
      const mockTaskSelect = jest.fn().mockReturnThis();
      const mockTaskSingle = jest.fn().mockResolvedValue({
        data: createdTask,
        error: null,
      });
      const mockTaskInsert = jest.fn().mockReturnValue({
        select: mockTaskSelect,
      });

      // Setup mocks for status log creation
      const mockStatusLogInsert = jest.fn().mockResolvedValue({
        data: { id: 'log-123' },
        error: null,
      });

      // Mock supabase.from with different behaviors based on table name
      supabase.from.mockImplementation((tableName) => {
        if (tableName === 'categories') {
          return {
            select: mockCategorySelect,
          };
        } else if (tableName === 'tasks') {
          return {
            insert: mockTaskInsert,
          };
        } else if (tableName === 'task_status_logs') {
          return {
            insert: mockStatusLogInsert,
          };
        }
        return {};
      });

      // Setup the chain for categories check
      mockCategorySelect.mockReturnValue({
        eq: mockCategoryEq,
      });
      mockCategoryEq.mockReturnValue({
        single: mockCategorySingle,
      });

      // Setup the chain for task creation
      mockTaskSelect.mockReturnValue({
        single: mockTaskSingle,
      });

      // Setup request body
      req.body = taskData;

      // Call the function
      await createTask(req, res);

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('categories');
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(supabase.from).toHaveBeenCalledWith('task_status_logs');

      expect(mockCategorySelect).toHaveBeenCalledWith('id');
      expect(mockCategoryEq).toHaveBeenCalledWith('id', taskData.categoryId);

      expect(mockTaskInsert).toHaveBeenCalledWith({
        title: taskData.title,
        description: taskData.description,
        category_id: taskData.categoryId,
        user_id: req.user.id,
        status: taskData.status,
        due_date: taskData.dueDate,
      });

      expect(mockStatusLogInsert).toHaveBeenCalledWith({
        task_id: createdTask.id,
        status: createdTask.status,
        changed_by: req.user.id,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdTask);
    });

    it('should return 400 if category does not exist', async () => {
      // Prepare test data with invalid category
      const taskData = {
        title: 'Test Task',
        description: 'Task Description',
        categoryId: 'invalid-category',
        status: 'pending',
        dueDate: '2025-05-01T00:00:00.000Z',
      };

      // Setup mocks for failed category check
      const mockCategorySelect = jest.fn().mockReturnThis();
      const mockCategoryEq = jest.fn().mockReturnThis();
      const mockCategorySingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Category not found' },
      });

      // Mock supabase.from for categories check
      supabase.from.mockImplementation(() => ({
        select: mockCategorySelect,
      }));

      // Setup the chain for categories check
      mockCategorySelect.mockReturnValue({
        eq: mockCategoryEq,
      });
      mockCategoryEq.mockReturnValue({
        single: mockCategorySingle,
      });

      // Setup request body
      req.body = taskData;

      // Call the function
      await createTask(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid category ID' });
    });

    it('should return 400 if there is an error creating the task', async () => {
      // Prepare test data
      const taskData = {
        title: 'Test Task',
        description: 'Task Description',
        categoryId: 'category-123',
        status: 'pending',
        dueDate: '2025-05-01T00:00:00.000Z',
      };

      // Setup mocks for successful category check
      const mockCategorySelect = jest.fn().mockReturnThis();
      const mockCategoryEq = jest.fn().mockReturnThis();
      const mockCategorySingle = jest.fn().mockResolvedValue({
        data: { id: taskData.categoryId },
        error: null,
      });

      // Setup mocks for failed task creation
      const mockTaskSelect = jest.fn().mockReturnThis();
      const mockTaskSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Task creation failed' },
      });
      const mockTaskInsert = jest.fn().mockReturnValue({
        select: mockTaskSelect,
      });

      // Mock supabase.from with different behaviors based on table name
      supabase.from.mockImplementation((tableName) => {
        if (tableName === 'categories') {
          return {
            select: mockCategorySelect,
          };
        } else if (tableName === 'tasks') {
          return {
            insert: mockTaskInsert,
          };
        }
        return {};
      });

      // Setup the chain for categories check
      mockCategorySelect.mockReturnValue({
        eq: mockCategoryEq,
      });
      mockCategoryEq.mockReturnValue({
        single: mockCategorySingle,
      });

      // Setup the chain for task creation
      mockTaskSelect.mockReturnValue({
        single: mockTaskSingle,
      });

      // Setup request body
      req.body = taskData;

      // Call the function
      await createTask(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task creation failed' });
    });
  });

  describe('getTasks', () => {
    it('should retrieve all tasks for a user successfully', async () => {
      // Prepare test data
      const tasksData = [
        {
          id: 'task-123',
          title: 'Task 1',
          description: 'Description 1',
          category_id: 'category-123',
          user_id: 'user-123',
          status: 'pending',
          categories: { name: 'Category 1' },
        },
        {
          id: 'task-456',
          title: 'Task 2',
          description: 'Description 2',
          category_id: 'category-123',
          user_id: 'user-123',
          status: 'completed',
          categories: { name: 'Category 1' },
        },
      ];

      // Create a mock query with a proper then method
      const mockQuery = {
        eq: jest.fn().mockReturnThis(),
        then: jest.fn().mockImplementation((callback) => {
          return Promise.resolve(
            callback({
              data: tasksData,
              error: null,
            }),
          );
        }),
      };

      // Mock the select function to return our mockQuery
      const mockSelect = jest.fn().mockReturnValue(mockQuery);

      // Mock supabase.from
      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      // Call the function
      await getTasks(req, res);

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        categories(name)
      `);
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', 'user-123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(tasksData);
    });

    it('should filter tasks by status and category if provided', async () => {
      // Add status and category filters to the request
      req.query = {
        status: 'pending',
        category: 'category-123',
      };

      // Prepare test data
      const tasksData = [
        {
          id: 'task-123',
          title: 'Task 1',
          description: 'Description 1',
          category_id: 'category-123',
          user_id: 'user-123',
          status: 'pending',
          categories: { name: 'Category 1' },
        },
      ];

      // Create a mock query with a proper then method
      const mockQuery = {
        eq: jest.fn().mockReturnThis(),
        then: jest.fn().mockImplementation((callback) => {
          return Promise.resolve(
            callback({
              data: tasksData,
              error: null,
            }),
          );
        }),
      };

      // Mock the select function to return our mockQuery
      const mockSelect = jest.fn().mockReturnValue(mockQuery);

      // Mock supabase.from
      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      // Call the function
      await getTasks(req, res);

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        categories(name)
      `);
      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'pending');
      expect(mockQuery.eq).toHaveBeenCalledWith('category_id', 'category-123');
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', 'user-123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(tasksData);
    });

    it('should return 400 if there is an error retrieving tasks', async () => {
      // Setup error message
      const errorMessage = 'Failed to retrieve tasks';

      // Create a mock query with a proper then method that returns an error
      const mockQuery = {
        eq: jest.fn().mockReturnThis(),
        then: jest.fn().mockImplementation((callback) => {
          return Promise.resolve(
            callback({
              data: null,
              error: { message: errorMessage },
            }),
          );
        }),
      };

      // Mock the select function
      const mockSelect = jest.fn().mockReturnValue(mockQuery);

      // Mock supabase.from
      supabase.from.mockReturnValue({
        select: mockSelect,
      });

      // Call the function
      await getTasks(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
