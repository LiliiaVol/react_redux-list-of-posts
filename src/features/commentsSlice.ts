/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPostComments, deleteComment } from '../api/comments';
import { Comment } from '../types/Comment';
// eslint-disable-next-line import/no-cycle

export interface CommentsState {
  data: Comment[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CommentsState = {
  data: [],
  status: 'idle',
};

export const getCommentsAsync = createAsyncThunk(
  '/comments',
  async (postId: number) => {
    const comments = await getPostComments(postId);

    return comments;
  },
);

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    deleteCommentReducer: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter(comment => comment.id !== action.payload);
      deleteComment(action.payload);
    },
    updateComments: (state, action: PayloadAction<Comment>) => {
      state.data = [...state.data, action.payload];
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getCommentsAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getCommentsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload;
      })
      .addCase(getCommentsAsync.rejected, state => {
        state.status = 'failed';
      });
  },
});

export const { deleteCommentReducer, updateComments } = commentsSlice.actions;

export default commentsSlice.reducer;
