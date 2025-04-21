const {
  getTaskById,
  updateTask,
  deleteTask,
} = require('../../controllers/task.controller');
const supabase = require('../../config/supabase.client');

// Mock supabase client
jest.mock('../../config/supabase.client', () => {
  return {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(),
      })),
      insert: jest.fn(),
    })),
    auth: {
      admin: {
        getUserById: jest.fn(),
      },
    },
  };
});

describe('Task Controller - Additional Methods', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock request and response
    req = {
      params: {},
      body: {},
      user: { id: 'user-123' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('getTaskById', () => {
    it('should retrieve a task by ID successfully', async () => {
      // Setup request params
      req.params = { id: 'task-123' };

      // Setup test data
      const taskData = {
        id: 'task-123',
        title: 'Test Task',
        user_id: 'user-123',
        categories: { name: 'Work' },
        status_logs: [{ status: 'pending', created_at: '2025-04-20' }],
      };

      // Mock successful response
      const singleMock = jest.fn().mockResolvedValue({
        data: taskData,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: singleMock,
          }),
        }),
      });

      // Call the function
      await getTaskById(req, res);

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(taskData);
    });

    it('should return 404 if task not found', async () => {
      // Setup request params
      req.params = { id: 'non-existent-task' };

      // Mock error response
      const singleMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Task not found' },
      });

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: singleMock,
          }),
        }),
      });

      // Call the function
      await getTaskById(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });

    it('should handle unexpected errors', async () => {
      // Setup request params
      req.params = { id: 'task-123' };

      // Mock to throw error
      supabase.from.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      // Call the function
      await getTaskById(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch task' });
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      // Setup request params and body
      req.params = { id: 'task-123' };
      req.body = {
        title: 'Updated Task Title',
        status: 'completed',
      };

      // Mock existing task check
      const existingTaskSingleMock = jest.fn().mockResolvedValue({
        data: { status: 'pending' },
        error: null,
      });

      // Mock task update response
      const updatedTaskSingleMock = jest.fn().mockResolvedValue({
        data: {
          id: 'task-123',
          title: 'Updated Task Title',
          status: 'completed',
        },
        error: null,
      });

      // Mock the insert for status logs
      const insertMock = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      // First we set up the select call for existing task check
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: existingTaskSingleMock,
          }),
        }),
      });

      // Then we set up the update call
      supabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: updatedTaskSingleMock,
            }),
          }),
        }),
      });

      // Finally we set up the insert call for status logs
      supabase.from.mockReturnValueOnce({
        insert: insertMock,
      });

      // Call the function
      await updateTask(req, res);

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(supabase.from).toHaveBeenCalledWith('task_status_logs');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(insertMock).toHaveBeenCalledWith({
        task_id: 'task-123',
        status: 'completed',
        changed_by: 'user-123',
      });
    });

    it('should return 404 if task not found', async () => {
      // Setup request params
      req.params = { id: 'non-existent-task' };
      req.body = { title: 'Updated Title' };

      // Mock error response for existing task check
      const singleMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Task not found' },
      });

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: singleMock,
          }),
        }),
      });

      // Call the function
      await updateTask(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });

    it('should validate categoryId if provided', async () => {
      // Setup request params and body
      req.params = { id: 'task-123' };
      req.body = {
        categoryId: 'invalid-category-id',
      };

      // Mock existing task check
      const existingTaskSingleMock = jest.fn().mockResolvedValue({
        data: { status: 'pending' },
        error: null,
      });

      // Mock category validation with error
      const categorySingleMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Category not found' },
      });

      // Set up the existing task check
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: existingTaskSingleMock,
          }),
        }),
      });

      // Set up the category check
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: categorySingleMock,
          }),
        }),
      });

      // Call the function
      await updateTask(req, res);

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('categories');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid category ID' });
    });

    it('should validate userId if provided', async () => {
      // Setup request params and body
      req.params = { id: 'task-123' };
      req.body = {
        userId: 'invalid-user-id',
      };

      // Mock existing task check
      const existingTaskSingleMock = jest.fn().mockResolvedValue({
        data: { status: 'pending' },
        error: null,
      });

      // Mock user validation with error
      supabase.auth.admin.getUserById.mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      });

      // Set up the existing task check
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: existingTaskSingleMock,
          }),
        }),
      });

      // Call the function
      await updateTask(req, res);

      // Assertions
      expect(supabase.auth.admin.getUserById).toHaveBeenCalledWith(
        'invalid-user-id',
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user ID' });
    });

    it('should handle database errors during update', async () => {
      // Setup request params and body
      req.params = { id: 'task-123' };
      req.body = { title: 'Updated Title' };

      // Mock existing task check
      const existingTaskSingleMock = jest.fn().mockResolvedValue({
        data: { status: 'pending' },
        error: null,
      });

      // Mock update with database error
      const updatedTaskSingleMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      // Set up the existing task check
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: existingTaskSingleMock,
          }),
        }),
      });

      // Set up the update call
      supabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: updatedTaskSingleMock,
            }),
          }),
        }),
      });

      // Call the function
      await updateTask(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should handle unexpected errors', async () => {
      // Setup request params
      req.params = { id: 'task-123' };
      req.body = { title: 'Updated Title' };

      // Mock to throw error
      supabase.from.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      // Call the function
      await updateTask(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update task' });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and its status logs successfully', async () => {
      // Setup request params
      req.params = { id: 'task-123' };

      // Mock status logs delete success
      const deleteStatusLogsMock = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock task delete success
      const deleteTaskMock = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      // Setup the delete task_status_logs call
      supabase.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: deleteStatusLogsMock,
        }),
      });

      // Setup the delete tasks call
      supabase.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: deleteTaskMock,
        }),
      });

      // Call the function
      await deleteTask(req, res);

      // Assertions
      expect(supabase.from).toHaveBeenCalledWith('task_status_logs');
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle database errors during delete', async () => {
      // Setup request params
      req.params = { id: 'task-123' };

      // Mock status logs delete success
      const deleteStatusLogsMock = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock task delete error
      const deleteTaskMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Could not delete task' },
      });

      // Setup the delete task_status_logs call
      supabase.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: deleteStatusLogsMock,
        }),
      });

      // Setup the delete tasks call
      supabase.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: deleteTaskMock,
        }),
      });

      // Call the function
      await deleteTask(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Could not delete task' });
    });

    it('should handle unexpected errors', async () => {
      // Setup request params
      req.params = { id: 'task-123' };

      // Mock to throw error
      supabase.from.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      // Call the function
      await deleteTask(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete task' });
    });
  });
});
