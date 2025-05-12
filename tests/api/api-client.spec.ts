import { test, expect } from '@playwright/test';
import APIClient from '../../api/APIClient';
import { testConfig } from '../../config/test-config';

test.describe('API Client Tests', () => {
  let apiClient: APIClient;
  // Use JSONPlaceholder as our test API since we don't have OrangeHRM API docs
  const jsonPlaceholderUrl = 'https://jsonplaceholder.typicode.com';

  test.beforeEach(async ({ request }) => {
    apiClient = new APIClient(request);
  });

  test('GET request to public endpoint', async () => {
    const response = await apiClient.get(`${jsonPlaceholderUrl}/posts/1`);
    
    expect(response.status()).toBe(200);
    const data = await apiClient.parseResponse(response);
    expect(data).toHaveProperty('id', 1);
  });

  test('POST request with body', async () => {
    const body = {
      title: 'foo',
      body: 'bar',
      userId: 1
    };
    
    const response = await apiClient.post(`${jsonPlaceholderUrl}/posts`, body);
    
    expect(response.status()).toBe(201);
    const data = await apiClient.parseResponse(response);
    expect(data).toHaveProperty('title', 'foo');
    expect(data).toHaveProperty('id');
  });

  test('PUT request to update resource', async () => {
    const body = {
      id: 1,
      title: 'updated title',
      body: 'updated body',
      userId: 1
    };
    
    const response = await apiClient.put(`${jsonPlaceholderUrl}/posts/1`, body);
    
    expect(response.status()).toBe(200);
    const data = await apiClient.parseResponse(response);
    expect(data).toHaveProperty('title', 'updated title');
  });

  test('DELETE request', async () => {
    const response = await apiClient.delete(`${jsonPlaceholderUrl}/posts/1`);
    
    expect(response.status()).toBe(200);
  });

  test('Handling failed requests with retry', async () => {
    // This URL should return 404
    const response = await apiClient.get(`${jsonPlaceholderUrl}/nonexistent`, {
      retry: 2,
      requestOptions: {
        failOnStatusCode: false
      }
    });
    
    expect(response.status()).toBe(404);
  });
});
