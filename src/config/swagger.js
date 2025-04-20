const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description:
        'API for managing tasks, categories, and user authentication',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              description: 'User password',
            },
          },
        },
        Category: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Category ID',
            },
            name: {
              type: 'string',
              maxLength: 100,
              description: 'Category name',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
          },
        },
        Task: {
          type: 'object',
          required: ['title', 'categoryId'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Task ID',
            },
            title: {
              type: 'string',
              maxLength: 200,
              description: 'Task title',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Task description',
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
              description: 'Category ID',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'User ID (automatically set to authenticated user)',
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed'],
              default: 'pending',
              description: 'Task status',
            },
            dueDate: {
              type: 'string',
              format: 'date',
              nullable: true,
              description: 'Due date (YYYY-MM-DD)',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API routes files
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
};
