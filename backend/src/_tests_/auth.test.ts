import request from 'supertest';
import mongoose from 'mongoose';
// IMPORTANT: Ensure your Express 'app' is exported from server.ts or app.ts
// e.g., export const app = express();
import { app } from '../server';

describe('Auth API - Registration', () => {
  // Connect to a specific test database before all tests
  beforeAll(async () => {
    const testDbUri = 'mongodb://localhost:27017/ride-flex-test';
    await mongoose.connect(testDbUri);
  });

  // Clean up the database after each test
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  // Disconnect from the database after all tests are done
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should successfully register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: "Test User",
        email: "test_jest@example.com",
        mobile: "9876543210",
        password: "password123",
        role: "user",
        city: "Mumbai",
        dlNumber: "MH1234567890"
      });

    // Assert that the status code is 201 (Created) or 200 (OK)
    expect(response.status).toBe(201);
    
    // Assert that the response body contains expected properties
    expect(response.body).toHaveProperty('message');
    expect(response.body.user).toHaveProperty('email', 'test_jest@example.com');
    expect(response.body).not.toHaveProperty('password'); // Ensure password isn't leaked
  });

  it('should fail to register a user with missing required fields (Zod validation)', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: "Incomplete User"
        // Missing email, password, mobile, role, etc.
      });

    // Expecting a Bad Request error due to validation failing
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should fail to register a user with an already registered email', async () => {
    const userData = {
      name: "Duplicate User",
      email: "duplicate@example.com",
      mobile: "1111111111",
      password: "password123",
      role: "user"
    };

    // First registration succeeds
    await request(app).post('/api/auth/register').send(userData);

    // Second registration with the same email fails
    const response = await request(app).post('/api/auth/register').send(userData);
    expect(response.status).not.toBe(201); // Likely 400 or 409 depending on your error handler
  });
});