<script>
  export let post = {
    id: 0,
    title: "",
    content: "",
    date: "",
    author: "",
    image: "",
  };
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
</style>
