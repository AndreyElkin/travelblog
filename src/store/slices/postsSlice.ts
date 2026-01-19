import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';
import type { Post, ApiError, CreatePostRequest } from '../../types/api';

interface PostsState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
  createSuccess: boolean;
}

const initialState: PostsState = {
  posts: [],
  isLoading: false,
  error: null,
  validationErrors: null,
  createSuccess: false,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      // API возвращает массив Post[] напрямую
      const posts = await apiService.getPosts();
      return posts;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Error fetching posts:', error);
      return rejectWithValue(apiError.message || 'Ошибка загрузки постов');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (data: CreatePostRequest, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('country', data.country);
      formData.append('city', data.city);
      formData.append('photo', data.photo);
      
      const post = await apiService.createPost(formData);
      return post;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Error creating post:', error);
      return rejectWithValue({
        message: apiError.message || 'Ошибка создания поста',
        errors: apiError.errors || {},
      });
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.validationErrors = null;
      state.createSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.validationErrors = null;
        state.createSuccess = false;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload);
        state.error = null;
        state.validationErrors = null;
        state.createSuccess = true;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as { message: string; errors?: Record<string, string[]> };
        state.error = payload?.message || 'Ошибка создания поста';
        state.validationErrors = payload?.errors || null;
        state.createSuccess = false;
      });
  },
});

export const { clearError } = postsSlice.actions;

export default postsSlice.reducer;
