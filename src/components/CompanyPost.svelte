<script>
  import { onMount } from "svelte";

  export let post = {
    id: 0,
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

  onMount(async () => {
    const token = localStorage.getItem("userToken");
    if (token) {
      isLoggedIn = true;
      username = localStorage.getItem("username");
    }
    await loadComments();
  });

  async function loadComments() {
    const response = await fetch(`/api/posts/${post.id}/comments`);
    comments = await response.json();
  }

  async function handleCommentSubmit() {
    if (!isLoggedIn) return;

    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
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

      if (response.ok) {
        const comment = await response.json();
        comments = [comment, ...comments];
        newComment = "";
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
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

    {#if isLoggedIn}
      <form on:submit|preventDefault={handleCommentSubmit}>
        <textarea
          bind:value={newComment}
          placeholder="Write a comment..."
          required
        ></textarea>
        <button type="submit">Post Comment</button>
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
    padding: 1rem;
    margin-top: 1rem;
    border-top: 1px solid #eee;
  }

  .comment {
    padding: 0.5rem;
    margin: 0.5rem 0;
    border-bottom: 1px solid #eee;
  }

  textarea {
    width: 100%;
    min-height: 100px;
    margin-bottom: 1rem;
    padding: 0.5rem;
  }

  button {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: var(--color-secondary);
  }
</style>
