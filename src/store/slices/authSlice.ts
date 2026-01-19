import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';
import type { User, LoginRequest, RegisterRequest, ApiError } from '../../types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
}

const getInitialState = (): AuthState => {
  let user: User | null = null;
  let token: string | null = null;
  
  try {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
      token = localStorage.getItem('authToken');
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    // Очищаем поврежденные данные
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }
  }

  return {
    user,
    token,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
    validationErrors: null,
  };
};

const initialState: AuthState = getInitialState();

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || 'Ошибка авторизации',
        errors: apiError.errors,
      });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.register(data);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Register user error:', apiError);
      return rejectWithValue({
        message: apiError.message || 'Ошибка регистрации',
        errors: apiError.errors || {},
      });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await apiService.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Ошибка загрузки данных пользователя');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiService.logout();
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Ошибка выхода');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
    updateUserData: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as { message: string; errors?: Record<string, string[]> };
        state.error = payload?.message || 'Ошибка авторизации';
        state.validationErrors = payload?.errors || null;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as { message: string; errors?: Record<string, string[]> };
        state.error = payload?.message || 'Ошибка регистрации';
        state.validationErrors = payload?.errors || null;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateUserData } = authSlice.actions;
export default authSlice.reducer;
