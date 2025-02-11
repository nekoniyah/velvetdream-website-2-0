<script lang="ts">
  import { onMount } from "svelte";
  import ProjectCard from "../components/ProjectCard.svelte";
  import TagFilter from "../components/TagFilter.svelte";

  let projects = [];
  let selectedTags = [];
  let allTags = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");

      const data = await response.json();
      projects = data;

      console.log(projects);

      // Extract unique tags
      allTags = projects
        .map((project) => project.tags)
        .flat()
        .filter((tag, index, tags) => tags.indexOf(tag) === index);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

  let filteredProjects = projects;

  $: {
    if (selectedTags.length === 0) {
      filteredProjects = projects;
    } else {
      filteredProjects = projects.filter((project) =>
        selectedTags.every((tag) => project.tags.includes(tag))
      );
    }
  }
</script>

<div class="projects-wrapper">
  <h1>Our Projects</h1>

  {#if loading}
    <p>Loading projects...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
    <TagFilter tags={allTags} bind:selectedTags />
    <div class="project-grid">
      {#each filteredProjects as project (project.id)}
        <ProjectCard {project} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .projects-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 1rem;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .error {
    color: red;
    text-align: center;
    margin: 2rem 0;
  }
</style>
