// src/utils/ApiResponse.ts

/**
 * Standard API Response structure
 */
export interface IapiResponse<T> {
  status: 'success' | 'fail';
  statusCode: number;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Utility class for sending consistent API responses
 */
export class ApiResponse<T> implements IapiResponse<T> {
  public readonly status: 'success' | 'fail';
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data?: T;
  public readonly meta?: Record<string, unknown>;
  public readonly timestamp: string;

  constructor(
    statusCode: number,
    message: string,
    options?: {
      data?: T;
      meta?: Record<string, unknown>;
    }
  ) {
    this.status = statusCode >= 200 && statusCode < 400 ? 'success' : 'fail';
    this.statusCode = statusCode;
    this.message = message;
    this.data = options?.data;
    this.meta = options?.meta;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Convert instance to plain JSON object
   */
  toJSON(): IapiResponse<T> {
    return {
      status: this.status,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      meta: this.meta,
      timestamp: this.timestamp,
    };
  }

  /**
   * Static factory for success response
   */
  static success<T>(
    data: T,
    message = 'Request successful',
    statusCode = 200,
    meta?: Record<string, unknown>
  ): ApiResponse<T> {
    return new ApiResponse<T>(statusCode, message, { data, meta });
  }

  /**
   * Static factory for failure response (non-exception cases)
   */
  static fail(
    message: string,
    statusCode = 400,
    meta?: Record<string, unknown>
  ): ApiResponse<null> {
    return new ApiResponse<null>(statusCode, message, { data: null, meta });
  }
}
