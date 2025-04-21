const {
  getCompletionRateS,
} = require('../../validations/analytics.validation');

describe('Analytics Validation Schemas', () => {
  describe('getCompletionRateS', () => {
    it('should validate a valid object with timeframe', () => {
      const validObject = {
        timeframe: 'day',
      };

      const { error } = getCompletionRateS.validate(validObject);
      expect(error).toBeUndefined();
    });

    it('should use default timeframe when not provided', () => {
      const emptyObject = {};

      const { value } = getCompletionRateS.validate(emptyObject);
      expect(value.timeframe).toBe('all');
    });

    it('should validate all valid timeframe values', () => {
      const validTimeframes = ['day', 'week', 'month', 'all'];

      validTimeframes.forEach((timeframe) => {
        const { error } = getCompletionRateS.validate({ timeframe });
        expect(error).toBeUndefined();
      });
    });

    it('should reject invalid timeframe value', () => {
      const invalidObject = {
        timeframe: 'invalid-timeframe',
      };

      const { error } = getCompletionRateS.validate(invalidObject);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('timeframe');
    });
  });
});
