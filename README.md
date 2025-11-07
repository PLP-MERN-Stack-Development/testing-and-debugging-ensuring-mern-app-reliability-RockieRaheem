# Testing and Debugging MERN Applications

This assignment focuses on implementing comprehensive testing strategies for a MERN stack application, including unit testing, integration testing, and end-to-end testing, along with debugging techniques.

## 🎯 Assignment Overview

This project demonstrates:
1. ✅ Complete testing environment setup for both client and server
2. ✅ Unit tests for React components and server functions
3. ✅ Integration tests for API endpoints
4. ✅ End-to-end tests for critical user flows
5. ✅ Debugging techniques for MERN stack issues

## 📁 Project Structure

```
mern-testing/
├── client/                      # React front-end
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Form.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostList.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useFetch.js
│   │   │   └── useForm.js
│   │   ├── utils/               # Utility functions
│   │   │   ├── api.js
│   │   │   ├── validation.js
│   │   │   └── format.js
│   │   ├── tests/               # Client-side tests
│   │   │   ├── unit/            # Unit tests
│   │   │   │   ├── Button.test.jsx
│   │   │   │   ├── Input.test.jsx
│   │   │   │   ├── Form.test.jsx
│   │   │   │   ├── PostCard.test.jsx
│   │   │   │   ├── PostList.test.jsx
│   │   │   │   ├── validation.test.js
│   │   │   │   └── format.test.js
│   │   │   └── setup.js
│   │   └── App.jsx
│   ├── cypress/                 # End-to-end tests
│   │   ├── e2e/
│   │   │   ├── auth.cy.js
│   │   │   ├── posts.cy.js
│   │   │   └── errorHandling.cy.js
│   │   └── support/
│   └── package.json
├── server/                      # Express.js back-end
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   │   ├── authController.js
│   │   │   └── postController.js
│   │   ├── models/              # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   └── Category.js
│   │   ├── routes/              # API routes
│   │   │   ├── authRoutes.js
│   │   │   └── postRoutes.js
│   │   ├── middleware/          # Custom middleware
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── requestLogger.js
│   │   ├── utils/               # Utility functions
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   └── logger.js
│   │   ├── app.js               # Express app config
│   │   └── server.js            # Server entry point
│   ├── tests/                   # Server-side tests
│   │   ├── unit/                # Unit tests
│   │   │   ├── auth.test.js
│   │   │   ├── validation.test.js
│   │   │   └── middleware.test.js
│   │   ├── integration/         # Integration tests
│   │   │   ├── auth.test.js
│   │   │   └── posts.test.js
│   │   └── setup.js
│   └── package.json
├── jest.config.js               # Jest configuration
└── package.json                 # Root dependencies
```

## 🚀 Getting Started

### Installation

```bash
# Install all dependencies (root, client, and server)
npm run install-all

# Or install individually
npm install
cd client && npm install
cd ../server && npm install
```

### Environment Setup

Create a `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mern-testing
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
LOG_LEVEL=info
```

### Running the Application

```bash
# Run both client and server concurrently
npm run dev

# Run server only
npm run server

# Run client only
npm run client
```

## 🧪 Testing Strategy

### 1. Unit Testing

**Client-Side Unit Tests:**
- React components (Button, Input, Form, PostCard, PostList)
- Custom hooks (useFetch, useForm)
- Utility functions (validation, formatting, API client)

**Server-Side Unit Tests:**
- Authentication utilities (JWT generation/verification)
- Validation utilities (email, password, pagination)
- Middleware functions (authentication, authorization)

**Coverage Goal:** 70%+ for all unit tests

### 2. Integration Testing

**API Endpoint Tests:**
- Authentication (register, login, profile management)
- Posts CRUD operations (create, read, update, delete)
- Authorization and access control
- Error handling and validation

**Database Integration:**
- Uses MongoDB Memory Server for isolated testing
- Automatic setup and teardown
- No dependencies on external databases

### 3. End-to-End Testing

**Critical User Flows:**
- User registration and login
- Post creation and management
- Like functionality
- Error handling and edge cases
- Protected route access

**Tools:** Cypress for E2E testing

## 🧑‍💻 Running Tests

### All Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Unit Tests Only

```bash
npm run test:unit
```

### Integration Tests Only

```bash
npm run test:integration
```

### End-to-End Tests

```bash
# Open Cypress test runner
npm run test:e2e

# Run Cypress tests headlessly
cd client && npm run test:e2e:headless
```

## 📊 Test Coverage

Current test coverage:

| Type | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| Client | 75%+ | 70%+ | 75%+ | 75%+ |
| Server | 80%+ | 75%+ | 80%+ | 80%+ |
| Overall | 77%+ | 72%+ | 77%+ | 77%+ |

## 🐛 Debugging Techniques Implemented

### 1. Server-Side Debugging

**Winston Logger:**
- Structured logging with different levels (error, warn, info, debug)
- File-based logging (error.log, combined.log)
- Console logging for development
- Request/response logging with Morgan

**Global Error Handler:**
- Centralized error handling middleware
- Custom AppError class for operational errors
- Mongoose error handling (validation, duplicate keys, cast errors)
- JWT error handling
- Development vs production error responses

**Performance Monitoring:**
- Request duration tracking
- Slow request detection (>1s)
- Memory usage monitoring

### 2. Client-Side Debugging

**Error Boundaries:**
- Catch and handle React component errors
- Fallback UI for error states
- Error logging and reporting
- Development mode error details

**Console Logging:**
- Structured logging for API calls
- Error tracking for failed requests
- Performance measurements

**Browser DevTools Integration:**
- React DevTools compatible
- Source maps for debugging
- Network request inspection

### 3. Common Issues Addressed

**Authentication Issues:**
- Token expiration handling
- Invalid token detection
- Missing authorization headers

**Database Issues:**
- Connection error handling
- Query validation
- Transaction rollback

**API Errors:**
- Network timeout handling
- 404 and 500 error pages
- Graceful degradation

**Validation Errors:**
- Client-side form validation
- Server-side data validation
- User-friendly error messages

## 📈 Testing Best Practices Followed

1. **AAA Pattern:** Arrange, Act, Assert
2. **Test Isolation:** Each test is independent
3. **Mocking:** External dependencies are mocked
4. **Clean Code:** Descriptive test names and clear assertions
5. **Coverage:** High code coverage with meaningful tests
6. **CI/CD Ready:** Tests can run in automated pipelines
7. **Fast Tests:** Unit tests run in milliseconds
8. **Realistic E2E:** Tests simulate real user behavior

## 🛠️ Technologies Used

### Testing Tools

- **Jest:** JavaScript testing framework
- **React Testing Library:** Testing utilities for React
- **Supertest:** HTTP assertions for API testing
- **Cypress:** End-to-end testing framework
- **MongoDB Memory Server:** In-memory MongoDB for testing

### Development Tools

- **Winston:** Logging library
- **Morgan:** HTTP request logger
- **Express Async Errors:** Async error handling
- **BCrypt:** Password hashing
- **JSON Web Tokens:** Authentication

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Cypress Documentation](https://docs.cypress.io/)
- [MongoDB Testing Best Practices](https://www.mongodb.com/blog/post/mongodb-testing-best-practices)
- [Winston Logger](https://github.com/winstonjs/winston)

## 📝 Assignment Completion Checklist

- ✅ Testing environment configured for client and server
- ✅ Unit tests for React components (Button, Input, Form, PostCard, PostList)
- ✅ Unit tests for custom hooks
- ✅ Unit tests for utility functions (client and server)
- ✅ Unit tests for middleware
- ✅ Integration tests for authentication API
- ✅ Integration tests for posts API
- ✅ E2E tests for user registration and login
- ✅ E2E tests for posts CRUD operations
- ✅ E2E tests for error handling
- ✅ Error boundaries implemented
- ✅ Logging system configured (Winston)
- ✅ Global error handler implemented
- ✅ Performance monitoring added
- ✅ 70%+ code coverage achieved
- ✅ Testing strategy documented
- ✅ Debugging techniques demonstrated

## 🎓 Learning Outcomes

This assignment demonstrates proficiency in:

1. **Test-Driven Development (TDD):** Writing tests before implementation
2. **Test Pyramid:** Balanced mix of unit, integration, and E2E tests
3. **Mocking and Stubbing:** Isolating units under test
4. **Async Testing:** Handling promises and async operations
5. **API Testing:** Testing RESTful endpoints
6. **Error Handling:** Comprehensive error management
7. **Debugging:** Using logs and tools to identify issues
8. **CI/CD Readiness:** Automated testing pipeline compatibility

## 📧 Contact

For questions or issues, please contact the instructor or refer to the Week6-Assignment.md file.

---

**Note:** This is a comprehensive testing and debugging assignment for MERN Stack Development. All tests are implemented and ready to run. The application includes production-ready error handling, logging, and monitoring features. 