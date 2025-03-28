<script lang="ts">
  import { onMount } from "svelte";
  import ProjectCard from "../components/ProjectCard.svelte";
  import TagFilter from "../components/TagFilter.svelte";
  import SkeletonLoader from "../components/SkeletonLoader.svelte";
  import { api } from "../utils/api";
  import { loading } from "../stores/loading";

  interface Project {
    _id: string;
    title: string;
    description: string;
    image: string;
    tags: string | string[];
    githubUrl?: string;
    liveUrl?: string;
  }

  interface ProcessedProject extends Omit<Project, 'tags'> {
    tags: string[];
  }

  let projects: ProcessedProject[] = [];
  let selectedTags: string[] = [];
  let allTags: string[] = [];
  let error: Error | null = null;

  onMount(async () => {
    try {
      const data = await api<Project[]>("/api/projects", { loadingKey: "projects" });
      // Ensure tags are arrays, not strings
      projects = data.map((project) => ({
        ...project,
        tags: typeof project.tags === 'string'
          ? project.tags.split(",").filter(Boolean)
          : Array.isArray(project.tags)
            ? project.tags
            : []
      }));

      // Extract unique tags
      allTags = Array.from(new Set(projects.flatMap(project => project.tags)));
    } catch (err) {
      error = err instanceof Error ? err : new Error(String(err));
      throw error; // ErrorBoundary will catch this
    }
  });

  $: filteredProjects = selectedTags.length === 0
    ? projects
    : projects.filter((project) => 
        selectedTags.every((tag) => project.tags.includes(tag))
      );

  function handleTagSelect(tag: string) {
    selectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
  }
</script>

<div class="projects-container">
  <h1>Projects</h1>
  
  <TagFilter
    tags={allTags}
    selectedTags={selectedTags}
    on:tagSelect={({ detail }) => handleTagSelect(detail)}
  />

  {#if $loading.projects}
    <div class="projects-grid">
      {#each Array(6) as _, i}
        <div class="project-skeleton">
          <SkeletonLoader height="200px" margin="0 0 1rem 0" />
          <SkeletonLoader width="70%" height="24px" margin="0 0 0.5rem 0" />
          <SkeletonLoader height="16px" margin="0 0 0.5rem 0" />
          <SkeletonLoader width="40%" height="16px" />
        </div>
      {/each}
    </div>
  {:else if filteredProjects.length > 0}
    <div class="projects-grid animate__animated animate__fadeIn">
      {#each filteredProjects as project (project._id)}
        <ProjectCard {project} />
      {/each}
    </div>
  {:else}
    <p class="no-projects">
      {selectedTags.length > 0
        ? "No projects match the selected filters."
        : "No projects available."}
    </p>
  {/if}
</div>

<style lang="scss">
  .projects-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: var(--text-primary);
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .project-skeleton {
    background: var(--bg-secondary);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .no-projects {
    text-align: center;
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin-top: 3rem;
  }

  @media (max-width: 768px) {
    .projects-grid {
      grid-template-columns: 1fr;
    }

    h1 {
      font-size: 2rem;
    }
  }
</style>
