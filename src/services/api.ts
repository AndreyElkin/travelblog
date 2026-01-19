import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  ApiError,
  Post,
  User,
  Comment,
  UpdateUserRequest,
  UpdatePasswordRequest
} from '../types/api';

const API_BASE_URL = 'https://travelblog.skillbox.cc/api';

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let error: ApiError;
      try {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        
        // Обрабатываем разные форматы ошибок от API
        // Laravel может возвращать errors или messages
        let validationErrors: Record<string, string[]> = {};
        
        if (errorData.errors) {
          validationErrors = errorData.errors;
        } else if (errorData.messages) {
          // Если messages - это объект с массивами ошибок
          if (typeof errorData.messages === 'object' && !Array.isArray(errorData.messages)) {
            validationErrors = errorData.messages;
          }
        }
        
        const errorMessage = errorData.message || 
                            errorData.error || 
                            'Произошла ошибка при выполнении запроса';
        
        error = {
          message: errorMessage,
          errors: validationErrors,
        };
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        error = {
          message: `Ошибка ${response.status}: ${response.statusText}`,
        };
      }
      throw error;
    }

    return response.json();
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.request<any>('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      console.log('Login API response:', response);
      
      // Обрабатываем разные форматы ответа
      if (response.token && response.user) {
        return response as LoginResponse;
      }
      
      // Если структура другая, пытаемся адаптировать
      if (response.data) {
        return {
          token: response.data.token || response.token,
          user: response.data.user || response.user,
        };
      }
      
      return response as LoginResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      return await this.request<RegisterResponse>('/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Register error details:', error);
      throw error;
    }
  }

  async getPosts(): Promise<Post[]> {
    try {
      // API возвращает массив напрямую согласно документации
      const response = await this.request<Post[]>('/posts');
      return response || [];
    } catch (error) {
      console.error('Error in getPosts:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/user');
  }

  async updateUser(data: UpdateUserRequest): Promise<User> {
    const isFormData = data.photo instanceof File;
    
    if (isFormData) {
      const formData = new FormData();
      formData.append('full_name', data.full_name);
      if (data.city && data.city.trim()) {
        formData.append('city', data.city.trim());
      }
      if (data.bio && data.bio.trim()) {
        formData.append('bio', data.bio.trim());
      }
      if (data.photo instanceof File) {
        formData.append('photo', data.photo);
      }
      
      const token = this.getAuthToken();
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Не устанавливаем Content-Type для FormData - браузер сделает это автоматически с boundary
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        let error: ApiError;
        try {
          const errorData = await response.json();
          let validationErrors: Record<string, string[]> = {};
          
          if (errorData.errors) {
            validationErrors = errorData.errors;
          } else if (errorData.messages) {
            if (typeof errorData.messages === 'object' && !Array.isArray(errorData.messages)) {
              validationErrors = errorData.messages;
            }
          }
          
          error = {
            message: errorData.message || errorData.error || 'Ошибка обновления профиля',
            errors: validationErrors,
          };
        } catch (parseError) {
          error = {
            message: `Ошибка ${response.status}: ${response.statusText}`,
          };
        }
        throw error;
      }

      return response.json();
    }

    // Для JSON запросов без файла
    const jsonData: any = {
      full_name: data.full_name,
    };
    if (data.city && data.city.trim()) {
      jsonData.city = data.city.trim();
    }
    if (data.bio && data.bio.trim()) {
      jsonData.bio = data.bio.trim();
    }

    return this.request<User>('/user', {
      method: 'POST',
      body: JSON.stringify(jsonData),
    });
  }

  async updatePassword(data: UpdatePasswordRequest): Promise<void> {
    return this.request<void>('/user/password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getPost(id: number): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  async createPost(data: FormData | Record<string, any>): Promise<Post> {
    const isFormData = data instanceof FormData;
    const headers: HeadersInit = {};
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    return this.request<Post>('/posts', {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
  }

  async updatePost(id: number, data: FormData | Record<string, any>): Promise<Post> {
    const isFormData = data instanceof FormData;
    const headers: HeadersInit = {};
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    return this.request<Post>(`/posts/${id}`, {
      method: 'PUT',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
  }

  async deletePost(id: number): Promise<void> {
    return this.request<void>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async getComments(postId: number): Promise<Comment[]> {
    return this.request<Comment[]>(`/posts/${postId}/comments`);
  }

  async createComment(postId: number, data: { text: string; name?: string }): Promise<Comment> {
    return this.request<Comment>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    const token = this.getAuthToken();
    if (token) {
      try {
        await this.request('/logout', {
          method: 'GET',
        });
      } catch (error) {
        // Игнорируем ошибки при выходе
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}

export const apiService = new ApiService();
