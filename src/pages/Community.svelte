<script lang="ts">
  import CompanyPost from "../components/CompanyPost.svelte";

  const companyPosts = [
    {
      id: 1,
      title: "New Game Announcement!",
      content: "We're excited to announce our latest project...",
      date: "2024-02-20",
      author: "VelvetDream Team",
      image: "https://picsum.photos/800/400",
    },
  ];
</script>

<div class="community-wrapper">
  <h1>Community Hub</h1>

  <section class="company-updates">
    <h2>Latest Updates</h2>
    {#each companyPosts as post (post.id)}
      <CompanyPost {post} />
    {/each}
  </section>

  <section class="community-discussion">
    <h2>Community Discussion</h2>
    <!-- Add discussion forum component here -->
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
</style>
