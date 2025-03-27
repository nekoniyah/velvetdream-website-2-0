<script lang="ts">
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import ProjectCard from "./ProjectCard.svelte";

  interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
    url?: string;
    github?: string;
  }

  let featuredProjects: Project[] = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");

      const data = await response.json();
      console.log(data);
      // Take only the first 2 projects for featured section
      featuredProjects = data.slice(0, 2).map((project) => ({
        ...project,
        tags: project.tags ? project.tags : [],
      }));
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<section class="projects-wrapper">
  <div class="projects-content">
    <h2>Featured Projects</h2>

    {#if loading}
      <p>Loading featured projects...</p>
    {:else if error}
      <p class="error">{error}</p>
    {:else}
      <div class="project-grid">
        {#each featuredProjects as project (project.id)}
          <ProjectCard {project} />
        {/each}
      </div>
    {/if}

    <Link to="/projects" class="view-all">View All Projects</Link>
  </div>
</section>

<style>
  .projects-wrapper {
    padding: 4rem 0;
    background-color: #f9f9f9;
  }

  .projects-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 2rem;
    color: var(--color-primary);
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  :global(.view-all) {
    display: block;
    text-align: center;
    font-weight: bold;
    color: var(--color-primary);
    transition: color 0.3s ease;
  }

  :global(.view-all:hover) {
    color: var(--color-secondary);
  }
</style>
