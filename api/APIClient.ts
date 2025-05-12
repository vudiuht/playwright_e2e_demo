import { APIRequestContext, APIResponse } from "@playwright/test";

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
type AuthType = 'cookie' | 'bearer';

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  timeout?: number;
  failOnStatusCode?: boolean;
}

export default class APIClient {
  constructor(private request: APIRequestContext) {}

  /**
   * Build authentication headers based on token and auth type
   */
  private buildHeaders(token?: string, authType: AuthType = 'cookie'): Record<string, string> {
    if (!token) return {};

    return authType === 'bearer'
      ? { Authorization: `Bearer ${token}` }
      : { Cookie: `token=${token}` };
  }

  /**
   * Make an API request with comprehensive options
   */
  private async makeRequest(
    method: HttpMethod,
    endpoint: string,
    options: {
      body?: object;
      token?: string;
      authType?: AuthType;
      retry?: number;
      requestOptions?: RequestOptions;
    } = {}
  ): Promise<APIResponse> {
    const { body, token, authType = 'cookie', retry = 0, requestOptions = {} } = options;
    const { headers = {}, params, timeout, failOnStatusCode } = requestOptions;
    
    // Merge auth headers with custom headers
    const authHeaders = this.buildHeaders(token, authType);
    const mergedHeaders = { ...authHeaders, ...headers };
    
    const requestConfig = {
      headers: mergedHeaders,
      data: body,
      params,
      timeout,
      failOnStatusCode
    };

    try {
      console.log(`[API] ${method.toUpperCase()} ${endpoint}`);
      const response = await this.request[method](endpoint, requestConfig);
      console.log(`[API] Status: ${response.status()}`);

      // Retry logic for failed requests
      if (!response.ok() && retry > 0) {
        console.warn(`[API] Retry (${retry}) due to status ${response.status()}`);
        return this.makeRequest(method, endpoint, {
          ...options,
          retry: retry - 1
        });
      }

      return response;
    } catch (error) {
      console.error(`[API] Request failed:`, error);
      throw error;
    }
  }

  /**
   * Make a GET request
   */
  async get(
    endpoint: string, 
    options: {
      token?: string;
      authType?: AuthType;
      retry?: number;
      requestOptions?: RequestOptions;
    } = {}
  ): Promise<APIResponse> {
    return this.makeRequest('get', endpoint, options);
  }

  /**
   * Make a POST request
   */
  async post(
    endpoint: string, 
    body: object,
    options: {
      token?: string;
      authType?: AuthType;
      retry?: number;
      requestOptions?: RequestOptions;
    } = {}
  ): Promise<APIResponse> {
    return this.makeRequest('post', endpoint, { ...options, body });
  }

  /**
   * Make a PUT request
   */
  async put(
    endpoint: string, 
    body: object,
    options: {
      token?: string;
      authType?: AuthType;
      retry?: number;
      requestOptions?: RequestOptions;
    } = {}
  ): Promise<APIResponse> {
    return this.makeRequest('put', endpoint, { ...options, body });
  }

  /**
   * Make a PATCH request
   */
  async patch(
    endpoint: string, 
    body: object,
    options: {
      token?: string;
      authType?: AuthType;
      retry?: number;
      requestOptions?: RequestOptions;
    } = {}
  ): Promise<APIResponse> {
    return this.makeRequest('patch', endpoint, { ...options, body });
  }

  /**
   * Make a DELETE request
   */
  async delete(
    endpoint: string,
    options: {
      body?: object;
      token?: string;
      authType?: AuthType;
      retry?: number;
      requestOptions?: RequestOptions;
    } = {}
  ): Promise<APIResponse> {
    return this.makeRequest('delete', endpoint, options);
  }

  /**
   * Parse JSON response with error handling
   */
  async parseResponse<T>(response: APIResponse): Promise<T> {
    try {
      return await response.json() as T;
    } catch (error) {
      console.error('[API] Failed to parse response:', error);
      throw new Error(`Failed to parse API response: ${error.message}`);
    }
  }
}
