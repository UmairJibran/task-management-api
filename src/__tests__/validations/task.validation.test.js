const {
  createTaskSchema,
  updateTaskSchema,
} = require('../../validations/task.validation');

describe('Task Validation Schemas', () => {
  describe('createTaskSchema', () => {
    it('should validate a valid task creation object', () => {
      const validObject = {
        title: 'Test Task',
        description: 'This is a test task',
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'pending',
        dueDate: '2025-04-25',
      };

      const { error } = createTaskSchema.validate(validObject);
      expect(error).toBeUndefined();
    });

    it('should use default status when not provided', () => {
      const objectWithoutStatus = {
        title: 'Test Task',
        description: 'This is a test task',
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const { value } = createTaskSchema.validate(objectWithoutStatus);
      expect(value.status).toBe('pending');
    });

    it('should allow empty description', () => {
      const emptyDescription = {
        title: 'Test Task',
        description: '',
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const { error } = createTaskSchema.validate(emptyDescription);
      expect(error).toBeUndefined();
    });

    it('should allow null description', () => {
      const nullDescription = {
        title: 'Test Task',
        description: null,
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const { error } = createTaskSchema.validate(nullDescription);
      expect(error).toBeUndefined();
    });

    it('should reject missing title', () => {
      const missingTitle = {
        description: 'This is a test task',
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const { error } = createTaskSchema.validate(missingTitle);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('title');
    });

    it('should reject title longer than 200 characters', () => {
      const longTitle = {
        title: 'A'.repeat(201),
        description: 'This is a test task',
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const { error } = createTaskSchema.validate(longTitle);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('title');
    });

    it('should reject missing categoryId', () => {
      const missingCategoryId = {
        title: 'Test Task',
        description: 'This is a test task',
      };

      const { error } = createTaskSchema.validate(missingCategoryId);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('categoryId');
    });

    it('should reject invalid categoryId format', () => {
      const invalidCategoryId = {
        title: 'Test Task',
        description: 'This is a test task',
        categoryId: 'not-a-uuid',
      };

      const { error } = createTaskSchema.validate(invalidCategoryId);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('categoryId');
    });

    it('should reject invalid status value', () => {
      const invalidStatus = {
        title: 'Test Task',
        description: 'This is a test task',
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'invalid-status',
      };

      const { error } = createTaskSchema.validate(invalidStatus);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('status');
    });

    it('should allow valid status values', () => {
      const statuses = ['pending', 'in_progress', 'completed'];

      statuses.forEach((status) => {
        const validStatus = {
          title: 'Test Task',
          description: 'This is a test task',
          categoryId: '123e4567-e89b-12d3-a456-426614174000',
          status,
        };

        const { error } = createTaskSchema.validate(validStatus);
        expect(error).toBeUndefined();
      });
    });
  });

  describe('updateTaskSchema', () => {
    it('should validate a valid task update object', () => {
      const validObject = {
        title: 'Updated Task',
        status: 'completed',
      };

      const { error } = updateTaskSchema.validate(validObject);
      expect(error).toBeUndefined();
    });

    it('should reject empty update object', () => {
      const emptyObject = {};

      const { error } = updateTaskSchema.validate(emptyObject);
      expect(error).toBeDefined();
      expect(error.message).toContain('at least 1');
    });

    it('should reject title longer than 200 characters', () => {
      const longTitle = {
        title: 'A'.repeat(201),
      };

      const { error } = updateTaskSchema.validate(longTitle);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('title');
    });

    it('should reject invalid categoryId format', () => {
      const invalidCategoryId = {
        categoryId: 'not-a-uuid',
      };

      const { error } = updateTaskSchema.validate(invalidCategoryId);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('categoryId');
    });

    it('should reject invalid status value', () => {
      const invalidStatus = {
        status: 'invalid-status',
      };

      const { error } = updateTaskSchema.validate(invalidStatus);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('status');
    });

    it('should allow valid status values', () => {
      const statuses = ['pending', 'in_progress', 'completed'];

      statuses.forEach((status) => {
        const validStatus = { status };

        const { error } = updateTaskSchema.validate(validStatus);
        expect(error).toBeUndefined();
      });
    });

    it('should allow null due date', () => {
      const nullDueDate = {
        dueDate: null,
      };

      const { error } = updateTaskSchema.validate(nullDueDate);
      expect(error).toBeUndefined();
    });
  });
});
