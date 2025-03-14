<script>
  import { onMount } from "svelte";

  export let post = {
    _id: null,
    title: "",
    content: "",
    date: "",
    author: "",
    image: "",
  };

  let comments = [];
  let newComment = "";
  let isLoggedIn = false;
  let username = "";
  let errorMessage = "";
  let successMessage = "";

  onMount(async () => {
    const token = localStorage.getItem("userToken");
    if (token) {
      isLoggedIn = true;
      username = localStorage.getItem("username");
    }
    await loadComments();
  });

  async function loadComments() {
    try {
      const response = await fetch(`/api/posts/${post._id}/comments`);
      if (!response.ok) {
        throw new Error("Failed to load comments");
      }
      comments = await response.json();
      errorMessage = "";
    } catch (error) {
      console.error("Failed to load comments:", error);
      errorMessage = "Failed to load comments. Please try again later.";
    }
  }

  async function handleCommentSubmit() {
    if (!isLoggedIn) return;
    errorMessage = "";
    successMessage = "";

    try {
      const response = await fetch(`/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          content: newComment,
          username,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to post comment");
      }

      const comment = await response.json();
      comments = [comment, ...comments];
      newComment = "";
      successMessage = "Comment posted successfully!";
    } catch (error) {
      console.error("Failed to post comment:", error);
      errorMessage = error.message || "Failed to post comment. Please try again.";
    }
  }
</script>

<article class="company-post">
  {#if post.image}
    <img src={"/" + post.image} alt={post.title} />
  {/if}
  <div class="post-content">
    <h3>{post.title}</h3>
    <div class="post-meta">
      <span>{post.author}</span>
      <span>{post.date}</span>
    </div>
    <p>{post.content}</p>
  </div>

  <div class="comments-section">
    <h4>Comments</h4>

    {#if errorMessage}
      <div class="error-message">{errorMessage}</div>
    {/if}

    {#if successMessage}
      <div class="success-message">{successMessage}</div>
    {/if}

    {#if isLoggedIn}
      <form on:submit|preventDefault={handleCommentSubmit} class="comment-form">
        <textarea
          bind:value={newComment}
          placeholder="Write a comment..."
          required
          rows="3"
          maxlength="500"
        ></textarea>
        <div class="form-footer">
          <span class="char-count">{newComment.length}/500</span>
          <button type="submit">Post Comment</button>
        </div>
      </form>
    {:else}
      <p>Please <a href="/login">login</a> to comment</p>
    {/if}

    <div class="comments-list">
      {#each comments as comment}
        <div class="comment">
          <strong>{comment.username}</strong>
          <p>{comment.content}</p>
          <small>{new Date(comment.created_at).toLocaleDateString()}</small>
        </div>
      {/each}
    </div>
  </div>
</article>

<style>
  .company-post {
    background: var(--color-light);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }

  .post-content {
    padding: 1.5rem;
  }

  .post-meta {
    color: #666;
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }

  .post-meta span:not(:last-child)::after {
    content: "•";
    margin: 0 0.5rem;
  }

  .comments-section {
    padding: 1.5rem;
    margin-top: 1rem;
    border-top: 1px solid #eee;
  }

  .comment-form {
    margin: 1rem 0;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
  }

  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: var(--font-body);
    font-size: 0.95rem;
    line-height: 1.4;
    transition: all 0.2s ease;
    min-height: auto;
    resize: vertical;
    background: white;
  }

  textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }

  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
  }

  .char-count {
    color: #666;
    font-size: 0.85rem;
  }

  button {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
  }

  button:hover {
    background: var(--color-secondary);
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .comment {
    padding: 0.75rem;
    margin: 0.5rem 0;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s ease;
  }

  .comment:hover {
    background-color: #f8f9fa;
  }

  .comment strong {
    color: var(--color-primary);
    font-size: 0.95rem;
  }

  .comment p {
    margin: 0.5rem 0;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .comment small {
    color: #666;
    font-size: 0.8rem;
  }

  .error-message {
    color: #d32f2f;
    background-color: #ffebee;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border-radius: 4px;
  }

  .success-message {
    color: #2e7d32;
    background-color: #e8f5e9;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border-radius: 4px;
  }
</style>
