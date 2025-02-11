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
          tags: project.tags ? project.tags : [],
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

  let newPost = {
    title: "",
    content: "",
    author: "",
  };

  async function handlePostSubmit() {
    try {
      const response = await fetch("/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("adminToken"),
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const post = await response.json();
        posts = [post, ...posts];
        newPost = { title: "", content: "", author: "" };
      }
    } catch (err) {
      error = err.message;
    }
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
      <section class="dashboard-section">
        <h2>Create New Post</h2>
        <form class="post-form" on:submit|preventDefault={handlePostSubmit}>
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" bind:value={newPost.title} required />
          </div>
          <div class="form-group">
            <label for="content">Content</label>
            <textarea id="content" bind:value={newPost.content} required
            ></textarea>
          </div>
          <div class="form-group">
            <label for="author">Author</label>
            <input
              type="text"
              id="author"
              bind:value={newPost.author}
              required
            />
          </div>
          <button type="submit" class="submit-btn">Create Post</button>
        </form>
      </section>

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

  .dashboard-section {
    background: var(--color-light);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .post-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-family: var(--font-display);
    color: var(--color-primary);
    font-size: 1.1rem;
  }

  .form-group input,
  .form-group textarea {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: var(--font-body);
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }

  .form-group textarea {
    min-height: 150px;
    resize: vertical;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  .submit-btn {
    background: var(--color-primary);
    color: var(--color-light);
    border: none;
    padding: 0.8rem;
    border-radius: 4px;
    font-family: var(--font-display);
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .logout-btn {
    background: var(--color-secondary);
    color: var(--color-light);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-family: var(--font-display);
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .logout-btn:hover,
  .submit-btn:hover {
    background: var(--color-secondary);
  }

  h2 {
    margin-bottom: 1.5rem;
    color: var(--color-primary);
    font-family: var(--font-display);
  }

  /* Error message styling */
  .error {
    background-color: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  /* Success message styling */
  .success {
    background-color: #d4edda;
    color: #155724;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .dashboard-section {
      padding: 1rem;
    }

    .form-group input,
    .form-group textarea {
      padding: 0.5rem;
    }

    .submit-btn {
      padding: 0.75rem;
    }
  }
</style>
