import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api';
import type { Post, Comment, ApiError } from '../../types/api';

interface PostState {
  post: Post | null;
  comments: Comment[];
  isLoading: boolean;
  isLoadingComments: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
  commentSuccess: boolean;
}

const initialState: PostState = {
  post: null,
  comments: [],
  isLoading: false,
  isLoadingComments: false,
  error: null,
  validationErrors: null,
  commentSuccess: false,
};

export const fetchPost = createAsyncThunk(
  'post/fetchPost',
  async (id: number, { rejectWithValue }) => {
    try {
      const post = await apiService.getPost(id);
      return post;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Error fetching post:', error);
      return rejectWithValue(apiError.message || 'Ошибка загрузки поста');
    }
  }
);

export const fetchComments = createAsyncThunk(
  'post/fetchComments',
  async (postId: number, { rejectWithValue }) => {
    try {
      const comments = await apiService.getComments(postId);
      return comments;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Error fetching comments:', error);
      return rejectWithValue(apiError.message || 'Ошибка загрузки комментариев');
    }
  }
);

export const createComment = createAsyncThunk(
  'post/createComment',
  async ({ postId, comment, full_name }: { postId: number; comment: string; full_name: string }, { rejectWithValue }) => {
    try {
      const result = await apiService.createComment(postId, { comment, full_name });
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Error creating comment:', error);
      return rejectWithValue({
        message: apiError.message || 'Ошибка создания комментария',
        errors: apiError.errors || {},
      });
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.validationErrors = null;
      state.commentSuccess = false;
    },
    clearPost: (state) => {
      state.post = null;
      state.comments = [];
      state.error = null;
      state.validationErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Post
      .addCase(fetchPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.post = action.payload;
        state.error = null;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.isLoadingComments = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoadingComments = false;
        state.comments = action.payload;
        state.error = null;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoadingComments = false;
        state.error = action.payload as string;
      })
      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.validationErrors = null;
        state.commentSuccess = false;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments.push(action.payload);
        state.error = null;
        state.validationErrors = null;
        state.commentSuccess = true;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as { message: string; errors?: Record<string, string[]> };
        state.error = payload?.message || 'Ошибка создания комментария';
        state.validationErrors = payload?.errors || null;
        state.commentSuccess = false;
      });
  },
});

export const { clearError, clearPost } = postSlice.actions;
export default postSlice.reducer;
