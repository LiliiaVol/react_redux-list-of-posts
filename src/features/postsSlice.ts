/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { Post } from '../types/Post';
import { getUserPosts } from '../api/posts';

export interface PostsState {
  data: Post[];
  selectedPost: Post | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PostsState = {
  data: [],
  selectedPost: null,
  status: 'idle',
};

export const getPostsAsync = createAsyncThunk(
  '/posts',
  async (userId: number) => {
    const posts = await getUserPosts(userId);

    return posts;
  },
);

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSelectedPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedPost = action.payload;
    },
    unSetSelectedPost: state => {
      state.selectedPost = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getPostsAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getPostsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload;
      })
      .addCase(getPostsAsync.rejected, state => {
        state.status = 'failed';
      });
  },
});

export const { setSelectedPost, unSetSelectedPost } = postsSlice.actions;

export default postsSlice.reducer;
