import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';
import type { User, UpdateUserRequest, UpdatePasswordRequest, ApiError } from '../../types/api';

interface ProfileState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
  updateSuccess: boolean;
}

const initialState: ProfileState = {
  user: null,
  isLoading: false,
  error: null,
  validationErrors: null,
  updateSuccess: false,
};

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await apiService.getCurrentUser();
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || 'Ошибка загрузки профиля',
        errors: apiError.errors || {},
      });
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (data: UpdateUserRequest, { rejectWithValue }) => {
    try {
      const user = await apiService.updateUser(data);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || 'Ошибка обновления профиля',
        errors: apiError.errors || apiError.errors || {},
      });
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  'profile/updateUserPassword',
  async (data: UpdatePasswordRequest, { rejectWithValue }) => {
    try {
      await apiService.updatePassword(data);
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || 'Ошибка изменения пароля',
        errors: apiError.errors || {},
      });
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.validationErrors = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as { message: string; errors?: Record<string, string[]> };
        state.error = payload?.message || 'Ошибка загрузки профиля';
        state.validationErrors = payload?.errors || null;
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.validationErrors = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        state.validationErrors = null;
        state.updateSuccess = true;
        // Обновляем данные в localStorage
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as { message: string; errors?: Record<string, string[]> };
        state.error = payload?.message || 'Ошибка обновления профиля';
        state.validationErrors = payload?.errors || null;
        state.updateSuccess = false;
      })
      // Update Password
      .addCase(updateUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.validationErrors = null;
        state.updateSuccess = true;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as { message: string; errors?: Record<string, string[]> };
        state.error = payload?.message || 'Ошибка изменения пароля';
        state.validationErrors = payload?.errors || null;
      });
  },
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;
