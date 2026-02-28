import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  deleteCommentReducer,
  getCommentsAsync,
} from '../features/commentsSlice';

export const PostDetails: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const dispatch = useAppDispatch();

  const post = useAppSelector(state => state.posts.selectedPost);
  const comments = useAppSelector(state => state.comments);

  useEffect(() => {
    if (post) {
      dispatch(getCommentsAsync(post.id));
    }

    setVisible(false);
  }, [post]);

  return (
    <div className="content" data-cy="PostDetails">
      <div className="block">
        <h2 data-cy="PostTitle">{`#${post?.id}: ${post?.title}`}</h2>

        <p data-cy="PostBody">{post?.body}</p>
      </div>

      <div className="block">
        {comments.status === 'loading' && <Loader />}

        {comments.status === 'failed' && (
          <div className="notification is-danger" data-cy="CommentsError">
            Something went wrong
          </div>
        )}

        {comments.data.length === 0 && comments.status === 'idle' && (
          <p className="title is-4" data-cy="NoCommentsMessage">
            No comments yet
          </p>
        )}

        {comments.data.length > 0 && comments.status === 'idle' && (
          <>
            <p className="title is-4">Comments:</p>

            {comments.data.map(comment => (
              <article
                className="message is-small"
                key={comment.id}
                data-cy="Comment"
              >
                <div className="message-header">
                  <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                    {comment.name}
                  </a>

                  <button
                    data-cy="CommentDelete"
                    type="button"
                    className="delete is-small"
                    aria-label="delete"
                    onClick={() => dispatch(deleteCommentReducer(comment.id))}
                  >
                    delete button
                  </button>
                </div>

                <div className="message-body" data-cy="CommentBody">
                  {comment.body}
                </div>
              </article>
            ))}
          </>
        )}

        {comments.status === 'idle' && !visible && (
          <button
            data-cy="WriteCommentButton"
            type="button"
            className="button is-link"
            onClick={() => setVisible(prev => !prev)}
          >
            Write a comment
          </button>
        )}

        {visible && <NewCommentForm />}
      </div>
    </div>
  );
};
