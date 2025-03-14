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
  let stats = {
    totalProjects: 0,
    totalPosts: 0,
    totalMessages: 0,
    recentMessages: 0,
  };
  let activeTab = "overview";

  let newProject = {
    title: "",
    description: "",
    image: "",
    tags: "",
  };

  let newPost = {
    title: "",
    content: "",
    author: "",
    image: "",
  };

  async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return null;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...(options.headers || {}),
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

  async function deleteItem(type, id) {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const response = await fetchWithAuth(`/api/admin/${type}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (type === "projects") {
          projects = projects.filter(p => p._id !== id);
          stats.totalProjects--;
        } else if (type === "posts") {
          posts = posts.filter(p => p._id !== id);
          stats.totalPosts--;
        }
      } else {
        throw new Error(`Failed to delete ${type}`);
      }
    } catch (err) {
      error = err.message;
    }
  }

  async function handleProjectSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", newProject.title);
      formData.append("description", newProject.description);
      formData.append("tags", newProject.tags);
      if (newProject.image) {
        formData.append("image", newProject.image);
      }

      const response = await fetchWithAuth("/api/admin/projects", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const project = await response.json();
        projects = [project, ...projects];
        newProject = { title: "", description: "", image: "", tags: "" };
        stats.totalProjects++;
      }
    } catch (err) {
      error = err.message;
    }
  }

  async function handlePostSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("content", newPost.content);
      formData.append("author", newPost.author);
      if (newPost.image) {
        formData.append("image", newPost.image);
      }

      const response = await fetchWithAuth("/api/admin/posts", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const post = await response.json();
        posts = [post, ...posts];
        newPost = { title: "", content: "", author: "", image: "" };
        stats.totalPosts++;
      }
    } catch (err) {
      error = err.message;
    }
  }

  function handleFileInput(event, type) {
    const file = event.target.files[0];
    if (type === 'project') {
      newProject.image = file;
    } else {
      newPost.image = file;
    }
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
        stats.totalProjects = projects.length;
      }
      loading.projects = false;

      // Fetch posts
      const postsResponse = await fetchWithAuth("/api/posts");
      if (postsResponse) {
        posts = await postsResponse.json();
        stats.totalPosts = posts.length;
      }
      loading.posts = false;

      // Fetch messages
      const messagesResponse = await fetchWithAuth("/api/admin/messages");
      if (messagesResponse) {
        messages = await messagesResponse.json();
        stats.totalMessages = messages.length;
        stats.recentMessages = messages.filter(
          m => new Date(m.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length;
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

<div class="dashboard-container">
  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="/icon.png" alt="Logo" class="logo" />
      <h2>Admin Panel</h2>
    </div>
    <nav class="sidebar-nav">
      <button 
        class:active={activeTab === "overview"}
        on:click={() => activeTab = "overview"}>
        Overview
      </button>
      <button 
        class:active={activeTab === "posts"}
        on:click={() => activeTab = "posts"}>
        Posts
      </button>
      <button 
        class:active={activeTab === "projects"}
        on:click={() => activeTab = "projects"}>
        Projects
      </button>
      <button 
        class:active={activeTab === "messages"}
        on:click={() => activeTab = "messages"}>
        Messages
      </button>
    </nav>
    <button class="logout-btn" on:click={handleLogout}>Logout</button>
  </aside>

  <!-- Main Content -->
  <main class="main-content">
    {#if error}
      <div class="error">{error}</div>
    {:else}
      {#if activeTab === "overview"}
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Projects</h3>
            <p class="stat-number">{stats.totalProjects}</p>
          </div>
          <div class="stat-card">
            <h3>Total Posts</h3>
            <p class="stat-number">{stats.totalPosts}</p>
          </div>
          <div class="stat-card">
            <h3>Total Messages</h3>
            <p class="stat-number">{stats.totalMessages}</p>
          </div>
          <div class="stat-card">
            <h3>Recent Messages</h3>
            <p class="stat-number">{stats.recentMessages}</p>
            <small>(Last 7 days)</small>
          </div>
        </div>

        <div class="recent-activity">
          <h2>Recent Activity</h2>
          <div class="activity-grid">
            <div class="activity-section">
              <h3>Latest Projects</h3>
              {#if loading.projects}
                <p>Loading...</p>
              {:else}
                <div class="projects-preview">
                  {#each projects.slice(0, 2) as project (project.id)}
                    <ProjectCard {project} />
                  {/each}
                </div>
              {/if}
            </div>

            <div class="activity-section">
              <h3>Latest Messages</h3>
              {#if loading.messages}
                <p>Loading...</p>
              {:else}
                <div class="messages-preview">
                  {#each messages.slice(0, 3) as message (message.id)}
                    <div class="message-card">
                      <h4>{message.name}</h4>
                      <p class="email">{message.email}</p>
                      <p class="message-preview">{message.message.slice(0, 100)}...</p>
                      <small>{new Date(message.created_at).toLocaleDateString()}</small>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/if}

      {#if activeTab === "posts"}
        <section class="content-section">
          <h2>Manage Posts</h2>
          <form class="management-form" on:submit|preventDefault={handlePostSubmit}>
            <div class="form-group">
              <label for="post-title">Title</label>
              <input type="text" id="post-title" bind:value={newPost.title} required />
            </div>
            <div class="form-group">
              <label for="post-content">Content</label>
              <textarea id="post-content" bind:value={newPost.content} required></textarea>
            </div>
            <div class="form-group">
              <label for="post-author">Author</label>
              <input type="text" id="post-author" bind:value={newPost.author} required />
            </div>
            <div class="form-group">
              <label for="post-image">Post Image</label>
              <input type="file" id="post-image" accept="image/*" on:change={(e) => handleFileInput(e, 'post')} />
            </div>
            <button type="submit" class="submit-btn">Create Post</button>
          </form>

          <div class="items-grid">
            {#if loading.posts}
              <p>Loading posts...</p>
            {:else}
              {#each posts as post (post._id)}
                <div class="item-card">
                  <CompanyPost {post} />
                  <div class="item-actions">
                    <button class="delete-btn" on:click={() => deleteItem('posts', post._id)}>
                      Delete Post
                    </button>
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        </section>
      {/if}

      {#if activeTab === "projects"}
        <section class="content-section">
          <h2>Manage Projects</h2>
          <form class="management-form" on:submit|preventDefault={handleProjectSubmit}>
            <div class="form-group">
              <label for="project-title">Title</label>
              <input type="text" id="project-title" bind:value={newProject.title} required />
            </div>
            <div class="form-group">
              <label for="project-description">Description</label>
              <textarea id="project-description" bind:value={newProject.description} required></textarea>
            </div>
            <div class="form-group">
              <label for="project-tags">Tags (comma-separated)</label>
              <input type="text" id="project-tags" bind:value={newProject.tags} placeholder="tag1, tag2, tag3" />
            </div>
            <div class="form-group">
              <label for="project-image">Project Image</label>
              <input type="file" id="project-image" accept="image/*" on:change={(e) => handleFileInput(e, 'project')} />
            </div>
            <button type="submit" class="submit-btn">Create Project</button>
          </form>

          <div class="items-grid">
            {#if loading.projects}
              <p>Loading projects...</p>
            {:else}
              {#each projects as project (project._id)}
                <div class="item-card">
                  <ProjectCard {project} />
                  <div class="item-actions">
                    <button class="delete-btn" on:click={() => deleteItem('projects', project._id)}>
                      Delete Project
                    </button>
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        </section>
      {/if}

      {#if activeTab === "messages"}
        <section class="content-section">
          <h2>Messages</h2>
          <div class="messages-list">
            {#if loading.messages}
              <p>Loading messages...</p>
            {:else}
              {#each messages as message (message.id)}
                <div class="message-card">
                  <h3>{message.name}</h3>
                  <p class="email">{message.email}</p>
                  <p class="message">{message.message}</p>
                  <p class="date">{new Date(message.created_at).toLocaleDateString()}</p>
                </div>
              {/each}
            {/if}
          </div>
        </section>
      {/if}
    {/if}
  </main>
</div>

<style>
  .dashboard-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    min-height: 100vh;
  }

  .sidebar {
    background: var(--color-dark);
    color: var(--color-light);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    position: sticky;
    top: 0;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .logo {
    width: 40px;
    height: 40px;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-grow: 1;
  }

  .sidebar-nav button {
    background: transparent;
    border: none;
    color: var(--color-light);
    padding: 0.75rem 1rem;
    text-align: left;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .sidebar-nav button:hover,
  .sidebar-nav button.active {
    background: var(--color-primary);
  }

  .logout-btn {
    background: var(--color-secondary);
    color: var(--color-light);
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: auto;
    text-align: center;
    font-weight: 500;
  }

  .logout-btn:hover {
    background: #d32f2f;
    transform: translateY(-1px);
  }

  .main-content {
    padding: 2rem;
    background: #f8f9fa;
    min-height: 100vh;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .stat-card h3 {
    color: var(--color-primary);
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-dark);
    margin: 0.5rem 0;
  }

  .recent-activity {
    margin-top: 2rem;
  }

  .activity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 1rem;
  }

  .activity-section {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .content-section {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .message-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid var(--color-primary);
    margin-bottom: 1rem;
  }

  .message-card h4 {
    color: var(--color-primary);
    margin: 0;
  }

  .email {
    color: var(--color-secondary);
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }

  .message-preview {
    margin: 0.5rem 0;
    color: #666;
  }

  .management-form {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--color-dark);
  }

  .form-group input[type="text"],
  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f8f9fa;
  }

  .form-group input[type="text"]:focus,
  .form-group textarea:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
    outline: none;
  }

  .form-group textarea {
    min-height: 120px;
    resize: vertical;
  }

  .form-group input[type="file"] {
    width: 100%;
    padding: 0.75rem;
    border: 2px dashed #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .form-group input[type="file"]:hover {
    border-color: var(--color-primary);
    background: rgba(var(--color-primary-rgb), 0.05);
  }

  .submit-btn {
    background: var(--color-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: block;
    width: 100%;
    max-width: 200px;
    margin: 2rem auto 0;
  }

  .submit-btn:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .submit-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .content-section h2 {
    font-size: 1.75rem;
    color: var(--color-primary);
    margin-bottom: 2rem;
    text-align: center;
    font-weight: 600;
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .item-card {
    position: relative;
    transition: transform 0.2s ease;
  }

  .item-card:hover {
    transform: translateY(-2px);
  }

  .item-actions {
    padding: 1rem;
    background: white;
    border-radius: 0 0 8px 8px;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  .delete-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .delete-btn:hover {
    background: #c82333;
  }

  .error {
    background: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .dashboard-container {
      grid-template-columns: 60px 1fr;
    }

    .sidebar {
      padding: 1rem;
    }

    .sidebar-header h2,
    .sidebar-nav button span {
      display: none;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .logout-btn {
      padding: 0.5rem;
      font-size: 0.8rem;
    }

    .management-form {
      padding: 1.5rem;
    }

    .form-group input[type="text"],
    .form-group textarea {
      padding: 0.5rem;
    }

    .submit-btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }
</style>
