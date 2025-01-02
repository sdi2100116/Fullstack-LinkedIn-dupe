import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './feed.css';
import CommentList from './CommentList';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [showCommentInput, setShowCommentInput] = useState(null);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const authTokens = JSON.parse(localStorage.getItem('authTokens'));
  const token = authTokens ? authTokens.access : null;

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 2; // Load 2 posts at a time

  useEffect(() => {
    const fetchPosts = async () => {
      if (!hasMore || loadingMore) return;

      setLoadingMore(true);

      try {
        const response = await axios.get(`http://127.0.0.1:8000/blogs/fetch/?limit=${limit}&offset=${offset}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const newPosts = response.data.results || [];
        console.log(newPosts);
        setPosts(prevPosts => {
          const filteredPosts = newPosts.filter(post => !prevPosts.some(prevPost => prevPost.id === post.id));
          return [...prevPosts, ...filteredPosts];
        });
        setHasMore(response.data.next !== null);
        
        // Record views for newly fetched posts
        newPosts.forEach(post => {
          recordView(post.id);
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchPosts();
  }, [token, offset, hasMore]);

  const recordView = async (postId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/blogs/view/${postId}/`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) { // Increased threshold
        if (!loadingMore && hasMore) {
            setOffset(prevOffset => prevOffset + limit);
        }
    }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

  const handleAddCommentClick = (postId) => {
    setShowCommentInput(prev => (prev === postId ? null : postId));
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = async (postId) => {
    if (!comment.trim()) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      const response = await axios.post(`http://127.0.0.1:8000/blogs/comments/${postId}/`, {
        comment_body: comment,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert('Comment posted successfully');
        setComment('');
        setShowCommentInput(null);
      } else {
        alert('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Error posting comment');
    }
  };

  const handleShowCommentsClick = (postId) => {
    setShowComments(prev => (prev === postId ? null : postId));
  };

  const handleLikeClick = async (postId) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/blogs/interest/${postId}/`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setPosts(posts.map(post =>
          post.id === postId ? { ...post, liked: response.data.liked } : post
        ));
      } else {
        alert('Failed to like/unlike post');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/blogs/delete/${postId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Post deleted successfully');
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2 className='feed-title'>
        <i className="fa-solid fa-angles-down"></i> Your Feed <i className="fa-solid fa-angles-down"></i>
      </h2>
      <div className='feed'>
        {/* Check if there are any posts to display */}
        {posts.length === 0 ? (
          <p>You're all caught up!</p> // Message when no posts are available
        ) : (
          posts.map(post => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p className='postDate'>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}, {new Date(post.created_at).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
                <span className='postAuthor'>
                  <br />
                  <Link to={`/auth/profile/${post.author.username}`}>{post.author.username}</Link>
                </span>
              </p>

              <p>{post.body}</p>
              {post.image && (
                <img className='postImage' src={`http://127.0.0.1:8000${post.image}`} alt="Post Image" />
              )}
              {post.video && (
                <video className='postVideo' controls controlsList="nodownload">
                  <source src={`http://127.0.0.1:8000${post.video}`} type="video/mp4" />
                </video>
              )}
              {post.audio && (
                <audio className='postAudio' controls controlsList="nodownload" src={`http://127.0.0.1:8000${post.audio}`} />
              )}
              <div>
                <button className='likeButton' onClick={() => handleLikeClick(post.id)}>
                  {post.liked ? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}
                </button>
                <button className='commentFeed' onClick={() => handleAddCommentClick(post.id)}>
                  Add comment
                </button>
                <button className="showComments" onClick={() => handleShowCommentsClick(post.id)}>
                  {showComments === post.id ? 'Hide comments' : 'Show comments'}
                </button>

                {showComments === post.id && <CommentList postId={post.id} />}
                
                {showCommentInput === post.id && (
                  <div className='comment-form'>
                    <textarea
                      value={comment}
                      onChange={handleCommentChange}
                      placeholder="Write your comment here..."
                    />
                    <button onClick={() => handleCommentSubmit(post.id)}>Submit</button>
                  </div>
                )}

                {user.username === post.author.username && (
                  <button className='deleteButton' onClick={() => handleDeletePost(post.id)}>
                    Delete 
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        {loadingMore && <p>Loading more posts...</p>}
      </div>
    </div>
);
}

export default Feed;
