<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import ProjectCard from "../components/ProjectCard.svelte";
  import CompanyPost from "../components/CompanyPost.svelte";

  let projects = [];
  let posts = [];
  let messages = [];
  let loading = {
    projects: true,
    posts: true,
    messages: true,
  };
  let error = null;

  async function fetchWithAuth(endpoint) {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return null;
    }

    const response = await fetch(endpoint, {
      headers: {
        "admin-token": token,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
      return null;
    }

    return response;
  }

  async function fetchData() {
    try {
      // Fetch projects
      const projectsResponse = await fetchWithAuth("/api/projects");
      if (projectsResponse) {
        const projectsData = await projectsResponse.json();
        projects = projectsData.map((project) => ({
          ...project,
          tags: project.tags ? project.tags.split(",") : [],
        }));
      }
      loading.projects = false;

      // Fetch posts
      const postsResponse = await fetchWithAuth("/api/posts");
      if (postsResponse) {
        posts = await postsResponse.json();
      }
      loading.posts = false;

      // Fetch messages
      const messagesResponse = await fetchWithAuth("/api/admin/messages");
      if (messagesResponse) {
        messages = await messagesResponse.json();
      }
      loading.messages = false;
    } catch (err) {
      console.error(err);
      error = err.message;
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  onMount(fetchData);
</script>

<div class="dashboard-wrapper">
  <div class="dashboard-header">
    <h1>Admin Dashboard</h1>
    <button class="logout-btn" on:click={handleLogout}>Logout</button>
  </div>

  {#if error}
    <div class="error">{error}</div>
  {:else}
    <div class="dashboard-grid">
      <!-- Projects Section -->
      <section class="dashboard-section">
        <h2>Latest Projects</h2>
        {#if loading.projects}
          <p>Loading projects...</p>
        {:else}
          <div class="projects-list">
            {#each projects.slice(0, 3) as project (project.id)}
              <ProjectCard {project} />
            {/each}
          </div>
        {/if}
      </section>

      <!-- Community Posts Section -->
      <section class="dashboard-section">
        <h2>Recent Updates</h2>
        {#if loading.posts}
          <p>Loading updates...</p>
        {:else}
          <div class="posts-list">
            {#each posts.slice(0, 5) as post (post.id)}
              <CompanyPost {post} />
            {/each}
          </div>
        {/if}
      </section>

      <!-- Contact Messages Section -->
      <section class="dashboard-section">
        <h2>Recent Messages</h2>
        {#if loading.messages}
          <p>Loading messages...</p>
        {:else}
          <div class="messages-list">
            {#each messages as message (message.id)}
              <div class="message-card">
                <h3>{message.name}</h3>
                <p class="email">{message.email}</p>
                <p class="message">{message.message}</p>
                <p class="date">
                  {new Date(message.created_at).toLocaleDateString()}
                </p>
              </div>
            {/each}
          </div>
        {/if}
      </section>
    </div>
  {/if}
</div>

<style>
  .dashboard-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    text-align: center;
    color: var(--color-primary);
    margin-bottom: 2rem;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .dashboard-section {
    background: var(--color-light);
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  h2 {
    color: var(--color-primary);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .projects-list,
  .posts-list,
  .messages-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .message-card {
    background: white;
    padding: 1rem;
    border-radius: 4px;
    border-left: 4px solid var(--color-primary);
  }

  .message-card h3 {
    color: var(--color-primary);
    margin: 0;
    font-size: 1.1rem;
  }

  .email {
    color: var(--color-secondary);
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }

  .message {
    margin: 0.5rem 0;
    font-size: 0.95rem;
  }

  .date {
    color: #666;
    font-size: 0.8rem;
    margin: 0;
    text-align: right;
  }

  .error {
    color: #721c24;
    background-color: #f8d7da;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
  }
</style>
