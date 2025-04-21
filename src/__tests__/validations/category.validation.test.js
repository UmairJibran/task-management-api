const {
  createCategorySchema,
  updateCategorySchema,
} = require('../../validations/category.validation');

describe('Category Validation Schemas', () => {
  describe('createCategorySchema', () => {
    it('should validate a valid category creation object', () => {
      const validObject = {
        name: 'Test Category',
      };

      const { error } = createCategorySchema.validate(validObject);
      expect(error).toBeUndefined();
    });

    it('should reject missing name', () => {
      const missingName = {};

      const { error } = createCategorySchema.validate(missingName);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('name');
    });

    it('should reject empty name', () => {
      const emptyName = {
        name: '',
      };

      const { error } = createCategorySchema.validate(emptyName);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('name');
    });

    it('should reject name longer than 100 characters', () => {
      const longName = {
        name: 'A'.repeat(101),
      };

      const { error } = createCategorySchema.validate(longName);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('name');
    });
  });

  describe('updateCategorySchema', () => {
    it('should validate a valid category update object', () => {
      const validObject = {
        name: 'Updated Category',
      };

      const { error } = updateCategorySchema.validate(validObject);
      expect(error).toBeUndefined();
    });

    it('should reject missing name', () => {
      const missingName = {};

      const { error } = updateCategorySchema.validate(missingName);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('name');
    });

    it('should reject empty name', () => {
      const emptyName = {
        name: '',
      };

      const { error } = updateCategorySchema.validate(emptyName);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('name');
    });

    it('should reject name longer than 100 characters', () => {
      const longName = {
        name: 'A'.repeat(101),
      };

      const { error } = updateCategorySchema.validate(longName);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('name');
    });
  });
});
