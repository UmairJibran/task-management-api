const {
  signupSchema,
  loginSchema,
} = require('../../validations/user.validation');

describe('User Validation Schemas', () => {
  describe('signupSchema', () => {
    it('should validate a valid signup object', () => {
      const validObject = {
        email: 'test@example.com',
        password: 'password123',
      };

      const { error } = signupSchema.validate(validObject);
      expect(error).toBeUndefined();
    });

    it('should reject invalid email', () => {
      const invalidEmail = {
        email: 'invalid-email',
        password: 'password123',
      };

      const { error } = signupSchema.validate(invalidEmail);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('email');
    });

    it('should reject missing email', () => {
      const missingEmail = {
        password: 'password123',
      };

      const { error } = signupSchema.validate(missingEmail);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('email');
    });

    it('should reject short password', () => {
      const shortPassword = {
        email: 'test@example.com',
        password: '123',
      };

      const { error } = signupSchema.validate(shortPassword);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('password');
    });

    it('should reject missing password', () => {
      const missingPassword = {
        email: 'test@example.com',
      };

      const { error } = signupSchema.validate(missingPassword);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('password');
    });
  });

  describe('loginSchema', () => {
    it('should validate a valid login object', () => {
      const validObject = {
        email: 'test@example.com',
        password: 'password123',
      };

      const { error } = loginSchema.validate(validObject);
      expect(error).toBeUndefined();
    });

    it('should reject invalid email', () => {
      const invalidEmail = {
        email: 'invalid-email',
        password: 'password123',
      };

      const { error } = loginSchema.validate(invalidEmail);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('email');
    });

    it('should reject missing email', () => {
      const missingEmail = {
        password: 'password123',
      };

      const { error } = loginSchema.validate(missingEmail);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('email');
    });

    it('should reject short password', () => {
      const shortPassword = {
        email: 'test@example.com',
        password: '123',
      };

      const { error } = loginSchema.validate(shortPassword);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('password');
    });

    it('should reject missing password', () => {
      const missingPassword = {
        email: 'test@example.com',
      };

      const { error } = loginSchema.validate(missingPassword);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('password');
    });
  });
});
