<script lang="ts">
  import { onMount } from "svelte";
  import CompanyPost from "../components/CompanyPost.svelte";

  let posts = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      posts = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="community-wrapper">
  <h1>Community Hub</h1>

  <section class="company-updates">
    <h2>Latest Updates</h2>
    {#if loading}
      <p>Loading updates...</p>
    {:else if error}
      <p class="error">Error: {error}</p>
    {:else if posts.length === 0}
      <p>No updates available yet.</p>
    {:else}
      {#each posts as post (post.id)}
        <CompanyPost {post} />
      {/each}
    {/if}
  </section>

  <section class="community-discussion">
    <h2>Community Discussion</h2>
    <p>
      Coming soon! We're working on bringing you a space to discuss and share
      your thoughts.
    </p>
  </section>
</div>

<style>
  .community-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 1rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 3rem;
  }

  section {
    margin-bottom: 4rem;
  }

  h2 {
    margin-bottom: 2rem;
  }

  .error {
    color: #721c24;
    background-color: #f8d7da;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
</style>
