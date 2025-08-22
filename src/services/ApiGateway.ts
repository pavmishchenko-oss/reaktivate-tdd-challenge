import { API_BASE } from './config';

export default class ApiGateway {
  async handleResponse(response: Response): Promise<unknown> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        // Try to get JSON with error details
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        // If JSON parsing failed, try to get text response
        try {
          const textError = await response.text();
          if (textError.includes('<!DOCTYPE')) {
            errorMessage =
              'API endpoint returned HTML instead of JSON. Please check the API configuration.';
          } else if (textError.length > 0) {
            errorMessage = `API Error: ${textError.substring(0, 100)}${textError.length > 100 ? '...' : ''}`;
          }
        } catch (textError) {
          // If text also failed, use standard error message
          errorMessage = `Request failed with status ${response.status}`;
        }
      }

      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch (parseError) {
      throw new Error('Invalid JSON response from server');
    }
  }

  get = async (path: string): Promise<unknown> => {
    try {
      const response = await fetch(`${API_BASE}${path}`);
      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`GET request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  post = async (path: string, payload: object): Promise<unknown> => {
    try {
      const response = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`POST request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
}
