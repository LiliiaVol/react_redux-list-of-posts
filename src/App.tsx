/* eslint-disable @typescript-eslint/indent */
import React, { useEffect } from 'react';
import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { UserSelector } from './components/UserSelector';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { Loader } from './components/Loader';
import { getPostsAsync } from './features/postsSlice';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const users = useAppSelector(state => state.users);
  const posts = useAppSelector(state => state.posts);

  useEffect(() => {
    if (users.selectedUser) {
      dispatch(getPostsAsync(users.selectedUser.id));
    }
  }, [users.selectedUser, dispatch]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector />
              </div>

              <div className="block" data-cy="MainContent">
                {!users.selectedUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {posts.status === 'loading' && <Loader />}

                {posts.status === 'failed' && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {posts.status === 'idle' &&
                  posts.data.length === 0 &&
                  users.selectedUser !== null && (
                    <div
                      className="notification is-warning"
                      data-cy="NoPostsYet"
                    >
                      No posts yet
                    </div>
                  )}

                {posts.data.length > 0 && posts.status === 'idle' && (
                  <PostsList />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': posts.selectedPost,
              },
            )}
          >
            <div className="tile is-child box is-success ">
              {posts.selectedPost && <PostDetails />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
