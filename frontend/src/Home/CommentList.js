import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authTokens = JSON.parse(localStorage.getItem("authTokens"));
    const token = authTokens ? authTokens.access : null;

    axios.get(`http://127.0.0.1:8000/blogs/comments/${postId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      setComments(response.data.results);
      console.log(response.data);
      setLoading(false);
    })
    .catch(error => {
      setError(error);
      setLoading(false);
    });
  }, [postId]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments: {error.message}</p>;

  return (
    <div className="comments-list">
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map(comment => (
          <div key={comment.id} className="comment">
            <p>{comment.comment_body}</p>
            <p><small>By {comment.comment_author.username}, {new Date(comment.created_at).toLocaleDateString()}</small></p>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;